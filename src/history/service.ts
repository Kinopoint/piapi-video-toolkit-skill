import type { PiApiClient } from "../piapi/client.js";
import type { HistoryListItem, PiApiTaskData, SeedanceHistoryItem, TaskHistoryEnvelope } from "../types/piapi.js";

function looksLikeHistoryListItem(item: unknown): item is HistoryListItem {
  return typeof item === "object" && item !== null && "task_id" in item && "status" in item;
}

function normalizeFromTaskData(task: PiApiTaskData): SeedanceHistoryItem {
  return {
    taskId: task.task_id,
    taskType: task.task_type,
    status: task.status,
    prompt: task.input?.prompt ?? "",
    createdAt: task.meta?.created_at ?? null,
    videoUrl: task.output?.video ?? null,
  };
}

function normalizeFromHistoryItem(task: HistoryListItem): SeedanceHistoryItem {
  return {
    taskId: task.task_id,
    taskType: task.action ?? task.detail?.task_type ?? "unknown",
    status: task.status,
    prompt: "",
    createdAt: task.created_at ?? null,
    videoUrl: task.detail?.output ?? null,
  };
}

function historyEntries(envelope: TaskHistoryEnvelope): Array<PiApiTaskData | HistoryListItem> {
  if (Array.isArray(envelope.data)) {
    return envelope.data;
  }

  if (Array.isArray(envelope.data.data)) {
    return envelope.data.data;
  }

  if (Array.isArray(envelope.data.items)) {
    return envelope.data.items;
  }

  if (Array.isArray(envelope.data.list)) {
    return envelope.data.list;
  }

  return [];
}

export function normalizeHistoryEnvelope(envelope: TaskHistoryEnvelope, limit: number): SeedanceHistoryItem[] {
  return historyEntries(envelope)
    .filter((task) => (looksLikeHistoryListItem(task) ? task.task_model === "seedance" : task.model === "seedance"))
    .slice(0, limit)
    .map((task) => (looksLikeHistoryListItem(task) ? normalizeFromHistoryItem(task) : normalizeFromTaskData(task)));
}

export async function listSeedanceHistory(client: PiApiClient, limit: number): Promise<SeedanceHistoryItem[]> {
  return normalizeHistoryEnvelope(await client.getTaskHistory(), limit);
}

export async function findTaskInHistory(client: PiApiClient, taskId: string): Promise<SeedanceHistoryItem | null> {
  const items = await listSeedanceHistory(client, 100);
  return items.find((item) => item.taskId === taskId) ?? null;
}
