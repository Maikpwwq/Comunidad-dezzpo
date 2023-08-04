import * as React from 'react'
import PropTypes from 'prop-types'
import { auth } from '#@/firebase/firebaseClient'
import { ThemeProvider } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
// import Providers from '#@/pages/app/Providers'
import { Navigator } from '#@/pages/app/components/Navigator'
// import Content from '#@/pages/app/components/Content'
import { Header } from '#@/pages/app/components/Header'
import { theme } from '#@/pages/app/components/theme.tsx'

export { LayoutPaperbase }

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
                COMUNIDAD DEZZPO INC.
                <br /> - Todos los derechos reservados -
            </Link>{' '}
            {new Date().getFullYear()}.
        </Typography>
    )
}



const drawerWidth = 256

function LayoutPaperbase({ children }) {
    const [mobileOpen, setMobileOpen] = React.useState(false)
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))

    const user = auth.currentUser || {}

    // const localRole = localStorage.getItem('role')
    // console.log(JSON.parse(localRole))

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                <CssBaseline />
                {/* {user.uid && ( */}
                    <Box
                        component="nav"
                        sx={{
                            width: { sm: drawerWidth },
                            flexShrink: { sm: 0 },
                        }}
                    >
                        {isSmUp ? null : (
                            <Navigator
                                PaperProps={{ style: { width: drawerWidth } }}
                                variant="temporary"
                                open={mobileOpen}
                                onClose={handleDrawerToggle}
                            />
                        )}

                        <Navigator
                            PaperProps={{ style: { width: drawerWidth } }}
                            sx={{ display: { sm: 'block', xs: 'none' } }}
                        />
                    </Box>
                 {/* )} */}

                <Box
                    sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                    style={{ overflowX: 'auto' }}
                >
                    <Header onDrawerToggle={handleDrawerToggle} />
                    <Box
                        className="p-0"
                        component="main"
                        sx={{ flex: 1, py: 6, px: 4, bgcolor: '#ffffff' }}
                    >
                        {/* Punto de inserción */}
                        {children}
                    </Box>
                    <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
                        <Copyright />
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

LayoutPaperbase.propTypes = {
    children: PropTypes.any,
}
