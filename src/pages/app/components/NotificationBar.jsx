import React from 'react'
import { Link } from '#@/pages/app/renderer/Link'
import { navigate } from 'vite-plugin-ssr/client/router'
import { auth } from '../../../firebase/firebaseClient'
import '#@/assets/cssPrivateApp/header.css'

//imagenes
import LogoMenuComunidadDezzpo from '#@/assets/img/IsologoHeader.png'

import PropTypes from 'prop-types'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import HelpIcon from '@mui/icons-material/Help'
import IconButton from '@mui/material/IconButton'
// import Link from '@mui/material/Link'
import MenuIcon from '@mui/icons-material/Menu'
import Badge from '@mui/material/Badge'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

const lightColor = 'rgba(255, 255, 255, 0.7)'

export { NotificationBar }

function NotificationBar(props) {
    const { onDrawerToggle } = props
    const user = auth.currentUser || {}
    const userPhotoUrl = user.photoURL || ''
    // const navigate = useNavigate()

    const handleHelp = () => {
        navigate('/ayuda-pqrs')
    }
    const handleShowNotifications = () => {}
    // console.log(user)
    return (
        <>
            <AppBar color="primary" position="sticky" elevation={0}>
                <Toolbar
                    style={{
                        background: '#e9ebe6',
                        height: '80px',
                        color: 'black',
                    }}
                >
                    {user.uid ? (
                        <Grid
                            container
                            spacing={1}
                            alignItems="center"
                            style={{ justifyContent: 'center' }}
                        >
                            <Grid
                                sx={{ display: { sm: 'none', xs: 'block' } }}
                                item
                            >
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={onDrawerToggle}
                                    edge="start"
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Grid>
                            <Grid sx={{}} item>
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
                            <Grid item xs />
                            <Grid
                                item
                                sx={{ display: { sm: 'block', xs: 'none' } }}
                            >
                                <Link
                                    href="/legal/"
                                    variant="body2"
                                    sx={{
                                        textDecoration: 'none',
                                        color: 'common.black',
                                        '&:hover': {
                                            color: 'common.gray',
                                        },
                                    }}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    Documentación
                                </Link>
                            </Grid>
                            <Grid
                                item
                                sx={{ display: { sm: 'block', xs: 'none' } }}
                            >
                                <Tooltip title="Alerts • No alerts">
                                    <IconButton color="inherit">
                                        <Badge badgeContent={17} color="error">
                                            <NotificationsIcon
                                                onClick={
                                                    handleShowNotifications
                                                }
                                            />
                                        </Badge>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid
                                item
                                sx={{ display: { sm: 'block', xs: 'none' } }}
                            >
                                <IconButton color="inherit" sx={{ p: 0.5 }}>
                                    <Avatar
                                        src={userPhotoUrl}
                                        alt="My Avatar"
                                    />
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <Button
                                    sx={{ borderColor: lightColor }}
                                    variant="outlined"
                                    color="inherit"
                                    size="small"
                                >
                                    Web setup
                                </Button>
                            </Grid>
                            <Grid item>
                                <Tooltip title="Help">
                                    <IconButton
                                        color="inherit"
                                        onClick={handleHelp}
                                    >
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
                            style={{ justifyContent: 'center' }}
                        >
                            <Grid sx={{}} item>
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
        </>
    )
}

NotificationBar.propTypes = {
    onDrawerToggle: PropTypes.func.isRequired,
}
