/**
 * Dezzpo Facebook Social Interceptor & Rate Limiting Engine
 * Meta Graph API v19.0+ Strict Type Definitions
 */

import type { TradeSpecialty } from '@/types/copys'
import type { TargetTrade } from '@/types/interceptCopys'

// =============================================================================
// 1. META GRAPH API v19.0 CONSTANTS & CONTRACTS
// =============================================================================

export const META_API_VERSION = 'v19.0' as const
export const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}` as const

export interface MetaGraphUser {
  readonly id: string
  readonly name: string
}

export interface MetaGraphPost {
  readonly id: string // Format: "{page_id}_{post_id}" or "{group_id}_{post_id}"
  readonly message?: string | undefined
  readonly from: MetaGraphUser
  readonly created_time: string // ISO 8601
  readonly permalink_url: string
}

export interface MetaGraphFeedResponse {
  readonly data: readonly MetaGraphPost[]
  readonly paging?: {
    readonly cursors: {
      readonly before: string
      readonly after: string
    }
    readonly next?: string | undefined
    readonly previous?: string | undefined
  } | undefined
}

export interface MetaGraphCommentResponse {
  readonly id: string
}

export interface MetaGraphErrorDetail {
  readonly message: string
  readonly type: string
  readonly code: number
  readonly error_subcode?: number | undefined
  readonly is_transient?: boolean | undefined
  readonly error_user_title?: string | undefined
  readonly error_user_msg?: string | undefined
  readonly fbtrace_id: string
}

export interface MetaGraphErrorResponse {
  readonly error: MetaGraphErrorDetail
}

// =============================================================================
// 2. RATE LIMITING & USAGE HEADERS (X-App-Usage & X-Business-Usecase-Usage)
// =============================================================================

export interface AppUsageMetrics {
  readonly call_count: number // 0-100 (percentage)
  readonly total_cputime: number // 0-100 (percentage)
  readonly total_time: number // 0-100 (percentage)
}

export interface BusinessUsageBucket {
  readonly type: string
  readonly call_count: number
  readonly total_cputime: number
  readonly total_time: number
  readonly estimated_time_to_regain_access: number // In minutes
}

export type BusinessUsageMetrics = Record<string, readonly BusinessUsageBucket[]>

export interface ParsedUsageHeaders {
  readonly appUsage: AppUsageMetrics | null
  readonly businessUsage: BusinessUsageMetrics | null
  readonly maxUsagePercent: number
}

// =============================================================================
// 3. CIRCUIT BREAKER STATE MACHINE
// =============================================================================

export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN' | 'HALTED'

export interface CircuitBreakerSnapshot {
  readonly state: CircuitBreakerState
  readonly lastUsage: AppUsageMetrics | null
  readonly maxUsageRecorded: number
  readonly consecutiveFailures: number
  readonly cooldownUntil: number | null // Epoch ms
  readonly cooldownSecondsRemaining: number
  readonly backoffMultiplier: number
  readonly haltReason?: string | undefined
}

export interface CircuitBreakerConfig {
  readonly usageThresholdPercent?: number | undefined // Default: 80%
  readonly baseCooldownMs?: number | undefined // Default: 300_000 (5 min)
  readonly maxCooldownMs?: number | undefined // Default: 3_600_000 (60 min)
}

// =============================================================================
// 4. INTENT PARSER & CLASSIFICATION
// =============================================================================

export type PostIntent = 'SUPPLY' | 'DEMAND' | 'NEUTRAL'

export type IntentConfidence = 'HIGH' | 'MEDIUM' | 'LOW'

export interface IntentResult {
  readonly intent: PostIntent
  readonly confidence: IntentConfidence
  readonly detectedTrade: TradeSpecialty | TargetTrade | 'general'
  readonly matchedPatterns: readonly string[]
  readonly extractedZone?: string | undefined
}

export interface PreparedComment {
  readonly targetPostId: string
  readonly authorId: string
  readonly authorName: string
  readonly intent: PostIntent
  readonly selectedCopyId: string
  readonly rawCopy: string
  readonly formattedComment: string
  readonly utmUrl: string
  readonly isSimulation?: boolean | undefined
}

// =============================================================================
// 5. ASYNC DISPATCH QUEUE & HUMANIZED JITTER
// =============================================================================

export type DispatchTaskStatus = 'PENDING' | 'DISPATCHED' | 'FAILED' | 'SKIPPED'

export interface DispatchTask {
  readonly id: string
  readonly postId: string
  readonly postPermalink: string
  readonly authorId: string
  readonly authorName: string
  readonly commentBody: string
  readonly utmUrl: string
  readonly copyId: string
  readonly intent: PostIntent
  status: DispatchTaskStatus
  readonly enqueuedAt: number
  dispatchedAt: number | null
  errorCode: number | null
  errorDetails?: string | undefined
}

export interface QueueConfig {
  readonly jitterMinMs?: number | undefined // Default: 45_000 (45s)
  readonly jitterMaxMs?: number | undefined // Default: 120_000 (120s)
  readonly maxCommentsPerHour?: number | undefined // Default: 12
  readonly quietHoursStart?: number | undefined // Default: 23 (11:00 PM)
  readonly quietHoursEnd?: number | undefined // Default: 6  (06:00 AM)
}

export interface QueueStats {
  readonly pending: number
  readonly dispatchedInCurrentHour: number
  readonly maxPerHour: number
  readonly isQuietHour: boolean
}

// =============================================================================
// 6. AUTONOMOUS WORKER & CRON CONFIGURATION (PROD)
// =============================================================================

export interface InterceptorConfig {
  readonly groupIds: readonly string[]
  readonly pageAccessToken: string
  readonly maxCommentsPerHour?: number | undefined
  readonly jitterMinMs?: number | undefined
  readonly jitterMaxMs?: number | undefined
  readonly quietHoursStart?: number | undefined
  readonly quietHoursEnd?: number | undefined
  readonly circuitBreakerThreshold?: number | undefined
  readonly defaultBaseUrl?: string | undefined
}

export interface InterceptionMetrics {
  readonly totalPostsScanned: number
  readonly classifiedSupply: number
  readonly classifiedDemand: number
  readonly classifiedNeutral: number
  readonly enqueued: number
  readonly dispatched: number
  readonly failed: number
  readonly skippedByBreaker: number
  readonly scanTimestamp: string
}

export interface WorkerState {
  readonly isRunning: boolean
  readonly isPaused: boolean
  readonly lastScanTime: number | null
  readonly lastGroupDeltas: Record<string, string> // groupId -> created_time ISO
  readonly metrics: InterceptionMetrics
  readonly breakerSnapshot: CircuitBreakerSnapshot
}

export interface StatePersistenceAdapter {
  readonly getDelta: (groupId: string) => Promise<string | null>
  readonly setDelta: (groupId: string, isoTimestamp: string) => Promise<void>
  readonly logEvent: (eventName: string, data: Record<string, unknown>) => Promise<void>
}

// =============================================================================
// 7. MCP TOOL SCHEMAS & SIMULATION (DEV / MCP)
// =============================================================================

export interface SimulationPostInput {
  readonly id: string
  readonly message: string
  readonly authorName: string
  readonly authorId?: string | undefined
  readonly created_time?: string | undefined
  readonly permalink_url?: string | undefined
}

export interface SimulateScanOptions {
  readonly posts: readonly SimulationPostInput[]
  readonly simulatedAppUsage?: Partial<AppUsageMetrics> | undefined
  readonly forceErrorCode?: number | undefined
}

export interface SimulateScanResult {
  readonly scannedCount: number
  readonly breakerState: CircuitBreakerState
  readonly appUsageApplied: AppUsageMetrics
  readonly classifiedItems: readonly {
    readonly post: SimulationPostInput
    readonly intentResult: IntentResult
    readonly preparedComment?: PreparedComment | undefined
  }[]
  readonly executionLogs: readonly string[]
}
