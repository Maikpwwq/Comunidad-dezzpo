/**
 * Navbar Component
 *
 * App header with search and role-based navigation tabs.
 * Refactored from legacy Header.jsx (271 lines -> modular component).
 */

import React from 'react'
import { navigate } from 'vike/client/router'
import { Link } from '@hooks'
import { useUserStore } from '@stores/userStore'
import { getHeaderConfig } from './navigation.config'
import type { UserRole } from './types'

// MUI Components
// MUI Components
import {
    AppBar,
    Toolbar,
    Box,
    Tab,
    Tabs,
    IconButton,
    useMediaQuery
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

// MUI Icons
import MenuIcon from '@mui/icons-material/Menu'
import PersonIcon from '@mui/icons-material/Person'
import StoreIcon from '@mui/icons-material/Store'
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove'
import MessageIcon from '@mui/icons-material/Message'
import WorkHistoryIcon from '@mui/icons-material/WorkHistory'
import LoyaltyIcon from '@mui/icons-material/Loyalty'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import StarRateIcon from '@mui/icons-material/StarRate'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import StorefrontIcon from '@mui/icons-material/Storefront'

// Types
import type { NavbarProps } from './types'

/** Icon resolver - maps icon name strings to MUI components */
const ICON_MAP: Record<string, React.ReactNode> = {
    StorefrontIcon: <StorefrontIcon />,
    PersonIcon: <PersonIcon className="ms-1" />,
    StoreIcon: <StoreIcon />,
    DriveFileMoveIcon: <DriveFileMoveIcon />,
    MessageIcon: <MessageIcon className="ms-1" />,
    WorkHistoryIcon: <WorkHistoryIcon className="ms-1" />,
    LoyaltyIcon: <LoyaltyIcon className="ms-1" />,
    HowToRegIcon: <HowToRegIcon className="ms-1" />,
    StarRateIcon: <StarRateIcon className="ms-1" />,
    LoginIcon: <LoginIcon className="ms-1" />,
    PersonAddIcon: <PersonAddIcon className="ms-1" />,
}

function Navbar({ onMenuToggle, userInfo }: NavbarProps): React.ReactElement {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

    // Get user from Zustand store with selectors (flat state, not nested)
    const userId = useUserStore((state) => state.userId)
    const displayName = useUserStore((state) => state.displayName)
    const photoUrl = useUserStore((state) => state.photoUrl)
    const rol = useUserStore((state) => state.rol)

    /** Convert numeric rol to UserRole type */
    const roleFromStore = (): UserRole => {
        if (rol === 2) return 'comerciante'
        if (rol === 1) return 'propietario'
        return 'guest'
    }

    // Merge props user with store user
    const user = userInfo ?? {
        userId: userId ?? '',
        displayName: displayName ?? '',
        photoURL: photoUrl ?? '',
        role: roleFromStore(),
    }

    // Get navigation config based on role
    const headerItems = getHeaderConfig(user.role)

    /** Resolve route with userId placeholder */
    const resolveRoute = (route: string): string => {
        return route.replace(':userId', user.userId)
    }

    // Resolve active tab index dynamically from URL
    const getActiveTabIndex = (): number | false => {
        const index = headerItems.findIndex(item => {
            const resolved = resolveRoute(item.route)
            // Exact match or sub-route match (e.g. /app/mensajes/123)
            return currentPath === resolved || currentPath.startsWith(`${resolved}/`)
        })
        return index !== -1 ? index : false
    }
    const activeTabIndex = getActiveTabIndex()

    /** Handle tab navigation */
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
        const item = headerItems[newValue]
        if (item) {
            navigate(resolveRoute(item.route))
        }
    }

    return (
        <AppBar
            component="div"
            color="primary"
            position="static"
            elevation={0}
            sx={{
                zIndex: 0,
                backgroundColor: 'var(--background-main-green-color, #4caf50)',
                width: '100%',
            }}
        >
            <Toolbar
                variant="dense"
                sx={{
                    p: { xs: '0 8px', md: '0 16px' },
                    minHeight: { xs: 48, md: 54 },
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'nowrap',
                    width: '100%',
                    gap: 0.5,
                    overflow: 'hidden',
                }}
            >
                {/* Mobile Menu Toggle Button */}
                {isMobile && (
                    <IconButton
                        aria-label="open menu"
                        onClick={onMenuToggle}
                        sx={{
                            color: 'inherit',
                            flexShrink: 0,
                            p: 0.75,
                            mr: 0.5,
                        }}
                    >
                        <MenuIcon sx={{ fontSize: '28px' }} />
                    </IconButton>
                )}

                {/* Navigation Tabs (Single scrollable row) */}
                <Box sx={{ flex: 1, minWidth: 0, width: '100%', overflow: 'hidden' }}>
                    <Tabs
                        value={activeTabIndex}
                        onChange={handleTabChange}
                        textColor="inherit"
                        variant={isMobile ? 'scrollable' : 'standard'}
                        scrollButtons={isMobile ? 'auto' : false}
                        allowScrollButtonsMobile
                        sx={{
                            minHeight: 48,
                            '& .MuiTabs-scroller': {
                                overflowX: 'auto !important',
                                scrollbarWidth: 'none',
                                '&::-webkit-scrollbar': { display: 'none' },
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#ffffff',
                                height: 3,
                                borderRadius: '3px 3px 0 0',
                            },
                        }}
                    >
                        {headerItems.map((item) => (
                            <Tab
                                key={item.id}
                                sx={{
                                    color: 'inherit',
                                    textDecoration: 'none',
                                    minHeight: 48,
                                    py: { xs: 0.5, md: 1 },
                                    px: { xs: 1.5, md: 2 },
                                    minWidth: { xs: 44, md: 'auto' },
                                    whiteSpace: 'nowrap',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    borderRadius: '8px 8px 0 0',
                                    transition: 'background-color 0.15s ease',
                                    '&:hover': {
                                        backgroundColor: 'var(--background-hover-green-color)',
                                        textDecoration: 'none',
                                        color: '#ffffff',
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        color: '#ffffff',
                                        textDecoration: 'none',
                                    },
                                }}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        {ICON_MAP[item.icon]}
                                        {!isMobile && <span>{item.label}</span>}
                                    </Box>
                                }
                                component={Link}
                                href={resolveRoute(item.route)}
                            />
                        ))}
                    </Tabs>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
