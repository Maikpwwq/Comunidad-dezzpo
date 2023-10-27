export { Page }

// Pagina de Ingreso
import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Link } from '#R/Link'
import { navigate } from 'vike/client/router'
import { SnackBarAlert } from '#@/index/components/SnackBarAlert'
import { auth } from '#@/firebase/firebaseClient' // src/firebase/firebaseClient
import { UserAuthContext } from '#@/providers/UserAuthProvider'

import {
    EmailAuthProvider,
    signInWithCredential,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth'

import '#@/assets/css/ingreso.css'
//imagenes
import LogoGmail from '#@/assets/img/G.jpg'
import LogoComunidadDezzpo from '#@/assets/img/IsologoFooter.png'

import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'

// react-bootrstrap
import Paper from '@mui/material/Paper'
import Row from 'react-bootstrap/Row'
import Box from '@mui/material/Box'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Typography from '@mui/material/Typography'

const Page = (props) => {
    const {
        showLogo,
        // draftId,
        setDraftInfo,
        draftInfo,
        handleSave,
    } = props

    const { currentUser, updateUser } = useContext(UserAuthContext)

    const googleProvider = new GoogleAuthProvider()
    // const navigate = useNavigate()
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success',
    })
    const [send, setSend] = useState(false)
    const [step, setStep] = useState(1)
    const [userLoginEmail, setEmail] = useState(undefined)
    const [userLoginPassword, setPassword] = useState('')
    const [userSignupRol, setRol] = useState(0)

    const handleAlert = (message, severity) => {
        setAlert({ ...alert, open: true, message: message, severity: severity })
    }

    const handleClose = (event, reason) => {
        // console.log(reason, event)
        if (reason === 'clickaway') {
            return
        } else {
            setAlert({ ...alert, open: false, message: '' })
        }
    }

    const handleSelectRol = (e) => {
        setRol(e[0])
        console.log('handleSelectRol', e, userSignupRol)
        setStep(2)
    }

    const onSuccess = (user) => {
        const { uid, displayName } = user
        console.log('onLoginSuccess', userSignupRol, uid, displayName)

        const loginData = { 
            displayName: displayName,
            userId: uid,
            isAuth: true,
            updated: false,
            rol: userSignupRol,
        }

        updateUser(loginData)

        // console.log('Account successfully upgraded', user)
        // console.log('onLoginSuccess', userSignupRol, uid)
        // if (userSignupRol == 1) {
        //     if (draftInfo) {
        //         data.userCreatedDrafts.push(draftInfo.draftId)
        //     }
        // }        

        localStorage.role = JSON.stringify(userSignupRol)
        localStorage.userID = JSON.stringify(uid)
        // localStorage.setItem('role', JSON.stringify(userSignupRol))
        handleAlert('Cuenta autorizada con éxito.', 'success')
        if (draftInfo && uid ) {
            setDraftInfo({
                ...draftInfo,
                draftPropietarioResidente: uid,
            })
            handleSave()
        } else {
            navigate(`/app/perfil/${uid}`)
        }
    }

    const handleClick = (e) => {
        e.preventDefault()
        if (userSignupRol > 0) {
            // console.log(userLoginEmail, userLoginPassword, userSignupRol)
            let credential = EmailAuthProvider.credential(
                userLoginEmail,
                userLoginPassword
            )
            const logIn = (usercredential) => {
                signInWithCredential(auth, usercredential)
                    .then((userCredential) => {
                        var user = userCredential.user
                        // console.log('Anonymous account successfully upgraded', user)
                        onSuccess(user)
                    })
                    .catch((err) => {
                        // console.log('Error upgrading anonymous account', err)
                        var errorCode = err.code
                        var errorMessage = err.message
                        if (errorCode === 'auth/wrong-password') {
                            handleAlert('Clave incorrecta!', 'error')
                        } else {
                            handleAlert(errorMessage, 'error')
                        }
                    })
            }
            setSend(true)
            logIn(credential)
        } else {
            handleAlert('Selecciona un rol para ingresar!', 'info')
        }
    }

    const handleGoogleProvider = (e) => {
        e.preventDefault()
        if (userSignupRol > 0) {
            const logIn = () => {
                signInWithPopup(auth, googleProvider)
                    .then((result) => {
                        // console.log('googleProvider', result)
                        // This gives you a Google Access Token. You can use it to access the Google API.
                        const credential =
                            GoogleAuthProvider.credentialFromResult(result)
                        const token = credential.accessToken
                        // The signed-in user info.
                        const user = result.user
                        onSuccess(user)
                    })
                    .catch((error) => {
                        // Handle Errors here.
                        const errorCode = error.code
                        const errorMessage = error.message
                        // The email of the user's account used.
                        // const email = error.customData.email
                        // The AuthCredential type that was used.
                        const credential =
                            GoogleAuthProvider.credentialFromError(error)
                        // console.log(
                        //     'Error upgrading anonymous account',
                        //     errorMessage,
                        //     error
                        // )
                        if (errorCode === 'auth/wrong-password') {
                            handleAlert('Clave incorrecta!', 'error')
                        } else {
                            handleAlert(errorMessage, 'error')
                        }
                    })
            }
            setSend(true)
            logIn()
        } else {
            handleAlert('Selecciona un rol para ingresar!', 'info')
        }
    }

    let checkStyle = {
        width: '30px',
    }
    
    const handleComeBack = () => {
        if (step > 0) {
            let active = step - 1
            setStep(active)
        }
    }

    return (
        <>
            <Container fluid className="p-0">
                <Row className="ingresoFormulario  m-0 w-100">
                    {showLogo === true && (
                        <Col
                            className="imagenIngreso d-flex align-items-start justify-content-center"
                            lg={6}
                            md={6}
                            sm={12}
                        >
                            <Box style={{ top: '16vh', position: 'relative' }}>
                                <Typography className="text-white" variant="h4">
                                    Bienvenido a
                                </Typography>
                            </Box>
                        </Col>
                    )}
                    <Col
                        className="ingresarFormulario m-0 p-0 mb-4 mt-4"
                        lg={4}
                        md={5}
                        sm={10}
                        xs={10}
                    >
                        <Paper
                            elevation={16}
                            id="formularioIngreso"
                            className="pt-4 pb-4"
                        >
                            <Form action="" className="p-4">
                                <Col className="d-flex pt-4 pb-4">
                                    <Typography
                                        variant="h4"
                                        className="headline-xl"
                                    >
                                        Iniciar sesión
                                    </Typography>
                                    {step === 1 && (
                                        <>
                                            <Form.Label className="mb-0 pt-4 body-1">
                                                Primero, elige tu rol
                                            </Form.Label>
                                            <ToggleButtonGroup
                                                type="checkbox" // 'radio'
                                                name="userRol"
                                                className="mb-5 mt-2 align-items-center"
                                                vertical="true"
                                                onChange={handleSelectRol}
                                            >
                                                <ToggleButton
                                                    className="body-1 p-3 btn-round btn-high btn-buscador w-auto d-flex flex-row align-items-center justify-content-center"
                                                    value={1}
                                                    id="formBasicRolPropietarioInmobiliario"
                                                    aria-label="Soy propietario inmobiliario"
                                                >
                                                    Soy propietario inmobiliario
                                                </ToggleButton>
                                                <br className="mb-2 mt-2" />
                                                <ToggleButton
                                                    className="body-1 p-3 btn-round btn-middle w-auto d-flex flex-row align-items-center justify-content-center"
                                                    value={2}
                                                    id="formBasicRolComercianteCalificado"
                                                    aria-label="Soy Comerciante Calificado"
                                                >
                                                    Soy comerciante calificado
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                            <p className="body-1 pt-2 m-0">
                                                {/* Eres nuevo, crea fácil una cuenta, */}
                                                <Link
                                                    className="body-2 btn-TEXT textVerde2"
                                                    href="/registro/"
                                                >
                                                    {' Registrarme'}
                                                </Link>
                                            </p>
                                            {/* TODO: Modal ingresar datos olvidaste la contaseña */}
                                            <Link
                                                className="body-2 btn-TEXT textVerde2"
                                                href="/restaurar-contraseña/"
                                            >
                                                <Button
                                                    className="textBlanco btn-TEXT btn-round btn-high"
                                                    variant="primary"
                                                >
                                                    Olvidé mi contraseña
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                    {step === 2 && (
                                        <>
                                            <Form.Label className="mb-0 body-1 pt-4">
                                                {userSignupRol == 1
                                                    ? 'Soy propietario/residente'
                                                    : 'Soy comerciante calificado'}
                                            </Form.Label>
                                            <ul className="align-items-center mt-2 w-100">
                                                {/* <li className="body-1">
                                        <Button className="btn btn-round btn-middle">
                                            Ingresar con Facebook
                                        </Button>
                                    </li> */}
                                                <li className="body-1">
                                                    <Button
                                                        className="btn btn-round btn-middle d-flex align-items-center p-0 pe-2"
                                                        onClick={
                                                            handleGoogleProvider
                                                        }
                                                        style={{
                                                            background:
                                                                '#e9ebe6',
                                                        }}
                                                    >
                                                        <Box
                                                            component="img"
                                                            src={LogoGmail}
                                                            alt="Ingresar-con-cuenta-gmail"
                                                            sx={{
                                                                height: 33,
                                                                display:
                                                                    'block',
                                                                maxWidth: 33,
                                                                overflow:
                                                                    'hidden',
                                                                width: '100%',
                                                                borderRadius:
                                                                    '50%',
                                                            }}
                                                            className="p-2"
                                                        />
                                                        <Typography className="body-1">
                                                            Ingresar con Gmail
                                                        </Typography>
                                                    </Button>
                                                </li>
                                            </ul>
                                            <Col
                                                className="d-flex flex-column align-items-center"
                                                lg={10}
                                                md={12}
                                                sm={10}
                                                xs={12}
                                            >
                                                <Form.Group
                                                    className="pt-2 mb-2 d-flex flex-column align-items-start"
                                                    controlId="formLoginCredential"
                                                    style={{ width: 'inherit' }}
                                                >
                                                    <Form.Label className="mb-0 body-1">
                                                        Email
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="usa tu correo electrónico"
                                                        name="credential"
                                                        onChange={(e) =>
                                                            setEmail(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </Form.Group>
                                                <Form.Group
                                                    className="mb-2 d-flex flex-column align-items-start"
                                                    controlId="formLoginPassword"
                                                    style={{ width: 'inherit' }}
                                                >
                                                    <Form.Label className="mb-0 body-1">
                                                        Contraseña
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        placeholder="usa tu contraseña"
                                                        name="password"
                                                        onChange={(e) =>
                                                            setPassword(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </Form.Group>

                                                {/* <Form.Group
                                    className="mb-2 mt-4"
                                    controlId="formBasicCheckboxRecordar"
                                >
                                    <Form.Check
                                        className="d-flex flex-row align-items-center justify-content-start"
                                        type="checkbox"
                                        label="Recuérdame"
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="mb-2"
                                    controlId="formBasicCheckboxRobot"
                                >
                                    <Form.Check
                                        className="d-flex flex-row align-items-center justify-content-start"
                                        type="checkbox"
                                        label="No soy un robot"
                                    />
                                </Form.Group> */}
                                            </Col>
                                            <Col className="pt-4 pb-2">
                                                <Button
                                                    onClick={handleComeBack}
                                                    className="mb-4 btn-round btn-middle w-auto"
                                                    variant="secondary"
                                                    
                                                    // type="submit"
                                                >
                                                    <KeyboardBackspaceIcon /> Volver
                                                    atras
                                                </Button>
                                                <span className='mt-1' style={{ marginBottom: `1rem`}}></span>
                                                <Button
                                                    className="btn-buscador btn-round btn-high body-1"
                                                    variant="primary"
                                                    type="submit"
                                                    onClick={handleClick}
                                                >
                                                    Iniciar Sesión
                                                </Button>
                                                {alert.open && (
                                                    <SnackBarAlert
                                                        message={alert.message}
                                                        onClose={handleClose}
                                                        severity={
                                                            alert.severity
                                                        } // success, error, warning, info, default
                                                        open={alert.open}
                                                    />
                                                )}
                                            </Col>
                                        </>
                                    )}
                                </Col>
                            </Form>
                        </Paper>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

Page.propTypes = {
    showLogo: PropTypes.bool,
    setDraftInfo: PropTypes.func,
    draftInfo: PropTypes.object,
    handleSave: PropTypes.func,
}
