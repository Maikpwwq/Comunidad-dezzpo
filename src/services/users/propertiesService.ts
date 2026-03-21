import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { firestore, isFirebaseAvailable } from '@services/firebase'
import type { Property, UserFirestoreDocument } from '../types'

const PROPIETARIOS_COLLECTION = 'usersPropietariosResidentes'

/**
 * Get all properties for a specific user.
 */
export async function getProperties(userId: string): Promise<Property[]> {
    if (!isFirebaseAvailable() || !firestore) {
        console.log('[SSR] getProperties skipped - Firebase not available')
        return []
    }
    
    try {
        const docRef = doc(firestore, PROPIETARIOS_COLLECTION, userId)
        const snapshot = await getDoc(docRef)
        
        if (snapshot.exists()) {
            const data = snapshot.data() as UserFirestoreDocument
            return data.properties || []
        }
        return []
    } catch (error) {
        console.error('Error fetching properties:', error)
        throw error
    }
}

/**
 * Add a new property to the user's properties array using arrayUnion.
 */
export async function addProperty(userId: string, property: Property): Promise<void> {
    if (!isFirebaseAvailable() || !firestore) return
    
    try {
        const docRef = doc(firestore, PROPIETARIOS_COLLECTION, userId)
        await updateDoc(docRef, {
            properties: arrayUnion(property)
        })
    } catch (error) {
        console.error('Error adding property:', error)
        throw error
    }
}

/**
 * Delete a property from the user's properties array using arrayRemove.
 * Requires the exact property object to match in Firebase.
 */
export async function deleteProperty(userId: string, propertyToRemove: Property): Promise<void> {
    if (!isFirebaseAvailable() || !firestore) return
    
    try {
        const docRef = doc(firestore, PROPIETARIOS_COLLECTION, userId)
        await updateDoc(docRef, {
            properties: arrayRemove(propertyToRemove)
        })
    } catch (error) {
        console.error('Error deleting property:', error)
        throw error
    }
}

/**
 * Update an existing property.
 * Firestore doesn't have a direct array update method, so we read the document,
 * modify the array in memory, and write the complete array back.
 */
export async function updateProperty(userId: string, updatedProperty: Property): Promise<void> {
    if (!isFirebaseAvailable() || !firestore) return
    
    try {
        const docRef = doc(firestore, PROPIETARIOS_COLLECTION, userId)
        const snapshot = await getDoc(docRef)
        
        if (snapshot.exists()) {
            const data = snapshot.data() as UserFirestoreDocument
            const properties = data.properties || []
            
            // Reemplazar la propiedad basada en su ID
            const newProperties = properties.map((prop) => 
                prop.id === updatedProperty.id ? updatedProperty : prop
            )
            
            await updateDoc(docRef, { properties: newProperties })
        }
    } catch (error) {
        console.error('Error updating property:', error)
        throw error
    }
}

/**
 * Overwrite the entire properties list (useful for bulk updates or reordering).
 */
export async function setPropertiesList(userId: string, properties: Property[]): Promise<void> {
    if (!isFirebaseAvailable() || !firestore) return
    
    try {
        const docRef = doc(firestore, PROPIETARIOS_COLLECTION, userId)
        await updateDoc(docRef, { properties })
    } catch (error) {
        console.error('Error setting properties list:', error)
        throw error
    }
}
