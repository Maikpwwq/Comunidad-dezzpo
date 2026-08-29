import { describe, it, expect } from 'vitest'
import {
  mcpSimulateFacebookScan,
  mcpSimulateRateLimitScenario,
  mcpPreviewCopyInjection,
  mcpControlWorker,
} from '@/services/social/mcpTools'

describe('MCP Tools Interface & Simulation Engine', () => {
  it('should simulate post scan and classification without side effects', () => {
    const result = mcpSimulateFacebookScan({
      posts: [
        {
          id: 'sim_1',
          message: 'Maestro de construcción disponible para obra negra y enchape',
          authorName: 'Pedro Maestro',
        },
        {
          id: 'sim_2',
          message: 'Necesito plomero urgente por fuga de agua',
          authorName: 'Ana Gomez',
        },
        {
          id: 'sim_3',
          message: 'Buenos días a todos los del grupo',
          authorName: 'Carlos',
        },
      ],
      simulatedAppUsage: { call_count: 45, total_cputime: 30, total_time: 25 },
    })

    expect(result.scannedCount).toBe(3)
    expect(result.breakerState).toBe('CLOSED')
    expect(result.classifiedItems[0]?.intentResult.intent).toBe('SUPPLY')
    expect(result.classifiedItems[0]?.preparedComment?.utmUrl).toContain('growth_maestros')
    expect(result.classifiedItems[1]?.intentResult.intent).toBe('DEMAND')
    expect(result.classifiedItems[1]?.preparedComment?.utmUrl).toContain('demand_homeowners')
    expect(result.classifiedItems[2]?.intentResult.intent).toBe('NEUTRAL')
  })

  it('should simulate rate limit trip to OPEN when usage >= 80%', () => {
    const result = mcpSimulateRateLimitScenario({
      callCountPercent: 88,
      resetBeforeTest: true,
    })

    expect(result.newSnapshot.state).toBe('OPEN')
    expect(result.newSnapshot.cooldownSecondsRemaining).toBeGreaterThan(0)
    expect(result.explanation).toContain('Rate limit threshold exceeded')
  })

  it('should simulate Error 368 kill switch', () => {
    const result = mcpSimulateRateLimitScenario({
      forceErrorCode: 368,
      resetBeforeTest: true,
    })

    expect(result.newSnapshot.state).toBe('HALTED')
    expect(result.explanation).toContain('KILL SWITCH ACTIVATED')
  })

  it('should preview dynamic copy injection for arbitrary input', () => {
    const preview = mcpPreviewCopyInjection({
      message: 'Busco pintor para pintar fachada de conjunto',
      authorName: 'Administrador Juan',
    })

    expect(preview.intent).toBe('DEMAND')
    expect(preview.trade).toBe('pintor')
    expect(preview.preparedComment?.formattedComment).toContain('Administrador Juan')
    expect(preview.preparedComment?.utmUrl).toContain('demand_homeowners')
  })

  it('should control worker lifecycle via MCP', () => {
    const initResult = mcpControlWorker('init', {
      groupIds: ['group_dev_1'],
      pageAccessToken: 'dev_token',
    })
    expect(initResult.actionExecuted).toBe('init')
    expect(initResult.workerState?.isRunning).toBe(false)

    const pauseResult = mcpControlWorker('pause')
    expect(pauseResult.workerState?.isPaused).toBe(true)

    const resumeResult = mcpControlWorker('resume')
    expect(resumeResult.workerState?.isPaused).toBe(false)
  })
})
