import type { PageContext } from 'vike/types'
import { PageContextProvider } from '@hooks/usePageContext'
import { UserAuthProvider } from '@providers/UserAuthProvider'
// CSS import - will be processed by Vite
import '@styles/global.scss'
import '@styles/index.scss'

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
            <UserAuthProvider>
                {children}
            </UserAuthProvider>
        </PageContextProvider>
    )
}
