import { describe, it, expect } from 'vitest'
import {
  CLIENT_INTERCEPT_COPYS,
  CLIENT_INTERCEPT_STARTER_PACK,
  CONTEXT_TRIGGER_RESPONSES,
  matchContextTriggerResponse,
  DISAMBIGUATION_JOB_SEEKER_REGEX,
  DISAMBIGUATION_HIRING_REGEX,
  getFilteredInterceptCopys,
  getInterceptCopyById,
  getRandomInterceptCopy,
  buildClientUtmUrl,
  interpolateClientCopy,
} from '@/types/interceptCopys'

describe('Client Demand Interception Copys Library', () => {
  it('should contain a complete catalog of client intercept copys with unique IDs', () => {
    expect(CLIENT_INTERCEPT_COPYS.length).toBeGreaterThanOrEqual(40)

    const ids = new Set<string>()
    for (const copy of CLIENT_INTERCEPT_COPYS) {
      expect(ids.has(copy.id)).toBe(false)
      ids.add(copy.id)
      expect(copy.copy.length).toBeGreaterThan(5)
      expect(copy.hook.length).toBeGreaterThan(3)
      expect(['RESPUESTA_DIRECTA', 'INVENTO_NECESIDAD_DM', 'POST_PUBLICO_SOLUCION']).toContain(copy.segment)
      expect(['CONFIANZA', 'RAPIDEZ']).toContain(copy.angle)
      expect(['INTRIGA', 'BENEFICIO', 'CONVERSION']).toContain(copy.intent)
      expect(['CON_URL', 'SIN_URL']).toContain(copy.format)
      expect(['DESCONFIANZA', 'SPAM_MENSAJES', 'INFORMALIDAD_PRECIOS', 'LENTITUD_URGENCIA']).toContain(copy.painPoint)
    }
  })

  it('should filter client copys accurately by angle, intent, format, and painPoint', () => {
    const confianzaIntrigaSinUrl = getFilteredInterceptCopys({
      angle: 'CONFIANZA',
      intent: 'INTRIGA',
      format: 'SIN_URL',
    })
    expect(confianzaIntrigaSinUrl.length).toBeGreaterThan(0)
    for (const c of confianzaIntrigaSinUrl) {
      expect(c.angle).toBe('CONFIANZA')
      expect(c.intent).toBe('INTRIGA')
      expect(c.format).toBe('SIN_URL')
    }

    const rapidezConversionConUrl = getFilteredInterceptCopys({
      angle: 'RAPIDEZ',
      intent: 'CONVERSION',
      format: 'CON_URL',
    })
    expect(rapidezConversionConUrl.length).toBeGreaterThan(0)
    for (const c of rapidezConversionConUrl) {
      expect(c.angle).toBe('RAPIDEZ')
      expect(c.intent).toBe('CONVERSION')
      expect(c.format).toBe('CON_URL')
    }

    const spamPainPointCopys = getFilteredInterceptCopys({
      painPoint: 'SPAM_MENSAJES',
    })
    expect(spamPainPointCopys.length).toBeGreaterThan(0)
    for (const c of spamPainPointCopys) {
      expect(c.painPoint).toBe('SPAM_MENSAJES')
    }
  })

  it('should retrieve a client copy by ID', () => {
    const copy = getInterceptCopyById('CLI-CONF-INT-SIN-01')
    expect(copy).toBeDefined()
    expect(copy?.ctaKeyword).toBe('VER')
    expect(copy?.angle).toBe('CONFIANZA')
    expect(copy?.painPoint).toBe('SPAM_MENSAJES')
  })

  it('should retrieve a random client copy matching criteria', () => {
    const copy = getRandomInterceptCopy({ angle: 'RAPIDEZ', format: 'SIN_URL' })
    expect(copy).toBeDefined()
    expect(copy?.angle).toBe('RAPIDEZ')
    expect(copy?.format).toBe('SIN_URL')
  })

  it('should build valid client UTM tracking URLs', () => {
    const url = buildClientUtmUrl('https://dezzpo.com/directorio', 'CLI-CONF-INT-SIN-01', {
      source: 'facebook',
      medium: 'group_interception',
      campaign: 'demand_homeowners',
      content: 'CLI-CONF-INT-SIN-01',
      term: 'remodelaciones_bogota',
    })

    const parsed = new URL(url)
    expect(parsed.searchParams.get('utm_source')).toBe('facebook')
    expect(parsed.searchParams.get('utm_medium')).toBe('group_interception')
    expect(parsed.searchParams.get('utm_campaign')).toBe('demand_homeowners')
    expect(parsed.searchParams.get('utm_content')).toBe('CLI-CONF-INT-SIN-01')
    expect(parsed.searchParams.get('utm_term')).toBe('remodelaciones_bogota')
  })

  it('should interpolate client copy templates correctly', () => {
    const template = '🚰 ¿Buscas {oficio} en {zona}? Comenta "{keyword}" y te paso el link con fotos reales.'
    const result = interpolateClientCopy(template, {
      trade: 'plomero',
      cityOrZone: 'Cedritos',
      keyword: 'VER',
    })
    expect(result).toBe('🚰 ¿Buscas plomero en Cedritos? Comenta "VER" y te paso el link con fotos reales.')
  })

  it('should contain all valid starter pack copy IDs', () => {
    for (const starterId of CLIENT_INTERCEPT_STARTER_PACK) {
      const copy = getInterceptCopyById(starterId)
      expect(copy).toBeDefined()
    }
  })

  it('should have contextual trigger responses with regex compilation for top query patterns', () => {
    expect(CONTEXT_TRIGGER_RESPONSES.length).toBeGreaterThanOrEqual(8)
    for (const trigger of CONTEXT_TRIGGER_RESPONSES) {
      expect(trigger.id).toBeDefined()
      expect(trigger.testRegex).toBeInstanceOf(RegExp)
      expect(trigger.recommendedCopy).toContain('dezzpo.com')
      expect(trigger.fallbackCopyId).toBeDefined()
      expect(getInterceptCopyById(trigger.fallbackCopyId)).toBeDefined()

      // Validate sample empirical posts against trigger regex
      if (trigger.sampleEmpiricalPosts) {
        for (const sample of trigger.sampleEmpiricalPosts) {
          expect(trigger.testRegex.test(sample)).toBe(true)
        }
      }
    }
  })

  it('should match contextual triggers dynamically via matchContextTriggerResponse', () => {
    const plomeroMatch = matchContextTriggerResponse('Solicito plomero urgente para arreglar un tubo roto')
    expect(plomeroMatch).toBeDefined()
    expect(plomeroMatch?.targetTrade).toBe('plomero')

    const electricistaMatch = matchContextTriggerResponse('Necesito electricista urgente por corto circuito')
    expect(electricistaMatch).toBeDefined()
    expect(electricistaMatch?.targetTrade).toBe('electricista')

    const ayudanteMatch = matchContextTriggerResponse('SE BUSCA AYUDANTE DE CONSTRUCCIÓN')
    expect(ayudanteMatch).toBeDefined()
    expect(ayudanteMatch?.id).toBe('TRG-AYUDANTE-CONSTRUCCION-01')

    const noMatch = matchContextTriggerResponse('Vendo bicicleta de montaña')
    expect(noMatch).toBeUndefined()
  })

  it('should accurately evaluate disambiguation regex constants', () => {
    expect(DISAMBIGUATION_JOB_SEEKER_REGEX.test('Busco trabajo en obra')).toBe(true)
    expect(DISAMBIGUATION_JOB_SEEKER_REGEX.test('En busca de empleo urgente')).toBe(true)
    expect(DISAMBIGUATION_JOB_SEEKER_REGEX.test('Busco quien trabaje en mi casa')).toBe(false)

    expect(DISAMBIGUATION_HIRING_REGEX.test('Se busca maestro de obra')).toBe(true)
    expect(DISAMBIGUATION_HIRING_REGEX.test('Solicito ayudante de construcción')).toBe(true)
    expect(DISAMBIGUATION_HIRING_REGEX.test('Busco trabajo')).toBe(false)
  })
})

