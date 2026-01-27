import type { PageContext } from 'vike/types'
import { PageContextProvider } from '@hooks/usePageContext'
// CSS import - will be processed by Vite
import '@styles/global.scss'

/**
 * PageShell Component
 *
 * Wraps all pages with essential providers and global styles.
 * This is the root wrapper for both SSR and client rendering.
 */
export default function PageShell({
    children,
    pageContext,
}: {
    children: React.ReactNode
    pageContext: PageContext
}) {
    return (
        <PageContextProvider pageContext={pageContext}>
            {children}
        </PageContextProvider>
    )
}
