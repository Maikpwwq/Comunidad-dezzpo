/**
 * Asesoria Service Unit Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    getAllAsesorias,
    createAsesoria,
    addAsesoriaResponse,
    incrementAsesoriaLikes,
} from '@services/asesoriaService'

import * as firestoreModule from 'firebase/firestore'

// Mock Firebase
vi.mock('@services/firebase', () => ({
    isFirebaseAvailable: () => true,
    firestore: {},
}))

vi.mock('firebase/firestore', async (importOriginal) => {
    const actual = await importOriginal<typeof import('firebase/firestore')>()
    return {
        ...actual,
        collection: vi.fn(() => ({ type: 'collection' })),
        doc: vi.fn((_db, ...paths) => ({ type: 'doc', path: paths.join('/') })),
        addDoc: vi.fn(() => Promise.resolve({ id: 'asesoria-789' })),
        getDocs: vi.fn(),
        updateDoc: vi.fn(() => Promise.resolve()),
        setDoc: vi.fn(() => Promise.resolve()),
        query: vi.fn((col) => col),
        orderBy: vi.fn(),
        arrayUnion: vi.fn((val) => val),
        increment: vi.fn((val) => val),
    }
})

describe('asesoriaService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('createAsesoria', () => {
        it('creates a new advisory document and sets docId', async () => {
            const id = await createAsesoria({
                asesoriaTitulo: '¿Cómo impermeabilizar una terraza?',
                asesoriaDescription: 'Tengo filtraciones de agua en mi último piso',
                asesoriaCategoria: 'Impermeabilización',
                asesoriaAuthorId: 'user-100',
                asesoriaAuthorName: 'Carlos Pérez',
                asesoriaAuthorRole: 1,
            })

            expect(id).toBe('asesoria-789')
            expect(firestoreModule.addDoc).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    asesoriaTitulo: '¿Cómo impermeabilizar una terraza?',
                    asesoriaAuthorId: 'user-100',
                    asesoriaSelect: 'open',
                })
            )
        })
    })

    describe('addAsesoriaResponse', () => {
        it('adds a response with verified badge for merchants', async () => {
            const ok = await addAsesoriaResponse('asesoria-789', {
                providerId: 'merchant-200',
                authorName: 'Construcciones M&M',
                authorRole: 2,
                answerText: 'Recomiendo aplicar un manto asfáltico o impermeabilizante acrílico con tela de refuerzo.',
                date: '2026-07-21T15:00:00Z',
            })

            expect(ok).toBe(true)
            expect(firestoreModule.updateDoc).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    asesoriaRespuestas: expect.anything(),
                })
            )
        })
    })

    describe('getAllAsesorias', () => {
        it('fetches and maps advisory threads', async () => {
            vi.mocked(firestoreModule.getDocs).mockResolvedValueOnce({
                docs: [
                    {
                        id: 't1',
                        data: () => ({
                            asesoriaTitulo: 'Consulta de pintura',
                            asesoriaCreatedAt: '2026-07-21T10:00:00Z',
                        }),
                    },
                ],
            } as any)

            const list = await getAllAsesorias()

            expect(list.length).toBe(1)
            expect(list[0]!.asesoriaTitulo).toBe('Consulta de pintura')
            expect(list[0]!.id).toBe('t1')
        })
    })
})
