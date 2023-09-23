export { Header }

import React, { useState, useContext, useMemo, useEffect } from 'react'
import { Link } from '#R/Link'
import { auth } from '#@/firebase/firebaseClient'
import { SearchBar } from './SearchBar'
import '#@/assets/cssPrivateApp/header.css'
import { UserAuthContext } from '#@/providers/UserAuthProvider'
import { sharingInformationService } from '#@/services/sharing-information'
import useMediaQuery from '@mui/material/useMediaQuery'
import { theme } from '#@/app/components/theme.tsx'

import { NotificationBar } from './NotificationBar'
import { navigate } from 'vite-plugin-ssr/client/router'

import PropTypes from 'prop-types'
import AppBar from '@mui/material/AppBar'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Toolbar from '@mui/material/Toolbar'

import PersonIcon from '@mui/icons-material/Person'
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove'
import MessageIcon from '@mui/icons-material/Message'
import StarRateIcon from '@mui/icons-material/StarRate'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import WorkHistoryIcon from '@mui/icons-material/WorkHistory'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import LoyaltyIcon from '@mui/icons-material/Loyalty'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import StoreIcon from '@mui/icons-material/Store'

function Header(props) {
    const { currentUser, updateUser, updateMobileMenu } =
        useContext(UserAuthContext)
    const { onDrawerToggle } = props
    const isSmDown = useMediaQuery(theme.breakpoints.down('md'))
    const userAuth = useMemo(() => auth?.currentUser, [])
    const [isLoaded, setIsLoaded] = useState(false)
    const [tab, setTab] = useState(0)
    const [isAuth, setIsAuth] = useState(currentUser.isAuth)
    const [rolAuth, setRolAuth] = useState(currentUser.rol)
    const [userAuthInfo, setUserAuthInfo] = useState({
        userId: currentUser.userId || '', // Este es el id de la cuenta de Auth
        userPhotoUrl: userAuth?.photoURL || '',
        userName: currentUser.displayName || '',
    })

    useEffect(() => {
        // Perform localStorage action
        const localRole = localStorage.getItem('role')
        const selectRole = parseInt(JSON.parse(localRole))
        setRolAuth(selectRole)
    }, [])

    const [isOpen, setIsOpen] = useState(false)

    const handleOpenMenu = () => {
        setIsOpen(!isOpen)
        updateMobileMenu({
            isOpen,
        })
    }

    const perfilRoute = `/app/perfil/${userAuthInfo.userId}`

    useEffect(() => {
        if ( !rolAuth ){ 
            console.log('rolAuth', rolAuth) 
            setIsAuth(false) 
        }
        if (!isLoaded) {
            const userData = sharingInformationService.getSubject()
            userData.subscribe((data) => {
                if (data) {
                    const { currentUser, authUser } = data
                    console.log('Header', currentUser, authUser)
                    if (authUser) {
                        // currentUser ||
                        const { uid, displayName, photoURL } = authUser
                        setUserAuthInfo({
                            ...userAuthInfo,
                            userId: uid,
                            userPhotoUrl: photoURL,
                            userName: displayName,
                        })
                        updateUser({
                            displayName: displayName,
                            userId: uid,
                            isAuth: true,
                            updated: true,
                            rol: rolAuth,
                        })
                        setIsAuth(true)
                        setIsLoaded(true)
                    }
                } else {
                    console.log(
                        'No se encontro información relacionada con este usuario!'
                    )
                }
            })
        }
    }, [userAuthInfo, updateUser, isLoaded, rolAuth])

    const handleNav = (route, tab) => {
        console.log('handleHeaderNav', route, tab)
        setTab(tab)
        navigate(`${route}`)
    }

    const headerLinks = isAuth
        ? rolAuth === 2
            ? [
                  {
                      id: 'Ver tu perfil',
                      tab: 0,
                      icon: <PersonIcon className="ms-1" />,
                      route: perfilRoute,
                  },
                  {
                      id: 'Directorio de Requerimientos',
                      tab: 1,
                      icon: <DriveFileMoveIcon />,
                      route: '/app/directorio-requerimientos/',
                  },
                  {
                      id: 'Mensajes',
                      tab: 2,
                      icon: <MessageIcon className="ms-1" />,
                      route: '/app/mensajes',
                  },
                  {
                      id: 'Historial de servicio',
                      tab: 3,
                      icon: <WorkHistoryIcon className="ms-1" />,
                      route: '/app/historial-servicios',
                  },
                  {
                      id: 'Suscripciones',
                      tab: 4,
                      icon: <LoyaltyIcon className="ms-1" />,
                      route: '/app/suscripciones',
                  },
                  {
                      id: 'Certificaciones',
                      tab: 5,
                      icon: <HowToRegIcon className="ms-1" />,
                      route: '/app/certificaciones',
                  },
              ]
            : [
                  {
                      id: 'Portal de servicios',
                      icon: <StoreIcon />,
                      tab: 0,
                      route: '/app/portal-servicios/',
                  },
                  {
                      id: 'Mensajes',
                      tab: 1,
                      icon: <MessageIcon className="ms-1" />,
                      route: '/app/mensajes',
                  },
                  {
                      id: 'Historial de servicio',
                      tab: 2,
                      icon: <WorkHistoryIcon className="ms-1" />,
                      route: '/app/historial-servicios',
                  },
                  {
                      id: 'Suscripciones',
                      tab: 3,
                      icon: <LoyaltyIcon className="ms-1" />,
                      route: '/app/suscripciones',
                  },
                  {
                      id: 'Calificaciones',
                      tab: 4,
                      icon: <StarRateIcon className="ms-1" />,
                      route: '/app/calificaciones',
                  },
              ]
        : [
              {
                  id: 'Iniciar Sesión',
                  tab: 0,
                  icon: <LoginIcon className="ms-1" />,
                  route: '/ingreso',
              },
              {
                  id: 'Registrarse',
                  tab: 1,
                  icon: <PersonAddIcon className="ms-1" />,
                  route: '/registro',
              },
          ]

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
                        {isSmDown && (
                            <Grid item xs style={{ maxWidth: '50px' }}>
                                <IconButton
                                    aria-label="mobile-more"
                                    className="mobile-app-menu"
                                    onClick={handleOpenMenu}
                                >
                                    <MenuIcon sx={{ fontSize: '30px' }} />
                                </IconButton>
                            </Grid>
                        )}
                        <Grid item xs style={{ maxWidth: '330px' }}>
                            <SearchBar></SearchBar>
                        </Grid>
                        <Grid item xs>
                            <Tabs
                                value={tab}
                                textColor="inherit"
                                // style={{ 'overflow-x': 'auto' }}
                            >
                                {headerLinks.map(({ id, tab, icon, route }) => (
                                    <Tab
                                        key={id}
                                        label={
                                            <>
                                                {icon}
                                                {id}
                                            </>
                                        }
                                        component={Link}
                                        href={route}
                                        onClick={() => handleNav(route, tab)}
                                    />
                                ))}
                            </Tabs>
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
