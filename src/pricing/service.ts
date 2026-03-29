import type { CostBreakdown, SeedanceTaskType, WatermarkRemovalModel } from "../types/piapi.js";

const GENERATION_PRICE_PER_SECOND: Record<string, number> = {
  "seedance-2-preview": 0.15,
  "seedance-2-fast-preview": 0.08,
  "sora2-video": 0.08,
  "sora2-pro-video": 0.24,
};

const WATERMARK_REMOVAL_PRICE_PER_SECOND: Partial<Record<WatermarkRemovalModel, number>> = {
  sora2: 0.003,
};

export function estimateGenerationCostUsd(taskType: SeedanceTaskType | "sora2-video" | "sora2-pro-video", durationSeconds: number): number | null {
  const perSecond = GENERATION_PRICE_PER_SECOND[taskType];
  return perSecond === undefined ? null : roundUsd(perSecond * durationSeconds);
}

export function supportsWatermarkRemoval(model: string): boolean {
  return model === "seedance" || model === "sora2";
}

export function watermarkRemovalPriceDisclosure(model: WatermarkRemovalModel): "public" | "undisclosed" {
  return WATERMARK_REMOVAL_PRICE_PER_SECOND[model] === undefined ? "undisclosed" : "public";
}

export function estimatePipelineCost(options: {
  generationTaskType: SeedanceTaskType | "sora2-video" | "sora2-pro-video";
  generationModel: string;
  durationSeconds: number;
  removeWatermark: boolean;
  watermarkModel?: WatermarkRemovalModel;
}): CostBreakdown {
  const generationUsd = estimateGenerationCostUsd(options.generationTaskType, options.durationSeconds);

  if (!options.removeWatermark) {
    return {
      generationUsd,
      generationPriceDisclosure: generationUsd === null ? "undisclosed" : "public",
      watermarkRemovalUsd: null,
      watermarkRemovalPriceDisclosure: "not_applicable",
      totalUsd: generationUsd,
    };
  }

  const watermarkModel = options.watermarkModel ?? (options.generationModel === "sora2" ? "sora2" : "seedance");
  const watermarkPerSecond = WATERMARK_REMOVAL_PRICE_PER_SECOND[watermarkModel];
  const watermarkRemovalUsd = watermarkPerSecond === undefined ? null : roundUsd(watermarkPerSecond * options.durationSeconds);
  const totalUsd =
    generationUsd !== null && watermarkRemovalUsd !== null
      ? roundUsd(generationUsd + watermarkRemovalUsd)
      : null;

  return {
    generationUsd,
    generationPriceDisclosure: generationUsd === null ? "undisclosed" : "public",
    watermarkRemovalUsd,
    watermarkRemovalPriceDisclosure: watermarkRemovalPriceDisclosure(watermarkModel),
    totalUsd,
  };
}

function roundUsd(value: number): number {
  return Math.round(value * 100) / 100;
}
