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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: BRAND.surface }}>
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
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { md: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: BRAND.teal,
              }}
            />
            <Typography variant="h6" color="text.primary" fontWeight={600} noWrap>
              Centro de Control — Comunidad Dezzpo
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
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '64px',
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
