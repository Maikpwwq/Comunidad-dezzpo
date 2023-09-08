export { Header }

import React, { useState, useMemo } from 'react'
import { Link } from '#R/Link'
import { auth } from '#@/firebase/firebaseClient'
import { SearchBar } from './SearchBar'
import '#@/assets/cssPrivateApp/header.css'

import { NotificationBar } from './NotificationBar'
import { navigate } from 'vite-plugin-ssr/client/router'

import PropTypes from 'prop-types'
import AppBar from '@mui/material/AppBar'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Toolbar from '@mui/material/Toolbar'

function Header(props) {
    const { onDrawerToggle } = props
    const userAuth = useMemo(() => auth?.currentUser , [] )
    console.log("Navigator user", userAuth)
    const [ isAuth, setIsAuth ] = React.useState(userAuth ? true : false)
    const userId = userAuth?.uid

    const perfilRoute = `perfil/${userId}`
    const [tab, setTab] = useState(0)

    const signup = () => {
        navigate('/registro')
    }

    const login = () => {
        navigate('/ingreso')
    }

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
                            {isAuth ? (
                                <Tabs
                                    value={tab}
                                    textColor="inherit"
                                    // style={{ 'overflow-x': 'auto' }}
                                >
                                    <Tab
                                        label="Ver tu perfil"
                                        component={Link}
                                        href={perfilRoute}
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
                                <>
                                    {/* TODO implement nav to login */}
                                    <Tabs
                                        value={tab}
                                        textColor="inherit"
                                        // style={{ 'overflow-x': 'auto' }}
                                    >
                                        <Tab
                                            label="Iniciar Sesión"
                                            // component={Link}
                                            // href={}
                                            onClick={login}
                                        />
                                         <Tab
                                            label="Registrarse"
                                            // component={Link}
                                            // href={}
                                            onClick={signup}
                                        />
                                    </Tabs>
                                </>
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
