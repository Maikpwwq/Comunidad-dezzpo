import { describe, it, expect } from 'vitest'
import {
    evaluateComercianteBadges,
    BADGE_CATALOG,
    type ContractPerformanceMetrics,
} from '../../../src/services/reputation/badgeEngine'

describe('Reputation & Badge Engine', () => {
    it('returns empty badges for a brand new unverified merchant', () => {
        const metrics: ContractPerformanceMetrics = {
            totalCompletedContracts: 0,
            onTimeCompletedContracts: 0,
            disputedContractsCount: 0,
            hasVerifiedIdentity: false,
            hasTechnicalCertification: false,
            isAnnualMember: false,
        }

        const badges = evaluateComercianteBadges(metrics)
        expect(badges).toHaveLength(0)
    })

    it('awards Identidad Verificada when identity is approved', () => {
        const metrics: ContractPerformanceMetrics = {
            totalCompletedContracts: 0,
            onTimeCompletedContracts: 0,
            disputedContractsCount: 0,
            hasVerifiedIdentity: true,
            hasTechnicalCertification: false,
            isAnnualMember: false,
        }

        const badges = evaluateComercianteBadges(metrics)
        expect(badges).toHaveLength(1)
        expect(badges[0]?.id).toBe('identidad_verificada')
        expect(badges[0]?.title).toBe(BADGE_CATALOG.identidad_verificada.title)
    })

    it('awards Miembro Destacado when merchant has an active annual membership', () => {
        const metrics: ContractPerformanceMetrics = {
            totalCompletedContracts: 0,
            onTimeCompletedContracts: 0,
            disputedContractsCount: 0,
            hasVerifiedIdentity: false,
            hasTechnicalCertification: false,
            isAnnualMember: true,
        }

        const badges = evaluateComercianteBadges(metrics)
        expect(badges).toHaveLength(1)
        expect(badges[0]?.id).toBe('miembro_destacado')
        expect(badges[0]?.color).toBe('#d97706')
    })

    it('awards Cero Disputas only if at least 3 contracts are completed with 0 disputes', () => {
        // Less than 3 contracts -> no badge
        expect(
            evaluateComercianteBadges({
                totalCompletedContracts: 2,
                onTimeCompletedContracts: 2,
                disputedContractsCount: 0,
                hasVerifiedIdentity: false,
                hasTechnicalCertification: false,
                isAnnualMember: false,
            }).some((b) => b.id === 'cero_disputas')
        ).toBe(false)

        // 3 completed with 0 disputes -> badge awarded
        expect(
            evaluateComercianteBadges({
                totalCompletedContracts: 3,
                onTimeCompletedContracts: 3,
                disputedContractsCount: 0,
                hasVerifiedIdentity: false,
                hasTechnicalCertification: false,
                isAnnualMember: false,
            }).some((b) => b.id === 'cero_disputas')
        ).toBe(true)

        // 5 completed but 1 dispute -> no badge
        expect(
            evaluateComercianteBadges({
                totalCompletedContracts: 5,
                onTimeCompletedContracts: 5,
                disputedContractsCount: 1,
                hasVerifiedIdentity: false,
                hasTechnicalCertification: false,
                isAnnualMember: false,
            }).some((b) => b.id === 'cero_disputas')
        ).toBe(false)
    })

    it('awards Puntualidad Certificada if >= 90% of completed contracts were on time (min 3)', () => {
        // 9 out of 10 on time (90%) -> awarded
        const badges90 = evaluateComercianteBadges({
            totalCompletedContracts: 10,
            onTimeCompletedContracts: 9,
            disputedContractsCount: 0,
            hasVerifiedIdentity: false,
            hasTechnicalCertification: false,
            isAnnualMember: false,
        })
        expect(badges90.some((b) => b.id === 'puntualidad')).toBe(true)

        // 8 out of 10 on time (80%) -> not awarded
        const badges80 = evaluateComercianteBadges({
            totalCompletedContracts: 10,
            onTimeCompletedContracts: 8,
            disputedContractsCount: 0,
            hasVerifiedIdentity: false,
            hasTechnicalCertification: false,
            isAnnualMember: false,
        })
        expect(badges80.some((b) => b.id === 'puntualidad')).toBe(false)
    })

    it('awards Especialista Calificado if technical certification is verified or high rating', () => {
        const withCert = evaluateComercianteBadges({
            totalCompletedContracts: 1,
            onTimeCompletedContracts: 1,
            disputedContractsCount: 0,
            hasVerifiedIdentity: false,
            hasTechnicalCertification: true,
            isAnnualMember: false,
        })
        expect(withCert.some((b) => b.id === 'especialista')).toBe(true)

        const withHighRating = evaluateComercianteBadges({
            totalCompletedContracts: 4,
            onTimeCompletedContracts: 4,
            disputedContractsCount: 0,
            averageReviewRating: 4.9,
            hasVerifiedIdentity: false,
            hasTechnicalCertification: false,
            isAnnualMember: false,
        })
        expect(withHighRating.some((b) => b.id === 'especialista')).toBe(true)
    })

    it('sorts awarded badges by catalog priority', () => {
        const fullMetrics: ContractPerformanceMetrics = {
            totalCompletedContracts: 10,
            onTimeCompletedContracts: 10,
            disputedContractsCount: 0,
            averageReviewRating: 5.0,
            hasVerifiedIdentity: true,
            hasTechnicalCertification: true,
            isAnnualMember: true,
        }

        const badges = evaluateComercianteBadges(fullMetrics)
        expect(badges).toHaveLength(5)
        expect(badges.map((b) => b.id)).toEqual([
            'identidad_verificada',
            'cero_disputas',
            'puntualidad',
            'especialista',
            'miembro_destacado',
        ])
    })
})

