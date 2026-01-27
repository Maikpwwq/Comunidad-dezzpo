import React, { createContext, useContext } from 'react'
import type { PageContext } from 'vike/types'

/**
 * PageContext Provider
 *
 * Makes Vike's pageContext available throughout the React component tree.
 * Access route params, page props, and other Vike data anywhere via usePageContext().
 *
 * @example
 * ```tsx
 * const { routeParams, pageProps } = usePageContext()
 * ```
 */

const Context = createContext<PageContext | null>(null)

/**
 * Hook to access the current page context
 * Must be used within a PageContextProvider
 */
export function usePageContext(): PageContext {
    const pageContext = useContext(Context)
    if (!pageContext) {
        throw new Error(
            'usePageContext must be used within a PageContextProvider. ' +
            'Ensure your component is wrapped in the root Layout.'
        )
    }
    return pageContext
}

/**
 * Provider component that wraps the app with pageContext
 */
export function PageContextProvider({
    pageContext,
    children,
}: {
    pageContext: PageContext
    children: React.ReactNode
}) {
    return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

export default usePageContext
