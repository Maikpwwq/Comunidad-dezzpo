import type { ReactNode } from 'react'
import type { PageContext } from 'vike/types'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { PageContextProvider } from '@hooks/usePageContext'
import { UserAuthProvider } from '@providers/UserAuthProvider'
import { theme } from '@config/theme'
import { useReferralTracker } from '@hooks/useReferralTracker'
import '@styles/global.scss'
import '@styles/index.scss'

/**
 * PageShell Component
 *
 * Wraps all pages with essential providers and global styles.
 * Theme + CssBaseline live here so marketing + app + admin share one MUI theme for SSR/CSR.
 */
export default function PageShell({
  children,
  pageContext,
}: {
  children: ReactNode
  pageContext: PageContext
}) {
  useReferralTracker()

  return (

    <PageContextProvider pageContext={pageContext}>
      <UserAuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </UserAuthProvider>
    </PageContextProvider>
  )
}
