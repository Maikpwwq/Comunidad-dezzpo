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
