/**
 * Badge Service
 *
 * Connects the reputation BadgeEngine with Firestore.
 * Evaluates real contracts, certifications, and verification records to compute
 * and persist verifiable operational badges in the merchant's profile.
 */

import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { firestore, isFirebaseAvailable } from '@services/firebase'
import { getContractsByProvider } from '@services/contracts/contractService'
import {
    evaluateComercianteBadges,
    type EarnedBadge,
    type ContractPerformanceMetrics,
} from './badgeEngine'
import type { ServiceResponse } from '@/types/services.d'

const COMERCIANTES_COLLECTION = 'usersComerciantesCalificados'

/**
 * Derives contract performance metrics for a given merchant.
 */
export async function deriveMerchantPerformanceMetrics(
    comercianteId: string,
    merchantDocData?: Record<string, unknown>
): Promise<ContractPerformanceMetrics> {
    let merchantData = merchantDocData

    if (!merchantData && isFirebaseAvailable() && firestore) {
        try {
            const userDocRef = doc(firestore, COMERCIANTES_COLLECTION, comercianteId)
            const snap = await getDoc(userDocRef)
            if (snap.exists()) {
                merchantData = snap.data() as Record<string, unknown>
            }
        } catch (err) {
            console.warn('[badgeService] Failed to read merchant doc:', err)
        }
    }

    const contracts = await getContractsByProvider(comercianteId).catch(() => [])

    const completed = contracts.filter((c) => c.status === 'completed')
    const disputed = contracts.filter((c) => c.status === 'disputed')

    const hasVerifiedIdentity = Boolean(
        merchantData?.isVerifiedProvider === true ||
        merchantData?.verificationStatus === 'verified' ||
        merchantData?.idVerified === true
    )

    const isAnnualMember = Boolean(
        merchantData?.membershipStatus === 'active' ||
        merchantData?.profileTier === 'destacado'
    )

    const hasCert = Boolean(
        merchantData?.hasCertification === true ||
        (Array.isArray(merchantData?.earnedBadges) && merchantData.earnedBadges.length > 0)
    )

    const avgRating = typeof merchantData?.rating === 'number'
        ? merchantData.rating
        : typeof merchantData?.userRating === 'number'
            ? merchantData.userRating
            : undefined

    return {
        totalCompletedContracts: completed.length,
        onTimeCompletedContracts: Math.max(0, completed.length - disputed.length),
        disputedContractsCount: disputed.length,
        averageReviewRating: avgRating,
        hasVerifiedIdentity,
        hasTechnicalCertification: hasCert,
        isAnnualMember,
    }
}

/**
 * Re-evaluates operational badges for a contractor and saves them to Firestore.
 */
export async function syncComercianteBadges(
    comercianteId: string
): Promise<ServiceResponse<EarnedBadge[]>> {
    if (!isFirebaseAvailable() || !firestore) {
        return {
            success: false,
            data: null,
            error: { code: 'UNAVAILABLE', message: 'Servicio de base de datos no disponible' },
        }
    }

    try {
        const metrics = await deriveMerchantPerformanceMetrics(comercianteId)
        const badges = evaluateComercianteBadges(metrics)

        const userDocRef = doc(firestore, COMERCIANTES_COLLECTION, comercianteId)
        await updateDoc(userDocRef, {
            operationalBadges: badges,
            badgesLastEvaluatedAt: new Date().toISOString(),
        })

        return { success: true, data: badges, error: null }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al sincronizar insignias'
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL', message },
        }
    }
}

