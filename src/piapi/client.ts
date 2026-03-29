import type { RuntimeEnv } from "../config/env.js";
import type { CreateTaskRequest, TaskHistoryEnvelope, TaskResponseEnvelope } from "../types/piapi.js";

async function parseJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  if (text.length === 0) {
    return {};
  }

  return JSON.parse(text) as unknown;
}

function buildRequestInit(apiKey: string, body?: unknown): RequestInit {
  const requestInit: RequestInit = {
    method: body === undefined ? "GET" : "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
    },
  };

  if (body !== undefined) {
    requestInit.body = JSON.stringify(body);
  }

  return requestInit;
}

async function readEnvelope<T>(response: Response, context: string): Promise<T> {
  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    const message = typeof payload === "object" && payload !== null && "message" in payload
      ? String(payload.message)
      : response.statusText;
    throw new Error(`${context} failed with HTTP ${response.status}: ${message}`);
  }

  return payload as T;
}

export class PiApiClient {
  readonly #apiKey: string;
  readonly #baseUrl: string;

  constructor(env: RuntimeEnv) {
    this.#apiKey = env.piapiApiKey;
    this.#baseUrl = env.piapiBaseUrl.replace(/\/+$/, "");
  }

  async createTask(payload: CreateTaskRequest): Promise<TaskResponseEnvelope> {
    const response = await fetch(
      `${this.#baseUrl}/api/v1/task`,
      buildRequestInit(this.#apiKey, payload),
    );
    const envelope = await readEnvelope<TaskResponseEnvelope>(response, "PiAPI createTask");
    this.assertTaskIntegrity(envelope, "PiAPI createTask");
    return envelope;
  }

  async getTask(taskId: string): Promise<TaskResponseEnvelope> {
    const response = await fetch(
      `${this.#baseUrl}/api/v1/task/${taskId}`,
      buildRequestInit(this.#apiKey),
    );
    const envelope = await readEnvelope<TaskResponseEnvelope>(response, "PiAPI getTask");
    this.assertTaskIntegrity(envelope, "PiAPI getTask");
    return envelope;
  }

  async getTaskHistory(): Promise<TaskHistoryEnvelope> {
    const response = await fetch(
      `${this.#baseUrl}/api/open/tasks/histories`,
      buildRequestInit(this.#apiKey),
    );
    return readEnvelope<TaskHistoryEnvelope>(response, "PiAPI getTaskHistory");
  }

  private assertTaskIntegrity(envelope: TaskResponseEnvelope, context: string): void {
    const errorCode = envelope.data.error?.code ?? 0;
    const errorMessage = envelope.data.error?.message ?? envelope.data.error?.raw_message ?? "";

    if (errorCode !== 0) {
      throw new Error(`${context} returned PiAPI error ${errorCode}: ${errorMessage}`);
    }
  }
}
