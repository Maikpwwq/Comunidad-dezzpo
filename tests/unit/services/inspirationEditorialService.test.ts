import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    buildInspirationThemeTitle,
    assembleInspirationCollection,
    getCuratedInspirationProjects,
} from '@/services/inspiration/inspirationEditorialService'
import type { ProjectFirestoreDocument } from '@/services/projects'
import * as firebaseModule from '@/services/firebase'

vi.mock('@services/firebase', () => ({
    isFirebaseAvailable: vi.fn(),
    firestore: {},
}))

vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
}))

describe('inspirationEditorialService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('buildInspirationThemeTitle', () => {
        it('formats title correctly with zone', () => {
            const title = buildInspirationThemeTitle('Cocinas', 'chapinero')
            expect(title).toBe('Inspiración y Proyectos Reales de Cocinas en Chapinero')
        })

        it('defaults to Bogotá when zone is default or unspecified', () => {
            const title = buildInspirationThemeTitle('Pintura', 'bogota')
            expect(title).toBe('Inspiración y Proyectos Reales de Pintura en Bogotá')
        })
    })

    describe('assembleInspirationCollection', () => {
        it('assembles structured editorial metadata and keywords', () => {
            const dummyProjects: ProjectFirestoreDocument[] = [
                {
                    projectId: 'p1',
                    comercianteId: 'c1',
                    title: 'Cocina Integral Moderna',
                    description: 'Remodelación completa',
                    category: 'Cocinas',
                    zone: 'suba',
                    beforeAfterPairs: [],
                    galleryUrls: [],
                    clientConsent: { granted: true, acceptedAt: '', noticeVersion: 'V1.1' },
                    editorialStatus: 'approved',
                    isFeatured: true,
                    tags: ['Cocinas', 'suba'],
                    createdAt: '2026-11-13T00:00:00Z',
                    updatedAt: '2026-11-13T00:00:00Z',
                },
            ]

            const collection = assembleInspirationCollection('Cocinas', 'suba', dummyProjects)
            expect(collection.themeSlug).toBe('cocinas-suba')
            expect(collection.projectCount).toBe(1)
            expect(collection.seoKeywords).toContain('Cocinas')
            expect(collection.seoKeywords).toContain('suba')
        })
    })

    describe('getCuratedInspirationProjects', () => {
        it('returns empty array when firebase is unavailable', async () => {
            vi.mocked(firebaseModule.isFirebaseAvailable).mockReturnValue(false)

            const res = await getCuratedInspirationProjects()
            expect(res.success).toBe(true)
            expect(res.data).toEqual([])
        })
    })
})

