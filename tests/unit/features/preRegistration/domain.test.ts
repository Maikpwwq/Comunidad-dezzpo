/**
 * Unit & Property-Based Tests — Pre-Registration Domain (Phase 1)
 *
 * Covers:
 * 1. Zod schema validation & transformations
 * 2. Input sanitization (XSS, zero-width, NFC, control chars)
 * 3. Colombian E.164 phone formatting
 * 4. Safe URL normalization (javascript:/data: rejection)
 * 5. State transitions & terminal states
 * 6. Property-based invariants with fast-check
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
    preRegistrationCandidateSchema,
    preRegistrationConsentSchema,
    createPreRegistrationSchema,
    moderatePreRegistrationSchema,
} from '@/features/preRegistration/schemas/preRegistration.schema'
import {
    sanitizeText,
    normalizeCandidateName,
    normalizeCandidateEmail,
    normalizeCandidatePhone,
    normalizeCandidateWebsite,
    canTransition,
    assertValidTransition,
} from '@/features/preRegistration/utils/normalization'
import {
    ALLOWED_TRANSITIONS,
    type PreRegistrationStatus,
} from '@/features/preRegistration/types'
import {
    CANONICAL_PRIVACY_NOTICE_VERSION,
    MAX_SKILLS_COUNT,
} from '@/config/preRegistration.config'

describe('Pre-Registration Domain — Sanitization & Normalization', () => {
    describe('sanitizeText', () => {
        it('strips HTML tags to prevent XSS attacks', () => {
            const raw = '<script>alert("xss")</script>Maestro <b>Pérez</b> <img src=x onerror=alert(1)>'
            const sanitized = sanitizeText(raw)
            expect(sanitized).toBe('alert("xss")Maestro Pérez')
            expect(sanitized).not.toContain('<')
            expect(sanitized).not.toContain('>')
        })

        it('removes zero-width and directional unicode override characters', () => {
            // \u200B = zero-width space, \u202E = right-to-left override
            const raw = 'Juan\u200B\u200C \u202EMaestro\u202C'
            const sanitized = sanitizeText(raw)
            expect(sanitized).toBe('Juan Maestro')
        })

        it('strips ASCII control characters but preserves clean text', () => {
            const raw = 'Instalaciones\x00\x07 Eléctricas\x1F'
            const sanitized = sanitizeText(raw)
            expect(sanitized).toBe('Instalaciones Eléctricas')
        })

        it('applies Unicode NFC normalization', () => {
            // Decomposed "e" + combining acute accent (\u0065\u0301) vs precomposed "é" (\u00E9)
            const decomposed = 'Jose\u0301'
            const precomposed = 'José'
            expect(sanitizeText(decomposed)).toBe(precomposed)
        })

        it('handles null, undefined or empty strings gracefully', () => {
            expect(sanitizeText('')).toBe('')
            // @ts-expect-error Testing runtime resilience
            expect(sanitizeText(null)).toBe('')
            // @ts-expect-error Testing runtime resilience
            expect(sanitizeText(undefined)).toBe('')
        })
    })

    describe('normalizeCandidateName', () => {
        it('collapses multiple spaces and trims properly', () => {
            const input = '   Construcciones    y   Remodelaciones   SAS   '
            expect(normalizeCandidateName(input)).toBe(
                'Construcciones y Remodelaciones SAS',
            )
        })
    })

    describe('normalizeCandidateEmail', () => {
        it('lowercases, strips spaces, and applies NFKC normalization', () => {
            const raw = '  JUAN.PEREZ@Dezzpo.Com  '
            expect(normalizeCandidateEmail(raw)).toBe('juan.perez@dezzpo.com')
        })
    })

    describe('normalizeCandidatePhone', () => {
        it('normalizes local 10-digit mobile numbers to Colombian E.164 (+57)', () => {
            expect(normalizeCandidatePhone('320 484 2897')).toBe('+573204842897')
            expect(normalizeCandidatePhone('320-484-2897')).toBe('+573204842897')
            expect(normalizeCandidatePhone('+57 320 484 2897')).toBe('+573204842897')
            expect(normalizeCandidatePhone('3001234567')).toBe('+573001234567')
        })

        it('returns empty string for non-Colombian mobile or invalid formats', () => {
            expect(normalizeCandidatePhone('6012345678')).toBe('') // Landline
            expect(normalizeCandidatePhone('+14155552671')).toBe('') // US number
            expect(normalizeCandidatePhone('12345')).toBe('') // Too short
            expect(normalizeCandidatePhone('')).toBe('')
        })
    })

    describe('normalizeCandidateWebsite', () => {
        it('prepends https:// when protocol is missing', () => {
            expect(normalizeCandidateWebsite('instagram.com/maestro')).toBe(
                'https://instagram.com/maestro',
            )
            expect(normalizeCandidateWebsite('www.carpinteria.co')).toBe(
                'https://www.carpinteria.co/',
            )
        })

        it('preserves valid http and https URLs', () => {
            expect(normalizeCandidateWebsite('https://dezzpo.com/pro')).toBe(
                'https://dezzpo.com/pro',
            )
            expect(normalizeCandidateWebsite('http://mi-web.com')).toBe(
                'http://mi-web.com/',
            )
        })

        it('rejects dangerous protocols (javascript:, data:, vbscript:)', () => {
            expect(
                normalizeCandidateWebsite('javascript:alert("pwned")'),
            ).toBeUndefined()
            expect(
                normalizeCandidateWebsite('data:text/html;base64,PHNjcmlwdD4='),
            ).toBeUndefined()
            expect(
                normalizeCandidateWebsite('file:///etc/passwd'),
            ).toBeUndefined()
        })

        it('rejects non-http/https protocols such as ftp', () => {
            expect(normalizeCandidateWebsite('ftp://ftp.example.com')).toBeUndefined()
        })

        it('returns undefined for malformed URL strings', () => {
            expect(normalizeCandidateWebsite('http://')).toBeUndefined()
            expect(normalizeCandidateWebsite('http://::invalid::')).toBeUndefined()
        })
    })
})

describe('Pre-Registration Domain — Zod Schemas Validation', () => {
    describe('preRegistrationCandidateSchema', () => {
        const validCandidate = {
            displayName: 'Carlos Rodríguez',
            email: 'carlos.electricista@gmail.com',
            phone: '315 889 0012',
            description: 'Técnico electricista certificado con 10 años de experiencia en redes residenciales.',
            skillIds: ['instalaciones_electricas', 'iluminacion'],
            address: 'Calle 100 # 15-20, Bogotá',
            website: 'facebook.com/carlos.instalaciones',
        }

        it('parses and normalizes valid candidate data successfully', () => {
            const parsed = preRegistrationCandidateSchema.parse(validCandidate)
            expect(parsed.displayName).toBe('Carlos Rodríguez')
            expect(parsed.email).toBe('carlos.electricista@gmail.com')
            expect(parsed.phone).toBe('+573158890012')
            expect(parsed.description).toBe(
                'Técnico electricista certificado con 10 años de experiencia en redes residenciales.',
            )
            expect(parsed.skillIds).toEqual(['instalaciones_electricas', 'iluminacion'])
            expect(parsed.website).toBe('https://facebook.com/carlos.instalaciones')
        })

        it('rejects candidate with display name shorter than 2 characters', () => {
            const res = preRegistrationCandidateSchema.safeParse({
                ...validCandidate,
                displayName: 'A',
            })
            expect(res.success).toBe(false)
            if (!res.success) {
                expect(res.error.issues[0]?.message).toContain('al menos 2 caracteres')
            }
        })

        it('rejects candidate with invalid email', () => {
            const res = preRegistrationCandidateSchema.safeParse({
                ...validCandidate,
                email: 'not-an-email',
            })
            expect(res.success).toBe(false)
            if (!res.success) {
                expect(res.error.issues[0]?.message).toContain('correo electrónico válido')
            }
        })

        it('rejects candidate with invalid phone', () => {
            const res = preRegistrationCandidateSchema.safeParse({
                ...validCandidate,
                phone: '555-1234',
            })
            expect(res.success).toBe(false)
            if (!res.success) {
                expect(res.error.issues[0]?.message).toContain('número de celular colombiano válido')
            }
        })

        it('rejects description shorter than 15 characters', () => {
            const res = preRegistrationCandidateSchema.safeParse({
                ...validCandidate,
                description: 'Pinta casas',
            })
            expect(res.success).toBe(false)
            if (!res.success) {
                expect(res.error.issues[0]?.message).toContain('mínimo 15 caracteres')
            }
        })

        it(`rejects skill list exceeding ${MAX_SKILLS_COUNT} items`, () => {
            const res = preRegistrationCandidateSchema.safeParse({
                ...validCandidate,
                skillIds: ['1', '2', '3', '4', '5', '6'],
            })
            expect(res.success).toBe(false)
            if (!res.success) {
                expect(res.error.issues[0]?.message).toContain('máximo 5 habilidades')
            }
        })
    })

    describe('preRegistrationConsentSchema', () => {
        it('accepts canonical privacy notice version V1.1 with accepted: true', () => {
            const res = preRegistrationConsentSchema.safeParse({
                privacyNoticeVersion: CANONICAL_PRIVACY_NOTICE_VERSION,
                accepted: true,
            })
            expect(res.success).toBe(true)
        })

        it('rejects outdated or altered privacy notice version', () => {
            const res = preRegistrationConsentSchema.safeParse({
                privacyNoticeVersion: 'V1.0',
                accepted: true,
            })
            expect(res.success).toBe(false)
            if (!res.success) {
                expect(res.error.issues[0]?.message).toContain('no coincide')
            }
        })

        it('rejects unchecked consent (accepted: false)', () => {
            const res = preRegistrationConsentSchema.safeParse({
                privacyNoticeVersion: CANONICAL_PRIVACY_NOTICE_VERSION,
                accepted: false,
            })
            expect(res.success).toBe(false)
        })
    })

    describe('createPreRegistrationSchema', () => {
        it('validates full creation payload with idempotencyKey', () => {
            const payload = {
                candidate: {
                    displayName: 'Plomería Bogotá Express',
                    email: 'plomeria@bogota.co',
                    phone: '320 123 4567',
                    description: 'Servicio de destape y mantenimiento de tuberías 24/7.',
                },
                consent: {
                    privacyNoticeVersion: CANONICAL_PRIVACY_NOTICE_VERSION,
                    accepted: true,
                },
                idempotencyKey: 'idem-uuid-9876543210',
            }

            const parsed = createPreRegistrationSchema.parse(payload)
            expect(parsed.idempotencyKey).toBe('idem-uuid-9876543210')
            expect(parsed.candidate.phone).toBe('+573201234567')
        })
    })

    describe('moderatePreRegistrationSchema', () => {
        it('accepts valid approval action with verified checklist', () => {
            const payload = {
                id: 'pre-reg-123',
                expectedVersion: 1,
                action: {
                    type: 'aprobar',
                    verification: {
                        contrastedWithSources: true,
                        sourcesNote: 'Verificado perfil de Instagram y RUT de la empresa.',
                    },
                    internalNote: 'Contacto verificado, calificado para radar.',
                },
            }

            const parsed = moderatePreRegistrationSchema.parse(payload)
            expect(parsed.action.type).toBe('aprobar')
        })

        it('rejects approval if checklist contrastedWithSources is not true', () => {
            const payload = {
                id: 'pre-reg-123',
                expectedVersion: 1,
                action: {
                    type: 'aprobar',
                    verification: {
                        contrastedWithSources: false,
                    },
                },
            }

            const res = moderatePreRegistrationSchema.safeParse(payload)
            expect(res.success).toBe(false)
        })

        it('accepts rejection with valid reason code', () => {
            const payload = {
                id: 'pre-reg-123',
                expectedVersion: 1,
                action: {
                    type: 'rechazar',
                    reasonCode: 'no_cumple_criterios',
                    internalNote: 'Venta de productos, no presta servicios técnicos.',
                },
            }

            const parsed = moderatePreRegistrationSchema.parse(payload)
            expect(parsed.action.type).toBe('rechazar')
        })

        it('accepts duplicate action referencing existing entity', () => {
            const payload = {
                id: 'pre-reg-123',
                expectedVersion: 1,
                action: {
                    type: 'duplicada',
                    duplicateOf: {
                        type: 'merchant_profile',
                        targetId: 'user-uid-abc',
                        displayName: 'Plomería Bogotá',
                    },
                    internalNote: 'Ya registrado desde 2024.',
                },
            }

            const parsed = moderatePreRegistrationSchema.parse(payload)
            expect(parsed.action.type).toBe('duplicada')
        })

        it('accepts suppression request by titular or admin', () => {
            const payload = {
                id: 'pre-reg-123',
                expectedVersion: 2,
                action: {
                    type: 'suprimir',
                    requestedBy: 'titular',
                    reason: 'Solicitud de supresión Habeas Data por canal oficial.',
                },
            }

            const parsed = moderatePreRegistrationSchema.parse(payload)
            expect(parsed.action.type).toBe('suprimir')
        })
    })
})

describe('Pre-Registration Domain — State Machine & Transitions', () => {
    it('allows valid transitions from pendiente', () => {
        expect(canTransition('pendiente', 'aprobada')).toBe(true)
        expect(canTransition('pendiente', 'rechazada')).toBe(true)
        expect(canTransition('pendiente', 'duplicada')).toBe(true)
        expect(canTransition('pendiente', 'retirada')).toBe(true)
    })

    it('allows suppression transition from aprobada to retirada', () => {
        expect(canTransition('aprobada', 'retirada')).toBe(true)
    })

    it('forbids moving backwards from terminal states', () => {
        const terminalStates: PreRegistrationStatus[] = [
            'rechazada',
            'duplicada',
            'retirada',
        ]
        const allStates: PreRegistrationStatus[] = [
            'pendiente',
            'aprobada',
            'rechazada',
            'duplicada',
            'retirada',
        ]

        for (const terminal of terminalStates) {
            for (const target of allStates) {
                expect(canTransition(terminal, target)).toBe(false)
            }
        }
    })

    it('assertValidTransition throws on invalid transitions', () => {
        expect(() =>
            assertValidTransition('rechazada', 'aprobada'),
        ).toThrow('Transición inválida')
        expect(() =>
            assertValidTransition('duplicada', 'pendiente'),
        ).toThrow('Transición inválida')
        expect(() =>
            assertValidTransition('retirada', 'aprobada'),
        ).toThrow('Transición inválida')
    })

    it('assertValidTransition does not throw on valid transitions', () => {
        expect(() =>
            assertValidTransition('pendiente', 'aprobada'),
        ).not.toThrow()
    })
})

describe('Pre-Registration Domain — Property-Based Invariants (fast-check)', () => {
    it('Property: sanitizeText is idempotent (sanitize(sanitize(x)) === sanitize(x))', () => {
        fc.assert(
            fc.property(fc.string(), (str) => {
                const once = sanitizeText(str)
                const twice = sanitizeText(once)
                expect(twice).toBe(once)
            }),
        )
    })

    it('Property: sanitizeText never contains HTML opening or closing brackets', () => {
        fc.assert(
            fc.property(fc.string(), (str) => {
                const sanitized = sanitizeText(str)
                expect(sanitized).not.toMatch(/<[^>]*>/)
            }),
        )
    })

    it('Property: normalizeCandidateEmail is always lowercase, trimmed and idempotent', () => {
        fc.assert(
            fc.property(fc.string(), (str) => {
                const normalized = normalizeCandidateEmail(str)
                expect(normalized).toBe(normalized.toLowerCase())
                expect(normalized).toBe(normalized.trim())
                expect(normalizeCandidateEmail(normalized)).toBe(normalized)
            }),
        )
    })

    it('Property: Terminal states in ALLOWED_TRANSITIONS have zero permitted outgoing transitions', () => {
        const terminalStates = ['rechazada', 'duplicada', 'retirada'] as const
        for (const terminal of terminalStates) {
            expect(ALLOWED_TRANSITIONS[terminal]).toHaveLength(0)
        }
    })
})
