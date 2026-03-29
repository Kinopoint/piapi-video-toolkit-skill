export function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export function hasTimedOut(startedAtMs: number, timeoutMs: number): boolean {
  return Date.now() - startedAtMs >= timeoutMs;
}
