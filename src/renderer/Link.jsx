export { Link }
import PropTypes from 'prop-types'
import { usePageContext } from './usePageContext'
import React from 'react'

//: { href: string; children: string }
function Link({ href, children }) {
    const pageContext = usePageContext() // TODO as { urlPathname: string }
    const urlPathname = pageContext
    console.log('pageContext', pageContext, urlPathname, href)
    const isActive =
        href === '/' ? urlPathname === href : urlPathname.startsWith(href)
    return (
        <a href={href} className={isActive ? 'is-active' : undefined}>
            {children}
        </a>
    )
}

Link.propTypes = {
    href: PropTypes.string,
    children: PropTypes.any,
}
