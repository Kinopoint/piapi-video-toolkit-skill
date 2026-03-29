import type { PiApiClient } from "../piapi/client.js";
import { estimatePipelineCost } from "../pricing/service.js";
import type { AspectRatio, NormalizedSeedanceTask, SeedanceTaskType, TaskResponseEnvelope, TextToVideoTaskRequest } from "../types/piapi.js";
import { hasTimedOut, sleep } from "../utils/time.js";

export type GenerateVideoOptions = {
  prompt: string;
  aspectRatio: AspectRatio;
  duration: number;
  taskType?: SeedanceTaskType;
};

export type WaitOptions = {
  pollIntervalMs: number;
  pollTimeoutMs: number;
};

const TERMINAL_STATUSES = new Set(["completed", "failed", "error", "canceled"]);

export function isTerminalStatus(status: string): boolean {
  return TERMINAL_STATUSES.has(status);
}

export function buildCreateSeedanceRequest(options: GenerateVideoOptions): TextToVideoTaskRequest {
  const prompt = options.prompt.trim();

  if (prompt.length === 0) {
    throw new Error("Prompt must not be empty.");
  }

  if (options.duration <= 0) {
    throw new Error("Duration must be greater than 0.");
  }

  return {
    model: "seedance",
    task_type: options.taskType ?? "seedance-2-preview",
    input: {
      prompt,
      aspect_ratio: options.aspectRatio,
      duration: options.duration,
    },
  };
}

export function normalizeTaskEnvelope(envelope: TaskResponseEnvelope): NormalizedSeedanceTask {
  const task = envelope.data;

  return {
    taskId: task.task_id,
    model: task.model,
    taskType: task.task_type,
    status: task.status,
    prompt: task.input?.prompt ?? "",
    aspectRatio: task.input?.aspect_ratio ?? null,
    duration: task.input?.duration ?? null,
    videoUrl: task.output?.video ?? null,
    createdAt: task.meta?.created_at ?? null,
    startedAt: task.meta?.started_at ?? null,
    endedAt: task.meta?.ended_at ?? null,
    errorCode: task.error?.code ?? 0,
    errorMessage: task.error?.message ?? task.error?.raw_message ?? "",
    usageType: task.meta?.usage?.type ?? null,
    usageConsume: task.meta?.usage?.consume ?? null,
  };
}

export async function createSeedanceTask(
  client: PiApiClient,
  options: GenerateVideoOptions,
): Promise<NormalizedSeedanceTask> {
  const envelope = await client.createTask(buildCreateSeedanceRequest(options));
  return normalizeTaskEnvelope(envelope);
}

export async function waitForTask(
  client: PiApiClient,
  taskId: string,
  options: WaitOptions,
): Promise<NormalizedSeedanceTask> {
  const startedAtMs = Date.now();

  while (!hasTimedOut(startedAtMs, options.pollTimeoutMs)) {
    const normalized = normalizeTaskEnvelope(await client.getTask(taskId));

    if (isTerminalStatus(normalized.status)) {
      if (normalized.status === "completed" && normalized.videoUrl === null) {
        throw new Error(`Task ${taskId} completed without output.video.`);
      }

      if (normalized.status !== "completed") {
        throw new Error(`Task ${taskId} ended with status ${normalized.status}: ${normalized.errorMessage}`);
      }

      return normalized;
    }

    await sleep(options.pollIntervalMs);
  }

  throw new Error(`Task ${taskId} did not reach a terminal state within ${options.pollTimeoutMs}ms.`);
}

export async function generateAndWait(
  client: PiApiClient,
  generateOptions: GenerateVideoOptions,
  waitOptions: WaitOptions,
): Promise<NormalizedSeedanceTask> {
  const createdTask = await createSeedanceTask(client, generateOptions);
  return waitForTask(client, createdTask.taskId, waitOptions);
}

export function buildGenerateSummary(task: NormalizedSeedanceTask, removeWatermark: boolean): {
  task: NormalizedSeedanceTask;
  cost: ReturnType<typeof estimatePipelineCost>;
} {
  return {
    task,
    cost: estimatePipelineCost({
      generationTaskType: task.taskType as SeedanceTaskType | "sora2-video" | "sora2-pro-video",
      generationModel: task.model,
      durationSeconds: task.duration ?? 0,
      removeWatermark,
      watermarkModel: task.model === "sora2" ? "sora2" : "seedance",
    }),
  };
}
