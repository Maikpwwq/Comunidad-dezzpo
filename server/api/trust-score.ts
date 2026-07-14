/**
 * Trust Score Calculation API
 *
 * Server-side endpoint that recalculates trust scores for all Comerciantes.
 * Designed to be called by a cron job (e.g., daily via Vercel Cron).
 *
 * Trust Score Formula (0-100):
 *   - Profile completeness (25%): photo, description, categories, coverage zones
 *   - Activity recency (25%): last active timestamp freshness
 *   - Responsiveness (25%): quote response rate and speed
 *   - Engagement (25%): contracts completed, availability toggle usage
 */

import { Context } from 'hono'
import { adminFirestore } from '@services/firebase/admin'

interface TrustInput {
    hasPhoto: boolean
    hasDescription: boolean
    hasCategories: boolean
    hasCoverageZones: boolean
    hasPhone: boolean
    lastActive: string | null
    quotationCount: number
    contractsCompleted: number
    isAvailableNow: boolean
    profileTier: string
}

function calculateTrustScore(input: TrustInput): number {
    let score = 0

    // ── Profile Completeness (25 pts) ────────────────────────────────────
    const completenessChecks = [
        input.hasPhoto,
        input.hasDescription,
        input.hasCategories,
        input.hasCoverageZones,
        input.hasPhone,
    ]
    const completenessRatio = completenessChecks.filter(Boolean).length / completenessChecks.length
    score += completenessRatio * 25

    // ── Activity Recency (25 pts) ────────────────────────────────────────
    if (input.lastActive) {
        const lastActiveDate = new Date(input.lastActive)
        const now = new Date()
        const daysSinceActive = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)

        if (daysSinceActive < 1) score += 25        // Active today
        else if (daysSinceActive < 3) score += 20   // Active in 3 days
        else if (daysSinceActive < 7) score += 15   // Active this week
        else if (daysSinceActive < 30) score += 8   // Active this month
        // else: 0 points — dormant
    }

    // ── Responsiveness (25 pts) ──────────────────────────────────────────
    // Based on quotation count as a proxy for engagement
    if (input.quotationCount >= 10) score += 25
    else if (input.quotationCount >= 5) score += 20
    else if (input.quotationCount >= 2) score += 12
    else if (input.quotationCount >= 1) score += 5

    // ── Engagement (25 pts) ──────────────────────────────────────────────
    // Contracts completed + availability toggle + tier
    if (input.contractsCompleted >= 5) score += 12
    else if (input.contractsCompleted >= 2) score += 8
    else if (input.contractsCompleted >= 1) score += 4

    if (input.isAvailableNow) score += 5
    if (input.profileTier === 'destacado') score += 8

    return Math.min(100, Math.round(score))
}

export async function trustScoreHandler(c: Context) {
    try {
        // Verify cron secret to prevent unauthorized calls
        const authHeader = c.req.header('Authorization')
        const cronSecret = process.env.CRON_SECRET
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return c.json({ error: 'Unauthorized' }, 401)
        }

        const comerciantesSnap = await adminFirestore
            .collection('usersComerciantesCalificados')
            .get()

        let updated = 0
        const batch = adminFirestore.batch()

        for (const docSnap of comerciantesSnap.docs) {
            const data = docSnap.data()

            // Count quotations for this merchant
            let quotationCount = 0
            try {
                const quotSnap = await adminFirestore
                    .collection('quotations')
                    .where('quotationComercianteId', '==', docSnap.id)
                    .count()
                    .get()
                quotationCount = quotSnap.data().count
            } catch {
                // quotations collection may not exist yet
            }

            // Count completed contracts
            let contractsCompleted = 0
            try {
                const contractSnap = await adminFirestore
                    .collection('contracts')
                    .where('providerId', '==', docSnap.id)
                    .where('status', '==', 'completed')
                    .count()
                    .get()
                contractsCompleted = contractSnap.data().count
            } catch {
                // contracts collection may not exist yet
            }

            const trustInput: TrustInput = {
                hasPhoto: Boolean(data.userImage),
                hasDescription: Boolean(data.userDescription && data.userDescription.length > 20),
                hasCategories: Boolean(data.userCategories && data.userCategories.length > 0),
                hasCoverageZones: Boolean(
                    data.coberturaTodaLaCiudad ||
                    (data.userZonasCobertura && data.userZonasCobertura.length > 0)
                ),
                hasPhone: Boolean(data.userCelular || data.userTel),
                lastActive: data.lastActive || null,
                quotationCount,
                contractsCompleted,
                isAvailableNow: Boolean(data.isAvailableNow),
                profileTier: data.profileTier || 'free',
            }

            const newScore = calculateTrustScore(trustInput)
            batch.update(docSnap.ref, { trustScore: newScore })
            updated++
        }

        await batch.commit()

        console.log(`[TrustScore] Updated ${updated} merchants`)
        return c.json({ success: true, updated })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        console.error('[TrustScore] Calculation failed:', message)
        return c.json({ error: 'Trust score calculation failed', details: message }, 500)
    }
}
