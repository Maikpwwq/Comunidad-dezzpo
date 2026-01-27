/**
 * Link Component
 *
 * Client-side navigation link with active state detection.
 * Migrated from src/index/renderer/Link.tsx
 */

import React from 'react'
import { usePageContext } from './usePageContext'

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href?: string
    className?: string
    children: React.ReactNode
}

function Link({ href, className, children, ...rest }: LinkProps): React.ReactElement {
    const pageContext = usePageContext()

    const combinedClassName = [
        className,
        pageContext.urlPathname === href && 'is-active',
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <a href={href} className={combinedClassName} {...rest}>
            {children}
        </a>
    )
}

export default Link
