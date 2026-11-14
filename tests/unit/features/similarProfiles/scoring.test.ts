/**
 * Unit Tests — Scoring & Ranking Engine (Invariants I2, I3, I4 & R2, R12)
 */
import { describe, it, expect } from 'vitest'
import {
    calculateTradeScore,
    calculateProximityScore,
    calculateQualityScore,
    calculateContextScore,
    computeDailyTieBreakerHash,
    evaluateCandidateProfile,
    rankAndSelectSimilarProfiles,
} from '@/features/similarProfiles/domain/scoring'
import type { CandidateProfile } from '@/features/similarProfiles/domain/types'

describe('Fase 1: Scoring & Ranking Domain Logic', () => {
    describe('calculateTradeScore (Invariant I3)', () => {
        it('gives highest score when primary category matches', () => {
            const target = ['Plomería', 'Albañilería']
            const candidateA = ['Plomería']
            const candidateB = ['Albañilería']

            const resA = calculateTradeScore(target, candidateA)
            const resB = calculateTradeScore(target, candidateB)

            expect(resA.hasTradeMatch).toBe(true)
            expect(resB.hasTradeMatch).toBe(true)
            expect(resA.score).toBeGreaterThan(resB.score)
        })

        it('is monotonically non-decreasing when candidate matches more categories', () => {
            const target = ['Plomería', 'Pintura', 'Albañilería']
            const match1 = ['Plomería']
            const match2 = ['Plomería', 'Pintura']
            const match3 = ['Plomería', 'Pintura', 'Albañilería']

            const s1 = calculateTradeScore(target, match1).score
            const s2 = calculateTradeScore(target, match2).score
            const s3 = calculateTradeScore(target, match3).score

            expect(s2).toBeGreaterThanOrEqual(s1)
            expect(s3).toBeGreaterThanOrEqual(s2)
        })

        it('returns score 0.0 when no categories overlap', () => {
            const target = ['Plomería']
            const candidate = ['Carpintería', 'Electricidad']
            const res = calculateTradeScore(target, candidate)
            expect(res.score).toBe(0.0)
            expect(res.hasTradeMatch).toBe(false)
        })
    })

    describe('calculateProximityScore', () => {
        const candidate: CandidateProfile = {
            userId: 'c1',
            userCiudad: 'Bogotá',
            userDirection: 'Suba, Bogotá',
            userDepartamento: 'Cundinamarca',
            userCodigoPostal: '11111',
            userZonasCobertura: ['suba', 'usaquen'],
        }

        it('resolves municipio tier (1.00) when target zone is within candidate coverage', () => {
            const res = calculateProximityScore('suba', '11111', 'cundinamarca', candidate)
            expect(res.tier).toBe('municipio')
            expect(res.score).toBe(1.0)
            expect(res.isSameZone).toBe(true)
        })

        it('resolves departamento tier (0.60) when target is different locality in same metro department', () => {
            const res = calculateProximityScore('kennedy', '11082', 'cundinamarca', candidate)
            expect(res.tier).toBe('departamento')
            expect(res.score).toBe(0.6)
            expect(res.isSameZone).toBe(false)
        })

        it('resolves nacional tier (0.25) when candidate is outside target department and no coverage', () => {
            const remoteCandidate: CandidateProfile = {
                userId: 'c2',
                userCiudad: 'Medellín',
                userDirection: 'El Poblado',
                userDepartamento: 'Antioquia',
            }
            const res = calculateProximityScore('suba', '11111', 'cundinamarca', remoteCandidate)
            expect(res.tier).toBe('nacional')
            expect(res.score).toBe(0.25)
            expect(res.isSameZone).toBe(false)
        })
    })

    describe('calculateQualityScore & Destacado threshold', () => {
        it('assigns reasons and sets featured when verification, badges, and completeness are high', () => {
            const highQualityCandidate: CandidateProfile = {
                userId: 'top_1',
                userName: 'Top Pro',
                userGrade: 'Verificado',
                trustScore: 85,
                earnedBadges: [{ category: 'Plomería', issuedAt: '2026-01-01' }],
                userPhotoUrl: 'https://dezzpo.com/photos/avatar.jpg',
                userDescription: 'Experto en remodelaciones y plomería con 15 años de trayectoria profesional garantizada.',
                userExperience: '15 años',
                isAvailableNow: true,
            }

            const res = calculateQualityScore(highQualityCandidate)
            expect(res.score).toBeGreaterThanOrEqual(0.70)
            expect(res.isFeatured).toBe(true)
            expect(res.reasons).toContain('verificado')
            expect(res.reasons).toContain('certificado')
            expect(res.reasons).toContain('perfil_completo')
            expect(res.reasons).toContain('activo_reciente')
        })

        it('forces featured flag if candidate has explicit profileTier = destacado', () => {
            const premiumCandidate: CandidateProfile = {
                userId: 'prem_1',
                userName: 'Premium Merchant',
                profileTier: 'destacado',
            }
            const res = calculateQualityScore(premiumCandidate)
            expect(res.isFeatured).toBe(true)
        })
    })

    describe('calculateContextScore (reusing fuzzyEngine)', () => {
        it('scores Persona Natural x Hogar with high affinity score', () => {
            const res = calculateContextScore('persona natural', 'hogar', 'same_zone')
            expect(res.score).toBeGreaterThanOrEqual(0.85)
            expect(res.isAfin).toBe(true)
        })

        it('returns neutral score 0.50 when visitor propertyType is unspecified (Invariant I5)', () => {
            const res = calculateContextScore('persona natural', null, 'same_zone')
            expect(res.score).toBe(0.50)
            expect(res.isAfin).toBe(false)
        })
    })

    describe('computeDailyTieBreakerHash (R12)', () => {
        it('is perfectly deterministic for identical userId and dateSeed', () => {
            const h1 = computeDailyTieBreakerHash('user_abc', '2026-11-14')
            const h2 = computeDailyTieBreakerHash('user_abc', '2026-11-14')
            expect(h1).toBe(h2)
            expect(h1).toBeGreaterThanOrEqual(0)
            expect(h1).toBeLessThan(1)
        })

        it('rotates value when dateSeed changes', () => {
            const hDay1 = computeDailyTieBreakerHash('user_abc', '2026-11-14')
            const hDay2 = computeDailyTieBreakerHash('user_abc', '2026-11-15')
            // With high probability they differ
            expect(typeof hDay1).toBe('number')
            expect(typeof hDay2).toBe('number')
        })
    })

    describe('rankAndSelectSimilarProfiles (Invariants I2 & I4)', () => {
        const createDummyResult = (id: string, score: number) => ({
            item: {
                profileId: id,
                displayName: `Pro ${id}`,
                userCategories: ['Plomería'],
                tier: 'municipio' as const,
                score,
                reasons: ['mismo_oficio' as const],
                reasonLabels: ['Mismo oficio'],
                featured: false,
            },
            rawScores: { trade: 1, proximity: 1, quality: 1, context: 1 },
        })

        it('returns empty array if total candidates are less than minResults (min = 2, Invariant I4)', () => {
            const single = [createDummyResult('id_1', 0.9)]
            const res = rankAndSelectSimilarProfiles(single)
            expect(res).toEqual([])
        })

        it('caps results at maxResults (max = 6, Invariant I4)', () => {
            const many = Array.from({ length: 15 }, (_, i) =>
                createDummyResult(`id_${i}`, 0.9 - i * 0.02)
            )
            const res = rankAndSelectSimilarProfiles(many)
            expect(res.length).toBe(6)
            expect(res[0]?.profileId).toBe('id_0')
        })

        it('produces identical deterministic order on duplicate invocations (Invariant I2)', () => {
            const candidates = [
                createDummyResult('id_A', 0.85),
                createDummyResult('id_B', 0.85),
                createDummyResult('id_C', 0.92),
                createDummyResult('id_D', 0.70),
            ]
            const run1 = rankAndSelectSimilarProfiles(candidates, '2026-11-14')
            const run2 = rankAndSelectSimilarProfiles(candidates, '2026-11-14')

            expect(run1.map((r) => r.profileId)).toEqual(run2.map((r) => r.profileId))
        })
    })

    describe('evaluateCandidateProfile end-to-end composite evaluation', () => {
        it('evaluates candidate profile and combines all 4 dimensions', () => {
            const candidate: CandidateProfile = {
                userId: 'cand_full',
                userName: 'Plomería Total SAS',
                userCategories: ['Plomería'],
                userCiudad: 'Bogotá',
                userDirection: 'Suba',
                userClasification: 'pyme de servicios',
                trustScore: 90,
                userPhotoUrl: 'https://dezzpo.com/avatar.jpg',
                userDescription: 'Servicios especializados en plomería residencial e industrial.',
                userExperience: '10 años',
            }

            const evalResult = evaluateCandidateProfile(candidate, {
                targetCategories: ['Plomería'],
                targetZone: 'suba',
                visitorPropertyType: 'hogar',
                dateSeed: '2026-11-14',
            })

            expect(evalResult.item.profileId).toBe('cand_full')
            expect(evalResult.item.displayName).toBe('Plomería Total SAS')
            expect(evalResult.item.tier).toBe('municipio')
            expect(evalResult.item.score).toBeGreaterThan(0.70)
            expect(evalResult.item.reasons).toContain('mismo_oficio')
            expect(evalResult.item.reasons).toContain('tu_zona')
            expect(evalResult.item.reasons).toContain('perfil_completo')
        })
    })
})
