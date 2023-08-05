// `usePageContext` allows us to access `pageContext` in any React component.
// See https://vite-plugin-ssr.com/pageContext-anywhere

import React, { useContext } from 'react'
// import PropTypes from 'prop-types'
// import { childrenPropType } from './PropTypeValues'
import type { PageContext } from './types'


export { PageContextProvider }
// eslint-disable-next-line react-refresh/only-export-components
export { usePageContext }

const Context = React.createContext<PageContext>(undefined as unknown as PageContext)

// PageContextProvider.propTypes = {
//     pageContext: PropTypes.any,
//     children: childrenPropType,
// }

function PageContextProvider({ pageContext, children }: { pageContext: PageContext; children: React.ReactNode }) {
    return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

function usePageContext() {
    const pageContext = useContext(Context)
    return pageContext
}
