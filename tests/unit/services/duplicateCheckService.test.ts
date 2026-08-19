import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    checkComercianteNameAvailability,
    checkTiendaNameAvailability,
    checkCategorySuggestionAvailability,
    normalizeSearchString,
} from '@services/validation/duplicateCheckService'
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
        query: vi.fn((col) => col),
        getDocs: vi.fn(),
    }
})

describe('duplicateCheckService Unit Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('normalizeSearchString', () => {
        it('normalizes accents, uppercase, and extra spaces', () => {
            expect(normalizeSearchString('  Ferretería   EL SOL  ')).toBe('ferreteria el sol')
            expect(normalizeSearchString('Plomería & Gas Bogotá')).toBe('plomeria gas bogota')
            expect(normalizeSearchString('Construcción Élite S.A.S.')).toBe('construccion elite sas')
        })
    })

    describe('checkComercianteNameAvailability', () => {
        it('detects exact matches in comerciante userName and userRazonSocial', async () => {
            const mockDocs = [
                {
                    id: 'user_123',
                    data: () => ({
                        userName: 'Prime Domotics',
                        userRazonSocial: 'Prime Domotics S.A.S.',
                        userProfession: 'Automatización e Inmótica',
                        userCategories: ['electricidad_iluminacion'],
                        userCiudad: 'Bogotá',
                    }),
                },
                {
                    id: 'user_456',
                    data: () => ({
                        userName: 'Plomería Rodríguez',
                        userProfession: 'Técnico Hidrosanitario',
                        userCategories: ['plomeria'],
                    }),
                },
            ]

            vi.mocked(firestoreModule.getDocs).mockResolvedValueOnce({
                forEach: (cb: any) => mockDocs.forEach(cb),
            } as any)

            const result = await checkComercianteNameAvailability('prime domotics')
            expect(result.isAvailable).toBe(false)
            expect(result.exactMatch).toBe(true)
            expect(result.matches.length).toBe(1)
            expect(result.matches[0]!.userId).toBe('user_123')
            expect(result.matches[0]!.userName).toBe('Prime Domotics')
        })

        it('excludes current user ID in edit mode', async () => {
            const mockDocs = [
                {
                    id: 'user_123',
                    data: () => ({
                        userName: 'Prime Domotics',
                        userRazonSocial: 'Prime Domotics S.A.S.',
                    }),
                },
            ]

            vi.mocked(firestoreModule.getDocs).mockResolvedValueOnce({
                forEach: (cb: any) => mockDocs.forEach(cb),
            } as any)

            const result = await checkComercianteNameAvailability('Prime Domotics', 'user_123')
            expect(result.isAvailable).toBe(true)
            expect(result.matches.length).toBe(0)
        })

        it('returns available when no matching merchants exist', async () => {
            const mockDocs = [
                {
                    id: 'user_123',
                    data: () => ({
                        userName: 'Prime Domotics',
                    }),
                },
            ]

            vi.mocked(firestoreModule.getDocs).mockResolvedValueOnce({
                forEach: (cb: any) => mockDocs.forEach(cb),
            } as any)

            const result = await checkComercianteNameAvailability('Constructora Totalmente Nueva')
            expect(result.isAvailable).toBe(true)
            expect(result.exactMatch).toBe(false)
            expect(result.matches).toEqual([])
        })
    })

    describe('checkTiendaNameAvailability', () => {
        it('detects exact and similar matches in tiendas collection', async () => {
            const mockDocs = [
                {
                    id: 'tienda_001',
                    data: () => ({
                        nombre: 'Ferretería y Metales El Progreso',
                        razonSocial: 'Comercializadora El Progreso S.A.S.',
                        nit: '900123456-1',
                        categorias: ['ferreteria_general'],
                        sedes: [
                            {
                                nombreSede: 'Sede Paloquemao',
                                direccion: 'Cra 22 # 15-30',
                                zona: 'los_martires',
                                ciudad: 'Bogotá, Colombia',
                            },
                        ],
                    }),
                },
            ]

            vi.mocked(firestoreModule.getDocs).mockResolvedValueOnce({
                forEach: (cb: any) => mockDocs.forEach(cb),
            } as any)

            const result = await checkTiendaNameAvailability('ferreteria y metales el progreso')
            expect(result.isAvailable).toBe(false)
            expect(result.exactMatch).toBe(true)
            expect(result.matches.length).toBe(1)
            expect(result.matches[0]!.nombre).toBe('Ferretería y Metales El Progreso')
            expect(result.matches[0]!.sedes[0]!.nombreSede).toBe('Sede Paloquemao')
        })

        it('excludes current tienda ID in edit mode', async () => {
            const mockDocs = [
                {
                    id: 'tienda_001',
                    data: () => ({
                        nombre: 'Ferretería y Metales El Progreso',
                    }),
                },
            ]

            vi.mocked(firestoreModule.getDocs).mockResolvedValueOnce({
                forEach: (cb: any) => mockDocs.forEach(cb),
            } as any)

            const result = await checkTiendaNameAvailability('Ferretería y Metales El Progreso', 'tienda_001')
            expect(result.isAvailable).toBe(true)
            expect(result.matches.length).toBe(0)
        })
    })

    describe('checkCategorySuggestionAvailability', () => {
        it('detects exact matches in the official ListadoCategorias catalog', async () => {
            vi.mocked(firestoreModule.getDocs).mockResolvedValueOnce({
                forEach: (cb: any) => [].forEach(cb),
            } as any)

            const result = await checkCategorySuggestionAvailability('pintura')
            expect(result.isAvailable).toBe(false)
            expect(result.exactMatch).toBe(true)
            expect(result.matches.some((m) => m.source === 'catalog' && m.similarity === 'exact')).toBe(true)
        })

        it('detects exact matches in existing Firestore category suggestions', async () => {
            const mockSuggestions = [
                {
                    id: 'sug_1',
                    data: () => ({
                        suggestedName: 'Instalación de Paneles Solares',
                        status: 'pending',
                        description: 'Sistemas fotovoltaicos',
                    }),
                },
            ]

            vi.mocked(firestoreModule.getDocs).mockResolvedValueOnce({
                forEach: (cb: any) => mockSuggestions.forEach(cb),
            } as any)

            const result = await checkCategorySuggestionAvailability('instalacion de paneles solares')
            expect(result.isAvailable).toBe(false)
            expect(result.exactMatch).toBe(true)
            expect(result.matches[0]!.source).toBe('pending_suggestion')
            expect(result.matches[0]!.name).toBe('Instalación de Paneles Solares')
        })

        it('detects similar category matches', async () => {
            vi.mocked(firestoreModule.getDocs).mockResolvedValueOnce({
                forEach: (cb: any) => [].forEach(cb),
            } as any)

            const result = await checkCategorySuggestionAvailability('Pintura Industrial Especializada')
            expect(result.matches.some((m) => m.name === 'Pintura' && m.similarity === 'similar')).toBe(true)
        })

        it('returns available when the suggested category does not match catalog or existing suggestions', async () => {
            vi.mocked(firestoreModule.getDocs).mockResolvedValueOnce({
                forEach: (cb: any) => [].forEach(cb),
            } as any)

            const result = await checkCategorySuggestionAvailability('Astronomia Cuantica Interestelar 99')
            expect(result.isAvailable).toBe(true)
            expect(result.exactMatch).toBe(false)
            expect(result.matches.length).toBe(0)
        })
    })
})
