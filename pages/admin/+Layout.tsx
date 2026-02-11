/**
 * Admin Layout
 *
 * Security perimeter for admin sub-application.
 * Uses useAdminGuard to verify custom claims before rendering.
 * Branded sidebar with Dezzpo teal identity.
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
    Avatar,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import MenuIcon from '@mui/icons-material/Menu'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { theme } from '@config/theme'
import { UserAuthProvider } from '@providers'
import { useAdminGuard } from '@hooks/useAdminGuard'
import { navigate } from 'vike/client/router'

/* ── Brand palette ─────────────────────────────────────────────── */
const BRAND = {
    teal: '#00897B',
    tealDark: '#00695C',
    tealDeep: '#004D40',
    tealLight: '#1ec7e6',
    sidebarBg: 'linear-gradient(180deg, #00695C 0%, #004D40 100%)',
    appBarBg: '#00897B',
    surface: '#F5F7FA',
    selectedBg: 'rgba(30, 199, 230, 0.15)',
    selectedColor: '#1ec7e6',
    hoverBg: 'rgba(255, 255, 255, 0.08)',
}

const DRAWER_WIDTH = 260

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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: BRAND.surface }}>
                <CircularProgress size={48} sx={{ color: BRAND.teal }} />
                <Typography sx={{ ml: 2 }} variant="body1" color="text.secondary">
                    Verificando permisos de administrador…
                </Typography>
            </Box>
        )
    }

    if (!isAdmin) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: BRAND.surface }}>
                <Typography variant="h6" color="error" fontWeight={600}>
                    Acceso denegado
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    No tienes permisos de administrador.
                </Typography>
            </Box>
        )
    }

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Sidebar header */}
            <Toolbar
                sx={{
                    justifyContent: 'center',
                    gap: 1.5,
                    py: 2.5,
                }}
            >
                <Avatar sx={{ bgcolor: 'rgba(30, 199, 230, 0.2)', width: 40, height: 40 }}>
                    <AdminPanelSettingsIcon sx={{ color: BRAND.tealLight, fontSize: 24 }} />
                </Avatar>
                <Box>
                    <Typography variant="subtitle1" fontWeight={700} color="#fff">
                        Admin Panel
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        Centro de Control
                    </Typography>
                </Box>
            </Toolbar>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

            {/* Navigation */}
            <List sx={{ px: 1.5, pt: 2, flex: 1 }}>
                {adminNav.map((item) => {
                    const isSelected = currentPath === item.path
                    return (
                        <ListItemButton
                            key={item.path}
                            selected={isSelected}
                            onClick={() => {
                                navigate(item.path)
                                setMobileOpen(false)
                            }}
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                py: 1.2,
                                color: 'rgba(255,255,255,0.7)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: BRAND.hoverBg,
                                    color: '#fff',
                                },
                                '&.Mui-selected': {
                                    bgcolor: BRAND.selectedBg,
                                    color: BRAND.selectedColor,
                                    '& .MuiListItemIcon-root': { color: BRAND.selectedColor },
                                    '&:hover': { bgcolor: BRAND.selectedBg },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{ fontWeight: isSelected ? 600 : 400, fontSize: '0.9rem' }}
                            />
                        </ListItemButton>
                    )
                })}
            </List>

            {/* Back to app */}
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
            <List sx={{ px: 1.5, pb: 2 }}>
                <ListItemButton
                    onClick={() => navigate('/app/ajustes')}
                    sx={{
                        borderRadius: 2,
                        color: 'rgba(255,255,255,0.6)',
                        '&:hover': { bgcolor: BRAND.hoverBg, color: '#fff' },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                        <ArrowBackIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Volver al App"
                        primaryTypographyProps={{ fontSize: '0.85rem' }}
                    />
                </ListItemButton>
            </List>
        </Box>
    )

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: BRAND.surface }}>
            <CssBaseline />

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
                            Centro de Control — Dezzpo
                        </Typography>
                    </Box>
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
                        '& .MuiDrawer-paper': {
                            width: DRAWER_WIDTH,
                            background: BRAND.sidebarBg,
                            border: 'none',
                        },
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
                            background: BRAND.sidebarBg,
                            border: 'none',
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
