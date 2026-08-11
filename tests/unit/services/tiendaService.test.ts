import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    getTiendas,
    getTiendaById,
    createTienda,
    updateTienda,
    approveTienda,
    rejectTienda,
    slugify,
} from '@services/tiendas'
import * as firestoreModule from 'firebase/firestore'

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
        getDoc: vi.fn(),
        getDocs: vi.fn(),
        setDoc: vi.fn(() => Promise.resolve()),
        updateDoc: vi.fn(() => Promise.resolve()),
        deleteDoc: vi.fn(() => Promise.resolve()),
        query: vi.fn((col) => col),
        where: vi.fn(),
        orderBy: vi.fn(),
    }
})

describe('tiendaService Unit Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('slugify', () => {
        it('generates clean URL-friendly slugs', () => {
            expect(slugify('Ferretería & Metales Bogotá')).toBe('ferreteria-metales-bogota')
            expect(slugify('Pinturas & Color Tech')).toBe('pinturas-color-tech')
        })
    })

    describe('createTienda', () => {
        it('creates a new tienda document with generated slug and timestamps', async () => {
            const input = {
                nombre: 'Ferretería El Sol',
                descripcion: 'Venta de materiales',
                categorias: ['ferreteria_general'],
                sedes: [
                    {
                        id: 's1',
                        nombreSede: 'Sucursal Principal',
                        direccion: 'Calle 100 # 15-20',
                        ciudad: 'Bogotá, Colombia',
                        zona: 'usaquen',
                        telefonos: ['6013004050'],
                    },
                ],
            }

            const res = await createTienda(input, 'user-123')
            expect(res.success).toBe(true)
            expect(res.data).not.toBeNull()
            if (res.data) {
                expect(res.data.nombre).toBe('Ferretería El Sol')
                expect(res.data.slug).toBe('ferreteria-el-sol')
                expect(res.data.estado).toBe('pendiente')
                expect(res.data.origen).toBe('usuario')
                expect(res.data.createdBy).toBe('user-123')
            }
        })
    })

    describe('approveTienda / rejectTienda shortcuts', () => {
        it('approveTienda updates status to aprobado', async () => {
            vi.spyOn(firestoreModule, 'getDoc').mockResolvedValueOnce({
                exists: () => true,
                id: 'tienda-1',
                data: () => ({
                    nombre: 'Test Tienda',
                    estado: 'pendiente',
                    categorias: [],
                    sedes: [],
                }),
            } as any)

            const res = await approveTienda('tienda-1')
            expect(res.success).toBe(true)
            if (res.data) {
                expect(res.data.estado).toBe('aprobado')
            }
        })

        it('rejectTienda updates status to rechazado', async () => {
            vi.spyOn(firestoreModule, 'getDoc').mockResolvedValueOnce({
                exists: () => true,
                id: 'tienda-1',
                data: () => ({
                    nombre: 'Test Tienda',
                    estado: 'pendiente',
                    categorias: [],
                    sedes: [],
                }),
            } as any)

            const res = await rejectTienda('tienda-1')
            expect(res.success).toBe(true)
            if (res.data) {
                expect(res.data.estado).toBe('rechazado')
            }
        })
    })
})
