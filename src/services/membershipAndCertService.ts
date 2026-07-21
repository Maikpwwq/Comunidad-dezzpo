/**
 * Membership and Certification Service
 *
 * Handles database operations for:
 * - Comerciante Annual Membership
 * - Propietario VIP Inspection Requests
 * - Technical visit Scheduling & Certifications
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
    arrayUnion,
} from 'firebase/firestore'
import { firestore } from './firebase'
import type { InspectionRequest, CertificationRequest } from './types'


const INSPECTIONS_COLLECTION = 'inspectionRequests'
const CERTIFICATIONS_COLLECTION = 'certificationRequests'
const COMERCIANTES_COLLECTION = 'usersComerciantesCalificados'

/**
 * Creates an inspection request for Propietario VIP
 */
export async function createInspectionRequest(
    data: Omit<InspectionRequest, 'requestId' | 'createdAt' | 'status'>
): Promise<string | null> {
    if (!firestore) return null

    try {
        const colRef = collection(firestore, INSPECTIONS_COLLECTION)
        const docRef = await addDoc(colRef, {
            ...data,
            status: 'pending_schedule',
            createdAt: new Date().toISOString(),
        })

        // Link request ID inside document
        await updateDoc(docRef, { requestId: docRef.id })
        return docRef.id
    } catch (error) {
        console.error('Error creating inspection request:', error)
        throw error
    }
}

/**
 * Gets all inspection requests for a specific Propietario user
 */
export async function getInspectionRequestsByPropietario(propietarioId: string): Promise<InspectionRequest[]> {
    if (!firestore) return []

    try {
        const colRef = collection(firestore, INSPECTIONS_COLLECTION)
        const q = query(
            colRef,
            where('propietarioId', '==', propietarioId),
            orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map((doc) => doc.data() as InspectionRequest)
    } catch (error) {
        console.error('Error fetching owner inspection requests:', error)
        throw error
    }
}

/**
 * Creates a certification request for a Comerciante
 */
export async function createCertificationRequest(
    data: Omit<CertificationRequest, 'requestId' | 'createdAt' | 'status' | 'paymentStatus'>
): Promise<string | null> {
    if (!firestore) return null

    try {
        const colRef = collection(firestore, CERTIFICATIONS_COLLECTION)
        const docRef = await addDoc(colRef, {
            ...data,
            status: 'pending_payment',
            paymentStatus: 'pending',
            createdAt: new Date().toISOString(),
        })

        await updateDoc(docRef, { requestId: docRef.id })
        return docRef.id
    } catch (error) {
        console.error('Error creating certification request:', error)
        throw error
    }
}

/**
 * Updates payment status for a certification request
 */
export async function markCertificationPaid(requestId: string, paymentReference: string): Promise<void> {
    if (!firestore) return

    try {
        const docRef = doc(firestore, CERTIFICATIONS_COLLECTION, requestId)
        await updateDoc(docRef, {
            status: 'pending', // paid, waiting for admin schedule
            paymentStatus: 'paid',
            paymentReference,
        })
    } catch (error) {
        console.error('Error updating certification payment:', error)
        throw error
    }
}

/**
 * Gets certification requests for a specific Comerciante
 */
export async function getCertificationRequestsByComerciante(comercianteId: string): Promise<CertificationRequest[]> {
    if (!firestore) return []

    try {
        const colRef = collection(firestore, CERTIFICATIONS_COLLECTION)
        const q = query(
            colRef,
            where('comercianteId', '==', comercianteId),
            orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map((doc) => doc.data() as CertificationRequest)
    } catch (error) {
        console.error('Error fetching merchant certification requests:', error)
        throw error
    }
}

/**
 * Gets all certification requests (for admin)
 */
export async function getAllCertificationRequests(): Promise<CertificationRequest[]> {
    if (!firestore) return []

    try {
        const colRef = collection(firestore, CERTIFICATIONS_COLLECTION)
        const q = query(colRef, orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        return snapshot.docs.map((doc) => doc.data() as CertificationRequest)
    } catch (error) {
        console.error('Error fetching all certification requests:', error)
        throw error
    }
}

/**
 * Admin: Update certification request status
 * If approved, automatically grants the competency badge and unlocks 'destacado' tier.
 */
export async function updateCertificationRequestStatus(
    requestId: string,
    status: 'scheduled' | 'evaluated' | 'approved' | 'rejected',
    notes: string = ''
): Promise<void> {
    if (!firestore) return

    try {
        const docRef = doc(firestore, CERTIFICATIONS_COLLECTION, requestId)
        const requestSnap = await getDoc(docRef)

        if (!requestSnap.exists()) {
            throw new Error('Certification request does not exist')
        }

        const request = requestSnap.data() as CertificationRequest
        const updatePayload: Partial<CertificationRequest> = { status, notes }

        await updateDoc(docRef, updatePayload)

        // If approved, update the comerciante's earnedBadges and set profileTier to destacado
        if (status === 'approved') {
            const merchantDocRef = doc(firestore, COMERCIANTES_COLLECTION, request.comercianteId)
            const badge = {
                category: request.category,
                issuedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year validity
            }

            await updateDoc(merchantDocRef, {
                earnedBadges: arrayUnion(badge),
                profileTier: 'destacado',
            })
        }
    } catch (error) {
        console.error('Error updating certification status:', error)
        throw error
    }
}

/**
 * Activate merchant membership subscription
 */
export async function activateMerchantMembership(userId: string): Promise<void> {
    if (!firestore) return

    try {
        const docRef = doc(firestore, COMERCIANTES_COLLECTION, userId)
        const expirationDate = new Date()
        expirationDate.setFullYear(expirationDate.getFullYear() + 1) // 1 year membership

        await updateDoc(docRef, {
            membershipStatus: 'active',
            membershipExpiresAt: expirationDate.toISOString(),
            profileTier: 'destacado',
        })
    } catch (error) {
        console.error('Error activating merchant membership:', error)
        throw error
    }
}
