import { describe, expect, it } from "vitest";

import { loadEnv } from "../../src/config/env.js";

describe("loadEnv", () => {
  it("reads required api key and default values", () => {
    const env = loadEnv({
      PIAPI_API_KEY: "secret",
    });

    expect(env.piapiApiKey).toBe("secret");
    expect(env.piapiBaseUrl).toBe("https://api.piapi.ai");
    expect(env.downloadDir).toBe("downloads");
    expect(env.pollIntervalMs).toBe(10_000);
    expect(env.pollTimeoutMs).toBe(2_700_000);
  });

  it("rejects missing api key", () => {
    expect(() => loadEnv({})).toThrow(/PIAPI_API_KEY/);
  });
});
