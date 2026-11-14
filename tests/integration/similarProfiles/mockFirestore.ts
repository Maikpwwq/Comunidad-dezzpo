/**
 * Mock Firestore Adapter with Exact Read & Query Metrics Tracking
 *
 * Implements the minimal subset of Firestore Admin SDK used by similarProfilesService:
 * - collection(name).doc(id).get()
 * - collection(name).where(field, op, val).limit(n).get()
 * - Exact metrics instrumentation for testing Invariant I5
 */

import type { RawMerchantDoc } from './syntheticProfileFactory'

export interface QueryInstrumentation {
    queryCount: number
    docReads: number
}

export class MockFirestoreDb {
    private readonly documents = new Map<string, RawMerchantDoc>()
    public metrics: QueryInstrumentation = {
        queryCount: 0,
        docReads: 0,
    }

    constructor(initialDocs: RawMerchantDoc[] = []) {
        initialDocs.forEach((doc) => {
            this.documents.set(doc.id, doc)
        })
    }

    resetMetrics(): void {
        this.metrics.queryCount = 0
        this.metrics.docReads = 0
    }

    collection(colName: string) {
        if (colName !== 'usersComerciantesCalificados') {
            throw new Error(`Unsupported collection in mock: ${colName}`)
        }

        const self = this

        return {
            doc(id: string) {
                return {
                    async get() {
                        self.metrics.queryCount++
                        self.metrics.docReads++
                        const data = self.documents.get(id)
                        return {
                            id,
                            exists: !!data,
                            data: () => (data ? { ...data } : undefined),
                        }
                    },
                }
            },
            where(field: string, op: string, value: unknown) {
                let limitCount: number | null = null

                const queryBuilder = {
                    limit(n: number) {
                        limitCount = n
                        return queryBuilder
                    },
                    async get() {
                        self.metrics.queryCount++

                        const matches: Array<{ id: string; data: () => Record<string, unknown> }> = []
                        for (const [id, doc] of self.documents.entries()) {
                            let isMatch = false

                            if (op === 'array-contains') {
                                const arr = doc[field as keyof RawMerchantDoc] as unknown[] | undefined
                                if (Array.isArray(arr) && arr.includes(value)) {
                                    isMatch = true
                                }
                            } else if (op === '==') {
                                const val = doc[field as keyof RawMerchantDoc]
                                if (val === value) {
                                    isMatch = true
                                }
                            }

                            if (isMatch) {
                                matches.push({
                                    id,
                                    data: () => ({ ...doc }),
                                })
                                if (limitCount !== null && matches.length >= limitCount) {
                                    break
                                }
                            }
                        }

                        self.metrics.docReads += matches.length

                        return {
                            size: matches.length,
                            empty: matches.length === 0,
                            forEach(cb: (docSnap: any) => void) {
                                matches.forEach(cb)
                            },
                        }
                    },
                }

                return queryBuilder
            },
        }
    }
}
