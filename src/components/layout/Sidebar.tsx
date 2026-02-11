/**
 * Sidebar Component
 *
 * App sidebar with role-based navigation.
 * Refactored from legacy Navigator.jsx (534 lines -> modular component).
 */

import React, { useMemo } from 'react'
import { navigate } from 'vike/client/router'
import { Link } from '@hooks'
import { useUserStore } from '@stores/userStore'
import { getSidebarConfig } from './navigation.config'
import type { UserRole } from './types'

// MUI Components
// MUI Components
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Divider,
    Avatar,
    IconButton
} from '@mui/material'

// MUI Icons
import PersonIcon from '@mui/icons-material/Person'
import StoreIcon from '@mui/icons-material/Store'
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LoyaltyIcon from '@mui/icons-material/Loyalty'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import TuneIcon from '@mui/icons-material/Tune'
import PaymentIcon from '@mui/icons-material/Payment'
import LockResetIcon from '@mui/icons-material/LockReset'
import LogoutIcon from '@mui/icons-material/Logout'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupIcon from '@mui/icons-material/Group'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'

// Branding
import LogoMenuComunidadDezzpo from '/assets/img/logo/IsoLogo-Dezzpo-Verde.png'

// Types
import type { SidebarProps } from './types'

/** Icon resolver - maps icon name strings to MUI components */
const ICON_MAP: Record<string, React.ReactNode> = {
    PersonIcon: <PersonIcon />,
    StoreIcon: <StoreIcon />,
    DriveFileMoveIcon: <DriveFileMoveIcon />,
    NotificationsIcon: <NotificationsIcon />,
    LoyaltyIcon: <LoyaltyIcon />,
    HowToRegIcon: <HowToRegIcon />,
    CollectionsBookmarkIcon: <CollectionsBookmarkIcon />,
    CardMembershipIcon: <CardMembershipIcon />,
    ManageAccountsIcon: <ManageAccountsIcon />,
    TuneIcon: <TuneIcon />,
    PaymentIcon: <PaymentIcon />,
    LockResetIcon: <LockResetIcon />,
    DashboardIcon: <DashboardIcon />,
    GroupIcon: <GroupIcon />,
    VerifiedUserIcon: <VerifiedUserIcon />,
}

/** Style tokens */
const styles = {
    item: {
        py: '2px',
        px: 3,
        color: 'rgba(255, 255, 255, 0.7)',
        '&:hover, &:focus': {
            bgcolor: 'var(--background-gray-color)',
        },
    },
    itemCategory: {
        boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
        py: 1.5,
        px: 3,
    },
    iconColor: '#00b0ab',
    sectionBg: '#575856',
}

function Sidebar({ open, onClose, userInfo, variant = 'permanent' }: SidebarProps): React.ReactElement {
    // Get user from Zustand store with selectors (flat state, not nested)
    const userId = useUserStore((state) => state.userId)
    const displayName = useUserStore((state) => state.displayName)
    const photoUrl = useUserStore((state) => state.photoUrl)
    const rol = useUserStore((state) => state.rol)
    const clearUser = useUserStore((state) => state.clearUser)

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

    // Read admin status from Zustand store (set by UserAuthProvider + persisted)
    const isAdmin = useUserStore((state) => state.isAdmin)

    // Get navigation config based on role + admin status
    const navSections = useMemo(
        () => getSidebarConfig(user.role, isAdmin),
        [user.role, isAdmin]
    )

    /** Resolve route with userId placeholder */
    const resolveRoute = (route: string): string => {
        return route.replace(':userId', user.userId)
    }

    /** Handle navigation */
    const handleNav = (route: string): void => {
        const resolvedRoute = resolveRoute(route)
        navigate(resolvedRoute)
    }

    /** Handle sign out */
    const handleSignOut = (): void => {
        clearUser()
        navigate('/')
    }

    return (
        <Drawer
            open={open}
            variant={variant}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: 256,
                    maxWidth: 256,
                },
            }}
        >
            <List disablePadding>
                {/* Logo */}
                <ListItem
                    sx={{
                        ...styles.item,
                        ...styles.itemCategory,
                        fontSize: 22,
                        color: '#fff',
                    }}
                >
                    <Link href="/">
                        <img
                            src={LogoMenuComunidadDezzpo}
                            alt="Logo Comunidad Dezzpo"
                            style={{ padding: '3px 10px' }}
                            height="55px"
                            width="200px"
                        />
                    </Link>
                </ListItem>

                {/* User Info */}
                {user.userId && (
                    <ListItem sx={{ flexDirection: 'row', ...styles.item, ...styles.itemCategory }}>
                        <ListItemIcon>
                            <IconButton color="inherit" sx={{ p: 0.5 }}>
                                <Avatar src={user.photoURL} alt={user.displayName} />
                            </IconButton>
                        </ListItemIcon>
                        <ListItemText
                            primary="Bienvenido"
                            secondary={`${user.displayName}!`}
                            secondaryTypographyProps={{ color: 'inherit' }}
                        />
                    </ListItem>
                )}

                {/* Navigation Sections */}
                {navSections.map((section) => (
                    <Box key={section.id} sx={{ bgcolor: styles.sectionBg }}>
                        <ListItem sx={{ py: 2, px: 3 }}>
                            <ListItemText sx={{ color: '#fff' }}>
                                {section.title}
                            </ListItemText>
                        </ListItem>

                        {section.items.map((item) => (
                            <ListItem
                                disablePadding
                                key={item.id}
                                onClick={() => handleNav(item.route)}
                            >
                                <ListItemButton sx={styles.item}>
                                    <ListItemIcon sx={{ color: styles.iconColor }}>
                                        {ICON_MAP[item.icon] ?? <PersonIcon />}
                                    </ListItemIcon>
                                    <ListItemText>{item.label}</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        ))}

                        <Divider sx={{ mt: 2 }} />
                    </Box>
                ))}

                {/* Sign Out Button */}
                {user.userId && (
                    <ListItem disablePadding onClick={handleSignOut}>
                        <ListItemButton sx={styles.item}>
                            <ListItemIcon sx={{ color: styles.iconColor }}>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText>Cerrar Sesión</ListItemText>
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </Drawer>
    )
}

export default Sidebar
