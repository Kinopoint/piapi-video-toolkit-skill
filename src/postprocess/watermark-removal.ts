import type { PiApiClient } from "../piapi/client.js";
import { normalizeTaskEnvelope, type WaitOptions, waitForTask } from "../seedance/service.js";
import type { NormalizedSeedanceTask, TaskResponseEnvelope, WatermarkRemovalModel, WatermarkRemovalTaskRequest } from "../types/piapi.js";

export type WatermarkRemovalRequestOptions = {
  model: WatermarkRemovalModel;
  videoUrl: string;
};

export function buildWatermarkRemovalRequest(options: WatermarkRemovalRequestOptions): WatermarkRemovalTaskRequest {
  if (!/^https?:\/\//.test(options.videoUrl)) {
    throw new Error("Watermark removal requires an http:// or https:// video URL.");
  }

  return {
    model: options.model,
    task_type: "remove-watermark",
    input: {
      video_url: options.videoUrl,
    },
  };
}

export function shouldAttemptWatermarkRemoval(task: Pick<NormalizedSeedanceTask, "status" | "videoUrl">): boolean {
  return task.status === "completed" && task.videoUrl !== null;
}

export function normalizeWatermarkRemovalTask(envelope: TaskResponseEnvelope): NormalizedSeedanceTask {
  return normalizeTaskEnvelope(envelope);
}

export async function createWatermarkRemovalTask(
  client: PiApiClient,
  options: WatermarkRemovalRequestOptions,
): Promise<NormalizedSeedanceTask> {
  const envelope = await client.createTask(buildWatermarkRemovalRequest(options));
  return normalizeWatermarkRemovalTask(envelope);
}

export async function removeWatermarkAndWait(
  client: PiApiClient,
  options: WatermarkRemovalRequestOptions,
  waitOptions: WaitOptions,
): Promise<NormalizedSeedanceTask> {
  const task = await createWatermarkRemovalTask(client, options);
  return waitForTask(client, task.taskId, waitOptions);
}
