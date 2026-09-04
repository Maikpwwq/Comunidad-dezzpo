/**
 * Meta Graph API v19.0 Resilient HTTP Client
 * 
 * Intercepts `X-App-Usage` and `X-Business-Usecase-Usage` headers on every response,
 * performs cursor-based pagination, and maps native Graph API error codes.
 */

import {
  META_BASE_URL,
  type AppUsageMetrics,
  type BusinessUsageMetrics,
  type MetaGraphFeedResponse,
  type MetaGraphPost,
  type MetaGraphErrorResponse,
  type ParsedUsageHeaders,
} from './types'
import { CircuitBreaker } from './circuitBreaker'

export interface MetaGraphClientOptions {
  readonly accessToken: string
  readonly circuitBreaker?: CircuitBreaker | undefined
  readonly customFetch?: typeof fetch | undefined
}

export class MetaGraphClient {
  private readonly accessToken: string
  private readonly circuitBreaker?: CircuitBreaker | undefined
  private readonly fetchFn: typeof fetch

  constructor(options: MetaGraphClientOptions) {
    this.accessToken = options.accessToken
    if (options.circuitBreaker) {
      this.circuitBreaker = options.circuitBreaker
    }
    this.fetchFn = options.customFetch ?? fetch.bind(globalThis)
  }

  /**
   * Decodes and extracts Meta rate limiting usage headers.
   */
  public parseUsageHeaders(headers: Headers): ParsedUsageHeaders {
    let appUsage: AppUsageMetrics | null = null
    let businessUsage: BusinessUsageMetrics | null = null
    let maxUsage = 0

    const rawAppUsage = headers.get('x-app-usage')
    if (rawAppUsage) {
      try {
        const parsed = JSON.parse(rawAppUsage) as Record<string, number>
        appUsage = {
          call_count: Number(parsed['call_count'] ?? 0),
          total_cputime: Number(parsed['total_cputime'] ?? 0),
          total_time: Number(parsed['total_time'] ?? 0),
        }
        maxUsage = Math.max(appUsage.call_count, appUsage.total_cputime, appUsage.total_time)
      } catch {
        // Corrupted header, ignore gracefully
      }
    }

    const rawBusinessUsage = headers.get('x-business-usecase-usage')
    if (rawBusinessUsage) {
      try {
        businessUsage = JSON.parse(rawBusinessUsage) as BusinessUsageMetrics
        for (const buckets of Object.values(businessUsage)) {
          for (const bucket of buckets) {
            maxUsage = Math.max(maxUsage, bucket.call_count, bucket.total_cputime, bucket.total_time)
          }
        }
      } catch {
        // Corrupted header, ignore gracefully
      }
    }

    // Auto-report to circuit breaker if bound
    if (this.circuitBreaker && appUsage) {
      this.circuitBreaker.reportUsage(appUsage)
    }

    return {
      appUsage,
      businessUsage,
      maxUsagePercent: maxUsage,
    }
  }

  /**
   * Fetches latest posts from a Facebook public group feed with delta tracking.
   */
  public async fetchGroupFeed(
    groupId: string,
    sinceTimestamp?: string
  ): Promise<{
    readonly posts: readonly MetaGraphPost[]
    readonly usage: ParsedUsageHeaders
    readonly nextCursor?: string | undefined
  }> {
    if (this.circuitBreaker && !this.circuitBreaker.canProceed()) {
      return {
        posts: [],
        usage: { appUsage: null, businessUsage: null, maxUsagePercent: 0 },
      }
    }

    const url = new URL(`${META_BASE_URL}/${groupId}/feed`)
    url.searchParams.set('fields', 'id,message,from,created_time,permalink_url')
    url.searchParams.set('limit', '25')
    url.searchParams.set('access_token', this.accessToken)
    if (sinceTimestamp) {
      url.searchParams.set('since', sinceTimestamp)
    }

    try {
      const response = await this.fetchFn(url.toString(), {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })

      const usage = this.parseUsageHeaders(response.headers)

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as MetaGraphErrorResponse | null
        const errorCode = errorBody?.error?.code ?? response.status
        const errorMessage = errorBody?.error?.message ?? response.statusText

        if (this.circuitBreaker) {
          this.circuitBreaker.reportError(errorCode, errorMessage)
        }

        return { posts: [], usage }
      }

      const body = (await response.json()) as MetaGraphFeedResponse
      const posts = body.data ?? []
      const nextCursor = body.paging?.cursors?.after

      if (this.circuitBreaker) {
        this.circuitBreaker.reportSuccess()
      }

      return {
        posts,
        usage,
        ...(nextCursor ? { nextCursor } : {}),
      }
    } catch (err) {
      if (this.circuitBreaker) {
        this.circuitBreaker.reportError(500, err instanceof Error ? err.message : 'Network failure')
      }
      return {
        posts: [],
        usage: { appUsage: null, businessUsage: null, maxUsagePercent: 0 },
      }
    }
  }

  /**
   * Posts a direct comment to a Facebook post.
   */
  public async postComment(
    postId: string,
    message: string
  ): Promise<{
    readonly success: boolean
    readonly commentId?: string | undefined
    readonly errorCode?: number | undefined
    readonly errorMessage?: string | undefined
    readonly usage: ParsedUsageHeaders
  }> {
    if (this.circuitBreaker && !this.circuitBreaker.canProceed()) {
      return {
        success: false,
        errorCode: 429,
        errorMessage: 'Circuit breaker is OPEN or HALTED. Action denied for account safety.',
        usage: { appUsage: null, businessUsage: null, maxUsagePercent: 0 },
      }
    }

    const url = `${META_BASE_URL}/${postId}/comments`
    const payload = new URLSearchParams()
    payload.append('message', message)
    payload.append('access_token', this.accessToken)

    try {
      const response = await this.fetchFn(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: payload.toString(),
      })

      const usage = this.parseUsageHeaders(response.headers)

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as MetaGraphErrorResponse | null
        const errorCode = errorBody?.error?.code ?? response.status
        const errorMessage = errorBody?.error?.message ?? response.statusText

        if (this.circuitBreaker) {
          this.circuitBreaker.reportError(errorCode, errorMessage)
        }

        return {
          success: false,
          errorCode,
          errorMessage,
          usage,
        }
      }

      const body = (await response.json().catch(() => null)) as { id?: string; error?: { message?: string; code?: number } } | null
      const commentId = body?.id

      if (!commentId || typeof commentId !== 'string' || commentId.trim().length === 0) {
        const errorCode = body?.error?.code ?? 422
        const errorMessage = body?.error?.message ?? 'Meta API response did not contain a valid comment ID'
        if (this.circuitBreaker) {
          this.circuitBreaker.reportError(errorCode, errorMessage)
        }
        return {
          success: false,
          errorCode,
          errorMessage,
          usage,
        }
      }

      if (this.circuitBreaker) {
        this.circuitBreaker.reportSuccess()
      }

      return {
        success: true,
        commentId,
        usage,
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error'
      if (this.circuitBreaker) {
        this.circuitBreaker.reportError(500, msg)
      }
      return {
        success: false,
        errorCode: 500,
        errorMessage: msg,
        usage: { appUsage: null, businessUsage: null, maxUsagePercent: 0 },
      }
    }
  }
}

export function createMetaGraphClient(options: MetaGraphClientOptions): MetaGraphClient {
  return new MetaGraphClient(options)
}
