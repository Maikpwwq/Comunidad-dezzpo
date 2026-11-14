/**
 * Unit Tests — Merchant Eligibility Predicate (Invariant I1 & R3)
 */
import { describe, it, expect } from 'vitest'
import { isMerchantEligibleForRecommendations } from '@/features/similarProfiles/domain/eligibility'
import type { CandidateProfile } from '@/features/similarProfiles/domain/types'

describe('Fase 1: Eligibility Domain Logic (Invariant I1)', () => {
    const baseCandidate: CandidateProfile = {
        userId: 'merchant_100',
        userName: 'Instalaciones y Plomería Bogotá',
        userCategories: ['Plomería', 'Redes hidrosanitarias'],
        userSelectedRol: 2,
        status: 'active',
        isDeleted: false,
    }

    it('approves a valid, active merchant with required public fields', () => {
        expect(
            isMerchantEligibleForRecommendations(baseCandidate, {
                targetProfileId: 'visited_999',
            })
        ).toBe(true)
    })

    it('rejects candidate when userId equals targetProfileId (cannot recommend visited profile)', () => {
        expect(
            isMerchantEligibleForRecommendations(baseCandidate, {
                targetProfileId: 'merchant_100',
            })
        ).toBe(false)
    })

    it('rejects candidate when userId equals visitorProfileId (cannot recommend visitor own profile)', () => {
        expect(
            isMerchantEligibleForRecommendations(baseCandidate, {
                targetProfileId: 'visited_999',
                visitorProfileId: 'merchant_100',
            })
        ).toBe(false)
    })

    it('rejects deleted candidates (isDeleted = true)', () => {
        expect(
            isMerchantEligibleForRecommendations(
                { ...baseCandidate, isDeleted: true },
                { targetProfileId: 'visited_999' }
            )
        ).toBe(false)
    })

    it('rejects suspended, hidden, or inactive accounts', () => {
        expect(
            isMerchantEligibleForRecommendations(
                { ...baseCandidate, status: 'suspended' },
                { targetProfileId: 'visited_999' }
            )
        ).toBe(false)

        expect(
            isMerchantEligibleForRecommendations(
                { ...baseCandidate, status: 'oculto' },
                { targetProfileId: 'visited_999' }
            )
        ).toBe(false)

        expect(
            isMerchantEligibleForRecommendations(
                { ...baseCandidate, status: 'inactive' },
                { targetProfileId: 'visited_999' }
            )
        ).toBe(false)
    })

    it('rejects non-merchant roles (e.g. Propietario rol = 1)', () => {
        expect(
            isMerchantEligibleForRecommendations(
                { ...baseCandidate, userSelectedRol: 1 },
                { targetProfileId: 'visited_999' }
            )
        ).toBe(false)
    })

    it('rejects profiles marked private in privacySettings', () => {
        expect(
            isMerchantEligibleForRecommendations(
                {
                    ...baseCandidate,
                    privacySettings: { isPrivateProfile: true },
                },
                { targetProfileId: 'visited_999' }
            )
        ).toBe(false)
    })

    it('rejects profiles with missing name and missing razonSocial', () => {
        expect(
            isMerchantEligibleForRecommendations(
                { ...baseCandidate, userName: '', userRazonSocial: undefined },
                { targetProfileId: 'visited_999' }
            )
        ).toBe(false)
    })

    it('rejects profiles with zero categories', () => {
        expect(
            isMerchantEligibleForRecommendations(
                { ...baseCandidate, userCategories: [] },
                { targetProfileId: 'visited_999' }
            )
        ).toBe(false)
    })
})

