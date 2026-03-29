import { describe, expect, it } from "vitest";

import { buildWatermarkRemovalRequest, shouldAttemptWatermarkRemoval, normalizeWatermarkRemovalTask } from "../../src/postprocess/watermark-removal.js";
import completedEnvelope from "../fixtures/piapi/seedance-task-completed.json" with { type: "json" };

describe("watermark removal", () => {
  it("builds a PiAPI remove-watermark task request", () => {
    const request = buildWatermarkRemovalRequest({
      model: "seedance",
      videoUrl: "https://img.theapi.app/ephemeral/video.mp4",
    });

    expect(request.model).toBe("seedance");
    expect(request.task_type).toBe("remove-watermark");
    expect(request.input.video_url).toBe("https://img.theapi.app/ephemeral/video.mp4");
  });

  it("requires a valid video url", () => {
    expect(() =>
      buildWatermarkRemovalRequest({
        model: "seedance",
        videoUrl: "ftp://bad.example/video.mp4",
      }),
    ).toThrow(/http/);
  });

  it("detects whether a completed task can be post-processed", () => {
    expect(shouldAttemptWatermarkRemoval({
      status: "completed",
      videoUrl: "https://img.theapi.app/ephemeral/video.mp4",
    })).toBe(true);

    expect(shouldAttemptWatermarkRemoval({
      status: "pending",
      videoUrl: "https://img.theapi.app/ephemeral/video.mp4",
    })).toBe(false);
  });

  it("normalizes a watermark removal task as a regular task payload", () => {
    const task = normalizeWatermarkRemovalTask(completedEnvelope);

    expect(task.taskId).toBe("ee2be148-347e-4be2-a9e7-2b0b6fcb9341");
    expect(task.videoUrl).toMatch(/^https?:\/\//);
  });
});
