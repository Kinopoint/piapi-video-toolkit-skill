import { describe, expect, it } from "vitest";

import historyEnvelope from "../fixtures/piapi/task-history.json" with { type: "json" };
import { normalizeHistoryEnvelope } from "../../src/history/service.js";

describe("normalizeHistoryEnvelope", () => {
  it("keeps only seedance tasks and preserves key metadata", () => {
    const tasks = normalizeHistoryEnvelope(historyEnvelope, 20);

    expect(tasks).toHaveLength(2);
    expect(tasks[0]?.taskId).toBe("ee2be148-347e-4be2-a9e7-2b0b6fcb9341");
    expect(tasks[0]?.videoUrl).toMatch(/^https?:\/\//);
    expect(tasks[0]?.status).toBe("finished");
    expect(tasks[1]?.status).toBe("processing");
  });
});
