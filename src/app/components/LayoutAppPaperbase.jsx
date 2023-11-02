import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
// import { auth } from '#@/firebase/firebaseClient'
import { ThemeProvider } from '@mui/material/styles'
// import useMediaQuery from '@mui/material/useMediaQuery'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
// import Providers from '#@/app/components/Providers'
import { Navigator } from '#@/app/components/Navigator'
// import Content from '#@/app/components/Content'
import { Header } from '#@/app/components/Header'
import { theme } from '#@/app/components/theme.tsx'
// import { Providers } from '#@/app/components/Providers'
import { UserAuthContext } from '#@/providers/UserAuthProvider'

import '#@/app/components/Private-App.scss'
import '#R/index.scss'

export { LayoutAppPaperbase }

function Copyright() {
    const showYear = new Date().getFullYear()
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
                COMUNIDAD DEZZPO INC.
                <br /> - Todos los derechos reservados -
            </Link>
            {showYear}.
        </Typography>
    )
}

const drawerWidth = 256

function LayoutAppPaperbase({ children }) {
    const { currentUser, updateMobileMenu } = useContext(UserAuthContext)
    // const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))
    // const [mobileOpen, setMobileOpen] = useState(false)

    // Here change state to open and close menu

    // const user = auth?.currentUser || {}

    // const localRole = localStorage.getItem('role')
    // console.log(JSON.parse(localRole))

    // const handleDrawerToggle = () => {
    //     setMobileOpen(!mobileOpen)
    // }

    const handleDrawerToggle2 = () => {
        updateMobileMenu(false)
    }

    return (
        <ThemeProvider theme={theme}>
            {/* <Providers> */}
                <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                    <CssBaseline />
                    {/* {user.uid && ( */}
                    <Box
                        component="nav"
                        sx={{
                            width: { md: drawerWidth },
                            flexShrink: { sm: 0 },
                        }}
                    >
                        {/* {isSmUp ? null : (
                            <Navigator
                                PaperProps={{ style: { width: drawerWidth } }}
                                variant="temporary"
                                open={mobileOpen}
                                onClose={handleDrawerToggle}
                            />
                        )} */}

                        {currentUser?.mobileOpen && currentUser?.isAuth && (
                            <Navigator
                                PaperProps={{ style: { width: drawerWidth } }}
                                variant="temporary"
                                open={currentUser.mobileOpen}
                                onClose={handleDrawerToggle2}
                            />
                        )}
                        <Navigator
                            PaperProps={{}}
                            sx={{
                                display: {
                                    md: 'block',
                                    sm: 'none',
                                    xs: 'none',
                                },
                            }}
                        />
                    </Box>
                    {/* )} */}

                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                        style={{ overflowX: 'auto' }}
                    >
                        <Header onDrawerToggle={handleDrawerToggle2} />
                        <Box
                            className="p-0"
                            component="main"
                            sx={{ flex: 1, py: 6, px: 4, bgcolor: '#ffffff' }}
                        >
                            {/* Punto de inserción */}
                            {children}
                        </Box>
                        <Box
                            component="footer"
                            sx={{ p: 2, bgcolor: '#eaeff1' }}
                        >
                            <Copyright />
                        </Box>
                    </Box>
                </Box>
            {/* </Providers> */}
        </ThemeProvider>
    )
}

LayoutAppPaperbase.propTypes = {
    children: PropTypes.any,
}
