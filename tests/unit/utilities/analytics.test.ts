import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  trackEvent,
  trackSearch,
  trackViewProfile,
  trackContact,
  trackCreateContract,
  trackCompletePayment,
} from '@/utils/analytics'

describe('Analytics Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call window.gtag when available', () => {
    const mockGtag = vi.fn()
    ;(window as unknown as { gtag: typeof mockGtag }).gtag = mockGtag

    trackEvent('test_event', { key: 'value' })
    expect(mockGtag).toHaveBeenCalledWith('event', 'test_event', { key: 'value' })
  })

  it('should track search events', () => {
    const mockGtag = vi.fn()
    ;(window as unknown as { gtag: typeof mockGtag }).gtag = mockGtag

    trackSearch('plomeria', 'Suba', 5)
    expect(mockGtag).toHaveBeenCalledWith('event', 'search_services', {
      service: 'plomeria',
      zone: 'Suba',
      results_count: 5,
    })
  })

  it('should track view profile events', () => {
    const mockGtag = vi.fn()
    ;(window as unknown as { gtag: typeof mockGtag }).gtag = mockGtag

    trackViewProfile('user_123', 'Carlos Plomero', 'oro')
    expect(mockGtag).toHaveBeenCalledWith('event', 'view_profile', {
      comerciante_id: 'user_123',
      comerciante_name: 'Carlos Plomero',
      comerciante_tier: 'oro',
    })
  })

  it('should track contact events', () => {
    const mockGtag = vi.fn()
    ;(window as unknown as { gtag: typeof mockGtag }).gtag = mockGtag

    trackContact('user_123', 'whatsapp')
    expect(mockGtag).toHaveBeenCalledWith('event', 'initiate_contact', {
      comerciante_id: 'user_123',
      contact_type: 'whatsapp',
    })
  })

  it('should track contract creation and payment completion', () => {
    const mockGtag = vi.fn()
    ;(window as unknown as { gtag: typeof mockGtag }).gtag = mockGtag

    trackCreateContract('contract_001', 500000, 'provider_001')
    expect(mockGtag).toHaveBeenCalledWith('event', 'create_contract', {
      contract_id: 'contract_001',
      amount: 500000,
      provider_id: 'provider_001',
    })

    trackCompletePayment('contract_001', 500000)
    expect(mockGtag).toHaveBeenCalledWith('event', 'complete_payment', {
      contract_id: 'contract_001',
      amount: 500000,
    })
  })
})
