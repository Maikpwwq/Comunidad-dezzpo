/**
 * Autonomous Social Interception Worker (Production Cron & Serverless Worker)
 * 
 * Continuous, autonomous engine for scanning Facebook groups, classifying intent,
 * and dispatching comments with strict quota management and persistence.
 */

import { MetaGraphClient } from './metaGraphClient'
import { CircuitBreaker } from './circuitBreaker'
import { DispatchQueue } from './dispatchQueue'
import { classifyPostIntent, prepareComment } from './intentParser'
import { TARGET_GROUPS_NAME_MAP, getTargetGroupById } from '@config/targetGroups'
import type {
  InterceptorConfig,
  InterceptionMetrics,
  WorkerState,
  StatePersistenceAdapter,
  DispatchTask,
} from './types'


export class AutonomousWorker {
  private readonly config: InterceptorConfig
  private readonly client: MetaGraphClient
  private readonly circuitBreaker: CircuitBreaker
  private readonly dispatchQueue: DispatchQueue
  private readonly persistence?: StatePersistenceAdapter | undefined

  private isRunning = false
  private isPaused = false
  private loopTimer: NodeJS.Timeout | null = null
  private lastScanTime: number | null = null
  private lastGroupDeltas: Record<string, string> = {}
  private aggregatedMetrics: InterceptionMetrics = {
    totalPostsScanned: 0,
    classifiedSupply: 0,
    classifiedDemand: 0,
    classifiedNeutral: 0,
    enqueued: 0,
    dispatched: 0,
    failed: 0,
    skippedByBreaker: 0,
    scanTimestamp: new Date().toISOString(),
  }

  constructor(
    config: InterceptorConfig,
    options?: {
      persistence?: StatePersistenceAdapter | undefined
      customFetch?: typeof fetch | undefined
    }
  ) {
    this.config = config
    if (options?.persistence) {
      this.persistence = options.persistence
    }

    this.circuitBreaker = new CircuitBreaker({
      usageThresholdPercent: config.circuitBreakerThreshold ?? 80,
    })

    this.client = new MetaGraphClient({
      accessToken: config.pageAccessToken,
      circuitBreaker: this.circuitBreaker,
      customFetch: options?.customFetch,
    })

    this.dispatchQueue = new DispatchQueue({
      jitterMinMs: config.jitterMinMs ?? 45_000,
      jitterMaxMs: config.jitterMaxMs ?? 120_000,
      maxCommentsPerHour: config.maxCommentsPerHour ?? 12,
      quietHoursStart: config.quietHoursStart ?? 23,
      quietHoursEnd: config.quietHoursEnd ?? 6,
      targetRatio: { supply: 0.60, demand: 0.40 },
      enableRatioBalancing: config.enableRatioBalancing ?? true,
    })
  }

  /**
   * Runs a single scan and dispatch tick across all configured group feeds.
   * Can be invoked by serverless cron (e.g. Cloud Function) or worker loop.
   */
  public async executeScanTick(): Promise<InterceptionMetrics> {
    if (this.isPaused) {
      return { ...this.aggregatedMetrics, scanTimestamp: new Date().toISOString() }
    }

    if (!this.circuitBreaker.canProceed()) {
      this.aggregatedMetrics = {
        ...this.aggregatedMetrics,
        skippedByBreaker: this.aggregatedMetrics.skippedByBreaker + 1,
        scanTimestamp: new Date().toISOString(),
      }
      return this.aggregatedMetrics
    }

    this.lastScanTime = Date.now()
    let tickScanned = 0
    let tickSupply = 0
    let tickDemand = 0
    let tickNeutral = 0
    let tickEnqueued = 0

    // Prioritize configured groups by seed weight if known
    const prioritizedGroupIds = [...this.config.groupIds].sort((a, b) => {
      const weightA = getTargetGroupById(a)?.weight ?? 5
      const weightB = getTargetGroupById(b)?.weight ?? 5
      return weightB - weightA
    })

    // Scan each configured group
    for (const groupId of prioritizedGroupIds) {
      // Check circuit breaker before each group call
      if (!this.circuitBreaker.canProceed()) {
        break
      }

      const groupName =
        this.config.groupNames?.[groupId] ??
        TARGET_GROUPS_NAME_MAP[groupId] ??
        (groupId.includes('remodel') ? 'Remodelaciones & Acabados Bogotá' : 'Maestros y Ayudantes de Construcción')


      // 1. Resolve last delta for group
      let sinceTimestamp = this.lastGroupDeltas[groupId]
      if (!sinceTimestamp && this.persistence) {
        const persisted = await this.persistence.getDelta(groupId).catch(() => null)
        if (persisted) sinceTimestamp = persisted
      }

      // 2. Fetch Group Feed
      const feedResult = await this.client.fetchGroupFeed(groupId, sinceTimestamp)
      const posts = feedResult.posts

      if (posts.length > 0) {
        // Save latest created_time as next delta cursor
        const latestPostTime = posts[0]?.created_time
        if (latestPostTime) {
          this.lastGroupDeltas[groupId] = latestPostTime
          if (this.persistence) {
            await this.persistence.setDelta(groupId, latestPostTime).catch(() => null)
          }
        }
      }

      // 3. Classify and Enqueue
      for (const post of posts) {
        tickScanned += 1
        const intentResult = classifyPostIntent(post.message)

        if (intentResult.intent === 'NEUTRAL') {
          tickNeutral += 1
          continue
        }

        if (intentResult.intent === 'SUPPLY') {
          tickSupply += 1
        } else if (intentResult.intent === 'DEMAND') {
          tickDemand += 1
        }

        // Generate prepared comment
        const prepared = prepareComment({
          post,
          intentResult,
          baseUrl: this.config.defaultBaseUrl ?? 'https://dezzpo.com',
        })

        if (prepared) {
          const task: DispatchTask = {
            id: `task_${post.id}_${Date.now()}`,
            postId: post.id,
            postPermalink: post.permalink_url,
            authorId: prepared.authorId,
            authorName: prepared.authorName,
            groupId,
            groupName,
            detectedTrade: intentResult.detectedTrade,
            commentBody: prepared.formattedComment,
            utmUrl: prepared.utmUrl,
            copyId: prepared.selectedCopyId,
            intent: prepared.intent,
            status: 'PENDING',
            enqueuedAt: Date.now(),
            dispatchedAt: null,
            errorCode: null,
          }

          this.dispatchQueue.enqueue(task)
          tickEnqueued += 1
        }
      }
    }

    // 4. Process Enqueued Comments (Humanized execution with Jitter & 6:4 balance)
    const results = await this.dispatchQueue.processQueue(
      (postId, message) => this.client.postComment(postId, message),
      this.circuitBreaker
    )

    let tickDispatched = 0
    let tickFailed = 0

    for (const r of results) {
      if (r.status === 'DISPATCHED' && r.commentId) {
        tickDispatched += 1
        if (this.persistence) {
          await this.persistence
            .logEvent('interception_record', {
              id: r.id,
              postId: r.postId,
              commentId: r.commentId,
              authorName: r.authorName,
              groupName: r.groupName || 'Grupo Facebook',
              intent: r.intent,
              detectedTrade: r.detectedTrade || 'general',
              copyId: r.copyId,
              renderedComment: r.commentBody,
              timestamp: new Date(r.dispatchedAt || Date.now()).toISOString(),
              status: 'dispatched',
            })
            .catch(() => null)
        }
      } else if (r.status === 'FAILED') {
        tickFailed += 1
        if (this.persistence) {
          await this.persistence
            .logEvent('interception_record', {
              id: r.id,
              postId: r.postId,
              commentId: null,
              authorName: r.authorName,
              groupName: r.groupName || 'Grupo Facebook',
              intent: r.intent,
              detectedTrade: r.detectedTrade || 'general',
              copyId: r.copyId,
              renderedComment: r.commentBody,
              timestamp: new Date(Date.now()).toISOString(),
              status: 'failed',
              errorCode: r.errorCode,
              errorDetails: r.errorDetails,
            })
            .catch(() => null)
        }
      }
    }

    // 5. Update Metrics
    this.aggregatedMetrics = {
      totalPostsScanned: this.aggregatedMetrics.totalPostsScanned + tickScanned,
      classifiedSupply: this.aggregatedMetrics.classifiedSupply + tickSupply,
      classifiedDemand: this.aggregatedMetrics.classifiedDemand + tickDemand,
      classifiedNeutral: this.aggregatedMetrics.classifiedNeutral + tickNeutral,
      enqueued: this.aggregatedMetrics.enqueued + tickEnqueued,
      dispatched: this.aggregatedMetrics.dispatched + tickDispatched,
      failed: this.aggregatedMetrics.failed + tickFailed,
      skippedByBreaker: this.aggregatedMetrics.skippedByBreaker,
      scanTimestamp: new Date().toISOString(),
    }

    if (this.persistence) {
      await this.persistence
        .logEvent('social_interceptor_tick', {
          ...this.aggregatedMetrics,
          lastScanTime: this.lastScanTime,
        })
        .catch(() => null)
    }

    return this.aggregatedMetrics
  }

  /**
   * Starts a continuous autonomous worker loop (e.g. for long-running processes).
   */
  public startAutonomousLoop(intervalMs = 300_000): void {
    if (this.isRunning) return
    this.isRunning = true
    this.isPaused = false

    const runLoop = async () => {
      if (!this.isRunning) return
      try {
        await this.executeScanTick()
      } catch {
        // Safe loop continue
      } finally {
        if (this.isRunning) {
          this.loopTimer = setTimeout(runLoop, intervalMs)
        }
      }
    }

    // Execute first tick immediately
    void runLoop()
  }

  /**
   * Stops the autonomous worker loop gracefully.
   */
  public stop(): void {
    this.isRunning = false
    if (this.loopTimer) {
      clearTimeout(this.loopTimer)
      this.loopTimer = null
    }
  }

  public pause(): void {
    this.isPaused = true
  }

  public resume(): void {
    this.isPaused = false
  }

  /**
   * Returns live state, queue stats, and circuit breaker health snapshot.
   */
  public getState(): WorkerState {
    return {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      lastScanTime: this.lastScanTime,
      lastGroupDeltas: { ...this.lastGroupDeltas },
      metrics: { ...this.aggregatedMetrics },
      breakerSnapshot: this.circuitBreaker.getSnapshot(),
    }
  }

  public getCircuitBreaker(): CircuitBreaker {
    return this.circuitBreaker
  }

  public getDispatchQueue(): DispatchQueue {
    return this.dispatchQueue
  }
}

export function createAutonomousWorker(
  config: InterceptorConfig,
  options?: {
    persistence?: StatePersistenceAdapter | undefined
    customFetch?: typeof fetch | undefined
  }
): AutonomousWorker {
  return new AutonomousWorker(config, options)
}
