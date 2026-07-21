/**
 * NotificationBar Component
 *
 * App header with logo, notifications, user avatar, and help.
 * Migrated from src/app/components/NotificationBar.jsx
 */

import React, { useState, useEffect } from 'react'
import { navigate } from 'vike/client/router'
import Link from '@hooks/Link'
import { useUserStore } from '@stores/userStore'
import { useNotificationStore } from '@stores/useNotificationStore'
import { subscribeUserNotifications } from '@services/notificationService'

import {
    AppBar,
    Avatar,
    Button,
    Grid,
    Badge,
    IconButton,
    Toolbar,
    Tooltip,
    Popover,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'
import HelpIcon from '@mui/icons-material/Help'
import NotificationsIcon from '@mui/icons-material/Notifications'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import DoneAllIcon from '@mui/icons-material/DoneAll'

import LogoMenuComunidadDezzpo from '@assets/img/IsologoHeader.png'

const LIGHT_COLOR = 'rgba(255, 255, 255, 0.7)'

export interface NotificationBarProps {
    /** Callback to toggle drawer on mobile */
    onDrawerToggle: () => void
}

export function NotificationBar({ onDrawerToggle }: NotificationBarProps): React.ReactElement {
    // Use Zustand stores (SSR-safe atomic selectors)
    const currentUserId = useUserStore((state) => state.userId)
    const userPhotoUrl = useUserStore((state) => state.photoUrl) || ''

    const unreadCount = useNotificationStore((state) => state.unreadCount)
    const notifications = useNotificationStore((state) => state.notifications)
    const setNotifications = useNotificationStore((state) => state.setNotifications)
    const markRead = useNotificationStore((state) => state.markRead)
    const markAllRead = useNotificationStore((state) => state.markAllRead)

    // Popover anchor state
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

    // Subscribe to real-time notifications
    useEffect(() => {
        if (!currentUserId) return
        const unsubscribe = subscribeUserNotifications(currentUserId, (list) => {
            setNotifications(list)
        })
        return () => unsubscribe()
    }, [currentUserId, setNotifications])

    const handleHelp = () => {
        navigate('/ayuda-pqrs')
    }

    const handleOpenNotifications = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClosePopover = () => {
        setAnchorEl(null)
    }

    const handleNotificationClick = async (notifId?: string, actionUrl?: string) => {
        if (notifId) {
            await markRead(notifId)
        }
        handleClosePopover()
        if (actionUrl) {
            navigate(actionUrl)
        }
    }

    const handleViewAll = () => {
        handleClosePopover()
        navigate('/app/notificaciones')
    }

    const popoverOpen = Boolean(anchorEl)
    const recentNotifs = notifications.slice(0, 5)

    return (
        <AppBar color="primary" position="sticky" elevation={0}>
            <Toolbar
                sx={{
                    background: '#e9ebe6',
                    height: '80px',
                    color: 'black',
                }}
            >
                {currentUserId ? (
                    <Grid
                        container
                        spacing={1}
                        alignItems="center"
                        sx={{ justifyContent: 'center' }}
                    >
                        {/* Mobile menu button */}
                        <Grid sx={{ display: { sm: 'none', xs: 'block' } }} item>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={onDrawerToggle}
                                edge="start"
                            >
                                <MenuIcon />
                            </IconButton>
                        </Grid>

                        {/* Logo */}
                        <Grid item>
                            <Link href="/">
                                <img
                                    src={LogoMenuComunidadDezzpo}
                                    alt="Logo Comunidad Dezzpo"
                                    style={{ padding: '3px 10px' }}
                                    height="55px"
                                    width="200px"
                                />
                            </Link>
                        </Grid>

                        {/* Spacer */}
                        <Grid item xs />

                        {/* Documentation link */}
                        <Grid item sx={{ display: { sm: 'block', xs: 'none' } }}>
                            <Link
                                href="/legal/"
                                style={{
                                    textDecoration: 'none',
                                    color: 'black',
                                }}
                            >
                                Documentación
                            </Link>
                        </Grid>

                        {/* Notifications Bell */}
                        <Grid item sx={{ display: { sm: 'block', xs: 'none' } }}>
                            <Tooltip title={unreadCount > 0 ? `${unreadCount} notificaciones sin leer` : 'Notificaciones'}>
                                <IconButton color="inherit" onClick={handleOpenNotifications}>
                                    <Badge badgeContent={unreadCount} color="error">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                        </Grid>

                        {/* User avatar */}
                        <Grid item sx={{ display: { sm: 'block', xs: 'none' } }}>
                            <Link href={`/app/perfil/${currentUserId}`}>
                                <IconButton color="inherit" sx={{ p: 0.5 }}>
                                    <Avatar src={userPhotoUrl} alt="My Avatar" />
                                </IconButton>
                            </Link>
                        </Grid>

                        {/* Help */}
                        <Grid item>
                            <Tooltip title="Ayuda">
                                <IconButton color="inherit" onClick={handleHelp}>
                                    <HelpIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                ) : (
                    <Grid
                        container
                        spacing={1}
                        alignItems="center"
                        sx={{ justifyContent: 'center' }}
                    >
                        <Grid item>
                            <Link href="/">
                                <img
                                    src={LogoMenuComunidadDezzpo}
                                    alt="Logo Comunidad Dezzpo"
                                    style={{ padding: '3px 10px' }}
                                    height="55px"
                                    width="200px"
                                />
                            </Link>
                        </Grid>
                    </Grid>
                )}
            </Toolbar>

            {/* Notifications Quick Preview Popover */}
            <Popover
                open={popoverOpen}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: { width: 340, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', mt: 1 },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                        Notificaciones
                    </Typography>
                    {unreadCount > 0 && currentUserId && (
                        <Button
                            size="small"
                            startIcon={<DoneAllIcon fontSize="small" />}
                            onClick={() => markAllRead(currentUserId)}
                            sx={{ fontSize: '0.75rem' }}
                        >
                            Marcar leídas
                        </Button>
                    )}
                </Box>
                <Divider />

                {recentNotifs.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                        <NotificationsNoneIcon sx={{ fontSize: 40, opacity: 0.5, mb: 1 }} />
                        <Typography variant="body2">No tienes notificaciones recientes.</Typography>
                    </Box>
                ) : (
                    <List disablePadding>
                        {recentNotifs.map((item, idx) => (
                            <React.Fragment key={item.notificationId || idx}>
                                <ListItem
                                    button
                                    onClick={() => handleNotificationClick(item.notificationId, item.actionUrl)}
                                    sx={{
                                        bgcolor: item.isRead ? 'transparent' : 'action.hover',
                                        '&:hover': { bgcolor: 'action.selected' },
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" fontWeight={item.isRead ? 400 : 700}>
                                                {item.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="caption" color="text.secondary" noWrap display="block">
                                                {item.body}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                {idx < recentNotifs.length - 1 && <Divider component="li" />}
                            </React.Fragment>
                        ))}
                    </List>
                )}

                <Divider />
                <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Button fullWidth size="small" onClick={handleViewAll} sx={{ fontWeight: 600 }}>
                        Ver todas las notificaciones
                    </Button>
                </Box>
            </Popover>
        </AppBar>
    )
}

export default NotificationBar
