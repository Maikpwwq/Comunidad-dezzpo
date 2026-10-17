/**
 * Colombia Legal Time Utilities (`colombiaDate.ts`)
 *
 * Implements:
 * - America/Bogota (UTC-5, without daylight saving time)
 * - Deterministic date-range windows (7d, 30d, 90d) including today
 * - Shared across aggregation engine and dashboard readers
 */

import { PERIOD_DAYS_MAP, type PeriodId } from './types'

export const COLOMBIA_TIMEZONE = 'America/Bogota' as const

/**
 * Returns YYYY-MM-DD string for a given date or timestamp in Colombia legal time.
 */
export function getColombiaDateString(dateInput: Date | string | number = new Date()): string {
    const d = typeof dateInput === 'string' || typeof dateInput === 'number'
        ? new Date(dateInput)
        : dateInput

    if (isNaN(d.getTime())) {
        return '1970-01-01'
    }

    // en-CA produces standard ISO-like YYYY-MM-DD in the target timezone
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: COLOMBIA_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })

    return formatter.format(d)
}

/**
 * Computes the chronological list of dates [from, ..., to] for the given period.
 * All days are anchored in America/Bogota time.
 */
export function getPeriodDateRange(
    period: PeriodId,
    referenceDate: Date = new Date(),
): { from: string; to: string; days: readonly string[] } {
    const daysCount = PERIOD_DAYS_MAP[period] ?? 30
    const todayStr = getColombiaDateString(referenceDate)

    // Build day list going backwards from today in Colombia time
    const parts = todayStr.split('-')
    const y = parseInt(parts[0]!, 10)
    const m = parseInt(parts[1]!, 10) - 1
    const d = parseInt(parts[2]!, 10)

    const days: string[] = []
    for (let offset = daysCount - 1; offset >= 0; offset--) {
        // Date constructed in UTC noon to avoid any midnight timezone edge boundary jumps
        const target = new Date(Date.UTC(y, m, d - offset, 12, 0, 0))
        days.push(getColombiaDateString(target))
    }

    const from = days[0]!
    const to = days[days.length - 1]!

    return {
        from,
        to,
        days,
    }
}

/**
 * Formats a date range into es-CO human readable string (e.g., "12 sep – 11 oct 2026").
 */
export function formatColombiaDateRange(fromStr: string, toStr: string): string {
    if (!fromStr || !toStr) return ''

    const parseParts = (isoDate: string): Date => {
        const parts = isoDate.split('-')
        return new Date(Date.UTC(parseInt(parts[0]!, 10), parseInt(parts[1]!, 10) - 1, parseInt(parts[2]!, 10), 12, 0, 0))
    }

    const fromDate = parseParts(fromStr)
    const toDate = parseParts(toStr)

    const dayFormatter = new Intl.DateTimeFormat('es-CO', {
        timeZone: COLOMBIA_TIMEZONE,
        day: 'numeric',
    })

    const monthFormatter = new Intl.DateTimeFormat('es-CO', {
        timeZone: COLOMBIA_TIMEZONE,
        month: 'short',
    })

    const yearFormatter = new Intl.DateTimeFormat('es-CO', {
        timeZone: COLOMBIA_TIMEZONE,
        year: 'numeric',
    })

    const fromDay = dayFormatter.format(fromDate)
    const fromMonth = monthFormatter.format(fromDate).replace('.', '')
    const fromYear = yearFormatter.format(fromDate)

    const toDay = dayFormatter.format(toDate)
    const toMonth = monthFormatter.format(toDate).replace('.', '')
    const toYear = yearFormatter.format(toDate)

    if (fromYear === toYear) {
        if (fromMonth === toMonth) {
            return `${fromDay} – ${toDay} ${toMonth} ${toYear}`
        }
        return `${fromDay} ${fromMonth} – ${toDay} ${toMonth} ${toYear}`
    }

    return `${fromDay} ${fromMonth} ${fromYear} – ${toDay} ${toMonth} ${toYear}`
}

/**
 * Formats time in Colombia legal time (e.g., "10:42 a. m." or "10:42").
 */
export function formatColombiaTime(d: Date = new Date()): string {
    return new Intl.DateTimeFormat('es-CO', {
        timeZone: COLOMBIA_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(d)
}
