/**
 * MCP Tools Interface & Local Simulation Engine
 * 
 * Exposes Facebook Interceptor scanning, parsing, copy injection,
 * and rate-limit simulation methods as MCP tools for local IDE testing and validation.
 */

import { CircuitBreaker } from './circuitBreaker'
import { classifyPostIntent, prepareComment } from './intentParser'
import { AutonomousWorker } from './autonomousWorker'
import type {
  SimulationPostInput,
  SimulateScanOptions,
  SimulateScanResult,
  CircuitBreakerSnapshot,
  PreparedComment,
  InterceptorConfig,
  WorkerState,
} from './types'

// Global singleton worker instance for local MCP control
let activeDevWorker: AutonomousWorker | null = null
const devCircuitBreaker = new CircuitBreaker()

/**
 * MCP Tool 1: Simulate Scan and Intent Classification (No external side-effects)
 */
export function mcpSimulateFacebookScan(options: SimulateScanOptions): SimulateScanResult {
  const logs: string[] = []
  logs.push(`[MCP] Starting simulated scan of ${options.posts.length} posts...`)

  // 1. Simulate Usage Reporting if provided
  if (options.simulatedAppUsage) {
    const usage = {
      call_count: options.simulatedAppUsage.call_count ?? 0,
      total_cputime: options.simulatedAppUsage.total_cputime ?? 0,
      total_time: options.simulatedAppUsage.total_time ?? 0,
    }
    devCircuitBreaker.reportUsage(usage)
    logs.push(
      `[MCP] Injected App Usage: call_count=${usage.call_count}%, cpu=${usage.total_cputime}%, time=${usage.total_time}%`
    )
  }

  // 2. Simulate Error Code if provided
  if (options.forceErrorCode) {
    devCircuitBreaker.reportError(options.forceErrorCode, 'Forced error via MCP Simulation')
    logs.push(`[MCP] Injected Meta Error Code: ${options.forceErrorCode}`)
  }

  const breakerState = devCircuitBreaker.getSnapshot().state
  logs.push(`[MCP] Circuit Breaker State: ${breakerState}`)

  const classifiedItems: {
    post: SimulationPostInput
    intentResult: ReturnType<typeof classifyPostIntent>
    preparedComment?: PreparedComment | undefined
  }[] = []

  for (const post of options.posts) {
    const intentResult = classifyPostIntent(post.message)
    let preparedComment: PreparedComment | undefined = undefined

    if (intentResult.intent !== 'NEUTRAL') {
      const prepared = prepareComment({
        post,
        intentResult,
        isSimulation: true,
      })
      if (prepared) preparedComment = prepared
    }

    classifiedItems.push({
      post,
      intentResult,
      ...(preparedComment ? { preparedComment } : {}),
    })

    logs.push(
      `[MCP] Post "${post.id}": Intent=${intentResult.intent}, Trade=${intentResult.detectedTrade}, Confidence=${intentResult.confidence}`
    )
  }

  return {
    scannedCount: options.posts.length,
    breakerState,
    appUsageApplied: {
      call_count: options.simulatedAppUsage?.call_count ?? 0,
      total_cputime: options.simulatedAppUsage?.total_cputime ?? 0,
      total_time: options.simulatedAppUsage?.total_time ?? 0,
    },
    classifiedItems,
    executionLogs: logs,
  }
}

/**
 * MCP Tool 2: Simulate Rate Limit & Quota Scenarios (Verify Circuit Breaker Transitions)
 */
export function mcpSimulateRateLimitScenario(scenario: {
  readonly callCountPercent?: number | undefined
  readonly cpuTimePercent?: number | undefined
  readonly totalTimePercent?: number | undefined
  readonly forceErrorCode?: number | undefined
  readonly resetBeforeTest?: boolean | undefined
}): {
  readonly previousState: string
  readonly newSnapshot: CircuitBreakerSnapshot
  readonly explanation: string
} {
  if (scenario.resetBeforeTest) {
    devCircuitBreaker.reset()
  }

  const previousState = devCircuitBreaker.getSnapshot().state

  if (scenario.forceErrorCode) {
    devCircuitBreaker.reportError(scenario.forceErrorCode, 'Simulated Error via MCP')
  }

  if (
    scenario.callCountPercent !== undefined ||
    scenario.cpuTimePercent !== undefined ||
    scenario.totalTimePercent !== undefined
  ) {
    devCircuitBreaker.reportUsage({
      call_count: scenario.callCountPercent ?? 0,
      total_cputime: scenario.cpuTimePercent ?? 0,
      total_time: scenario.totalTimePercent ?? 0,
    })
  }

  const newSnapshot = devCircuitBreaker.getSnapshot()

  let explanation = `Breaker transitioned from ${previousState} to ${newSnapshot.state}.`
  if (newSnapshot.state === 'HALTED') {
    explanation += ' KILL SWITCH ACTIVATED (Account safety lock: Error 368).'
  } else if (newSnapshot.state === 'OPEN') {
    explanation += ` Rate limit threshold exceeded. Cooldown active for ${newSnapshot.cooldownSecondsRemaining} seconds.`
  } else {
    explanation += ' System is healthy and operating normally.'
  }

  return {
    previousState,
    newSnapshot,
    explanation,
  }
}

/**
 * MCP Tool 3: Preview Dynamic Copy Injection for Any Arbitrary Text
 */
export function mcpPreviewCopyInjection(input: {
  readonly message: string
  readonly authorName: string
  readonly authorId?: string | undefined
  readonly baseUrl?: string | undefined
}): {
  readonly intent: string
  readonly trade: string
  readonly confidence: string
  readonly preparedComment: PreparedComment | null
} {
  const dummyPost: SimulationPostInput = {
    id: `mcp_preview_${Date.now()}`,
    message: input.message,
    authorName: input.authorName,
    ...(input.authorId ? { authorId: input.authorId } : {}),
  }

  const intentResult = classifyPostIntent(input.message)
  const prepared = prepareComment({
    post: dummyPost,
    intentResult,
    baseUrl: input.baseUrl ?? 'https://dezzpo.com',
    isSimulation: true,
  })

  return {
    intent: intentResult.intent,
    trade: intentResult.detectedTrade,
    confidence: intentResult.confidence,
    preparedComment: prepared,
  }
}

/**
 * MCP Tool 4: Worker Lifecycle and Execution Controller
 */
export function mcpControlWorker(action: 'init' | 'tick' | 'pause' | 'resume' | 'stop' | 'status', config?: InterceptorConfig): {
  readonly actionExecuted: string
  readonly workerState: WorkerState | null
  readonly message: string
} {
  if (action === 'init' && config) {
    if (activeDevWorker) activeDevWorker.stop()
    activeDevWorker = new AutonomousWorker(config)
    return {
      actionExecuted: 'init',
      workerState: activeDevWorker.getState(),
      message: 'Autonomous worker initialized successfully.',
    }
  }

  if (!activeDevWorker) {
    return {
      actionExecuted: action,
      workerState: null,
      message: 'No active worker instance. Call with action="init" and configuration first.',
    }
  }

  if (action === 'pause') {
    activeDevWorker.pause()
  } else if (action === 'resume') {
    activeDevWorker.resume()
  } else if (action === 'stop') {
    activeDevWorker.stop()
  }

  return {
    actionExecuted: action,
    workerState: activeDevWorker.getState(),
    message: `Worker action "${action}" executed.`,
  }
}
