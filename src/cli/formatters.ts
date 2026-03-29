import type { NormalizedSeedanceTask, SeedanceHistoryItem } from "../types/piapi.js";

export function formatTask(task: NormalizedSeedanceTask): string {
  const lines = [
    `task_id: ${task.taskId}`,
    `status: ${task.status}`,
    `task_type: ${task.taskType}`,
    `created_at: ${task.createdAt ?? "-"}`,
  ];

  if (task.videoUrl !== null) {
    lines.push(`video_url: ${task.videoUrl}`);
  }

  if (task.errorMessage.length > 0) {
    lines.push(`error: ${task.errorMessage}`);
  }

  return lines.join("\n");
}

export function formatHistory(items: SeedanceHistoryItem[]): string {
  if (items.length === 0) {
    return "No Seedance tasks found.";
  }

  return items
    .map((item) =>
      [
        `task_id: ${item.taskId}`,
        `status: ${item.status}`,
        `task_type: ${item.taskType}`,
        `created_at: ${item.createdAt ?? "-"}`,
        `video_url: ${item.videoUrl ?? "-"}`,
      ].join("\n"),
    )
    .join("\n\n");
}
