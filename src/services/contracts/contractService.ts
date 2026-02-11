/**
 * Contract Service
 *
 * CRUD operations for the `contracts` Firestore collection.
 * Handles the lifecycle of service contracts between clients and providers.
 * SSR-safe: Returns null/empty when Firebase is not available.
 */

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where,
    orderBy,
    type DocumentReference,
} from 'firebase/firestore'
import { firestore, isFirebaseAvailable } from '@services/firebase'
import type {
    ContractFirestoreDocument,
    CreateContractParams,
    UpdateContractParams,
} from '../types'

const CONTRACTS_COLLECTION = 'contracts'

/**
 * Create a new contract document (auto-ID).
 * Returns the new contract ID on success, or null on failure.
 */
export async function createContract(
    { data }: CreateContractParams
): Promise<string | null> {
    if (!isFirebaseAvailable() || !firestore) {
        console.warn('[SSR] createContract skipped - Firebase not available')
        return null
    }

    try {
        const contractsRef = collection(firestore, CONTRACTS_COLLECTION)
        const docRef = await addDoc(contractsRef, data)
        return docRef.id
    } catch (error) {
        console.error('Error creating contract:', error)
        throw error
    }
}

/**
 * Get a single contract by ID
 */
export async function getContract(
    contractId: string
): Promise<ContractFirestoreDocument | null> {
    if (!isFirebaseAvailable() || !firestore) {
        console.warn('[SSR] getContract skipped - Firebase not available')
        return null
    }

    try {
        const contractsRef = collection(firestore, CONTRACTS_COLLECTION)
        const docRef = doc(contractsRef, contractId) as DocumentReference<ContractFirestoreDocument>
        const snapshot = await getDoc(docRef)

        if (snapshot.exists()) {
            return { ...snapshot.data(), contractId: snapshot.id }
        }
        return null
    } catch (error) {
        console.error('Error reading contract:', error)
        throw error
    }
}

/**
 * Update a contract document (e.g., change status, mark as rated)
 */
export async function updateContract(
    { contractId, data }: UpdateContractParams
): Promise<void> {
    if (!isFirebaseAvailable() || !firestore) {
        console.warn('[SSR] updateContract skipped - Firebase not available')
        return
    }

    try {
        const contractsRef = collection(firestore, CONTRACTS_COLLECTION)
        const docRef = doc(contractsRef, contractId)
        await updateDoc(docRef, data)
    } catch (error) {
        console.error('Error updating contract:', error)
        throw error
    }
}

/**
 * Get contracts where the user is the client (Propietario)
 */
export async function getContractsByClient(
    clientId: string
): Promise<ContractFirestoreDocument[]> {
    if (!isFirebaseAvailable() || !firestore) {
        console.warn('[SSR] getContractsByClient skipped - Firebase not available')
        return []
    }

    try {
        const contractsRef = collection(firestore, CONTRACTS_COLLECTION)
        const q = query(
            contractsRef,
            where('clientId', '==', clientId),
            orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(q)

        return snapshot.docs.map((doc) => ({
            ...doc.data(),
            contractId: doc.id,
        })) as ContractFirestoreDocument[]
    } catch (error) {
        console.error('Error getting client contracts:', error)
        throw error
    }
}

/**
 * Get contracts where the user is the provider (Comerciante)
 */
export async function getContractsByProvider(
    providerId: string
): Promise<ContractFirestoreDocument[]> {
    if (!isFirebaseAvailable() || !firestore) {
        console.warn('[SSR] getContractsByProvider skipped - Firebase not available')
        return []
    }

    try {
        const contractsRef = collection(firestore, CONTRACTS_COLLECTION)
        const q = query(
            contractsRef,
            where('providerId', '==', providerId),
            orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(q)

        return snapshot.docs.map((doc) => ({
            ...doc.data(),
            contractId: doc.id,
        })) as ContractFirestoreDocument[]
    } catch (error) {
        console.error('Error getting provider contracts:', error)
        throw error
    }
}

/**
 * Get completed contracts for a user (as client or provider).
 * Used to gate the ratings feature.
 */
export async function getCompletedContracts(
    userId: string
): Promise<ContractFirestoreDocument[]> {
    if (!isFirebaseAvailable() || !firestore) {
        console.warn('[SSR] getCompletedContracts skipped - Firebase not available')
        return []
    }

    try {
        const contractsRef = collection(firestore, CONTRACTS_COLLECTION)

        // Query as client
        const clientQ = query(
            contractsRef,
            where('clientId', '==', userId),
            where('status', '==', 'completed')
        )
        const clientSnap = await getDocs(clientQ)

        // Query as provider
        const providerQ = query(
            contractsRef,
            where('providerId', '==', userId),
            where('status', '==', 'completed')
        )
        const providerSnap = await getDocs(providerQ)

        const allDocs = [
            ...clientSnap.docs.map((doc) => ({
                ...doc.data(),
                contractId: doc.id,
            })),
            ...providerSnap.docs.map((doc) => ({
                ...doc.data(),
                contractId: doc.id,
            })),
        ] as ContractFirestoreDocument[]

        return allDocs
    } catch (error) {
        console.error('Error getting completed contracts:', error)
        throw error
    }
}
