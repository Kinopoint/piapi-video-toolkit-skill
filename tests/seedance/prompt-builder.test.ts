import { describe, expect, it } from "vitest";

import { buildSeedancePrompt } from "../../src/seedance/prompt-builder.js";

describe("buildSeedancePrompt", () => {
  it("builds a hybrid generic destination prompt", () => {
    const prompt = buildSeedancePrompt({ theme: "hybrid" });

    expect(prompt).toContain("cinematic video");
    expect(prompt).toContain("golf");
    expect(prompt).toContain("destination lifestyle storytelling");
    expect(prompt.length).toBeGreaterThan(200);
  });

  it("appends a custom brief cleanly", () => {
    const prompt = buildSeedancePrompt({
      theme: "golf",
      brief: "Focus on dramatic Atlantic wind and premium travel storytelling."
    });

    expect(prompt).toContain("dramatic Atlantic wind");
    expect(prompt).toContain("premium travel storytelling");
  });
});
