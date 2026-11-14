/**
 * Milestone Service (I2.1 - Modelo D: Logical Escrow)
 *
 * Implements milestone decomposition, visual progress proof submission,
 * and bilateral client sign-off (acta de recibo a satisfacción) without custody of funds.
 */

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    orderBy,
    type DocumentReference,
} from 'firebase/firestore'
import { firestore, isFirebaseAvailable } from '@services/firebase'
import type { ServiceResponse } from '@/types/services.d'

export type MilestoneStatus =
    | 'pending'
    | 'in_progress'
    | 'submitted'
    | 'approved'
    | 'paid'

export interface ContractMilestone {
    readonly milestoneId: string
    readonly contractId: string
    readonly order: number
    readonly title: string
    readonly description?: string
    readonly percentage: number
    readonly amountCop: number
    readonly status: MilestoneStatus
    readonly proofPhotos?: string[]
    readonly proofNotes?: string
    readonly submittedAt?: string
    readonly approvedAt?: string
    readonly approvedByClientUid?: string
    readonly createdAt: string
    readonly updatedAt: string
}

export interface CreateMilestoneInput {
    readonly title: string
    readonly percentage: number
    readonly description?: string
}

const CONTRACTS_COLLECTION = 'contracts'
const MILESTONES_SUBCOLLECTION = 'milestones'

/**
 * Validates that milestones partition the total contract into 100% (within floating point precision).
 */
export function validateMilestonesPercentages(
    milestones: ReadonlyArray<{ percentage: number }>
): boolean {
    if (!milestones || milestones.length === 0) return false
    const total = milestones.reduce((sum, m) => sum + m.percentage, 0)
    return Math.abs(total - 100) < 0.01 && milestones.every((m) => m.percentage > 0)
}

/**
 * Calculates overall progress metrics from a list of milestones.
 */
export function calculateMilestoneProgress(
    milestones: ReadonlyArray<ContractMilestone>
): {
    completedCount: number
    totalCount: number
    progressPercentage: number
    totalApprovedAmountCop: number
} {
    if (milestones.length === 0) {
        return {
            completedCount: 0,
            totalCount: 0,
            progressPercentage: 0,
            totalApprovedAmountCop: 0,
        }
    }

    const completed = milestones.filter((m) => m.status === 'approved' || m.status === 'paid')
    const totalApprovedAmountCop = completed.reduce((sum, m) => sum + m.amountCop, 0)
    const progressPercentage = completed.reduce((sum, m) => sum + m.percentage, 0)

    return {
        completedCount: completed.length,
        totalCount: milestones.length,
        progressPercentage: Math.round(progressPercentage),
        totalApprovedAmountCop,
    }
}

/**
 * Initializes structured milestones for a given contract.
 */
export async function createContractMilestones(
    contractId: string,
    totalAmountCop: number,
    milestoneInputs: CreateMilestoneInput[]
): Promise<ServiceResponse<ContractMilestone[]>> {
    if (!isFirebaseAvailable() || !firestore) {
        return {
            success: false,
            data: null,
            error: { code: 'UNAVAILABLE', message: 'Servicio de base de datos no disponible.' },
        }
    }

    if (!validateMilestonesPercentages(milestoneInputs)) {
        return {
            success: false,
            data: null,
            error: {
                code: 'INVALID_ARGUMENT',
                message: 'La suma de porcentajes de los hitos debe ser exactamente 100%.',
            },
        }
    }

    const nowIso = new Date().toISOString()
    const results: ContractMilestone[] = []

    try {
        const milestonesColRef = collection(
            firestore,
            CONTRACTS_COLLECTION,
            contractId,
            MILESTONES_SUBCOLLECTION
        )

        for (let i = 0; i < milestoneInputs.length; i++) {
            const input = milestoneInputs[i]
            const amountCop = Math.round((totalAmountCop * input.percentage) / 100)

            const milestoneData = {
                contractId,
                order: i + 1,
                title: input.title,
                description: input.description,
                percentage: input.percentage,
                amountCop,
                status: (i === 0 ? 'in_progress' : 'pending') as MilestoneStatus,
                createdAt: nowIso,
                updatedAt: nowIso,
            }

            const docRef = await addDoc(milestonesColRef, milestoneData)
            results.push({
                ...milestoneData,
                milestoneId: docRef.id,
            })
        }

        return { success: true, data: results, error: null }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al crear hitos de obra'
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL', message },
        }
    }
}

/**
 * Gets all milestones for a contract sorted by order.
 */
export async function getMilestonesByContract(
    contractId: string
): Promise<ServiceResponse<ContractMilestone[]>> {
    if (!isFirebaseAvailable() || !firestore) {
        return { success: true, data: [], error: null }
    }

    try {
        const milestonesColRef = collection(
            firestore,
            CONTRACTS_COLLECTION,
            contractId,
            MILESTONES_SUBCOLLECTION
        )
        const q = query(milestonesColRef, orderBy('order', 'asc'))
        const snap = await getDocs(q)

        const list = snap.docs.map(
            (d) => ({ ...d.data(), milestoneId: d.id } as ContractMilestone)
        )

        return { success: true, data: list, error: null }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al consultar hitos'
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL', message },
        }
    }
}

/**
 * Contractor submits photo evidence and notes for a completed milestone.
 */
export async function submitMilestoneProof(params: {
    contractId: string
    milestoneId: string
    proofPhotos: string[]
    proofNotes?: string
}): Promise<ServiceResponse<void>> {
    if (!isFirebaseAvailable() || !firestore) {
        return {
            success: false,
            data: null,
            error: { code: 'UNAVAILABLE', message: 'Servicio de base de datos no disponible.' },
        }
    }

    try {
        const docRef = doc(
            firestore,
            CONTRACTS_COLLECTION,
            params.contractId,
            MILESTONES_SUBCOLLECTION,
            params.milestoneId
        )

        const nowIso = new Date().toISOString()
        await updateDoc(docRef, {
            status: 'submitted',
            proofPhotos: params.proofPhotos,
            proofNotes: params.proofNotes || '',
            submittedAt: nowIso,
            updatedAt: nowIso,
        })

        return { success: true, data: undefined as unknown as void, error: null }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al registrar evidencias de hito'
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL', message },
        }
    }
}

/**
 * Client signs off the completed milestone (Acta de recibo a satisfacción bilateral).
 * Transitions status to 'approved'.
 */
export async function approveMilestone(params: {
    contractId: string
    milestoneId: string
    clientUid: string
}): Promise<ServiceResponse<void>> {
    if (!isFirebaseAvailable() || !firestore) {
        return {
            success: false,
            data: null,
            error: { code: 'UNAVAILABLE', message: 'Servicio de base de datos no disponible.' },
        }
    }

    try {
        const docRef = doc(
            firestore,
            CONTRACTS_COLLECTION,
            params.contractId,
            MILESTONES_SUBCOLLECTION,
            params.milestoneId
        )

        const nowIso = new Date().toISOString()
        await updateDoc(docRef, {
            status: 'approved',
            approvedAt: nowIso,
            approvedByClientUid: params.clientUid,
            updatedAt: nowIso,
        })

        return { success: true, data: undefined as unknown as void, error: null }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al aprobar hito de obra'
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL', message },
        }
    }
}

