/**
 * Admin Layout
 *
 * Security perimeter for admin sub-application.
 * Uses useAdminGuard to verify custom claims before rendering.
 * Minimal sidebar with admin-only navigation.
 */

import React, { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import {
    Box,
    CssBaseline,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    AppBar,
    Typography,
    IconButton,
    CircularProgress,
    Divider,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import MenuIcon from '@mui/icons-material/Menu'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { theme } from '@config/theme'
import { UserAuthProvider } from '@providers'
import { useAdminGuard } from '@hooks/useAdminGuard'
import { navigate } from 'vike/client/router'

const DRAWER_WIDTH = 240

const adminNav = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { label: 'Usuarios', icon: <PeopleIcon />, path: '/admin/usuarios' },
    { label: 'Verificación', icon: <VerifiedUserIcon />, path: '/admin/verificacion' },
]

interface LayoutProps {
    children: React.ReactNode
}

function AdminContent({ children }: LayoutProps): React.ReactElement {
    const { isAdmin, isLoading } = useAdminGuard()
    const [mobileOpen, setMobileOpen] = useState(false)

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress size={48} />
                <Typography sx={{ ml: 2 }} variant="body1" color="text.secondary">
                    Verificando permisos de administrador…
                </Typography>
            </Box>
        )
    }

    if (!isAdmin) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography variant="h6" color="error">
                    Acceso denegado
                </Typography>
            </Box>
        )
    }

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

    const drawerContent = (
        <Box>
            <Toolbar sx={{ justifyContent: 'center' }}>
                <Typography variant="h6" fontWeight={700} color="primary">
                    Admin Panel
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {adminNav.map((item) => (
                    <ListItemButton
                        key={item.path}
                        selected={currentPath === item.path}
                        onClick={() => {
                            navigate(item.path)
                            setMobileOpen(false)
                        }}
                        sx={{
                            borderRadius: 1,
                            mx: 1,
                            mb: 0.5,
                            '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'white',
                                '& .MuiListItemIcon-root': { color: 'white' },
                                '&:hover': { bgcolor: 'primary.dark' },
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>
            <Divider sx={{ mt: 2 }} />
            <List>
                <ListItemButton
                    onClick={() => navigate('/app/ajustes')}
                    sx={{ borderRadius: 1, mx: 1 }}
                >
                    <ListItemIcon sx={{ minWidth: 40 }}><ArrowBackIcon /></ListItemIcon>
                    <ListItemText primary="Volver al App" />
                </ListItemButton>
            </List>
        </Box>
    )

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <CssBaseline />

            {/* Top Bar */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    ml: { md: `${DRAWER_WIDTH}px` },
                    bgcolor: 'white',
                    borderBottom: '1px solid #e0e0e0',
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
                    <Typography variant="h6" color="text.primary" fontWeight={600} noWrap>
                        Centro de Control — Dezzpo
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
                {/* Mobile drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
                    }}
                >
                    {drawerContent}
                </Drawer>

                {/* Desktop permanent drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            width: DRAWER_WIDTH,
                            boxSizing: 'border-box',
                            borderRight: '1px solid #e0e0e0',
                        },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Main content */}
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
    return (
        <ThemeProvider theme={theme}>
            <UserAuthProvider>
                <AdminContent>{children}</AdminContent>
            </UserAuthProvider>
        </ThemeProvider>
    )
}
