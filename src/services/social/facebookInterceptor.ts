/**
 * Dezzpo Facebook Interceptor & Anti-Spam Automation Service
 * 
 * Orchestrator integrating Meta Graph API v19.0+, Circuit Breaker quota management,
 * regex intent classification, dynamic copy rotation, and humanized jitter dispatch.
 */

import { AutonomousWorker, createAutonomousWorker } from './autonomousWorker'
import { classifyPostIntent, prepareComment } from './intentParser'
import { CircuitBreaker, createCircuitBreaker } from './circuitBreaker'
import { MetaGraphClient, createMetaGraphClient } from './metaGraphClient'
import { DispatchQueue, createDispatchQueue } from './dispatchQueue'
import type {
  InterceptorConfig,
  InterceptionMetrics,
  StatePersistenceAdapter,
} from './types'

/**
 * Executes a single complete interception scan over configured Facebook groups.
 */
export async function startInterceptionScan(
  config: InterceptorConfig,
  options?: {
    persistence?: StatePersistenceAdapter | undefined
    customFetch?: typeof fetch | undefined
  }
): Promise<InterceptionMetrics> {
  const worker = createAutonomousWorker(config, options)
  return worker.executeScanTick()
}

/**
 * Creates a continuous autonomous background worker for production serverless / cron execution.
 */
export function createInterceptionWorker(
  config: InterceptorConfig,
  options?: {
    persistence?: StatePersistenceAdapter | undefined
    customFetch?: typeof fetch | undefined
  }
): AutonomousWorker {
  return createAutonomousWorker(config, options)
}

export {
  AutonomousWorker,
  CircuitBreaker,
  MetaGraphClient,
  DispatchQueue,
  classifyPostIntent,
  prepareComment,
  createAutonomousWorker,
  createCircuitBreaker,
  createMetaGraphClient,
  createDispatchQueue,
}
