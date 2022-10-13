import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { auth } from '../../firebase/firebaseClient'
import SearchBar from './SearchBar'
import '../../../public/assets/cssPrivateApp/header.css'

import NotificationBar from './NotificationBar'

import PropTypes from 'prop-types'
import AppBar from '@mui/material/AppBar'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Toolbar from '@mui/material/Toolbar'

function Header(props) {
    const { onDrawerToggle } = props
    const user = auth.currentUser || {}
    const [tab, setTab] = useState(0)

    return (
        <>
            {/* <NotificationBar onDrawerToggle={onDrawerToggle} /> */}
            <AppBar
                component="div"
                color="primary"
                position="static"
                elevation={0}
                sx={{ zIndex: 0 }}
            >
                <Toolbar className="p-0">
                    <Grid
                        container
                        className="p-2 pb-0"
                        alignItems="center"
                        spacing={1}
                    >
                        <Grid item xs style={{ maxWidth: '330px' }}>
                            <SearchBar></SearchBar>
                        </Grid>
                        <Grid item xs>
                            {user.uid ? (
                                <Tabs
                                    value={tab}
                                    textColor="inherit"
                                    // style={{ 'overflow-x': 'auto' }}
                                >
                                    <Tab
                                        label="Ver tu perfil"
                                        component={NavLink}
                                        to="perfil"
                                        onClick={() => setTab(0)}
                                    />
                                    <Tab
                                        label="Calificaciones"
                                        component={NavLink}
                                        to="calificaciones"
                                        onClick={() => setTab(1)}
                                    />
                                    <Tab
                                        label="Mensajes"
                                        component={NavLink}
                                        to="mensajes"
                                        onClick={() => setTab(2)}
                                    />
                                    <Tab
                                        label="Historial de servicio"
                                        component={NavLink}
                                        to="historial-servicios"
                                        onClick={() => setTab(3)}
                                    />
                                    <Tab
                                        label="Certificaciones"
                                        component={NavLink}
                                        to="certificaciones"
                                        onClick={() => setTab(4)}
                                    />
                                </Tabs>
                            ) : (
                                <></>
                            )}
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </>
    )
}

Header.propTypes = {
    onDrawerToggle: PropTypes.func.isRequired,
}

export default Header
