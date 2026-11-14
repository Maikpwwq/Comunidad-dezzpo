/**
 * Property-Based Fuzzing Tests (Invariants I1, I2, I3, I4, I7)
 *
 * Uses fast-check to assert mathematical and business invariants
 * across randomized candidates, categories, zones, and contexts.
 */
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { isMerchantEligibleForRecommendations } from '@/features/similarProfiles/domain/eligibility'
import {
    calculateTradeScore,
    evaluateCandidateProfile,
    rankAndSelectSimilarProfiles,
} from '@/features/similarProfiles/domain/scoring'
import { sectionTitle } from '@/features/similarProfiles/domain/sectionTitle'
import type {
    CandidateProfile,
    ProximityTier,
    ZoneSource,
    SimilarProfilesData,
} from '@/features/similarProfiles/domain/types'

const CATEGORY_SAMPLE = [
    'Plomería',
    'Pintura',
    'Albañilería',
    'Red electrica',
    'Carpintería',
    'Cerrajería',
    'Impermeabilización',
    'Aires Acondicionados',
]

const STRUCTURE_SAMPLE = [
    'persona natural',
    'micro empresa',
    'pyme de servicios',
    'empresa',
    undefined,
]

const candidateArbitrary: fc.Arbitrary<CandidateProfile> = fc.record({
    userId: fc.uuid(),
    userName: fc.string({ minLength: 3, maxLength: 40 }),
    userCategories: fc.subarray(CATEGORY_SAMPLE, { minLength: 1, maxLength: 4 }),
    userClasification: fc.constantFrom(...STRUCTURE_SAMPLE),
    userCiudad: fc.constantFrom('Bogotá', 'Medellín', 'Cali', 'Chía', undefined),
    userDirection: fc.constantFrom('Suba', 'Chapinero', 'Kennedy', 'Usaquén', undefined),
    userDepartamento: fc.constantFrom('Cundinamarca', 'Antioquia', 'Valle', undefined),
    userSelectedRol: fc.constant(2),
    status: fc.constantFrom('active', 'suspended', 'hidden', undefined),
    isDeleted: fc.boolean(),
    trustScore: fc.integer({ min: 0, max: 100 }),
    userPhotoUrl: fc.constantFrom('https://dezzpo.com/avatar.jpg', undefined),
    userDescription: fc.string({ minLength: 0, maxLength: 100 }),
    userExperience: fc.string({ minLength: 0, maxLength: 20 }),
})

describe('Similar Profiles Invariants (Property-Based with fast-check)', () => {
    it('Invariant I1: Never allows visited profile or visitor profile into recommendations', () => {
        fc.assert(
            fc.property(
                candidateArbitrary,
                fc.uuid(),
                fc.uuid(),
                (candidate, targetId, visitorId) => {
                    // Test 1: candidate is the target
                    const targetMatchCandidate = { ...candidate, userId: targetId }
                    expect(
                        isMerchantEligibleForRecommendations(targetMatchCandidate, {
                            targetProfileId: targetId,
                            visitorProfileId: visitorId,
                        })
                    ).toBe(false)

                    // Test 2: candidate is the visitor
                    const visitorMatchCandidate = { ...candidate, userId: visitorId }
                    expect(
                        isMerchantEligibleForRecommendations(visitorMatchCandidate, {
                            targetProfileId: targetId,
                            visitorProfileId: visitorId,
                        })
                    ).toBe(false)
                }
            ),
            { numRuns: 300 }
        )
    })

    it('Invariant I2: Idempotent & Deterministic ordering for identical inputs', () => {
        fc.assert(
            fc.property(
                fc.array(candidateArbitrary, { minLength: 2, maxLength: 15 }),
                fc.subarray(CATEGORY_SAMPLE, { minLength: 1, maxLength: 3 }),
                fc.constantFrom('suba', 'bogota', undefined),
                fc.constantFrom('2026-11-14', '2026-11-15'),
                (candidates, targetCategories, targetZone, dateSeed) => {
                    const eligible = candidates.filter((c) =>
                        isMerchantEligibleForRecommendations(c, { targetProfileId: 'other_target' })
                    )

                    const context = { targetCategories, targetZone, dateSeed }
                    const evaluated = eligible.map((c) => evaluateCandidateProfile(c, context))

                    const run1 = rankAndSelectSimilarProfiles(evaluated, dateSeed)
                    const run2 = rankAndSelectSimilarProfiles(evaluated, dateSeed)

                    expect(run1.map((i) => i.profileId)).toEqual(run2.map((i) => i.profileId))
                }
            ),
            { numRuns: 200 }
        )
    })

    it('Invariant I3: Scores are bounded in [0.00, 1.00] without NaN, and monotonically non-decreasing', () => {
        fc.assert(
            fc.property(
                candidateArbitrary,
                fc.subarray(CATEGORY_SAMPLE, { minLength: 1, maxLength: 4 }),
                (candidate, targetCategories) => {
                    const res = evaluateCandidateProfile(candidate, { targetCategories })

                    expect(Number.isNaN(res.item.score)).toBe(false)
                    expect(res.item.score).toBeGreaterThanOrEqual(0.0)
                    expect(res.item.score).toBeLessThanOrEqual(1.0)

                    // Test monotonicity of trade score: adding an extra matching category never decreases score
                    const initialCats = ['Plomería']
                    const expandedCats = ['Plomería', 'Pintura']
                    const tradeInitial = calculateTradeScore(targetCategories, initialCats).score
                    const tradeExpanded = calculateTradeScore(targetCategories, expandedCats).score

                    expect(Number.isNaN(tradeInitial)).toBe(false)
                    expect(Number.isNaN(tradeExpanded)).toBe(false)
                    expect(tradeExpanded).toBeGreaterThanOrEqual(tradeInitial)
                }
            ),
            { numRuns: 300 }
        )
    })

    it('Invariant I4: Output count is <= maxResults (6), and 0 if count < minResults (2)', () => {
        fc.assert(
            fc.property(
                fc.array(candidateArbitrary, { minLength: 0, maxLength: 20 }),
                (candidates) => {
                    const eligible = candidates.filter((c) =>
                        isMerchantEligibleForRecommendations(c, { targetProfileId: 'target_id' })
                    )
                    const context = { targetCategories: ['Plomería'] }
                    const evaluated = eligible.map((c) => evaluateCandidateProfile(c, context))
                    const selected = rankAndSelectSimilarProfiles(evaluated)

                    expect(selected.length).toBeLessThanOrEqual(6)
                    if (evaluated.length < 2) {
                        expect(selected.length).toBe(0)
                    }
                }
            ),
            { numRuns: 250 }
        )
    })

    it('Invariant I7: Title contains «cerca de ti» if and only if zoneSource is busqueda/visitante and farthestTier is municipio', () => {
        const tierArbitrary = fc.constantFrom<ProximityTier>('municipio', 'departamento', 'nacional')
        const sourceArbitrary = fc.constantFrom<ZoneSource | null>('busqueda', 'visitante', 'perfil_visitado', null)

        fc.assert(
            fc.property(
                tierArbitrary,
                sourceArbitrary,
                fc.constantFrom('Plomería', 'Pintura', 'Albañilería'),
                (tier, source, catName) => {
                    const data: SimilarProfilesData = {
                        items: [
                            {
                                profileId: 'id1',
                                displayName: 'Pro 1',
                                userCategories: [catName],
                                tier,
                                score: 0.9,
                                reasons: ['mismo_oficio'],
                                reasonLabels: ['Mismo oficio'],
                                featured: false,
                            },
                            {
                                profileId: 'id2',
                                displayName: 'Pro 2',
                                userCategories: [catName],
                                tier,
                                score: 0.8,
                                reasons: ['mismo_oficio'],
                                reasonLabels: ['Mismo oficio'],
                                featured: false,
                            },
                        ],
                        basis: {
                            categoryName: catName,
                            zoneName: 'Suba',
                            zoneSource: source,
                            farthestTier: tier,
                        },
                        generatedAt: '2026-11-14T10:00:00Z',
                    }

                    const { title } = sectionTitle(data)
                    const hasCercaDeTi = title.includes('cerca de ti')
                    const expectedCercaDeTi =
                        (source === 'busqueda' || source === 'visitante') && tier === 'municipio'

                    expect(hasCercaDeTi).toBe(expectedCercaDeTi)
                }
            ),
            { numRuns: 300 }
        )
    })
})
