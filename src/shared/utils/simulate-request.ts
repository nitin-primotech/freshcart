export type SimulateOptions = {
  delayMs?: number;
  jitterMs?: number;
  shouldFail?: boolean;
  failRate?: number;
};

export async function simulateRequest<T>(
  data: T,
  options: SimulateOptions = {},
): Promise<T> {
  const {
    delayMs = 900,
    jitterMs = 500,
    shouldFail = false,
    failRate = 0,
  } = options;

  const wait = delayMs + Math.random() * jitterMs;
  await new Promise((resolve) => setTimeout(resolve, wait));

  if (shouldFail || (failRate > 0 && Math.random() < failRate)) {
    throw new Error('Simulated network error');
  }

  return data;
}

export function simulateMutation<T>(
  data: T,
  options?: SimulateOptions,
): Promise<T> {
  return simulateRequest(data, { delayMs: 1200, ...options });
}
