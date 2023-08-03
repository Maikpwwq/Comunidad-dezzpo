import React, { useState } from 'react'
import { Link } from '#@/renderer/Link'
import { auth } from '#@/firebase/firebaseClient'
import SearchBar from '#@/pages/app/components/SearchBar'
import '#@/assets/cssPrivateApp/header.css'

// import NotificationBar from '#@/pages/app/components/NotificationBar'

import PropTypes from 'prop-types'
import AppBar from '@mui/material/AppBar'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Toolbar from '@mui/material/Toolbar'

export { Header }

function Header() {
    // const { onDrawerToggle } = props
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
                                        component={Link}
                                        href="perfil"
                                        onClick={() => setTab(0)}
                                    />
                                    <Tab
                                        label="Calificaciones"
                                        component={Link}
                                        href="calificaciones"
                                        onClick={() => setTab(1)}
                                    />
                                    <Tab
                                        label="Mensajes"
                                        component={Link}
                                        href="mensajes"
                                        onClick={() => setTab(2)}
                                    />
                                    <Tab
                                        label="Historial de servicio"
                                        component={Link}
                                        href="historial-servicios"
                                        onClick={() => setTab(3)}
                                    />
                                    <Tab
                                        label="Certificaciones"
                                        component={Link}
                                        href="certificaciones"
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
