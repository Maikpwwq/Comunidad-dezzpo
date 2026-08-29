/**
 * Humanized Asynchronous Dispatch Queue with Jitter & Hourly Rate Limiting
 * 
 * Strict Anti-Ban Enforcement:
 * - NO Promise.all or concurrent bursts.
 * - Random delays (Jitter) between 45s and 120s.
 * - Max 10-15 comments per hour rolling window.
 * - Automated pause during quiet/night hours (11:00 PM - 06:00 AM).
 */

import type {
  DispatchTask,
  QueueConfig,
  QueueStats,
} from './types'
import { CircuitBreaker } from './circuitBreaker'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getRandomJitter(minMs: number, maxMs: number): number {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
}

export class DispatchQueue {
  private queue: DispatchTask[] = []
  private dispatchedTimestamps: number[] = []
  private readonly jitterMinMs: number
  private readonly jitterMaxMs: number
  private readonly maxCommentsPerHour: number
  private readonly quietHoursStart: number
  private readonly quietHoursEnd: number
  private isProcessing = false

  constructor(config?: QueueConfig) {
    this.jitterMinMs = config?.jitterMinMs ?? 45_000
    this.jitterMaxMs = config?.jitterMaxMs ?? 120_000
    this.maxCommentsPerHour = config?.maxCommentsPerHour ?? 12
    this.quietHoursStart = config?.quietHoursStart ?? 23
    this.quietHoursEnd = config?.quietHoursEnd ?? 6
  }

  /**
   * Adds a prepared task to the FIFO queue.
   */
  public enqueue(task: DispatchTask): void {
    // Avoid duplicate enqueues for the same post ID
    const exists = this.queue.some((t) => t.postId === task.postId && t.status === 'PENDING')
    if (!exists) {
      this.queue.push(task)
    }
  }

  /**
   * Checks if current time falls within configured quiet hours.
   */
  public isQuietHour(now: Date = new Date()): boolean {
    if (this.quietHoursStart === -1 || this.quietHoursStart === this.quietHoursEnd) {
      return false
    }
    const hour = now.getHours()
    if (this.quietHoursStart > this.quietHoursEnd) {
      // Overnight (e.g. 23:00 to 06:00)
      return hour >= this.quietHoursStart || hour < this.quietHoursEnd
    }
    return hour >= this.quietHoursStart && hour < this.quietHoursEnd
  }

  /**
   * Cleans up dispatched timestamps older than 60 minutes.
   */
  private pruneHourlyWindow(): void {
    const oneHourAgo = Date.now() - 3_600_000
    this.dispatchedTimestamps = this.dispatchedTimestamps.filter((ts) => ts > oneHourAgo)
  }

  /**
   * Returns current queue statistics and limits.
   */
  public getStats(): QueueStats {
    this.pruneHourlyWindow()
    return {
      pending: this.queue.filter((t) => t.status === 'PENDING').length,
      dispatchedInCurrentHour: this.dispatchedTimestamps.length,
      maxPerHour: this.maxCommentsPerHour,
      isQuietHour: this.isQuietHour(),
    }
  }

  /**
   * Processes enqueued tasks one-by-one with humanized delays and rate checks.
   */
  public async processQueue(
    posterFn: (
      postId: string,
      message: string
    ) => Promise<{ success: boolean; errorCode?: number | undefined; errorMessage?: string | undefined }>,
    circuitBreaker?: CircuitBreaker
  ): Promise<readonly DispatchTask[]> {
    if (this.isProcessing) {
      return this.queue
    }

    this.isProcessing = true
    const processedTasks: DispatchTask[] = []

    try {
      while (this.queue.some((t) => t.status === 'PENDING')) {
        const task = this.queue.find((t) => t.status === 'PENDING')
        if (!task) break

        // 1. Check Quiet Hours
        if (this.isQuietHour()) {
          task.status = 'SKIPPED'
          task.errorDetails = 'Skipped: Currently in configured quiet hours (Night time mode)'
          processedTasks.push(task)
          continue
        }

        // 2. Check Hourly Limit
        this.pruneHourlyWindow()
        if (this.dispatchedTimestamps.length >= this.maxCommentsPerHour) {
          task.status = 'SKIPPED'
          task.errorDetails = `Skipped: Hourly comment limit reached (${this.dispatchedTimestamps.length}/${this.maxCommentsPerHour})`
          processedTasks.push(task)
          continue
        }

        // 3. Check Circuit Breaker
        if (circuitBreaker && !circuitBreaker.canProceed()) {
          task.status = 'SKIPPED'
          task.errorCode = 429
          task.errorDetails = 'Skipped: Circuit breaker is OPEN/HALTED'
          processedTasks.push(task)
          break // Stop processing remaining queue until breaker recovers
        }

        // 4. Humanized Jitter Delay Before Posting
        const jitter = getRandomJitter(this.jitterMinMs, this.jitterMaxMs)
        await sleep(jitter)

        // 5. Execute Post
        const result = await posterFn(task.postId, task.commentBody)
        task.dispatchedAt = Date.now()

        if (result.success) {
          task.status = 'DISPATCHED'
          task.errorCode = null
          this.dispatchedTimestamps.push(task.dispatchedAt)
        } else {
          task.status = 'FAILED'
          task.errorCode = result.errorCode ?? 500
          if (result.errorMessage) {
            task.errorDetails = result.errorMessage
          }
        }

        processedTasks.push(task)
      }
    } finally {
      this.isProcessing = false
    }

    return processedTasks
  }

  /**
   * Empties the queue.
   */
  public clearQueue(): void {
    this.queue = []
  }
}

export function createDispatchQueue(config?: QueueConfig): DispatchQueue {
  return new DispatchQueue(config)
}
