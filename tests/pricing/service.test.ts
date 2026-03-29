import { describe, expect, it } from "vitest";

import { estimateGenerationCostUsd, estimatePipelineCost, supportsWatermarkRemoval, watermarkRemovalPriceDisclosure } from "../../src/pricing/service.js";

describe("pricing service", () => {
  it("estimates seedance preview generation cost", () => {
    expect(estimateGenerationCostUsd("seedance-2-preview", 10)).toBe(1.5);
    expect(estimateGenerationCostUsd("seedance-2-fast-preview", 5)).toBe(0.4);
  });

  it("marks seedance watermark removal pricing as undisclosed", () => {
    expect(supportsWatermarkRemoval("seedance")).toBe(true);
    expect(watermarkRemovalPriceDisclosure("seedance")).toBe("undisclosed");
  });

  it("estimates known watermark removal pricing for sora2", () => {
    const pipeline = estimatePipelineCost({
      generationTaskType: "sora2-video",
      durationSeconds: 10,
      generationModel: "sora2",
      removeWatermark: true,
      watermarkModel: "sora2",
    });

    expect(pipeline.generationUsd).toBe(0.8);
    expect(pipeline.watermarkRemovalUsd).toBe(0.03);
    expect(pipeline.totalUsd).toBe(0.83);
  });
});
