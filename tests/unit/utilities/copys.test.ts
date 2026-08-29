import { describe, it, expect } from 'vitest'
import {
  FACEBOOK_CAMPAIGN_COPYS,
  STARTER_PACK_COPYS,
  getFilteredCopys,
  getCopyById,
  getRandomCopy,
  buildUtmUrl,
  interpolateSegmentedCopy,
} from '@/types/copys'

describe('Facebook Campaign Copys Library', () => {
  it('should contain a complete catalog of copys with unique IDs', () => {
    expect(FACEBOOK_CAMPAIGN_COPYS.length).toBeGreaterThanOrEqual(40)

    const ids = new Set<string>()
    for (const copy of FACEBOOK_CAMPAIGN_COPYS) {
      expect(ids.has(copy.id)).toBe(false)
      ids.add(copy.id)
      expect(copy.copy.length).toBeGreaterThan(5)
      expect(copy.hook.length).toBeGreaterThan(3)
      expect(['EXPOSICION', 'VENTAS']).toContain(copy.target)
      expect(['INTRIGA', 'BENEFICIO', 'CONVERSION']).toContain(copy.intent)
      expect(['CON_URL', 'SIN_URL']).toContain(copy.format)
    }
  })

  it('should filter copys accurately by target, intent, and format', () => {
    const exposicionIntrigaSinUrl = getFilteredCopys({
      target: 'EXPOSICION',
      intent: 'INTRIGA',
      format: 'SIN_URL',
    })
    expect(exposicionIntrigaSinUrl.length).toBeGreaterThan(0)
    for (const c of exposicionIntrigaSinUrl) {
      expect(c.target).toBe('EXPOSICION')
      expect(c.intent).toBe('INTRIGA')
      expect(c.format).toBe('SIN_URL')
    }

    const ventasConversionConUrl = getFilteredCopys({
      target: 'VENTAS',
      intent: 'CONVERSION',
      format: 'CON_URL',
    })
    expect(ventasConversionConUrl.length).toBeGreaterThan(0)
    for (const c of ventasConversionConUrl) {
      expect(c.target).toBe('VENTAS')
      expect(c.intent).toBe('CONVERSION')
      expect(c.format).toBe('CON_URL')
    }
  })

  it('should retrieve a copy by ID', () => {
    const copy = getCopyById('EXP-INT-SIN-01')
    expect(copy).toBeDefined()
    expect(copy?.ctaKeyword).toBe('PÁGINA')
    expect(copy?.target).toBe('EXPOSICION')
  })

  it('should retrieve a random copy matching criteria', () => {
    const copy = getRandomCopy({ target: 'VENTAS', format: 'SIN_URL' })
    expect(copy).toBeDefined()
    expect(copy?.target).toBe('VENTAS')
    expect(copy?.format).toBe('SIN_URL')
  })

  it('should build valid UTM tracking URLs', () => {
    const url = buildUtmUrl('https://dezzpo.com/registro', 'VTA-INT-SIN-01', {
      source: 'facebook',
      medium: 'group_comment',
      campaign: 'growth_maestros',
      content: 'VTA-INT-SIN-01',
      term: 'maestros_bogota',
    })

    const parsed = new URL(url)
    expect(parsed.searchParams.get('utm_source')).toBe('facebook')
    expect(parsed.searchParams.get('utm_medium')).toBe('group_comment')
    expect(parsed.searchParams.get('utm_campaign')).toBe('growth_maestros')
    expect(parsed.searchParams.get('utm_content')).toBe('VTA-INT-SIN-01')
    expect(parsed.searchParams.get('utm_term')).toBe('maestros_bogota')
  })

  it('should interpolate segmented copy templates correctly', () => {
    const template = '🔌 {oficio}, muestra tus trabajos en {zona}. Comenta "{keyword}" y te paso el link.'
    const result = interpolateSegmentedCopy(template, {
      trade: 'Electricista',
      cityOrZone: 'Suba',
      keyword: 'FOTOS',
    })
    expect(result).toBe('🔌 Electricista, muestra tus trabajos en Suba. Comenta "FOTOS" y te paso el link.')
  })

  it('should contain all valid starter pack copy IDs', () => {
    for (const starterId of STARTER_PACK_COPYS) {
      const copy = getCopyById(starterId)
      expect(copy).toBeDefined()
    }
  })
})
