/**
 * App Layout
 *
 * Application layout using refactored layout components.
 * Migrated from AppLayout.tsx to Vike pages/(app)/+Layout.tsx
 */

import React, { useState } from 'react'
// MUI
import { Box, Typography, Link } from '@mui/material'
// Layout components
import { Sidebar, Navbar } from '@components/layout'
// Zustand store
import { useUserStore } from '@stores/userStore'
// Providers
import { SendbirdProviderWrapper } from '@providers'
import ChatWidget from '@features/chat/ChatWidget'

interface LayoutProps {
  children: React.ReactNode
}

const drawerWidth = 256

function Copyright(): React.ReactElement {
  const showYear = new Date().getFullYear()
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        Comunidad Dezzpo Inc.
        <br /> - Todos los derechos reservados -
      </Link>
      {showYear}.
    </Typography>
  )
}

export function Layout({ children }: LayoutProps): React.ReactElement {
  const isAuth = useUserStore((state) => state.isAuth)
  const mobileOpen = useUserStore((state) => state.mobileOpen)
  const updateMobileMenu = useUserStore((state) => state.updateMobileMenu)

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleMobileClose = () => {
    updateMobileMenu(false)
  }

  const handleMenuToggle = () => {
    updateMobileMenu(!mobileOpen)
  }

  return (
    <>
      {isAuth ? (
        <SendbirdProviderWrapper>
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar Navigation */}
            <Box
              component="nav"
              sx={{
                width: { md: drawerWidth },
                flexShrink: { sm: 0 },
              }}
            >
              {mobileOpen && (
                <Sidebar open={mobileOpen} onClose={handleMobileClose} variant="temporary" />
              )}

              <Box
                sx={{
                  display: {
                    md: 'block',
                    sm: 'none',
                    xs: 'none',
                  },
                }}
              >
                <Sidebar
                  open={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                  variant="permanent"
                />
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
              style={{ overflowX: 'auto' }}
            >
              <Navbar onMenuToggle={handleMenuToggle} />

              <Box className="p-0" component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#ffffff' }}>
                {children}
              </Box>

              <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
                <Copyright />
              </Box>
            </Box>
          </Box>
        </SendbirdProviderWrapper>
      ) : (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Box
            component="nav"
            sx={{
              width: { md: drawerWidth },
              flexShrink: { sm: 0 },
            }}
          >
            {mobileOpen && (
              <Sidebar open={mobileOpen} onClose={handleMobileClose} variant="temporary" />
            )}

            <Box
              sx={{
                display: {
                  md: 'block',
                  sm: 'none',
                  xs: 'none',
                },
              }}
            >
              <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                variant="permanent"
              />
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
            style={{ overflowX: 'auto' }}
          >
            <Navbar onMenuToggle={handleMenuToggle} />

            <Box className="p-0" component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#ffffff' }}>
              {children}
            </Box>

            <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
              <Copyright />
            </Box>
          </Box>
        </Box>
      )}

      <ChatWidget />
    </>
  )
}
