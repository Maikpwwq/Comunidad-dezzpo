/**
 * Daily Log Service (I3.1 - Bitácora de Obra Visual)
 *
 * Handles photographic progress feed for contracts, milestone linkage,
 * and client-authorized public sharing tokens.
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

export interface ContractDailyLog {
    readonly logId: string
    readonly contractId: string
    readonly authorId: string
    readonly milestoneId?: string
    readonly notes: string
    readonly photos: string[]
    readonly isPublicForShare: boolean
    readonly createdAt: string
}

export interface CreateDailyLogInput {
    readonly contractId: string
    readonly authorId: string
    readonly milestoneId?: string
    readonly notes: string
    readonly photos: string[]
    readonly isPublicForShare?: boolean
}

const CONTRACTS_COLLECTION = 'contracts'
const DAILY_LOGS_SUBCOLLECTION = 'dailyLogs'

/**
 * Creates a deterministic, URL-safe sharing token for a contract's public progress page.
 */
export function generateContractShareToken(contractId: string, salt: string = 'dezzpo-obra-2026'): string {
    let hash = 0
    const str = `${contractId}:${salt}`
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash |= 0 // Convert to 32bit integer
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0')
    return `${contractId.slice(0, 8)}-${hex}`
}

/**
 * Validates whether a token matches a given contractId.
 */
export function verifyContractShareToken(contractId: string, token: string, salt?: string): boolean {
    const expected = generateContractShareToken(contractId, salt)
    return token === expected
}

/**
 * Add a new daily progress entry to a contract.
 */
export async function addDailyLog(
    input: CreateDailyLogInput
): Promise<ServiceResponse<ContractDailyLog>> {
    if (!isFirebaseAvailable() || !firestore) {
        return {
            success: false,
            data: null,
            error: { code: 'UNAVAILABLE', message: 'Servicio de base de datos no disponible.' },
        }
    }

    if (!input.notes.trim() && input.photos.length === 0) {
        return {
            success: false,
            data: null,
            error: { code: 'INVALID_ARGUMENT', message: 'Debes incluir al menos una foto o una nota de avance.' },
        }
    }

    const nowIso = new Date().toISOString()
    const logData: Omit<ContractDailyLog, 'logId'> = {
        contractId: input.contractId,
        authorId: input.authorId,
        milestoneId: input.milestoneId,
        notes: input.notes.trim(),
        photos: input.photos,
        isPublicForShare: input.isPublicForShare ?? false,
        createdAt: nowIso,
    }

    try {
        const colRef = collection(
            firestore,
            CONTRACTS_COLLECTION,
            input.contractId,
            DAILY_LOGS_SUBCOLLECTION
        )
        const docRef = await addDoc(colRef, logData)
        const created: ContractDailyLog = {
            ...logData,
            logId: docRef.id,
        }

        return { success: true, data: created, error: null }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al registrar avance diario'
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL', message },
        }
    }
}

/**
 * Get all daily progress entries for a contract, sorted chronologically descending.
 */
export async function getDailyLogsByContract(
    contractId: string
): Promise<ServiceResponse<ContractDailyLog[]>> {
    if (!isFirebaseAvailable() || !firestore) {
        return { success: true, data: [], error: null }
    }

    try {
        const colRef = collection(
            firestore,
            CONTRACTS_COLLECTION,
            contractId,
            DAILY_LOGS_SUBCOLLECTION
        )
        const q = query(colRef, orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        const logs = snap.docs.map((d) => ({ ...d.data(), logId: d.id } as ContractDailyLog))

        return { success: true, data: logs, error: null }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al consultar bitácora de obra'
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL', message },
        }
    }
}

/**
 * Toggle whether a specific log entry is allowed to appear on the public share page.
 * Controlled by the client to protect home privacy (Habeas Data).
 */
export async function toggleDailyLogPublicShare(
    contractId: string,
    logId: string,
    isPublicForShare: boolean
): Promise<ServiceResponse<void>> {
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
            contractId,
            DAILY_LOGS_SUBCOLLECTION,
            logId
        )
        await updateDoc(docRef, { isPublicForShare })
        return { success: true, data: undefined as unknown as void, error: null }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al actualizar visibilidad del avance'
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL', message },
        }
    }
}
