import { describe, it, expect, beforeEach } from 'vitest'
import {
  storeUtmAttribution,
  getStoredUtmAttribution,
  clearStoredUtmAttribution,
  type UtmAttribution,
} from '@/hooks/useUtmTracker'


describe('UTM Tracker & Attribution Persistence', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('should persist and retrieve UTM attribution in sessionStorage', () => {
    const attribution: UtmAttribution = {
      utm_source: 'facebook_group',
      utm_medium: 'group_interception',
      utm_campaign: 'demand_homeowners',
      utm_content: 'CLI-CONF-CON-CON-15',
      utm_term: 'plomero',
      landingPath: '/directorio',
      capturedAt: new Date().toISOString(),
    }

    storeUtmAttribution(attribution)
    const stored = getStoredUtmAttribution()

    expect(stored).toBeDefined()
    expect(stored?.utm_source).toBe('facebook_group')
    expect(stored?.utm_campaign).toBe('demand_homeowners')
    expect(stored?.utm_content).toBe('CLI-CONF-CON-CON-15')
    expect(stored?.utm_term).toBe('plomero')
    expect(stored?.landingPath).toBe('/directorio')
  })

  it('should clear stored UTM attribution', () => {
    const attribution: UtmAttribution = {
      utm_source: 'facebook',
      utm_medium: 'group_comment',
      utm_campaign: 'growth_maestros',
      utm_content: 'MAES-EXP-INT-URL-01',
      landingPath: '/',
      capturedAt: new Date().toISOString(),
    }

    storeUtmAttribution(attribution)
    expect(getStoredUtmAttribution()).not.toBeNull()

    clearStoredUtmAttribution()
    expect(getStoredUtmAttribution()).toBeNull()
  })

  it('should return null when no attribution is present in sessionStorage', () => {
    expect(getStoredUtmAttribution()).toBeNull()
  })
})
