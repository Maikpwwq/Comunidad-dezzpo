/**
 * Characterization Tests — Baseline for Tarea 03
 *
 * Captures the exact baseline behavior of:
 * 1. Tienda creation & moderation workflow (tiendaService)
 * 2. Duplicate checking service in its current uses (duplicateCheckService)
 * 3. Registration privacy notice & consent requirements
 * 4. Portal de servicios catalog & public listing behavior
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    checkComercianteNameAvailability,
    checkTiendaNameAvailability,
    checkCategorySuggestionAvailability,
    normalizeSearchString,
} from '@services/validation/duplicateCheckService'
import {
    createTienda,
    approveTienda,
    rejectTienda,
    type CreateTiendaInput,
} from '@services/tiendas'
import { LEGAL_DOCUMENTS } from '@assets/data/legalDocuments'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'

// Mock Firestore for baseline characterization of tienda and duplicate services
vi.mock('@services/firebase', () => ({
    isFirebaseAvailable: () => true,
    firestore: {},
}))

const mockFirestoreDocs: Record<string, any[]> = {
    usersComerciantesCalificados: [
        {
            id: 'merchant_1',
            data: () => ({
                userName: 'Construcciones Morales',
                userRazonSocial: 'Morales & Hijos S.A.S.',
                userMail: 'contacto@morales.co',
                userPhone: '+573101234567',
                userProfession: 'Ingeniería Civil',
                userCategories: ['construccion_general'],
            }),
        },
        {
            id: 'merchant_2',
            data: () => ({
                userName: 'Pinturas y Acabados Bogotá',
                userRazonSocial: '',
                userMail: 'pinturas@dezzpo.test',
                userPhone: '+573209876543',
                userProfession: 'Pintor Profesional',
                userCategories: ['pintura'],
            }),
        },
    ],
    tiendas: [
        {
            id: 'tienda_existing_1',
            data: () => ({
                id: 'tienda_existing_1',
                nombre: 'Ferretería La Central',
                razonSocial: 'La Central Ferretera S.A.S.',
                nit: '900123456-1',
                categorias: ['ferreteria_general'],
                estado: 'aprobado',
                sedes: [
                    {
                        nombreSede: 'Principal',
                        direccion: 'Calle 45 # 13-20',
                        ciudad: 'Bogotá, Colombia',
                        zona: 'chapinero',
                    },
                ],
            }),
        },
    ],
    suggestedCategories: [
        {
            id: 'sugg_1',
            data: () => ({
                suggestedName: 'Domótica e Inmótica',
                status: 'pending',
                description: 'Automatización inteligente',
            }),
        },
    ],
}

let storedDocUpdates: Record<string, any> = {}

vi.mock('firebase/firestore', async (importOriginal) => {
    const actual = await importOriginal<typeof import('firebase/firestore')>()
    return {
        ...actual,
        collection: vi.fn((_db, colName: string) => ({ type: 'collection', colName })),
        doc: vi.fn((_db, ...paths: string[]) => ({ type: 'doc', path: paths.join('/') })),
        query: vi.fn((col, ...clauses) => ({ type: 'query', colName: col?.colName, clauses })),
        where: vi.fn((field, op, val) => ({ field, op, val })),
        getDocs: vi.fn(async (target: any) => {
            const colName = target?.colName || 'usersComerciantesCalificados'
            let list = mockFirestoreDocs[colName] || []
            if (target?.clauses && target.clauses.length > 0) {
                for (const clause of target.clauses) {
                    if (clause?.field && clause?.val !== undefined) {
                        list = list.filter((d: any) => {
                            const data = typeof d.data === 'function' ? d.data() : d
                            return data[clause.field] === clause.val
                        })
                    }
                }
            }
            return {
                forEach: (cb: (doc: any) => void) => list.forEach(cb),
                docs: list,
                empty: list.length === 0,
                size: list.length,
            }
        }),
        getDoc: vi.fn(async (docRef: any) => {
            return {
                exists: () => true,
                id: docRef.path.split('/').pop(),
                data: () => ({
                    id: docRef.path.split('/').pop(),
                    nombre: 'Tienda Test',
                    estado: 'pendiente',
                }),
            }
        }),
        setDoc: vi.fn(async (_docRef: any, data: any) => {
            storedDocUpdates[_docRef.path] = data
            return Promise.resolve()
        }),
        updateDoc: vi.fn(async (_docRef: any, data: any) => {
            storedDocUpdates[_docRef.path] = { ...(storedDocUpdates[_docRef.path] || {}), ...data }
            return Promise.resolve()
        }),
    }
})

describe('PreRegistration Phase 0 Characterization Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        storedDocUpdates = {}
    })

    // =========================================================================
    // 1. Tienda Creation & Moderation Baseline (H1)
    // =========================================================================
    describe('1. Tienda Workflow Baseline (Reference Model H1)', () => {
        it('allows tienda creation with default status "pendiente"', async () => {
            const input: CreateTiendaInput = {
                nombre: 'Ferretería El Progreso',
                descripcion: 'Materiales para obra negra',
                categorias: ['ferreteria_general'],
                sedes: [
                    {
                        id: 'sede-1',
                        nombreSede: 'Sede Principal',
                        direccion: 'Cra 10 # 20-30',
                        ciudad: 'Bogotá, Colombia',
                        zona: 'santa-fe',
                    },
                ],
            }

            const res = await createTienda(input, 'user_test_123')
            expect(res.success).toBe(true)
            expect(res.data?.estado).toBe('pendiente')
            expect(res.data?.origen).toBe('usuario')
            expect(res.data?.createdBy).toBe('user_test_123')
            expect(res.data?.slug).toBe('ferreteria-el-progreso')
        })

        it('fixes H1 defect: client CANNOT force "aprobado" status in createTienda', async () => {
            const inputWithBypass: CreateTiendaInput = {
                nombre: 'Ferretería Infiltrada',
                categorias: ['ferreteria_general'],
                estado: 'aprobado', // Direct client bypass attempt
                sedes: [
                    {
                        id: 'sede-1',
                        nombreSede: 'Sede 1',
                        direccion: 'Calle 1 # 2-3',
                        ciudad: 'Bogotá, Colombia',
                        zona: 'centro',
                    },
                ],
            }

            const res = await createTienda(inputWithBypass, 'user_regular_client')
            expect(res.success).toBe(true)
            // Enforced security rule: regular users are coerced to 'pendiente'
            expect(res.data?.estado).toBe('pendiente')
            expect(res.data?.auditLog?.[0]?.action).toBe('creada')
        })

        it('supports idempotencyKey in createTienda', async () => {
            const inputWithIdem: CreateTiendaInput = {
                nombre: 'Ferretería Idempotente',
                categorias: ['ferreteria_general'],
                idempotencyKey: 'idem-key-test-123',
                sedes: [
                    {
                        id: 'sede-1',
                        nombreSede: 'Sede 1',
                        direccion: 'Calle 10 # 20-30',
                        ciudad: 'Bogotá',
                        zona: 'suba',
                    },
                ],
            }

            const res1 = await createTienda(inputWithIdem, 'user_test_456')
            expect(res1.success).toBe(true)
            expect(res1.data?.idempotencyKey).toBe('idem-key-test-123')
        })

        it('transitions tienda status and records audit log via approveTienda and rejectTienda', async () => {
            const approveRes = await approveTienda('tienda_100', 'admin_123')
            expect(approveRes.success).toBe(true)
            expect(storedDocUpdates['tiendas/tienda_100']?.estado).toBe('aprobado')
            expect(storedDocUpdates['tiendas/tienda_100']?.auditLog).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ action: 'aprobada', performedBy: 'admin_123' }),
                ]),
            )

            const rejectRes = await rejectTienda('tienda_100', 'No cumple criterios', 'admin_123')
            expect(rejectRes.success).toBe(true)
            expect(storedDocUpdates['tiendas/tienda_100']?.estado).toBe('rechazado')
            expect(storedDocUpdates['tiendas/tienda_100']?.auditLog).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ action: 'rechazada', performedBy: 'admin_123', reason: 'No cumple criterios' }),
                ]),
            )
        })
    })

    // =========================================================================
    // 2. Duplicate Check Service Baseline (H2)
    // =========================================================================
    describe('2. Duplicate Check Service Baseline (Authority H2)', () => {
        it('normalizes accents, casing, punctuation, and whitespace uniformly', () => {
            expect(normalizeSearchString('  Ángel   GÓMEZ  &  Asociados  ')).toBe('angel gomez asociados')
            expect(normalizeSearchString('Plomería + Gas Bogotá D.C.')).toBe('plomeria gas bogota dc')
            expect(normalizeSearchString('  CCTV,   Seguridad   Privada  ')).toBe('cctv seguridad privada')
        })

        it('detects exact and similar merchant duplicates in usersComerciantesCalificados', async () => {
            const exactRes = await checkComercianteNameAvailability('Construcciones Morales')
            expect(exactRes.isAvailable).toBe(false)
            expect(exactRes.exactMatch).toBe(true)
            expect(exactRes.matches.length).toBeGreaterThan(0)
            expect(exactRes.matches[0]?.userId).toBe('merchant_1')

            const accentRes = await checkComercianteNameAvailability('construcciones morales')
            expect(accentRes.isAvailable).toBe(false)
            expect(accentRes.exactMatch).toBe(true)

            const similarRes = await checkComercianteNameAvailability('Morales')
            expect(similarRes.isAvailable).toBe(false)
            expect(similarRes.exactMatch).toBe(false)
            expect(similarRes.matches[0]?.similarity).toBe('similar')

            const freeRes = await checkComercianteNameAvailability('Electricistas Eléctricos Inexistentes')
            expect(freeRes.isAvailable).toBe(true)
            expect(freeRes.exactMatch).toBe(false)
            expect(freeRes.matches).toHaveLength(0)
        })

        it('detects tienda duplicates in tiendas collection', async () => {
            const match = await checkTiendaNameAvailability('Ferretería La Central')
            expect(match.isAvailable).toBe(false)
            expect(match.exactMatch).toBe(true)
            expect(match.matches[0]?.id).toBe('tienda_existing_1')
        })

        it('detects category suggestions in ListadoCategorias catalog and suggestions collection', async () => {
            const catalogMatch = await checkCategorySuggestionAvailability('Videovigilancia CCTV')
            expect(catalogMatch.isAvailable).toBe(false)
            expect(catalogMatch.exactMatch).toBe(true)
            expect(catalogMatch.matches[0]?.source).toBe('catalog')

            const suggMatch = await checkCategorySuggestionAvailability('Domótica e Inmótica')
            expect(suggMatch.isAvailable).toBe(false)
            expect(suggMatch.exactMatch).toBe(true)
            expect(suggMatch.matches[0]?.source).toBe('pending_suggestion')
        })
    })

    // =========================================================================
    // 3. Privacy Notice & Consent Baseline (H3 / R3)
    // =========================================================================
    describe('3. Privacy Notice & Consent Baseline (H3 / R3)', () => {
        it('has canonical legal document for aviso-privacidad at version V1.1', () => {
            const doc = LEGAL_DOCUMENTS.find((d) => d.id === 'aviso-privacidad')
            expect(doc).toBeDefined()
            expect(doc?.version).toBe('V1.1')
            expect(doc?.title).toBe('Aviso de Privacidad')
            expect(doc?.subtitle).toContain('Autorización para el Tratamiento de Datos Personales')
        })

        it('contains the mandatory rights exercise channel in privacy notice content', () => {
            const doc = LEGAL_DOCUMENTS.find((d) => d.id === 'aviso-privacidad')
            expect(doc?.content).toContain('¿Cómo ejercer sus derechos?')
            expect(doc?.content).toContain('Ajustes > Privacidad en la Plataforma')
            expect(doc?.content).toContain('Calle 159 No 8c-45')
        })
    })

    // =========================================================================
    // 4. Portal de Servicios & Category Taxonomy Baseline (R1 / R2)
    // =========================================================================
    describe('4. Portal & Taxonomy Baseline (R1 / R2)', () => {
        it('has 94 active specialties in ListadoCategorias for skill picker matching', () => {
            expect(ListadoCategorias).toHaveLength(94)
            const cctv = ListadoCategorias.find((c) => c.label.toLowerCase().includes('videovigilancia'))
            const izaje = ListadoCategorias.find((c) => c.label.toLowerCase().includes('izaje'))
            expect(cctv).toBeDefined()
            expect(izaje).toBeDefined()
        })
    })
})
