/**
 * Admin Layout
 *
 * Security perimeter for admin sub-application.
 * Uses useAdminGuard to verify custom claims before rendering.
 * Branded sidebar with Dezzpo teal identity.
 */

import React, { useState } from 'react'
import {
  Box,
  Drawer,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useAdminGuard } from '@hooks/useAdminGuard'

import { AdminSidebar, BRAND, DRAWER_WIDTH } from '@features/admin/components/AdminSidebar'

interface LayoutProps {
  children: React.ReactNode
}

function AdminContent({ children }: LayoutProps): React.ReactElement {
  const { isAdmin, isLoading } = useAdminGuard()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: BRAND.surface,
        }}
      >
        <CircularProgress size={48} sx={{ color: BRAND.teal }} />
        <Typography sx={{ ml: 2 }} variant="body1" color="text.secondary">
          Verificando permisos de administrador…
        </Typography>
      </Box>
    )
  }

  if (!isAdmin) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: BRAND.surface,
        }}
      >
        <Typography variant="h6" color="error" fontWeight={600}>
          Acceso denegado
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          No tienes permisos de administrador.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: { xs: 'block', md: 'flex' }, minHeight: '100vh', bgcolor: BRAND.surface, maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* Top Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: '#fff',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1.5, sm: 2.5 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 1.5, display: { md: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: BRAND.teal,
                flexShrink: 0,
              }}
            />
            <Typography
              variant="h6"
              color="text.primary"
              fontWeight={700}
              noWrap
              sx={{ fontSize: { xs: '0.95rem', sm: '1.15rem' } }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Centro de Control — Comunidad Dezzpo
              </Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                Centro de Control
              </Box>
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              background: BRAND.sidebarBg,
              border: 'none',
            },
          }}
        >
          <AdminSidebar onCloseMobile={() => setMobileOpen(false)} />
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              background: BRAND.sidebarBg,
              border: 'none',
            },
          }}
          open
        >
          <AdminSidebar />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: { md: 1 },
          display: 'block',
          textAlign: 'left',
          minWidth: 0,
          maxWidth: '100%',
          overflowX: 'hidden',
          p: { xs: 1.5, sm: 2.5, md: 3 },
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: { xs: '56px', sm: '64px' },
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export function Layout({ children }: LayoutProps): React.ReactElement {
  return <AdminContent>{children}</AdminContent>
}
