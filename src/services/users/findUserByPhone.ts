/**
 * Find User By Phone Service
 *
 * Locates an existing user profile in Firestore across Propietarios and Comerciantes
 * matching any Colombian or international phone representation.
 * Supports auto-linking phone auth credentials with existing accounts.
 */

import {
    collection,
    getDocs,
    query,
    where,
    type CollectionReference,
} from 'firebase/firestore'
import { firestore, isFirebaseAvailable } from '@services/firebase'
import type { UserFirestoreDocument, UserRole } from '../types'
import { formatToE164 } from '@services/utils/phoneUtils'
import { migrateContactFields } from '@utilities/contactUtils'
import { migrateLegacySocialFields } from '@utilities/socialUtils'

const PROPIETARIOS_COLLECTION = 'usersPropietariosResidentes'
const COMERCIANTES_COLLECTION = 'usersComerciantesCalificados'

export interface FindUserByPhoneResult {
    user: UserFirestoreDocument
    role: UserRole
    existingUid: string
}

/**
 * Generates common searchable variants of a phone number.
 * Example for '+573204842897':
 * ['+573204842897', '3204842897', '573204842897', '+57 320 484 2897']
 */
export function getPhoneVariants(rawPhone: string): string[] {
    if (!rawPhone) return []
    const trimmed = rawPhone.trim()
    const digitsOnly = trimmed.replace(/\D/g, '')
    const e164 = formatToE164(trimmed)

    const variants = new Set<string>()
    if (trimmed) variants.add(trimmed)
    if (e164) variants.add(e164)
    if (digitsOnly) variants.add(digitsOnly)

    // If it has Colombian prefix (57), add 10-digit local number
    if (digitsOnly.startsWith('57') && digitsOnly.length === 12) {
        variants.add(digitsOnly.slice(2))
    }
    // If it's a 10-digit number, add 12-digit 57... version
    if (digitsOnly.length === 10) {
        variants.add(`57${digitsOnly}`)
    }

    return Array.from(variants).filter(Boolean)
}

/**
 * Checks if a user document matches any of the phone variants.
 */
function documentMatchesPhone(docData: Record<string, unknown>, variants: string[]): boolean {
    const rawDigits = variants.map((v) => v.replace(/\D/g, '')).filter(Boolean)

    // Check userPhone
    if (docData.userPhone && typeof docData.userPhone === 'string') {
        const phoneDigits = docData.userPhone.replace(/\D/g, '')
        if (variants.includes(docData.userPhone) || rawDigits.includes(phoneDigits)) {
            return true
        }
    }

    // Check legacy userTel
    if (docData.userTel && typeof docData.userTel === 'string') {
        const telDigits = docData.userTel.replace(/\D/g, '')
        if (variants.includes(docData.userTel) || rawDigits.includes(telDigits)) {
            return true
        }
    }

    // Check phones array
    if (Array.isArray(docData.phones)) {
        for (const item of docData.phones) {
            if (item && typeof item === 'object' && typeof item.number === 'string') {
                const itemDigits = item.number.replace(/\D/g, '')
                if (variants.includes(item.number) || rawDigits.includes(itemDigits)) {
                    return true
                }
            }
        }
    }

    return false
}

/**
 * Search Firestore collections for a user matching the phone number.
 * If preferredRole is specified, searches that collection first.
 */
export async function findUserByPhone(
    phoneNumber: string,
    preferredRole?: 1 | 2 | null
): Promise<FindUserByPhoneResult | null> {
    if (!isFirebaseAvailable() || !firestore || !phoneNumber) {
        return null
    }

    const variants = getPhoneVariants(phoneNumber)
    if (variants.length === 0) return null

    // Determine role search order
    const rolesToSearch: UserRole[] = preferredRole === 1 ? [1, 2] : [2, 1]

    for (const role of rolesToSearch) {
        const collectionName = role === 1 ? PROPIETARIOS_COLLECTION : COMERCIANTES_COLLECTION
        const userCol: CollectionReference = collection(firestore, collectionName)

        try {
            // 1. Direct query on userPhone (up to 10 variants using 'in')
            const queryVariants = variants.slice(0, 10)
            const qPhone = query(userCol, where('userPhone', 'in', queryVariants))
            const snapPhone = await getDocs(qPhone)

            if (!snapPhone.empty) {
                const docSnap = snapPhone.docs[0]!
                const raw = { ...docSnap.data(), userId: docSnap.id }
                const { emails, phones } = migrateContactFields(raw)
                const socialLinks = migrateLegacySocialFields(raw)
                return {
                    user: { ...raw, emails, phones, socialLinks } as UserFirestoreDocument,
                    role,
                    existingUid: docSnap.id,
                }
            }

            // 2. Direct query on legacy userTel
            const qTel = query(userCol, where('userTel', 'in', queryVariants))
            const snapTel = await getDocs(qTel)

            if (!snapTel.empty) {
                const docSnap = snapTel.docs[0]!
                const raw = { ...docSnap.data(), userId: docSnap.id }
                const { emails, phones } = migrateContactFields(raw)
                const socialLinks = migrateLegacySocialFields(raw)
                return {
                    user: { ...raw, emails, phones, socialLinks } as UserFirestoreDocument,
                    role,
                    existingUid: docSnap.id,
                }
            }

            // 3. Fallback: Search in entire collection (handles array or formatting discrepancies)
            const snapAll = await getDocs(userCol)
            for (const docSnap of snapAll.docs) {
                const data = docSnap.data()
                if (documentMatchesPhone(data, variants)) {
                    const raw = { ...data, userId: docSnap.id }
                    const { emails, phones } = migrateContactFields(raw)
                    const socialLinks = migrateLegacySocialFields(raw)
                    return {
                        user: { ...raw, emails, phones, socialLinks } as UserFirestoreDocument,
                        role,
                        existingUid: docSnap.id,
                    }
                }
            }
        } catch (error) {
            console.error(`[findUserByPhone] Error querying collection for role ${role}:`, error)
        }
    }

    return null
}
