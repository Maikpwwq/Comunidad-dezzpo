import React from 'react'
import {
    Box,
    Toolbar,
    Avatar,
    Typography,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupIcon from '@mui/icons-material/Group'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import NotificationsIcon from '@mui/icons-material/Notifications'
import ArticleIcon from '@mui/icons-material/Article'

import { ADMIN_SIDEBAR } from '@components/layout/navigation.config'
import { navigate } from 'vike/client/router'
import { useUserStore } from '@stores/userStore'

/* ── Brand palette ─────────────────────────────────────────────── */
export const BRAND = {
    teal: 'var(--brand-teal)',
    tealDark: 'var(--brand-teal-dark)',
    tealDeep: 'var(--brand-teal-deep)',
    tealLight: 'var(--primary-blue-light-color)',
    sidebarBg: 'linear-gradient(180deg, var(--brand-teal-dark) 0%, var(--brand-teal-deep) 100%)',
    appBarBg: 'var(--brand-teal)',
    surface: 'var(--admin-surface)',
    selectedBg: 'rgba(30, 199, 230, 0.15)',
    selectedColor: 'var(--primary-blue-light-color)',
    hoverBg: 'rgba(255, 255, 255, 0.08)',
}

export const DRAWER_WIDTH = 260

const ICON_MAP: Record<string, React.ReactElement> = {
    DashboardIcon: <DashboardIcon />,
    GroupIcon: <GroupIcon />,
    VerifiedUserIcon: <VerifiedUserIcon />,
    HowToRegIcon: <HowToRegIcon />,
    ReceiptLongIcon: <ReceiptLongIcon />,
    AssignmentIcon: <AssignmentIcon />,
    CardMembershipIcon: <CardMembershipIcon />,
    NotificationsIcon: <NotificationsIcon />,
    ArticleIcon: <ArticleIcon />,
}


interface AdminSidebarProps {
    onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
    const userId = useUserStore((state) => state.userId)
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

    return (
        <Box
            sx={{
                width: DRAWER_WIDTH,
                height: '100%',
                background: BRAND.sidebarBg,
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Logo Header */}
            <Toolbar
                sx={{
                    px: 2.5,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    minHeight: '70px !important',
                }}
            >
                <Avatar
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        width: 40,
                        height: 40,
                    }}
                >
                    <AdminPanelSettingsIcon />
                </Avatar>
                <Box>
                    <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
                        Panel de
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={800} color={BRAND.tealLight} lineHeight={1.2}>
                        Administración
                    </Typography>
                </Box>
            </Toolbar>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

            {/* Navigation items */}
            <List sx={{ px: 1.5, py: 1.5, flexGrow: 1 }}>
                {ADMIN_SIDEBAR.items.map((item) => {
                    const isSelected = currentPath.startsWith(item.route)
                    return (
                        <ListItemButton
                            key={item.id}
                            onClick={() => {
                                navigate(item.route)
                                onCloseMobile?.()
                            }}
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                bgcolor: isSelected ? BRAND.selectedBg : 'transparent',
                                color: isSelected ? BRAND.selectedColor : 'rgba(255,255,255,0.75)',
                                '&:hover': {
                                    bgcolor: isSelected ? BRAND.selectedBg : BRAND.hoverBg,
                                    color: '#ffffff',
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 40,
                                    color: isSelected ? BRAND.selectedColor : 'inherit',
                                }}
                            >
                                {ICON_MAP[item.icon]}
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
                    onClick={() => {
                        if (userId) {
                            navigate(`/app/ajustes/${userId}`)
                        } else {
                            navigate('/app/portal-servicios')
                        }
                    }}
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
}
