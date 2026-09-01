/**
 * Utility for executing asynchronous operations with retry and exponential backoff.
 * Default: 3 attempts, backoff delays: 1000ms, 2000ms, 4000ms (1s, 2s, 4s).
 */
export interface RetryOptions {
  maxRetries?: number
  delays?: number[]
  onRetry?: (error: unknown, attempt: number) => void
}

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const maxRetries = options.maxRetries ?? 3
  const delays = options.delays ?? [1000, 2000, 4000]

  let lastError: unknown

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (attempt < maxRetries) {
        if (options.onRetry) {
          options.onRetry(err, attempt)
        }
        const delayMs = delays[attempt - 1] ?? delays[delays.length - 1] ?? 1000
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    }
  }

  throw lastError
}
