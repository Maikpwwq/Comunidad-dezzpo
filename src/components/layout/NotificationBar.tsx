/**
 * NotificationBar Component
 *
 * App header with logo, notifications, user avatar, and help.
 * Migrated from src/app/components/NotificationBar.jsx
 */

import React from 'react'
import { navigate } from 'vike/client/router'
import Link from '@hooks/Link'
import { auth } from '@services/firebase'

import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'

import MenuIcon from '@mui/icons-material/Menu'
import HelpIcon from '@mui/icons-material/Help'
import NotificationsIcon from '@mui/icons-material/Notifications'

import LogoMenuComunidadDezzpo from '@assets/img/IsologoHeader.png'
import '@assets/cssPrivateApp/header.css'

const LIGHT_COLOR = 'rgba(255, 255, 255, 0.7)'

export interface NotificationBarProps {
    /** Callback to toggle drawer on mobile */
    onDrawerToggle: () => void
}

export function NotificationBar({ onDrawerToggle }: NotificationBarProps): React.ReactElement {
    // Use Firebase auth directly (Zustand migration pending)
    const user = auth?.currentUser
    const userPhotoUrl = user?.photoURL || ''

    const handleHelp = () => {
        navigate('/ayuda-pqrs')
    }

    const handleShowNotifications = () => {
        // TODO: Implement notifications panel
    }

    return (
        <AppBar color="primary" position="sticky" elevation={0}>
            <Toolbar
                sx={{
                    background: '#e9ebe6',
                    height: '80px',
                    color: 'black',
                }}
            >
                {user?.uid ? (
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

                        {/* Notifications */}
                        <Grid item sx={{ display: { sm: 'block', xs: 'none' } }}>
                            <Tooltip title="Alerts • No alerts">
                                <IconButton color="inherit" onClick={handleShowNotifications}>
                                    <Badge badgeContent={17} color="error">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                        </Grid>

                        {/* User avatar */}
                        <Grid item sx={{ display: { sm: 'block', xs: 'none' } }}>
                            <IconButton color="inherit" sx={{ p: 0.5 }}>
                                <Avatar src={userPhotoUrl} alt="My Avatar" />
                            </IconButton>
                        </Grid>

                        {/* Web setup button */}
                        <Grid item>
                            <Button
                                sx={{ borderColor: LIGHT_COLOR }}
                                variant="outlined"
                                color="inherit"
                                size="small"
                            >
                                Web setup
                            </Button>
                        </Grid>

                        {/* Help */}
                        <Grid item>
                            <Tooltip title="Help">
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
        </AppBar>
    )
}

export default NotificationBar
