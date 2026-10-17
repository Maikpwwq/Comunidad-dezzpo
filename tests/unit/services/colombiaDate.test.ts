import { describe, it, expect } from 'vitest'
import {
    getColombiaDateString,
    getPeriodDateRange,
    formatColombiaDateRange,
    formatColombiaTime,
} from '@/services/admin/analytics/colombiaDate'

describe('colombiaDate — Colombia Timezone & Windows', () => {
    describe('getColombiaDateString', () => {
        it('uses current date when called without arguments', () => {
            const today = getColombiaDateString()
            expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
        })

        it('accurately parses Date at midnight UTC and shifts back 5 hours to previous day in Colombia', () => {
            // 2026-10-15T02:00:00Z is 2026-10-14 21:00:00 in America/Bogota (UTC-5)
            const d = new Date('2026-10-15T02:00:00Z')
            expect(getColombiaDateString(d)).toBe('2026-10-14')
        })

        it('handles boundary at 05:00:00 UTC (exact midnight in Colombia)', () => {
            // 2026-10-15T05:00:00Z is exactly 2026-10-15 00:00:00 in America/Bogota
            const d = new Date('2026-10-15T05:00:00Z')
            expect(getColombiaDateString(d)).toBe('2026-10-15')
        })

        it('handles end of day boundary at 04:59:59 UTC next day', () => {
            // 2026-10-16T04:59:59Z is 2026-10-15 23:59:59 in America/Bogota
            const d = new Date('2026-10-16T04:59:59Z')
            expect(getColombiaDateString(d)).toBe('2026-10-15')
        })

        it('returns 1970-01-01 for invalid date input', () => {
            expect(getColombiaDateString('invalid-date')).toBe('1970-01-01')
        })
    })

    describe('getPeriodDateRange', () => {
        // Use a fixed reference date: 2026-10-15 noon Colombia time
        const refDate = new Date('2026-10-15T17:00:00Z') // 12:00 in UTC-5

        it('computes exact 7-day range ending on reference date', () => {
            const range = getPeriodDateRange('7d', refDate)
            expect(range.days).toHaveLength(7)
            expect(range.to).toBe('2026-10-15')
            expect(range.from).toBe('2026-10-09')
            expect(range.days).toEqual([
                '2026-10-09',
                '2026-10-10',
                '2026-10-11',
                '2026-10-12',
                '2026-10-13',
                '2026-10-14',
                '2026-10-15',
            ])
        })

        it('computes exact 30-day range', () => {
            const range = getPeriodDateRange('30d', refDate)
            expect(range.days).toHaveLength(30)
            expect(range.to).toBe('2026-10-15')
            expect(range.from).toBe('2026-09-16')
        })

        it('computes exact 90-day range', () => {
            const range = getPeriodDateRange('90d', refDate)
            expect(range.days).toHaveLength(90)
            expect(range.to).toBe('2026-10-15')
            expect(range.from).toBe('2026-07-18')
        })

        it('falls back to 30 days for unknown period', () => {
            const range = getPeriodDateRange('unknown' as any, refDate)
            expect(range.days).toHaveLength(30)
        })
    })

    describe('formatColombiaDateRange', () => {
        it('formats date range in same month', () => {
            const label = formatColombiaDateRange('2026-10-01', '2026-10-15')
            expect(label).toBe('1 – 15 oct 2026')
        })

        it('formats date range across different months in same year', () => {
            const label = formatColombiaDateRange('2026-09-16', '2026-10-15')
            expect(label).toBe('16 sept – 15 oct 2026')
        })

        it('formats date range across different years', () => {
            const label = formatColombiaDateRange('2025-12-15', '2026-01-15')
            expect(label).toBe('15 dic 2025 – 15 ene 2026')
        })

        it('returns empty string for empty inputs', () => {
            expect(formatColombiaDateRange('', '')).toBe('')
        })
    })

    describe('formatColombiaTime', () => {
        it('formats current time when called without arguments', () => {
            const time = formatColombiaTime()
            expect(time).toMatch(/^\d{2}:\d{2}$/)
        })

        it('formats time in 24h format for Colombia', () => {
            // 17:30 UTC is 12:30 in Colombia
            const d = new Date('2026-10-15T17:30:00Z')
            expect(formatColombiaTime(d)).toBe('12:30')
        })
    })
})
