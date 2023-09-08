import * as React from 'react'
import { Link } from '#R/Link'
import { navigate } from 'vite-plugin-ssr/client/router'
import { auth } from '#@/firebase/firebaseClient'
import { signOut } from 'firebase/auth'
import { usePageContext } from '#R/usePageContext'
import { sharingInformationService } from '#@/services/sharing-information'

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
import HomeIcon from '@mui/icons-material/Home'
import PeopleIcon from '@mui/icons-material/People'
import DnsRoundedIcon from '@mui/icons-material/DnsRounded'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PublicIcon from '@mui/icons-material/Public'
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet'
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent'
import TimerIcon from '@mui/icons-material/Timer'
import SettingsIcon from '@mui/icons-material/Settings'
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup'
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
    const pageContext = usePageContext()
    const urlPath = pageContext.urlPathname
    const activeUrl = urlPath.slice(1).split('/')
    // console.log("Navigator urlPath", activeUrl[1])
    const { ...other } = props
    const userAuth = React.useMemo(() => auth?.currentUser , [] )
    console.log("Navigator user", userAuth)

    const [ isAuth, setIsAuth ] = React.useState(userAuth ? true : false)

    // const userData = sharingInformationService.getSubject()
    // userData.subscribe((data) => {
    //     if (data) {
    //         console.log('perfilPage', data)
    //         const { currentUser, authUser } = data
    //         if (currentUser || authUser) {
    //             setIsAuth(true)
    //         } 
    //     } else {
    //         console.log(
    //             'No se encontro información relacionada con este usuario!'
    //         )
    //     }
    // })
    
    const userID = userAuth?.uid || '' // Este es el id de la cuenta de Auth
    const userPhotoUrl = userAuth?.photoURL || ''
    const userName = userAuth?.displayName || ''
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

    const [open, setOpen] = React.useState(false)

    const handleClick = () => {
        setOpen(true)
    }

    const handleClose = (event, reason) => {
        console.log(reason, event)
        if (reason === 'clickaway') {
            return
        } else {
            navigate('/')
            setOpen(false)
        }
    }

    const categories = isAuth
        ? [
              {
                  id: 'Inicio',
                  children: [
                      {
                          id: 'Mi cuenta',
                          icon: <PeopleIcon />,
                          route: `perfil/${userID}`,
                          active: 'perfil' === activeUrl[1] ? true : false,
                      },
                      {
                          id: 'Portal de servicios',
                          icon: <HomeIcon />,
                          route: 'portal-servicios/',
                          active:
                              'portal-servicios' === activeUrl[1]
                                  ? true
                                  : false,
                      },
                      {
                          id: 'Directorio de Requerimientos',
                          icon: <HomeIcon />,
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
                              'notificaciones' === activeUrl[1] ? true : false,
                      },
                      {
                          id: 'Suscripciones',
                          icon: <TimerIcon />,
                          route: 'suscripciones',
                          active:
                              'suscripciones' === activeUrl[1] ? true : false,
                      },
                      {
                          id: 'Biblioteca',
                          icon: <DnsRoundedIcon />,
                          route: 'biblioteca',
                          active: 'biblioteca' === activeUrl[1] ? true : false,
                      },
                      {
                          id: 'Invitar a un Amigo',
                          icon: <PublicIcon />,
                          route: 'invitar-amigos',
                          active:
                              'invitar-amigos' === activeUrl[1] ? true : false,
                      },
                      {
                          id: 'Ajustes',
                          icon: <SettingsEthernetIcon />,
                          route: `ajustes/${userID}`,
                          active: 'ajustes' === activeUrl[1] ? true : false,
                      },
                  ],
              },
              {
                  id: 'Configuracion',
                  children: [
                      {
                          id: 'Privacidad',
                          icon: <SettingsIcon />,
                          route: 'configuracion-privacidad',
                          active:
                              'configuracion-privacidad' === activeUrl[1]
                                  ? true
                                  : false,
                      },
                      {
                          id: 'Formas de Pago',
                          icon: <SettingsInputComponentIcon />,
                          route: 'formas-pago',
                          active: 'formas-pago' === activeUrl[1] ? true : false,
                      },
                      {
                          id: 'Cambiar Clave',
                          icon: <PhonelinkSetupIcon />,
                          route: 'cambiar-clave',
                          active:
                              'cambiar-clave' === activeUrl[1] ? true : false,
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
                          icon: <HomeIcon />,
                          route: 'portal-servicios',
                          active:
                              'portal-servicios' === activeUrl[1]
                                  ? true
                                  : false,
                      },
                      {
                          id: 'Directorio de Requerimientos',
                          icon: <HomeIcon />,
                          route: 'directorio-requerimientos',
                          active:
                              'directorio-requerimientos' === activeUrl[1]
                                  ? true
                                  : false,
                      },
                      {
                          id: 'Suscripciones',
                          icon: <TimerIcon />,
                          route: 'suscripciones',
                          active:
                              'suscripciones' === activeUrl[1] ? true : false,
                      },
                  ],
              },
          ]

    return (
        <Drawer open={true} variant="permanent" {...other}>
            <List disablePadding>
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
                            <Avatar src={userPhotoUrl} alt="My Avatar" />
                        </IconButton>
                    </ListItemIcon>
                    <ListItemText>Bienvenido {userName}!</ListItemText>
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
                                console.log('navRoute', route)
                                return (
                                    <ListItem
                                        disablePadding
                                        button
                                        // activeClassName="Mui-selected"
                                        key={childId}
                                        component={Link}
                                        href={route}
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
                                <PhonelinkSetupIcon />
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
