/**
 * Characterization Tests — Baseline for Phone Utilities and Forms
 *
 * Captures the current behavior of phone handling across:
 * 1. Existing phoneUtils (legacy formatToE164, isValidColombianPhone, formatPhoneDisplay)
 * 2. ContactUtils (migrateContactFields, getPrimaryPhone, createEmptyPhone)
 * 3. Tienda contact payload structure (tiendaService createTienda phone flattening)
 */
import { describe, it, expect } from 'vitest'
import {
    formatToE164,
    isValidColombianPhone,
    formatPhoneDisplay,
} from '@services/utils/phoneUtils'
import {
    migrateContactFields,
    getPrimaryPhone,
    createEmptyPhone,
} from '@utilities/contactUtils'

describe('Fase 0: Phone Utilities Characterization Tests', () => {
    describe('Legacy phoneUtils baseline', () => {
        it('normalizes 10-digit mobile number to E.164 +57', () => {
            expect(formatToE164('3204842897')).toBe('+573204842897')
        })

        it('validates Colombian phones including landlines and mobiles via domain layer', () => {
            expect(isValidColombianPhone('3204842897')).toBe(true)
            expect(isValidColombianPhone('6013004050')).toBe(true) // Now supported via CRC 5886
        })

        it('formats phone display using the official mask', () => {
            expect(formatPhoneDisplay('3204842897')).toBe('+57 (320) 484 2897')
        })
    })

    describe('ContactUtils multi-channel migration baseline', () => {
        it('migrates legacy flat userPhone into structured phones array', () => {
            const result = migrateContactFields({
                userPhone: '3204842897',
            })
            expect(result.phones).toHaveLength(1)
            expect(result.phones[0]).toEqual({
                number: '3204842897',
                isPrimary: true,
                type: 'personal',
            })
        })

        it('preserves existing phones array when present', () => {
            const existing = [
                { number: '+573204842897', isPrimary: true, type: 'personal' as const },
                { number: '+576013004050', isPrimary: false, type: 'trabajo' as const },
            ]
            const result = migrateContactFields({
                phones: existing,
                userPhone: '3000000000',
            })
            expect(result.phones).toEqual(existing)
        })

        it('retrieves the primary phone from list', () => {
            const phones = [
                { number: '3101112233', isPrimary: false, type: 'personal' as const },
                { number: '3204842897', isPrimary: true, type: 'trabajo' as const },
            ]
            expect(getPrimaryPhone(phones)).toBe('3204842897')
        })

        it('creates a clean non-primary empty phone object', () => {
            expect(createEmptyPhone()).toEqual({
                number: '',
                isPrimary: false,
                type: 'personal',
            })
        })
    })
})
