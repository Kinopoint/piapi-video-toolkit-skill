import { CAMERA_BLOCK, LIGHTING_BLOCK, LOCATION_BLOCK, NEGATIVE_BLOCK, STYLE_BLOCK, STYLE_MODIFIERS, THEME_BLOCKS } from "./prompt-templates.js";

export type PromptTheme = keyof typeof THEME_BLOCKS;
export type PromptStyle = keyof typeof STYLE_MODIFIERS;

export type BuildPromptOptions = {
  theme: PromptTheme;
  style?: PromptStyle;
  durationSeconds?: number;
  brief?: string;
};

function normalizeBrief(brief?: string): string | null {
  const trimmed = brief?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

export function buildSeedancePrompt(options: BuildPromptOptions): string {
  const durationSeconds = options.durationSeconds ?? 15;
  const style = options.style ?? "luxury";
  const brief = normalizeBrief(options.brief);

  const parts = [
    `Create a ${durationSeconds}-second cinematic video set in ${LOCATION_BLOCK}`,
    THEME_BLOCKS[options.theme],
    CAMERA_BLOCK,
    LIGHTING_BLOCK,
    STYLE_BLOCK,
    STYLE_MODIFIERS[style],
    "Keep the result realistic, atmospheric, emotionally engaging, and suitable for Seedance text-to-video generation.",
  ];

  if (brief !== null) {
    parts.push(`Additional direction: ${brief}`);
  }

  parts.push(NEGATIVE_BLOCK);

  return parts.join(" ");
}
