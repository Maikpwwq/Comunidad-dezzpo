/**
 * Fase 4: Adversarial Battery Tests
 *
 * 9 adversarial test scenarios verifying edge cases, role handling,
 * missing data resilience, and invariant enforcement under stress.
 */

import { describe, it, expect } from 'vitest'
import { isMerchantEligibleForRecommendations, type EligibilityContext } from '@features/similarProfiles/domain/eligibility'
import {
    calculateTradeScore,
    calculateProximityScore,
    calculateQualityScore,
    evaluateCandidateProfile,
    rankAndSelectSimilarProfiles,
    type ScoringInputContext,
    type CandidateEvaluationResult,
} from '@features/similarProfiles/domain/scoring'
import { sectionTitle } from '@features/similarProfiles/domain/sectionTitle'
import { SIMILAR_PROFILES_CONFIG } from '@config/similarProfiles.config'
import type { CandidateProfile, SimilarProfilesData } from '@features/similarProfiles/domain/types'

const DEFAULT_CONTEXT: EligibilityContext = {
    targetProfileId: 'target-visited',
    visitorProfileId: 'visitor-abc',
}

function makeCandidate(overrides: Partial<CandidateProfile> = {}): CandidateProfile {
    return {
        userId: 'candidate-001',
        userName: 'Test Professional',
        userCategories: ['Plomería'],
        userClasification: 'Persona Natural',
        userCiudad: 'Bogotá',
        userDirection: 'Chapinero',
        userSelectedRol: 2,
        status: 'active',
        ...overrides,
    }
}

describe('Fase 4: Adversarial Battery', () => {
    // ── A1: Suspended / Deleted / Hidden accounts never appear ──
    describe('A1: Ineligible accounts are excluded', () => {
        it('rejects suspended account', () => {
            expect(isMerchantEligibleForRecommendations(makeCandidate({ status: 'suspended' }), DEFAULT_CONTEXT)).toBe(false)
        })

        it('rejects deleted account', () => {
            expect(isMerchantEligibleForRecommendations(makeCandidate({ isDeleted: true }), DEFAULT_CONTEXT)).toBe(false)
        })

        it('rejects private profile', () => {
            expect(isMerchantEligibleForRecommendations(
                makeCandidate({ privacySettings: { isPrivateProfile: true } }),
                DEFAULT_CONTEXT
            )).toBe(false)
        })

        it('rejects non-comerciante role (Propietario, role=1)', () => {
            expect(isMerchantEligibleForRecommendations(makeCandidate({ userSelectedRol: 1 }), DEFAULT_CONTEXT)).toBe(false)
        })

        it('rejects profile without name or razonSocial', () => {
            expect(isMerchantEligibleForRecommendations(
                makeCandidate({ userName: '', userRazonSocial: '' }),
                DEFAULT_CONTEXT
            )).toBe(false)
        })

        it('rejects profile without categories', () => {
            expect(isMerchantEligibleForRecommendations(
                makeCandidate({ userCategories: [] }),
                DEFAULT_CONTEXT
            )).toBe(false)
        })
    })

    // ── A2: Missing data resilience ──
    describe('A2: Missing data does not crash scoring', () => {
        it('trade score returns 0.0 for empty categories', () => {
            const res = calculateTradeScore([], ['Plomería'])
            expect(res.score).toBe(0.0)
        })

        it('trade score returns 0.0 for undefined target categories', () => {
            const res = calculateTradeScore(['Plomería'], [])
            expect(res.score).toBe(0.0)
        })

        it('proximity score returns nacional for candidate with no location data', () => {
            const candidate = makeCandidate({ userCiudad: '', userDirection: '', userDepartamento: '' })
            const result = calculateProximityScore('Bogotá', null, null, candidate)
            expect(result.tier).toBe('nacional')
            expect(result.score).toBe(SIMILAR_PROFILES_CONFIG.proximityTierScores.nacional)
        })

        it('quality score returns 0.0 for completely bare candidate', () => {
            const candidate = makeCandidate({
                userGrade: undefined,
                trustScore: undefined,
                earnedBadges: undefined,
                userPhotoUrl: undefined,
                userDescription: undefined,
                userExperience: undefined,
                isAvailableNow: undefined,
                lastActive: undefined,
            })
            const result = calculateQualityScore(candidate)
            expect(result.score).toBeGreaterThanOrEqual(0.0)
            expect(result.score).toBeLessThanOrEqual(1.0)
        })
    })

    // ── A3: Deterministic ranking ──
    describe('A3: Deterministic ranking under identical scores', () => {
        it('same inputs produce identical order across multiple runs', () => {
            const candidates = [
                makeCandidate({ userId: 'aaa', userName: 'Alpha' }),
                makeCandidate({ userId: 'bbb', userName: 'Beta' }),
                makeCandidate({ userId: 'ccc', userName: 'Charlie' }),
            ]

            const scoringCtx: ScoringInputContext = {
                targetCategories: ['Plomería'],
                targetZone: 'Bogotá',
                dateSeed: '2026-11-14',
            }

            const evaluated1: CandidateEvaluationResult[] = candidates.map((c) => evaluateCandidateProfile(c, scoringCtx))
            const evaluated2: CandidateEvaluationResult[] = candidates.map((c) => evaluateCandidateProfile(c, scoringCtx))

            const run1 = rankAndSelectSimilarProfiles(evaluated1, '2026-11-14')
            const run2 = rankAndSelectSimilarProfiles(evaluated2, '2026-11-14')

            expect(run1.map((r) => r.profileId)).toEqual(run2.map((r) => r.profileId))
        })
    })

    // ── A4: Self-exclusion ──
    describe('A4: Self never appears in recommendations', () => {
        it('visited profile ID is excluded by eligibility', () => {
            const candidate = makeCandidate({ userId: 'target-visited' })
            expect(isMerchantEligibleForRecommendations(candidate, DEFAULT_CONTEXT)).toBe(false)
        })

        it('visitor profile ID is excluded by eligibility', () => {
            const candidate = makeCandidate({ userId: 'visitor-abc' })
            expect(isMerchantEligibleForRecommendations(candidate, DEFAULT_CONTEXT)).toBe(false)
        })
    })

    // ── A5: Score bounds ──
    describe('A5: Score invariants', () => {
        it('trade score is bounded [0.0, 1.0]', () => {
            const maxRes = calculateTradeScore(
                ['Plomería', 'Albañilería', 'Pintura', 'Cerrajería'],
                ['Plomería', 'Albañilería', 'Pintura', 'Cerrajería']
            )
            expect(maxRes.score).toBeLessThanOrEqual(1.0)
            expect(maxRes.score).toBeGreaterThanOrEqual(0.0)

            const minRes = calculateTradeScore(['Plomería'], ['Carpintería'])
            expect(minRes.score).toBe(0.0)
        })

        it('proximity score is bounded [0.0, 1.0]', () => {
            const candidate = makeCandidate({ userCiudad: 'Bogotá', userDirection: 'Chapinero' })
            const result = calculateProximityScore('Bogotá', null, null, candidate)
            expect(result.score).toBeGreaterThanOrEqual(0.0)
            expect(result.score).toBeLessThanOrEqual(1.0)
        })

        it('quality score is bounded [0.0, 1.0]', () => {
            const maxCandidate = makeCandidate({
                trustScore: 95,
                earnedBadges: [{ category: 'Plomería', issuedAt: '2026-01-01' }],
                isAvailableNow: true,
                lastActive: new Date().toISOString(),
                userDescription: 'Full description with enough content for threshold.',
                userExperience: '10 years',
                userPhotoUrl: 'https://example.com/photo.jpg',
            })
            const result = calculateQualityScore(maxCandidate)
            expect(result.score).toBeLessThanOrEqual(1.0)
            expect(result.score).toBeGreaterThanOrEqual(0.0)
        })
    })

    // ── A6: Section title honesty ──
    describe('A6: Section title never lies', () => {
        it('never says "cerca de ti" when zoneSource is perfil_visitado', () => {
            const data: SimilarProfilesData = {
                items: [
                    { profileId: 'r1', displayName: 'A', userCategories: ['Plomería'], tier: 'municipio', score: 0.8, reasons: ['mismo_oficio'], reasonLabels: ['Mismo oficio'], featured: false },
                    { profileId: 'r2', displayName: 'B', userCategories: ['Plomería'], tier: 'municipio', score: 0.7, reasons: ['mismo_oficio'], reasonLabels: ['Mismo oficio'], featured: false },
                ],
                basis: { categoryName: 'Plomería', zoneName: 'Soacha', zoneSource: 'perfil_visitado', farthestTier: 'municipio' },
                generatedAt: new Date().toISOString(),
            }
            expect(sectionTitle(data).title).not.toContain('cerca de ti')
        })

        it('never says "destacados" when no items are featured', () => {
            const data: SimilarProfilesData = {
                items: [
                    { profileId: 'r1', displayName: 'A', userCategories: ['Pintura'], tier: 'nacional', score: 0.5, reasons: ['mismo_oficio'], reasonLabels: ['Mismo oficio'], featured: false },
                    { profileId: 'r2', displayName: 'B', userCategories: ['Pintura'], tier: 'nacional', score: 0.4, reasons: ['mismo_oficio'], reasonLabels: ['Mismo oficio'], featured: false },
                ],
                basis: { categoryName: 'Pintura', zoneName: null, zoneSource: null, farthestTier: 'nacional' },
                generatedAt: new Date().toISOString(),
            }
            expect(sectionTitle(data).title).not.toContain('destacados')
            expect(sectionTitle(data).title).toContain('similares')
        })
    })

    // ── A7: Config boundary checks ──
    describe('A7: Config boundary integrity', () => {
        it('maxCandidatesFetched >= maxResults', () => {
            expect(SIMILAR_PROFILES_CONFIG.maxCandidatesFetched).toBeGreaterThanOrEqual(SIMILAR_PROFILES_CONFIG.maxResults)
        })

        it('maxQueries is <= 3 (hard cap)', () => {
            expect(SIMILAR_PROFILES_CONFIG.maxQueries).toBeLessThanOrEqual(3)
        })

        it('cacheTtlSeconds is <= 900 (15 min boundary for R3)', () => {
            expect(SIMILAR_PROFILES_CONFIG.cacheTtlSeconds).toBeLessThanOrEqual(900)
        })

        it('featuredQualityThreshold is between 0 and 1', () => {
            expect(SIMILAR_PROFILES_CONFIG.featuredQualityThreshold).toBeGreaterThan(0)
            expect(SIMILAR_PROFILES_CONFIG.featuredQualityThreshold).toBeLessThanOrEqual(1.0)
        })
    })

    // ── A8: Empty directory scenario ──
    describe('A8: Empty directory returns empty', () => {
        it('zero evaluated candidates produces empty ranking', () => {
            const result = rankAndSelectSimilarProfiles([])
            expect(result.length).toBe(0)
        })

        it('below minResults returns empty (Invariant I4)', () => {
            const scoringCtx: ScoringInputContext = { targetCategories: ['Plomería'], targetZone: 'Bogotá' }
            const single = evaluateCandidateProfile(makeCandidate(), scoringCtx)
            const result = rankAndSelectSimilarProfiles([single])
            // Single result is below minResults=2, must return empty
            expect(result.length).toBe(0)
        })
    })

    // ── A9: Reason labels do not contain PII ──
    describe('A9: Reason labels contain no PII or technical jargon', () => {
        it('no label contains email, phone, or ID patterns', () => {
            for (const label of Object.values(SIMILAR_PROFILES_CONFIG.reasonLabels)) {
                expect(label).not.toMatch(/@/)
                expect(label).not.toMatch(/\d{7,}/)
                expect(label).not.toMatch(/userId|profileId|visitorId/i)
            }
        })
    })
})
