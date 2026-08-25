/**
 * Firestore Utilities
 *
 * Helpers for sanitizing payloads and safely preparing data for Cloud Firestore.
 */

/**
 * Recursively strips `undefined` values from an object or array to ensure compatibility
 * with Cloud Firestore SDK (which throws an error when encounters `undefined`).
 */
export function sanitizeForFirestore<T>(val: T): T {
    if (val === undefined || val === null) {
        return val
    }
    if (Array.isArray(val)) {
        return val.map((item) => sanitizeForFirestore(item)) as unknown as T
    }
    if (typeof val === 'object' && val.constructor === Object) {
        const cleaned: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(val as Record<string, unknown>)) {
            if (value !== undefined) {
                cleaned[key] = sanitizeForFirestore(value)
            }
        }
        return cleaned as T
    }
    return val
}
