import * as React from 'react'
import { NavLink, useNavigate, Redirect } from 'react-router-dom'
import { auth } from '../../firebase/firebaseClient'
import SearchBar from './SearchBar'

//imagenes
import Avatar1 from '../../../public/assets/img/CategoriasPopulares.png'

import PropTypes from 'prop-types'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import HelpIcon from '@mui/icons-material/Help'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import MenuIcon from '@mui/icons-material/Menu'
import Badge from '@mui/material/Badge'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

const lightColor = 'rgba(255, 255, 255, 0.7)'

function Header(props) {
    const { onDrawerToggle } = props
    const user = auth.currentUser || {}
    const userPhotoUrl = user.photoURL || ''
    const navigate = useNavigate()
    const handleHelp = () => {
        navigate('/ayuda-pqrs')
    }
    return (
        <React.Fragment>
            <AppBar color="primary" position="sticky" elevation={0}>
                <Toolbar>
                    <Grid container spacing={1} alignItems="center">
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
                        <Grid item xs />
                        <Grid item>
                            <Link
                                href="/"
                                variant="body2"
                                sx={{
                                    textDecoration: 'none',
                                    color: lightColor,
                                    '&:hover': {
                                        color: 'common.white',
                                    },
                                }}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                Go to docs
                            </Link>
                        </Grid>
                        <Grid item>
                            <Tooltip title="Alerts • No alerts">
                                <IconButton color="inherit">
                                    <Badge badgeContent={17} color="error">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <IconButton color="inherit" sx={{ p: 0.5 }}>
                                <Avatar src={userPhotoUrl} alt="My Avatar" />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <AppBar
                component="div"
                color="primary"
                position="static"
                elevation={0}
                sx={{ zIndex: 0 }}
            >
                <Toolbar>
                    <Grid container alignItems="center" spacing={1}>
                        <Grid item xs>
                            <Typography
                                color="inherit"
                                variant="h5"
                                component="h1"
                            >
                                <SearchBar></SearchBar>
                            </Typography>
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
                </Toolbar>
            </AppBar>
            <AppBar
                component="div"
                position="static"
                elevation={0}
                sx={{ zIndex: 0 }}
            >
                <Tabs value={0} textColor="inherit">
                    <Tab
                        label="Ver tu perfil"
                        component={NavLink}
                        to="perfil"
                    />
                    <Tab
                        label="Calificaciones"
                        component={NavLink}
                        to="calificaciones"
                    />
                    <Tab label="Mensajes" component={NavLink} to="mensajes" />
                    <Tab
                        label="Historial de servicio"
                        component={NavLink}
                        to="historial-servicios"
                    />
                    <Tab
                        label="Certificaciones"
                        component={NavLink}
                        to="certificaciones"
                    />
                </Tabs>
            </AppBar>
        </React.Fragment>
    )
}

Header.propTypes = {
    onDrawerToggle: PropTypes.func.isRequired,
}

export default Header
