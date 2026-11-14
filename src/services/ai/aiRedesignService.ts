/**
 * AI Room Redesign Service & Deterministic Fallback (T-I8.2)
 *
 * Provides space analysis, architectural style matching and materials extraction.
 * Includes client-side quota controls (max 3 per day), EXIF stripping, and
 * a mandatory legal disclaimer under Colombian consumer protection (Ley 1480 de 2011).
 */

import { processImageInClient } from '@utils/mediaPipeline'
import {
    ARCHITECTURAL_STYLES,
    getStyleBySlug,
    type ArchitecturalStyle,
} from '@services/inspiration/architecturalStyles'
import type { ServiceResponse } from '@/types/services.d'

export const MAX_DAILY_REDESIGNS = 3
const QUOTA_STORAGE_KEY_PREFIX = 'dezzpo_redesign_quota_'

export interface RedesignQuotaStatus {
    readonly remainingDaily: number
    readonly usedToday: number
    readonly isAllowed: boolean
    readonly resetAt: string
}

export interface RedesignAnalysisResult {
    readonly recommendedStyle: ArchitecturalStyle
    readonly alternativeStyles: ArchitecturalStyle[]
    readonly detectedSpace: string
    readonly keyMaterials: ArchitecturalStyle['keyMaterials']
    readonly recommendedTrades: string[]
    readonly estimatedCostRangeCop: { readonly minCop: number; readonly maxCop: number }
    readonly disclaimer: string
    readonly processedImageWebpUrl?: string
    readonly sourceMode: 'ai_assisted' | 'deterministic_plan_b'
}

/**
 * Checks the daily redesign quota for a user.
 */
export function checkUserRedesignQuota(userId: string | null | undefined): RedesignQuotaStatus {
    const today = new Date().toISOString().split('T')[0] || ''
    const resetAt = `${today}T23:59:59.999Z`

    if (!userId) {
        return {
            remainingDaily: 0,
            usedToday: 0,
            isAllowed: false,
            resetAt,
        }
    }

    if (typeof window === 'undefined') {
        return {
            remainingDaily: MAX_DAILY_REDESIGNS,
            usedToday: 0,
            isAllowed: true,
            resetAt,
        }
    }

    try {
        const raw = localStorage.getItem(`${QUOTA_STORAGE_KEY_PREFIX}${userId}`)
        if (!raw) {
            return {
                remainingDaily: MAX_DAILY_REDESIGNS,
                usedToday: 0,
                isAllowed: true,
                resetAt,
            }
        }

        const parsed = JSON.parse(raw) as { date: string; count: number }
        if (parsed.date !== today) {
            return {
                remainingDaily: MAX_DAILY_REDESIGNS,
                usedToday: 0,
                isAllowed: true,
                resetAt,
            }
        }

        const remaining = Math.max(0, MAX_DAILY_REDESIGNS - (parsed.count || 0))
        return {
            remainingDaily: remaining,
            usedToday: parsed.count || 0,
            isAllowed: remaining > 0,
            resetAt,
        }
    } catch {
        return {
            remainingDaily: MAX_DAILY_REDESIGNS,
            usedToday: 0,
            isAllowed: true,
            resetAt,
        }
    }
}

/**
 * Increments the daily redesign counter for a user in localStorage.
 */
function recordRedesignUsage(userId: string): void {
    if (typeof window === 'undefined') return
    const today = new Date().toISOString().split('T')[0] || ''
    try {
        const status = checkUserRedesignQuota(userId)
        const nextCount = status.usedToday + 1
        localStorage.setItem(
            `${QUOTA_STORAGE_KEY_PREFIX}${userId}`,
            JSON.stringify({ date: today, count: nextCount })
        )
    } catch (e) {
        console.warn('[Redesign] Failed to persist quota usage:', e)
    }
}

export interface RequestRedesignParams {
    readonly imageFile?: File
    readonly userId?: string
    readonly spaceType?: string
    readonly preferredStyleSlug?: string
    readonly approxAreaM2?: number
}

/**
 * Executes room redesign analysis:
 * 1. Checks quota (requires registered user, max 3/day)
 * 2. Processes image through canvas to strip EXIF/GPS and compress to WebP
 * 3. Matches architectural style and extracts materials & recommended trades
 * 4. Attaches mandatory legal disclaimer under Ley 1480 de 2011 & CONPES 4144
 */
export async function analyzeRoomRedesign(
    params: RequestRedesignParams
): Promise<ServiceResponse<RedesignAnalysisResult>> {
    const { userId, imageFile, spaceType = 'Sala - Comedor', preferredStyleSlug, approxAreaM2 = 18 } = params

    if (!userId) {
        return {
            success: false,
            data: null,
            error: {
                code: 'FIRESTORE_PERMISSION_DENIED',
                message: 'Debes iniciar sesión para utilizar el estudio de rediseño arquitectónico.',
            },
        }
    }

    const quota = checkUserRedesignQuota(userId)
    if (!quota.isAllowed) {
        return {
            success: false,
            data: null,
            error: {
                code: 'RATE_LIMIT_EXCEEDED',
                message: `Has alcanzado el límite diario de ${MAX_DAILY_REDESIGNS} consultas de rediseño. Se restablecerá a la medianoche.`,
            },
        }
    }

    let processedWebpUrl: string | undefined = undefined

    // Process image if provided (strip EXIF + WebP compression)
    if (imageFile) {
        try {
            const processed = await processImageInClient(imageFile, {
                maxDimension: 1600,
                quality: 0.82,
            })
            if (typeof URL !== 'undefined' && URL.createObjectURL) {
                processedWebpUrl = URL.createObjectURL(processed.blob)
            }
        } catch (err) {
            console.warn('[Redesign] Image processing warning, falling back:', err)
        }
    }

    // Select style: preferred if valid, otherwise match first relevant
    const matchedStyle =
        (preferredStyleSlug ? getStyleBySlug(preferredStyleSlug) : undefined) ||
        ARCHITECTURAL_STYLES[0]!

    const alternativeStyles = ARCHITECTURAL_STYLES.filter((s) => s.id !== matchedStyle.id).slice(0, 3)

    const minCost = matchedStyle.typicalBudgetRange.minCopPerM2 * approxAreaM2
    const maxCost = matchedStyle.typicalBudgetRange.maxCopPerM2 * approxAreaM2

    const disclaimer =
        'Aviso Legal (Ley 1480 de 2011 & CONPES 4144): Estimación orientativa no vinculante generada por computador. Las cantidades de material, acabados específicos y el valor final de la obra serán determinados por el contratista y las tiendas aliadas tras la visita técnica presencial.'

    recordRedesignUsage(userId)

    return {
        success: true,
        data: {
            recommendedStyle: matchedStyle,
            alternativeStyles,
            detectedSpace: spaceType,
            keyMaterials: matchedStyle.keyMaterials,
            recommendedTrades: matchedStyle.recommendedTrades,
            estimatedCostRangeCop: {
                minCop: Math.round(minCost),
                maxCop: Math.round(maxCost),
            },
            disclaimer,
            ...(processedWebpUrl ? { processedImageWebpUrl: processedWebpUrl } : {}),
            sourceMode: 'deterministic_plan_b',
        },
        error: null,
    }
}
