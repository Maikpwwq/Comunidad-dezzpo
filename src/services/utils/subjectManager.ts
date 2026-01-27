/**
 * Subject Manager Utility
 *
 * TypeScript version of the RxJS-based sharing information service.
 * Provides a simple pub/sub pattern for sharing data between services and components.
 */

import { BehaviorSubject } from 'rxjs'

export interface SubjectData {
    [key: string]: unknown
    // Common data patterns
    currentUser?: unknown
    draft?: unknown
    quotation?: unknown
    search?: unknown[]
    users?: unknown[]
    authUser?: unknown
    channelURL?: string
    sendDraft?: unknown
    sendUser?: unknown
    sendQuotation?: unknown
}

export class SubjectManager {
    private subject = new BehaviorSubject<SubjectData>({})

    /**
     * Update the shared subject data
     */
    setSubject(data: SubjectData): void {
        const current = this.subject.getValue()
        this.subject.next({ ...current, ...data })
    }

    /**
     * Get current subject data
     */
    getSubject(): SubjectData {
        return this.subject.getValue()
    }

    /**
     * Subscribe to subject changes
     */
    subscribe(callback: (data: SubjectData) => void) {
        return this.subject.subscribe(callback)
    }

    /**
     * Clear all subject data
     */
    clear(): void {
        this.subject.next({})
    }
}

export default SubjectManager
