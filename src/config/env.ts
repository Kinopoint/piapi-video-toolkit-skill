import { z } from "zod";

const envSchema = z.object({
  PIAPI_API_KEY: z.string().min(1, "PIAPI_API_KEY is required"),
  PIAPI_BASE_URL: z.string().url().default("https://api.piapi.ai"),
  PAPI_DOWNLOAD_DIR: z.string().min(1).default("downloads"),
  PAPI_POLL_INTERVAL_MS: z.coerce.number().int().positive().default(10_000),
  PAPI_POLL_TIMEOUT_MS: z.coerce.number().int().positive().default(2_700_000),
});

export type RuntimeEnv = {
  piapiApiKey: string;
  piapiBaseUrl: string;
  downloadDir: string;
  pollIntervalMs: number;
  pollTimeoutMs: number;
};

export function loadEnv(source: Record<string, string | undefined> = process.env): RuntimeEnv {
  const parsed = envSchema.parse(source);

  return {
    piapiApiKey: parsed.PIAPI_API_KEY,
    piapiBaseUrl: parsed.PIAPI_BASE_URL,
    downloadDir: parsed.PAPI_DOWNLOAD_DIR,
    pollIntervalMs: parsed.PAPI_POLL_INTERVAL_MS,
    pollTimeoutMs: parsed.PAPI_POLL_TIMEOUT_MS,
  };
}
