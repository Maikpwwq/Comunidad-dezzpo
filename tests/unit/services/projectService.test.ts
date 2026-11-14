import { describe, it, expect, vi } from 'vitest'
import {
    checkProjectCreationEligibility,
    createProject,
} from '../../../src/services/projects/projectService'
import * as firebaseModule from '../../../src/services/firebase'

describe('Project Service — Eligibility & Entitlements', () => {
    describe('checkProjectCreationEligibility', () => {
        it('allows free tier user to create project when count is under limit and no before/after pairs', () => {
            const res = checkProjectCreationEligibility(false, 0, false)
            expect(res.allowed).toBe(true)
            expect(res.reason).toBeUndefined()

            const res1 = checkProjectCreationEligibility(false, 1, false)
            expect(res1.allowed).toBe(true)
        })

        it('blocks free tier user from creating project when limit (2) is reached', () => {
            const res = checkProjectCreationEligibility(false, 2, false)
            expect(res.allowed).toBe(false)
            expect(res.reason).toContain('Has alcanzado el límite')
            expect(res.reason).toContain('Membresía Anual')
        })

        it('blocks free tier user from using Before/After pairs', () => {
            const res = checkProjectCreationEligibility(false, 0, true)
            expect(res.allowed).toBe(false)
            expect(res.reason).toContain('Antes / Después')
            expect(res.reason).toContain('exclusivo de la Membresía Anual')
        })

        it('allows annual members to create projects beyond the free limit and use Before/After pairs', () => {
            const res = checkProjectCreationEligibility(true, 5, true)
            expect(res.allowed).toBe(true)
            expect(res.reason).toBeUndefined()
        })
    })

    describe('createProject validation', () => {
        it('rejects project creation if client consent is not granted', async () => {
            vi.spyOn(firebaseModule, 'isFirebaseAvailable').mockReturnValue(true)

            const res = await createProject({
                comercianteId: 'com-1',
                isAnnualMember: false,
                existingProjectsCount: 0,
                data: {
                    comercianteId: 'com-1',
                    title: 'Cocina Nueva',
                    description: 'Remodelación completa',
                    category: 'Cocinas integrales',
                    zone: 'bogota-suba',
                    beforeAfterPairs: [],
                    galleryUrls: ['https://example.com/photo1.webp'],
                    tags: ['cocina'],
                    clientConsent: {
                        granted: false, // NOT GRANTED
                        acceptedAt: new Date().toISOString(),
                        noticeVersion: 'V1.1',
                    },
                },
            })

            expect(res.success).toBe(false)
            expect(res.error?.code).toBe('VALIDATION_ERROR')
            expect(res.error?.message).toContain('autorización del cliente')
        })
    })
})

