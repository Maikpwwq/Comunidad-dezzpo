/**
 * Profile Prefetch Unit Tests (Innovación #3)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
    isFastConnection,
    prefetchProfileRoute,
    prefetchProfileAssets,
    resetPrefetchCacheForTesting,
} from '@features/similarProfiles/utils/profilePrefetch'

describe('Innovación #3: Profile Prefetch Utility', () => {
    beforeEach(() => {
        resetPrefetchCacheForTesting()
    })

    describe('isFastConnection', () => {
        it('returns false if customNavigator is null', () => {
            expect(isFastConnection(null)).toBe(false)
        })

        it('returns false when Data Saver mode is active (saveData: true)', () => {
            const mockNav = {
                connection: {
                    saveData: true,
                    effectiveType: '4g',
                },
            }
            expect(isFastConnection(mockNav)).toBe(false)
        })

        it('returns false on slow 2G connections', () => {
            const mock2g = {
                connection: {
                    saveData: false,
                    effectiveType: '2g',
                },
            }
            const mockSlow2g = {
                connection: {
                    saveData: false,
                    effectiveType: 'slow-2g',
                },
            }
            expect(isFastConnection(mock2g)).toBe(false)
            expect(isFastConnection(mockSlow2g)).toBe(false)
        })

        it('returns true on 3G, 4G, or unthrottled connections', () => {
            const mock3g = {
                connection: {
                    saveData: false,
                    effectiveType: '3g',
                },
            }
            const mock4g = {
                connection: {
                    saveData: false,
                    effectiveType: '4g',
                },
            }
            expect(isFastConnection(mock3g)).toBe(true)
            expect(isFastConnection(mock4g)).toBe(true)
        })

        it('returns true when Network Information API is not supported (fallback)', () => {
            const mockNavWithoutConn = {}
            expect(isFastConnection(mockNavWithoutConn)).toBe(true)
        })

        it('supports vendor-prefixed connection properties (mozConnection, webkitConnection)', () => {
            const mockMoz = {
                mozConnection: {
                    effectiveType: '2g',
                },
            }
            const mockWebkit = {
                webkitConnection: {
                    saveData: true,
                },
            }
            expect(isFastConnection(mockMoz)).toBe(false)
            expect(isFastConnection(mockWebkit)).toBe(false)
        })
    })

    describe('prefetchProfileRoute', () => {
        it('skips invalid, empty, or whitespace-only URLs', () => {
            expect(prefetchProfileRoute('')).toBe(false)
            expect(prefetchProfileRoute('   ')).toBe(false)
            expect(prefetchProfileRoute(null as unknown as string)).toBe(false)
        })

        it('prefetches a valid URL on fast connection', () => {
            const customPrefetch = vi.fn()
            const mockNav = { connection: { effectiveType: '4g' } }

            const result = prefetchProfileRoute('/app/perfil/pro-123', {
                customPrefetch,
                customNavigator: mockNav,
            })

            expect(result).toBe(true)
            expect(customPrefetch).toHaveBeenCalledTimes(1)
            expect(customPrefetch).toHaveBeenCalledWith('/app/perfil/pro-123')
        })

        it('deduplicates prefetch calls for the same URL in the same session', () => {
            const customPrefetch = vi.fn()
            const mockNav = { connection: { effectiveType: '4g' } }

            const first = prefetchProfileRoute('/app/perfil/pro-123', {
                customPrefetch,
                customNavigator: mockNav,
            })
            const second = prefetchProfileRoute('/app/perfil/pro-123', {
                customPrefetch,
                customNavigator: mockNav,
            })

            expect(first).toBe(true)
            expect(second).toBe(false) // Deduplicated!
            expect(customPrefetch).toHaveBeenCalledTimes(1)
        })

        it('skips prefetch when connection is 2G', () => {
            const customPrefetch = vi.fn()
            const mockNav = { connection: { effectiveType: '2g' } }

            const result = prefetchProfileRoute('/app/perfil/pro-456', {
                customPrefetch,
                customNavigator: mockNav,
            })

            expect(result).toBe(false)
            expect(customPrefetch).not.toHaveBeenCalled()
        })

        it('injects <link rel="prefetch"> tag into document head when document is available', () => {
            const appendedChildren: any[] = []
            const mockDoc = {
                head: {
                    appendChild: (node: any) => appendedChildren.push(node),
                },
                createElement: (tag: string) => ({ tagName: tag, rel: '', href: '', as: '', crossOrigin: '' }),
            } as unknown as Document

            const mockNav = { connection: { effectiveType: '4g' } }

            const result = prefetchProfileRoute('/app/perfil/pro-dom', {
                customDocument: mockDoc,
                customNavigator: mockNav,
            })

            expect(result).toBe(true)
            expect(appendedChildren.length).toBe(1)
            expect(appendedChildren[0].rel).toBe('prefetch')
            expect(appendedChildren[0].href).toBe('/app/perfil/pro-dom')
        })
    })

    describe('prefetchProfileAssets', () => {
        it('prefetches route and attempts image prefetch on fast connection', () => {
            const customPrefetch = vi.fn()
            const mockNav = { connection: { effectiveType: '4g' } }

            const result = prefetchProfileAssets('/app/perfil/pro-image', 'https://example.com/avatar.jpg', {
                customPrefetch,
                customNavigator: mockNav,
            })

            expect(result).toBe(true)
            expect(customPrefetch).toHaveBeenCalledWith('/app/perfil/pro-image')
        })

        it('handles null or missing photoUrl safely', () => {
            const customPrefetch = vi.fn()
            const mockNav = { connection: { effectiveType: '4g' } }

            const result = prefetchProfileAssets('/app/perfil/no-image', null, {
                customPrefetch,
                customNavigator: mockNav,
            })

            expect(result).toBe(true)
            expect(customPrefetch).toHaveBeenCalledWith('/app/perfil/no-image')
        })
    })
})
