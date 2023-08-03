// `usePageContext` allows us to access `pageContext` in any React component.
// See https://vite-plugin-ssr.com/pageContext-anywhere
export { PageContextProvider }
export { usePageContext }

import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { childrenPropType } from './PropTypeValues'

const Context = React.createContext()

PageContextProvider.propTypes = {
    pageContext: PropTypes.any,
    children: childrenPropType,
}

function PageContextProvider({ pageContext, children }) {
    return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

function usePageContext() {
    const pageContext = useContext(Context)
    return pageContext
}
