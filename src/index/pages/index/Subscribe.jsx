export { Subscribe }

import React from 'react'
import { firestore } from '#@/firebase/firebaseClient'
import { collection, doc, setDoc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
// import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Snackbar from '@mui/material/Snackbar'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'

import productCTAImageDots from './productCTAImageDots.png'
// import PostalOfertas from "../../../publicAssets/static/img/Toma-Aerea-Ciudad.png";

const styles = (theme) => ({
    root: {
        marginTop: theme.spacing(6),
        marginBottom: 0,
        display: 'flex',
    },
    cardWrapper: {
        zIndex: 1,
        minHeight: '465px',
    },
    card: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#ffc071',
        padding: theme.spacing(6, 2),
    },
    textField: {
        width: '100%',
        margin: `${theme.spacing(2)} 0 ${theme.spacing(2)} 0 !important`,
        backgroundColor: theme.palette.common.white,
    },
    button: {
        width: '100%',
        margin: `${theme.spacing(1, 0)} !important`,
        padding: `${theme.spacing(2, 0)} !important`,
    },
    imagesWrapper: {
        position: 'relative',
    },
    imageDots: {
        position: 'absolute',
        top: -67,
        left: -67,
        right: 0,
        bottom: 0,
        width: '100%',
        background: `url(${productCTAImageDots})`,
    },
    image: {
        position: 'absolute',
        top: -28,
        left: -28,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: 600,
    },
})

const Form = styled('form')({
    maxWidth: 400,
})

function Subscribe() {
    // const { classes } = props;
    const theme = useTheme()
    const classes = styles(theme)
    const _firestore = firestore
    const suscribeRef = collection(_firestore, 'suscritos')
    const [open, setOpen] = React.useState(false)
    const [suscribeMail, setSuscribeMail] = React.useState(null)

    const userSuscribe = async (updateInfo, userID) => {
        await setDoc(doc(suscribeRef, userID), updateInfo, { merge: true })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setOpen(true) // open snackbar
        const suscriptionId = uuidv4()
        userSuscribe(suscribeMail, suscriptionId)
        setSuscribeMail(null)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const PostalOfertas =
        'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FToma-Aerea-Ciudad.png?alt=media&token=d16460b1-8e78-4f85-977f-afff44385b09'

    return (
        <Container sx={classes.root} component="section">
            <Grid container>
                <Grid item xs={12} md={6} sx={classes.cardWrapper}>
                    <Box sx={classes.card}>
                        <Form onSubmit={handleSubmit} sx={classes.cardContent}>
                            <Typography
                                variant="h3"
                                component="h3"
                                gutterBottom
                            >
                                Recibe nuestras ofertas
                            </Typography>
                            <Typography variant="h5">
                                Descubre nuestras actualizaciones primero.
                            </Typography>
                            <TextField
                                // noBorder
                                sx={classes.textField}
                                placeholder="Tu email"
                                onChange={(e) =>
                                    setSuscribeMail({ correo: e.target.value })
                                }
                            />
                            <Button
                                type="submit"
                                color="primary"
                                variant="contained"
                                sx={classes.button}
                            >
                                Suscribirme!
                            </Button>
                        </Form>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6} sx={classes.imagesWrapper}>
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Box sx={classes.imageDots} />
                        <Box
                            component="img"
                            src={PostalOfertas}
                            alt="Descubre nuestras actualizaciones primero."
                            sx={classes.image}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Snackbar
                open={open}
                onClose={handleClose}
                message="Te enviaremos nuestras mejores ofertas, una vez por mes."
            />
        </Container>
    )
}

Subscribe.propTypes = {
    //classes: PropTypes.object.isRequired,
}
