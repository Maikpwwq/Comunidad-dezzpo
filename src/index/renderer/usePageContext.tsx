// `usePageContext` allows us to access `pageContext` in any React component.
// See https://vike.dev/pageContext-anywhere

import React, { useContext, createContext } from 'react'
import type { PageContext } from './types'

export { PageContextProvider }
// eslint-disable-next-line react-refresh/only-export-components
export { usePageContext }

const Context = createContext<PageContext>(undefined as unknown as PageContext)

function PageContextProvider({
    pageContext,
    children,
}: {
    pageContext: PageContext
    children: React.ReactNode
}) {
    return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

function usePageContext() {
    const pageContext = useContext(Context)
    return pageContext
}
