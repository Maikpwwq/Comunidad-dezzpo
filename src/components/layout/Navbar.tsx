/**
 * Navbar Component
 *
 * App header with search and role-based navigation tabs.
 * Refactored from legacy Header.jsx (271 lines -> modular component).
 */

import React, { useState, useMemo } from 'react'
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
    Grid,
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

// Types
import type { NavbarProps } from './types'

/** Icon resolver - maps icon name strings to MUI components */
const ICON_MAP: Record<string, React.ReactNode> = {
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
    const [activeTab, setActiveTab] = useState(0)

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
    const headerItems = useMemo(
        () => getHeaderConfig(user.role),
        [user.role]
    )

    /** Resolve route with userId placeholder */
    const resolveRoute = (route: string): string => {
        return route.replace(':userId', user.userId)
    }

    /** Handle tab navigation */
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
        setActiveTab(newValue)
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
            sx={{ zIndex: 0 }}
        >
            <Toolbar sx={{ p: 0 }}>
                <Grid
                    container
                    sx={{ p: 2, pb: 0 }}
                    alignItems="center"
                    spacing={1}
                >
                    {/* Mobile Menu + Search */}
                    <Grid
                        item
                        xs="auto"
                        sx={{
                            display: 'flex',
                            maxWidth: 'fit-content',
                            flexWrap: 'nowrap',
                        }}
                    >
                        {isMobile && (
                            <IconButton
                                aria-label="open menu"
                                onClick={onMenuToggle}
                                sx={{ color: 'inherit' }}
                            >
                                <MenuIcon sx={{ fontSize: '30px' }} />
                            </IconButton>
                        )}
                        {/* SearchBar will be added as separate component */}
                    </Grid>

                    {/* Navigation Tabs */}
                    <Grid item xs>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            textColor="inherit"
                            variant={isMobile ? 'scrollable' : 'standard'}
                            scrollButtons={isMobile ? 'auto' : false}
                        >
                            {headerItems.map((item) => (
                                <Tab
                                    key={item.id}
                                    label={
                                        <>
                                            {ICON_MAP[item.icon]}
                                            {!isMobile && item.label}
                                        </>
                                    }
                                    component={Link}
                                    href={resolveRoute(item.route)}
                                />
                            ))}
                        </Tabs>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
