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

import PersonIcon from '@mui/icons-material/Person'
import MessageIcon from '@mui/icons-material/Message'
import StarRateIcon from '@mui/icons-material/StarRate'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import WorkHistoryIcon from '@mui/icons-material/WorkHistory'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

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
                                        label={<><PersonIcon  className="ms-1"/>Ver tu perfil</>} 
                                        component={Link}
                                        href={perfilRoute}
                                        onClick={() => setTab(0)}
                                    />
                                    <Tab
                                        label={<><StarRateIcon  className="ms-1"/>Calificaciones</>}
                                        component={Link}
                                        href="calificaciones"
                                        onClick={() => setTab(1)}
                                    />
                                    <Tab
                                        label={<><MessageIcon  className="ms-1"/>Mensajes</>}
                                        component={Link}
                                        href="mensajes"
                                        onClick={() => setTab(2)}
                                    />
                                    <Tab
                                        label={<><WorkHistoryIcon  className="ms-1"/>Historial de servicio</>}
                                        component={Link}
                                        href="historial-servicios"
                                        onClick={() => setTab(3)}
                                    />
                                    <Tab
                                        label={<><HowToRegIcon  className="ms-1"/>Certificaciones</>}
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
                                            label={<><LoginIcon  className="ms-1"/>Iniciar Sesión</>}
                                            // component={Link}
                                            // href={}
                                            onClick={login}
                                        />
                                         <Tab
                                            label={<><PersonAddIcon  className="ms-1"/>Registrarse</>}
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
