import * as React from 'react'
import { NavLink } from 'react-router-dom'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import HomeIcon from '@mui/icons-material/Home'
import PeopleIcon from '@mui/icons-material/People'
import DnsRoundedIcon from '@mui/icons-material/DnsRounded'
import PermMediaOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActual'
import PublicIcon from '@mui/icons-material/Public'
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet'
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent'
import TimerIcon from '@mui/icons-material/Timer'
import SettingsIcon from '@mui/icons-material/Settings'
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup'

const categories = [
    {
        id: 'Build',
        children: [
            {
                id: 'Inicio',
                icon: <PeopleIcon />,
                route: '/perfil',
                active: true,
            },
            {
                id: 'Calificaciones',
                icon: <DnsRoundedIcon />,
                route: '/calificaciones',
            },
            {
                id: 'Biblioteca',
                icon: <PermMediaOutlinedIcon />,
                route: '/biblioteca',
            },
            {
                id: 'Invitar a un Amigo',
                icon: <PublicIcon />,
                route: '/invitar-amigos',
            },
            {
                id: 'Ajustes',
                icon: <SettingsEthernetIcon />,
                route: '/ajsutes',
            },
            {
                id: 'Formas de Pago',
                icon: <SettingsInputComponentIcon />,
                route: '/formas-pago',
            },
        ],
    },
    {
        id: 'Quality',
        children: [
            {
                id: 'Configuracion',
                icon: <SettingsIcon />,
                route: '/configuracion',
            },
            { id: 'Privacidad', icon: <TimerIcon />, route: 'privacidad' },
            {
                id: 'Cambiar Clave',
                icon: <PhonelinkSetupIcon />,
                route: '/cambiar-clave',
            },
            {
                id: 'Cerrar Sesion',
                icon: <PhonelinkSetupIcon />,
                route: '/cerrar-sesion',
            },
        ],
    },
]

const item = {
    py: '2px',
    px: 3,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover, &:focus': {
        bgcolor: 'rgba(255, 255, 255, 0.08)',
    },
}

const itemCategory = {
    boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
    py: 1.5,
    px: 3,
}

export default function Navigator(props) {
    const { ...other } = props

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
                    Comunidad Dezzpo
                </ListItem>
                <ListItem sx={{ ...item, ...itemCategory }}>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText>Bienvenido!</ListItemText>
                </ListItem>
                {categories.map(({ id, children }) => (
                    <Box key={id} sx={{ bgcolor: '#101F33' }}>
                        <ListItem sx={{ py: 2, px: 3 }}>
                            <ListItemText sx={{ color: '#fff' }}>
                                {id}
                            </ListItemText>
                        </ListItem>
                        {children.map(
                            ({ id: childId, icon, route, active }) => (
                                <ListItem
                                    disablePadding
                                    button
                                    activeClassName="Mui-selected"
                                    key={childId}
                                    component={NavLink}
                                    to={route}
                                    exact
                                >
                                    <ListItemButton selected={active} sx={item}>
                                        <ListItemIcon>{icon}</ListItemIcon>
                                        <ListItemText>{childId}</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            )
                        )}

                        <Divider sx={{ mt: 2 }} />
                    </Box>
                ))}
            </List>
        </Drawer>
    )
}
