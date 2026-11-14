import { describe, it, expect } from 'vitest'
import {
    calculateNitDv,
    validateColombianNit,
    formatNitNumber,
} from '@/utils/colombiaNit'

describe('Colombian NIT Validator (Module 11 DIAN)', () => {
    describe('calculateNitDv', () => {
        it('calculates correct DV for official entities', () => {
            // Ecopetrol: 899999068 -> DV 1
            expect(calculateNitDv('899999068')).toBe(1)
            // Bancolombia: 890903938 -> DV 8
            expect(calculateNitDv('890903938')).toBe(8)
            // DIAN: 800197268 -> DV 4
            expect(calculateNitDv('800197268')).toBe(4)
        })

        it('returns null for empty or overly long strings', () => {
            expect(calculateNitDv('')).toBeNull()
            expect(calculateNitDv('1234567890123456')).toBeNull() // 16 digits
        })
    })

    describe('validateColombianNit', () => {
        it('validates correct formatted NIT with dots and dash', () => {
            const res = validateColombianNit('800.197.268-4')
            expect(res.isValid).toBe(true)
            expect(res.dv).toBe(4)
            expect(res.cleanNit).toBe('800197268')
            expect(res.formatted).toBe('800.197.268-4')
        })

        it('validates correct NIT with only dash', () => {
            const res = validateColombianNit('899999068-1')
            expect(res.isValid).toBe(true)
            expect(res.dv).toBe(1)
        })

        it('rejects incorrect verification digit', () => {
            const res = validateColombianNit('800.197.268-9')
            expect(res.isValid).toBe(false)
            expect(res.dv).toBe(4)
            expect(res.error).toContain('Dígito de verificación incorrecto')
        })

        it('rejects malformed NIT inputs', () => {
            expect(validateColombianNit('').isValid).toBe(false)
            expect(validateColombianNit('abc').isValid).toBe(false)
            expect(validateColombianNit('123-4-5').isValid).toBe(false)
        })
    })

    describe('formatNitNumber', () => {
        it('formats numbers with thousands separators', () => {
            expect(formatNitNumber('900123456')).toBe('900.123.456')
            expect(formatNitNumber('800197268')).toBe('800.197.268')
        })
    })
})
