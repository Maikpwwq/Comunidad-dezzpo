/**
 * Blog Service Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    getPublishedBlogPosts,
    getBlogPostBySlug,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    slugify,
} from '@services/blogService'

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
        addDoc: vi.fn(() => Promise.resolve({ id: 'post-100' })),
        getDocs: vi.fn(() => Promise.resolve({ empty: true, docs: [] })),
        getDoc: vi.fn(() => Promise.resolve({ exists: () => false })),
        updateDoc: vi.fn(() => Promise.resolve()),
        deleteDoc: vi.fn(() => Promise.resolve()),
        query: vi.fn((col) => col),
        where: vi.fn(),
        orderBy: vi.fn(),
        increment: vi.fn((val) => val),
    }
})

describe('blogService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('slugify', () => {
        it('converts title text to valid URL slug', () => {
            const slug = slugify('Guía Definitiva: ¿Cómo Publicar Tu Proyecto?')
            expect(slug).toBe('guia-definitiva-como-publicar-tu-proyecto')
        })
    })

    describe('createBlogPost', () => {
        it('creates a new blog post document with auto slug', async () => {
            const id = await createBlogPost({
                title: 'Consejos de Pintura Epóxica',
                slug: 'consejos-pintura-epoxica',
                excerpt: 'Recomendaciones prácticas para aplicar epóxico.',
                content: '# Pintura Epóxica\n\nContenido...',
                coverImage: 'https://example.com/cover.jpg',
                category: 'Propietarios',
                targetAudience: 'propietario',
                authorName: 'Equipo Dezzpo',
                authorRole: 'Especialista',
                readTimeMinutes: 4,
                publishedAt: '2026-07-21T12:00:00Z',
                status: 'published',
            })

            expect(id).toBe('post-100')
            expect(firestoreModule.addDoc).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    title: 'Consejos de Pintura Epóxica',
                    slug: 'consejos-pintura-epoxica',
                    status: 'published',
                })
            )
        })
    })

    describe('updateBlogPost', () => {
        it('updates post data in firestore', async () => {
            const ok = await updateBlogPost('post-100', {
                title: 'Nuevo Título de la Guía',
            })

            expect(ok).toBe(true)
            expect(firestoreModule.updateDoc).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    title: 'Nuevo Título de la Guía',
                    slug: 'nuevo-titulo-de-la-guia',
                })
            )
        })
    })

    describe('deleteBlogPost', () => {
        it('deletes post from firestore', async () => {
            const ok = await deleteBlogPost('post-100')
            expect(ok).toBe(true)
            expect(firestoreModule.deleteDoc).toHaveBeenCalledWith(expect.anything())
        })
    })
})
