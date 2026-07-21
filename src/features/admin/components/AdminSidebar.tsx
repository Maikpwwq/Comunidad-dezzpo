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

import { ADMIN_SIDEBAR } from '@components/layout/navigation.config'
import { navigate } from 'vike/client/router'

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
}


interface AdminSidebarProps {
    onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

    return (
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
                        Panel de Administración
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        Centro de Control
                    </Typography>
                </Box>
            </Toolbar>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

            {/* Navigation */}
            <List sx={{ px: 1.5, pt: 2, flex: 1 }}>
                {ADMIN_SIDEBAR.items.map((item) => {
                    const isSelected = currentPath === item.route
                    return (
                        <ListItemButton
                            key={item.id}
                            selected={isSelected}
                            onClick={() => {
                                navigate(item.route)
                                onCloseMobile?.()
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
}
