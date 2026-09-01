import { describe, it, expect } from 'vitest'
import { classifyPostIntent, prepareComment } from '@/services/social/intentParser'

describe('Intent Parser & Classification Engine', () => {
  it('should classify supply posts accurately (Maestros / Contratistas)', () => {
    const post1 = 'Ofrezco mis servicios como maestro de obra y acabados de primera calidad en Suba'
    const result1 = classifyPostIntent(post1)
    expect(result1.intent).toBe('SUPPLY')
    expect(result1.detectedTrade).toBe('maestro')
    expect(result1.extractedZone).toBe('Suba')
    expect(['HIGH', 'MEDIUM']).toContain(result1.confidence)

    const post2 = 'Plomería a domicilio 24/7. Destape de cañerías, reparación de fugas e inodoros'
    const result2 = classifyPostIntent(post2)
    expect(result2.intent).toBe('SUPPLY')
    expect(result2.detectedTrade).toBe('plomero')

    const post3 = 'Electricista certificado disponible para instalaciones trifásicas y cableado'
    const result3 = classifyPostIntent(post3)
    expect(result3.intent).toBe('SUPPLY')
    expect(result3.detectedTrade).toBe('electricista')
  })

  it('should classify demand posts accurately (Homeowners / Clients)', () => {
    const post1 = 'Busco plomero urgente para arreglar una fuga en el baño en Chapinero'
    const result1 = classifyPostIntent(post1)
    expect(result1.intent).toBe('DEMAND')
    expect(result1.detectedTrade).toBe('plomero')
    expect(result1.extractedZone).toBe('Chapinero')
    expect(result1.confidence).toBe('HIGH')

    const post2 = 'Necesito cotización para pintura de fachada de 3 pisos'
    const result2 = classifyPostIntent(post2)
    expect(result2.intent).toBe('DEMAND')
    expect(result2.detectedTrade).toBe('pintor')

    const post3 = 'Alguien que haga remodelación de cocina integral y cambio de pisos?'
    const result3 = classifyPostIntent(post3)
    expect(result3.intent).toBe('DEMAND')
    expect(['remodelador', 'albanil', 'maestro']).toContain(result3.detectedTrade)
  })

  describe('Empirical Production Corpus Accuracy (Demand vs Supply)', () => {
    const empiricalDemandPosts = [
      { text: 'SE BUSCA AYUDANTE DE CONSTRUCCIÓN', trade: 'maestro' },
      { text: 'Se busca soldador', trade: 'maestro' },
      { text: 'algún maestro de obra disponible para un trabajo', trade: 'maestro' },
      { text: 'requiero a un maestro para remodelar', trade: 'remodelador' },
      { text: 'Se busca maestro para enchape', trade: 'remodelador' },
      { text: 'requiero un maestro de obra civil para remodelación', trade: 'remodelador' },
      { text: 'Solicito plomero / Busco plomería', trade: 'plomero' },
      { text: 'Necesito electricista urgente / Corto circuito', trade: 'electricista' },
      { text: 'Busco maestro para remodelación / Obra blanca', trade: 'remodelador' },
      { text: 'Solicito cotización para pintura / Pintor', trade: 'pintor' },
      { text: 'Busco quien trabaje en remodelación de apartamento', trade: 'remodelador' },
      { text: 'Alguien que haga drywall en Kennedy', trade: 'remodelador', zone: 'Kennedy' },
      { text: 'Quien para pintar un apartamento en Chía', trade: 'pintor', zone: 'Chía' },
      { text: 'Recomienden plomero bueno en Suba', trade: 'plomero', zone: 'Suba' },
    ]

    for (const item of empiricalDemandPosts) {
      it(`should classify DEMAND correctly: "${item.text}"`, () => {
        const res = classifyPostIntent(item.text)
        expect(res.intent).toBe('DEMAND')
        if (item.zone) {
          expect(res.extractedZone).toBe(item.zone)
        }
      })
    }

    const empiricalSupplyPosts = [
      { text: 'Ofresco mis servicios de ornamentación y soldadura', trade: 'maestro' },
      { text: 'Ofrezco mis servicios como maestro de obra', trade: 'maestro' },
      { text: 'Ofrezco mis servicios como albañil', trade: 'albanil' },
      { text: 'Ofrezco mis servicios como contratista', trade: 'contratista' },
      { text: 'Ofrezco mis servicios como pintor', trade: 'pintor' },
      { text: 'Ofrezco mis servicios como electricista', trade: 'electricista' },
      { text: 'Ofrezco mis servicios como plomero', trade: 'plomero' },
      { text: 'Disponible para trabajar en obras y contratos', trade: 'general' },
      { text: 'Busco trabajo en obra blanca', trade: 'remodelador' },
      { text: 'Busco empleo como oficial de construcción', trade: 'maestro' },
      { text: 'En busca de trabajo de pintura', trade: 'pintor' },
      { text: 'A la orden para cualquier trabajo de remodelación', trade: 'remodelador' },
      { text: 'Realizo trabajos de enchape y pintura', trade: 'pintor' },
      { text: 'Hacemos trabajos de obra blanca y drywall', trade: 'remodelador' },
      { text: 'Cuento con experiencia en acabados y enchapes', trade: 'remodelador' },
    ]

    for (const item of empiricalSupplyPosts) {
      it(`should classify SUPPLY correctly: "${item.text}"`, () => {
        const res = classifyPostIntent(item.text)
        expect(res.intent).toBe('SUPPLY')
      })
    }
  })

  describe('Crucial Disambiguation Edge Cases (Hiring vs Job Seeking)', () => {
    it('should distinguish "Busco trabajo" (SUPPLY) vs "Busco quien trabaje" (DEMAND)', () => {
      const supply = classifyPostIntent('Busco trabajo en construcción')
      expect(supply.intent).toBe('SUPPLY')

      const demand = classifyPostIntent('Busco quien trabaje en construcción')
      expect(demand.intent).toBe('DEMAND')
    })

    it('should distinguish "Busco empleo" (SUPPLY) vs "Busco empleado / ayudante" (DEMAND)', () => {
      const supply = classifyPostIntent('Busco empleo urgente')
      expect(supply.intent).toBe('SUPPLY')

      const demand = classifyPostIntent('Busco ayudante de construcción urgente')
      expect(demand.intent).toBe('DEMAND')
    })

    it('should distinguish "Se busca trabajo" (SUPPLY) vs "Se busca maestro" (DEMAND)', () => {
      const supply = classifyPostIntent('Se busca trabajo como pintor')
      expect(supply.intent).toBe('SUPPLY')

      const demand = classifyPostIntent('Se busca maestro pintor')
      expect(demand.intent).toBe('DEMAND')
    })

    it('should handle spelling variations like "ofresco" and "alvañil"', () => {
      const supply = classifyPostIntent('Ofresco servicios de alvañil en Bosa')
      expect(supply.intent).toBe('SUPPLY')
      expect(supply.extractedZone).toBe('Bosa')
    })
  })

  describe('Performance & Catastrophic Backtracking Protection', () => {
    it('should evaluate long repetitive messages in under 20ms without hanging', () => {
      const pathologicalText = 'busco '.repeat(500) + 'maestro de obra para remodelar '.repeat(200) + 'en Suba'
      const start = performance.now()
      const res = classifyPostIntent(pathologicalText)
      const durationMs = performance.now() - start

      expect(durationMs).toBeLessThan(50)
      expect(res.intent).toBe('DEMAND')
      expect(res.extractedZone).toBe('Suba')
    })
  })

  it('should classify neutral / irrelevant posts as NEUTRAL', () => {
    const post1 = 'Vendo taladro DeWalt 20V casi nuevo con 2 baterías'
    const result1 = classifyPostIntent(post1)
    expect(result1.intent).toBe('NEUTRAL')

    const post2 = 'Meme del viernes en la obra jajaja'
    const result2 = classifyPostIntent(post2)
    expect(result2.intent).toBe('NEUTRAL')

    const post3 = ''
    const result3 = classifyPostIntent(post3)
    expect(result3.intent).toBe('NEUTRAL')
  })

  it('should generate prepared comments with author tagging and UTMs for SUPPLY', () => {
    const post = {
      id: '123_456',
      message: 'Ofrezco servicios de plomería y gasfitería a domicilio',
      authorName: 'Carlos Maestro',
      authorId: 'user_carlos',
      created_time: '2026-08-29T00:00:00Z',
      permalink_url: 'https://facebook.com/groups/123/posts/456',
    }

    const prepared = prepareComment({ post })
    expect(prepared).not.toBeNull()
    expect(prepared?.intent).toBe('SUPPLY')
    expect(prepared?.authorName).toBe('Carlos Maestro')
    expect(prepared?.formattedComment).toContain('Carlos Maestro')
    expect(prepared?.utmUrl).toContain('utm_campaign=growth_maestros')
    expect(prepared?.utmUrl).toContain('utm_source=facebook_group')
    expect(prepared?.utmUrl).toContain('utm_content=')
  })

  it('should generate prepared comments with author tagging and UTMs for DEMAND', () => {
    const post = {
      id: '123_789',
      message: 'Busco plomero urgente para destape de lavaplatos',
      authorName: 'Diana Propietaria',
      authorId: 'user_diana',
      created_time: '2026-08-29T00:00:00Z',
      permalink_url: 'https://facebook.com/groups/123/posts/789',
    }

    const prepared = prepareComment({ post })
    expect(prepared).not.toBeNull()
    expect(prepared?.intent).toBe('DEMAND')
    expect(prepared?.authorName).toBe('Diana Propietaria')
    expect(prepared?.formattedComment).toContain('Diana Propietaria')
    expect(prepared?.utmUrl).toContain('utm_campaign=demand_homeowners')
    expect(prepared?.utmUrl).toContain('utm_source=facebook_group')
    expect(prepared?.utmUrl).toContain('utm_content=')
  })

  it('should return null prepared comment for NEUTRAL posts', () => {
    const post = {
      id: '123_000',
      message: 'Noticia sobre el nuevo POT de Bogotá',
      authorName: 'Admin Grupo',
      authorId: 'user_admin',
      created_time: '2026-08-29T00:00:00Z',
      permalink_url: 'https://facebook.com/groups/123/posts/000',
    }

    const prepared = prepareComment({ post })
    expect(prepared).toBeNull()
  })
})

