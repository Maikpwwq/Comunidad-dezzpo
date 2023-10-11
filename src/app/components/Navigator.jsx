import React, { useEffect, useContext, useState, useMemo } from 'react'
import { Link } from '#R/Link'
import { navigate } from 'vite-plugin-ssr/client/router'
import { auth } from '#@/firebase/firebaseClient'
import { signOut } from 'firebase/auth'
import { usePageContext } from '#R/usePageContext'
import { sharingInformationService } from '#@/services/sharing-information'
import { UserAuthContext } from '#@/providers/UserAuthProvider'

// import categories from '#@/app/components/categories'

//imagenes
// import Avatar1 from '#@/assets/img/CategoriasPopulares.png'
import LogoMenuComunidadDezzpo from '/assets/img/logo/IsoLogo-Dezzpo-Verde.png'

import { SnackBarAlert } from '#@/index/components/SnackBarAlert'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import StoreIcon from '@mui/icons-material/Store'
import PersonIcon from '@mui/icons-material/Person'
// import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove'
import NotificationsIcon from '@mui/icons-material/Notifications'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark'
import TuneIcon from '@mui/icons-material/Tune'
import PaymentIcon from '@mui/icons-material/Payment'
import LockResetIcon from '@mui/icons-material/LockReset'
import LogoutIcon from '@mui/icons-material/Logout'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import LoyaltyIcon from '@mui/icons-material/Loyalty'
import HowToRegIcon from '@mui/icons-material/HowToReg'

// import HomeIcon from '@mui/icons-material/Home'
// import PeopleIcon from '@mui/icons-material/People'
// import DnsRoundedIcon from '@mui/icons-material/DnsRounded'
// import PublicIcon from '@mui/icons-material/Public'
// import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet'
// import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent'
// import TimerIcon from '@mui/icons-material/Timer'
// import SettingsIcon from '@mui/icons-material/Settings'
// import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup'

// const match = useMatch('/')
// console.log(match)

const item = {
    py: '2px',
    px: 3,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover, &:focus': {
        bgcolor: '#bababa', // rgba(255, 255, 255, 0.08)
    },
}

const itemCategory = {
    boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
    py: 1.5,
    px: 3,
}

export { Navigator }

function Navigator(props) {
    const { currentUser, updateUser, clearAuthUser } =
        useContext(UserAuthContext)
    const pageContext = usePageContext()
    const urlPath = pageContext.urlPathname
    const activeUrl = urlPath.slice(1).split('/')
    // console.log("Navigator urlPath", activeUrl[1])
    const { ...other } = props
    const userAuth = useMemo(() => auth?.currentUser, [])
    const [isLoaded, setIsLoaded] = useState(false)
    const [open, setOpen] = useState(false)
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
                    // console.log('Navigation', currentUser, authUser)
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

    // const navigate = useNavigate()
    const handleSignout = () => {
        signOut(auth)
            .then(() => {
                handleClick()
                // console.log('Cerro su sesión de manera exitosa!')
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleClick = () => {
        setOpen(true)
    }

    const handleNav = (route) => {
        console.log('handleNav', route)
        navigate(`/app/${route}`)
    }

    const handleClose = (event, reason) => {
        console.log(reason, event)
        if (reason === 'clickaway') {
            return
        } else {
            clearAuthUser()
            navigate('/')
            setOpen(false)
        }
    }

    const categories = isAuth
        ? rolAuth === 2
            ? [
                  {
                      id: 'Inicio',
                      children: [
                          {
                              id: 'Mi cuenta',
                              icon: <PersonIcon />,
                              route: `perfil/${userAuthInfo.userId}`,
                              active: 'perfil' === activeUrl[1] ? true : false,
                          },
                          {
                              id: 'Portal de servicios',
                              icon: <StoreIcon />,
                              route: 'portal-servicios/',
                              active:
                                  'portal-servicios' === activeUrl[1]
                                      ? true
                                      : false,
                          },
                          {
                              id: 'Directorio de Requerimientos',
                              icon: <DriveFileMoveIcon />,
                              route: 'directorio-requerimientos/',
                              active:
                                  'directorio-requerimientos' === activeUrl[1]
                                      ? true
                                      : false,
                          },
                          {
                              id: 'Notificaciones',
                              icon: <NotificationsIcon />,
                              route: 'notificaciones',
                              active:
                                  'notificaciones' === activeUrl[1]
                                      ? true
                                      : false,
                          },
                          {
                              id: 'Suscripciones',
                              icon: <LoyaltyIcon />,
                              route: 'suscripciones',
                              active:
                                  'suscripciones' === activeUrl[1]
                                      ? true
                                      : false,
                          },
                          {
                              id: 'Certificaciones',
                              icon: <HowToRegIcon />,
                              route: 'certificaciones',
                              active:
                                  'certificaciones' === activeUrl[1]
                                      ? true
                                      : false,
                          },
                          {
                              id: 'Biblioteca',
                              icon: <CollectionsBookmarkIcon />,
                              route: 'biblioteca',
                              active:
                                  'biblioteca' === activeUrl[1] ? true : false,
                          },
                          {
                              id: 'Invitar a un Amigo',
                              icon: <CardMembershipIcon />,
                              route: 'invitar-amigos',
                              active:
                                  'invitar-amigos' === activeUrl[1]
                                      ? true
                                      : false,
                          },
                          {
                              id: 'Ajustes',
                              icon: <ManageAccountsIcon />,
                              route: `ajustes/${userAuthInfo.userId}`,
                              active: 'ajustes' === activeUrl[1] ? true : false,
                          },
                      ],
                  },
                  {
                      id: 'Configuracion',
                      children: [
                          {
                              id: 'Privacidad',
                              icon: <TuneIcon />,
                              route: 'configuracion-privacidad',
                              active:
                                  'configuracion-privacidad' === activeUrl[1]
                                      ? true
                                      : false,
                          },
                          {
                              id: 'Formas de Pago',
                              icon: <PaymentIcon />,
                              route: 'formas-pago',
                              active:
                                  'formas-pago' === activeUrl[1] ? true : false,
                          },
                          {
                              id: 'Cambiar Clave',
                              icon: <LockResetIcon />,
                              route: 'cambiar-clave',
                              active:
                                  'cambiar-clave' === activeUrl[1]
                                      ? true
                                      : false,
                          },
                      ],
                  },
              ]
            : [
                  {
                      id: 'Inicio',
                      children: [
                          {
                              id: 'Mi cuenta',
                              icon: <PersonIcon />,
                              route: `perfil/${userAuthInfo.userId}`,
                              active: 'perfil' === activeUrl[1] ? true : false,
                          },
                          {
                              id: 'Portal de servicios',
                              icon: <StoreIcon />,
                              route: 'portal-servicios/',
                              active:
                                  'portal-servicios' === activeUrl[1]
                                      ? true
                                      : false,
                          },
                          {
                              id: 'Directorio de Requerimientos',
                              icon: <DriveFileMoveIcon />,
                              route: 'directorio-requerimientos/',
                              active:
                                  'directorio-requerimientos' === activeUrl[1]
                                      ? true
                                      : false,
                          },
                          {
                              id: 'Notificaciones',
                              icon: <NotificationsIcon />,
                              route: 'notificaciones',
                              active:
                                  'notificaciones' === activeUrl[1]
                                      ? true
                                      : false,
                          },
                          {
                              id: 'Suscripciones',
                              icon: <LoyaltyIcon />,
                              route: 'suscripciones',
                              active:
                                  'suscripciones' === activeUrl[1]
                                      ? true
                                      : false,
                          },
                          {
                              id: 'Biblioteca',
                              icon: <CollectionsBookmarkIcon />,
                              route: 'biblioteca',
                              active:
                                  'biblioteca' === activeUrl[1] ? true : false,
                          },
                          {
                              id: 'Invitar a un Amigo',
                              icon: <CardMembershipIcon />,
                              route: 'invitar-amigos',
                              active:
                                  'invitar-amigos' === activeUrl[1]
                                      ? true
                                      : false,
                          },
                          {
                              id: 'Ajustes',
                              icon: <ManageAccountsIcon />,
                              route: `ajustes/${userAuthInfo.userId}`,
                              active: 'ajustes' === activeUrl[1] ? true : false,
                          },
                      ],
                  },
                  {
                      id: 'Configuracion',
                      children: [
                          {
                              id: 'Privacidad',
                              icon: <TuneIcon />,
                              route: 'configuracion-privacidad',
                              active:
                                  'configuracion-privacidad' === activeUrl[1]
                                      ? true
                                      : false,
                          },
                          {
                              id: 'Formas de Pago',
                              icon: <PaymentIcon />,
                              route: 'formas-pago',
                              active:
                                  'formas-pago' === activeUrl[1] ? true : false,
                          },
                          {
                              id: 'Cambiar Clave',
                              icon: <LockResetIcon />,
                              route: 'cambiar-clave',
                              active:
                                  'cambiar-clave' === activeUrl[1]
                                      ? true
                                      : false,
                          },
                      ],
                  },
              ]
        : [
              {
                  id: 'Inicio',
                  children: [
                      {
                          id: 'Portal de servicios',
                          icon: <StoreIcon />,
                          route: 'portal-servicios',
                          active:
                              'portal-servicios' === activeUrl[1]
                                  ? true
                                  : false,
                      },
                      {
                          id: 'Directorio de Requerimientos',
                          icon: <DriveFileMoveIcon />,
                          route: 'directorio-requerimientos',
                          active:
                              'directorio-requerimientos' === activeUrl[1]
                                  ? true
                                  : false,
                      },
                      {
                          id: 'Suscripciones',
                          icon: <LoyaltyIcon />,
                          route: 'suscripciones',
                          active:
                              'suscripciones' === activeUrl[1] ? true : false,
                      },
                  ],
              },
          ]

    return (
        <Drawer open={true} variant="permanent" {...other}>
            <List disablePadding  style={{width: 'auto', maxWidth: '256px'}}>
                <ListItem
                    sx={{
                        ...item,
                        ...itemCategory,
                        fontSize: 22,
                        color: '#fff',
                    }}
                >
                    <Link href="/">
                        <img
                            src={LogoMenuComunidadDezzpo}
                            alt="Logo Comunidad Dezzpo"
                            style={{ padding: '3px 10px' }}
                            height="55px"
                            width="200px"
                        />
                    </Link>
                </ListItem>
                <ListItem sx={{ ...item, ...itemCategory }}>
                    <ListItemIcon>
                        <IconButton color="inherit" sx={{ p: 0.5 }}>
                            <Avatar
                                src={userAuthInfo.userPhotoUrl}
                                alt="My Avatar"
                            />
                        </IconButton>
                    </ListItemIcon>
                    <ListItemText>
                        Bienvenido {userAuthInfo.userName}!
                    </ListItemText>
                </ListItem>
                {categories.map(({ id, children }) => (
                    <Box key={id} sx={{ bgcolor: '#575856' }}>
                        {/* #101F33 */}
                        <ListItem sx={{ py: 2, px: 3 }}>
                            <ListItemText sx={{ color: '#fff' }}>
                                {id}
                            </ListItemText>
                        </ListItem>
                        {children.map(
                            ({ id: childId, icon, route, active }) => {
                                // const hrefRoute = route.split('/').splice(1, 1).toString
                                // console.log('navRoute', route)
                                return (
                                    <ListItem
                                        disablePadding
                                        button
                                        // activeClassName="Mui-selected"
                                        key={childId}
                                        // component={Link}
                                        // href={route}
                                        onClick={() => handleNav(route)}
                                        // exact
                                    >
                                        <ListItemButton
                                            className=""
                                            selected={active}
                                            sx={item}
                                        >
                                            <ListItemIcon
                                                style={{ color: '#00b0ab' }} // #009999
                                            >
                                                {icon}
                                            </ListItemIcon>
                                            <ListItemText>
                                                {childId}
                                            </ListItemText>
                                        </ListItemButton>
                                    </ListItem>
                                )
                            }
                        )}

                        <Divider sx={{ mt: 2 }} />
                        {open && (
                            <SnackBarAlert
                                message="Cerro su sesión de manera exitosa!"
                                onClose={handleClose}
                                severity="success" // success, error, warning, info, default
                                open={open}
                            />
                        )}
                    </Box>
                ))}
                {isAuth ? (
                    <ListItem
                        disablePadding
                        button
                        // activeClassName="Mui-selected"
                        key="Cerrar Sesion"
                        onClick={handleSignout}
                        // exact
                    >
                        <ListItemButton selected={false} sx={item}>
                            <ListItemIcon style={{ color: '#00b0ab' }}>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText>Cerrar Sesion</ListItemText>
                        </ListItemButton>
                    </ListItem>
                ) : (
                    <></>
                )}
            </List>
        </Drawer>
    )
}
