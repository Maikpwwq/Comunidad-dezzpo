import * as React from 'react'
import { NavLink, Navigate, useNavigate, useMatch } from 'react-router-dom'

//imagenes
import Avatar1 from '../../../public/assets/img/CategoriasPopulares.png'
import LogoMenuComunidadDezzpo from '../../../public/assets/img/IsologoUserApp.png'

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

export default function Navigator(props) {
    const { ...other } = props
    // const cerrarSesion = () => {}
    return (
        <Drawer variant="permanent" {...other}>
            <List disablePadding>
                <ListItem
                    sx={{
                        ...item,
                        ...itemCategory,
                        fontSize: 22,
                        color: '#fff',
                    }}
                >
                    <img
                        src={LogoMenuComunidadDezzpo}
                        alt="Logo Comunidad Dezzpo"
                        style={{ padding: '3px 10px' }}
                        height="55px"
                        width="200px"
                    />
                </ListItem>
                <ListItem sx={{ ...item, ...itemCategory }}>
                    <ListItemIcon>
                        <IconButton color="inherit" sx={{ p: 0.5 }}>
                            <Avatar src={Avatar1} alt="My Avatar" />
                        </IconButton>
                    </ListItemIcon>
                    <ListItemText>Bienvenido _nombre!</ListItemText>
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
                            ({ id: childId, icon, route, active }) => (
                                // { (childId !== 'Cerrar Sesion') ? () :
                                <ListItem
                                    disablePadding
                                    button
                                    activeClassName="Mui-selected"
                                    key={childId}
                                    component={NavLink}
                                    // component={NavLink} { Navigate }
                                    to={route}
                                    exact
                                >
                                    <ListItemButton selected={active} sx={item}>
                                        <ListItemIcon>{icon}</ListItemIcon>
                                        <ListItemText>{childId}</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                                // : cerrarSesion()}
                            )
                        )}

                        <Divider sx={{ mt: 2 }} />
                    </Box>
                ))}
            </List>
        </Drawer>
    )
}

const categories = [
    {
        id: 'Inicio',
        children: [
            {
                id: 'Mi cuenta',
                icon: <PeopleIcon />,
                route: 'perfil',
                active: true,
            },
            {
                id: 'Portal de servicios',
                icon: <HomeIcon />,
                route: 'portal-servicios',
            },
            {
                id: 'Notificaciones',
                icon: <NotificationsIcon />,
                route: 'notificaciones',
            },
            {
                id: 'Suscripciones',
                icon: <TimerIcon />,
                route: 'suscripciones',
            },
            {
                id: 'Biblioteca',
                icon: <DnsRoundedIcon />,
                route: 'biblioteca',
            },
            {
                id: 'Invitar a un Amigo',
                icon: <PublicIcon />,
                route: 'invitar-amigos',
            },
            {
                id: 'Ajustes',
                icon: <SettingsEthernetIcon />,
                route: 'ajustes',
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
            },
            {
                id: 'Formas de Pago',
                icon: <SettingsInputComponentIcon />,
                route: 'formas-pago',
            },
            {
                id: 'Cambiar Clave',
                icon: <PhonelinkSetupIcon />,
                route: 'cambiar-clave',
            },
            {
                id: 'Cerrar Sesion',
                icon: <PhonelinkSetupIcon />,
                route: `cerrar-sesion`, // ${match.url}/
            },
        ],
    },
]
