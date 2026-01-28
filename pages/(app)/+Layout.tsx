/**
 * App Layout
 *
 * Application layout using refactored layout components.
 * Migrated from AppLayout.tsx to Vike pages/(app)/+Layout.tsx
 */

import React, { useState } from 'react'
// MUI
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
// Layout components
import { Sidebar, Navbar } from '@components/layout'
// Theme
import { theme } from '@config/theme'
// Zustand store
import { useUserStore, useMobileMenu } from '@stores/userStore'
// Styles
import '@styles/Private-App.scss'
import '@styles/index.scss'

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
    // Zustand store
    const isAuth = useUserStore((state) => state.isAuth)
    const { mobileOpen, updateMobileMenu } = useMobileMenu()

    // Local state for permanent drawer
    const [sidebarOpen, setSidebarOpen] = useState(true)

    // Drawer toggle handlers
    const handleMobileClose = () => {
        updateMobileMenu(false)
    }

    const handleMenuToggle = () => {
        updateMobileMenu(!mobileOpen)
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                <CssBaseline />

                {/* Sidebar Navigation */}
                <Box
                    component="nav"
                    sx={{
                        width: { md: drawerWidth },
                        flexShrink: { sm: 0 },
                    }}
                >
                    {/* Mobile temporary drawer */}
                    {mobileOpen && isAuth && (
                        <Sidebar
                            open={mobileOpen}
                            onClose={handleMobileClose}
                            variant="temporary"
                        />
                    )}

                    {/* Desktop permanent drawer */}
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

                {/* Main Content Area */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    style={{ overflowX: 'auto' }}
                >
                    <Navbar onMenuToggle={handleMenuToggle} />

                    <Box
                        className="p-0"
                        component="main"
                        sx={{ flex: 1, py: 6, px: 4, bgcolor: '#ffffff' }}
                    >
                        {children}
                    </Box>

                    <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
                        <Copyright />
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}
