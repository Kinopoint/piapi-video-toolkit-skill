import { describe, expect, it } from "vitest";

import completedEnvelope from "../fixtures/piapi/seedance-task-completed.json" with { type: "json" };
import processingEnvelope from "../fixtures/piapi/seedance-task-processing.json" with { type: "json" };
import { buildCreateSeedanceRequest, buildGenerateSummary, isTerminalStatus, normalizeTaskEnvelope } from "../../src/seedance/service.js";

describe("seedance service", () => {
  it("builds a create-task request for text-to-video", () => {
    const request = buildCreateSeedanceRequest({
      prompt: "A cinematic Ballybunion golf video",
      aspectRatio: "9:16",
      duration: 15,
    });

    expect(request.model).toBe("seedance");
    expect(request.task_type).toBe("seedance-2-preview");
    expect(request.input.prompt).toContain("Ballybunion");
    expect(request.input.aspect_ratio).toBe("9:16");
    expect(request.input.duration).toBe(15);
  });

  it("detects terminal statuses", () => {
    expect(isTerminalStatus("completed")).toBe(true);
    expect(isTerminalStatus("failed")).toBe(true);
    expect(isTerminalStatus("processing")).toBe(false);
  });

  it("normalizes a completed task envelope", () => {
    const task = normalizeTaskEnvelope(completedEnvelope);

    expect(task.taskId).toMatch(/[a-f0-9-]+/);
    expect(task.status).toBe("completed");
    expect(task.videoUrl).toMatch(/^https?:\/\//);
  });

  it("normalizes an in-progress task envelope", () => {
    const task = normalizeTaskEnvelope(processingEnvelope);

    expect(task.status).toBe("processing");
    expect(task.videoUrl).toBeNull();
  });

  it("adds cost summary for a seedance task with watermark removal requested", () => {
    const task = normalizeTaskEnvelope(completedEnvelope);
    const summary = buildGenerateSummary(task, true);

    expect(summary.cost.generationUsd).toBe(2.25);
    expect(summary.cost.watermarkRemovalPriceDisclosure).toBe("undisclosed");
    expect(summary.cost.totalUsd).toBeNull();
  });
});
