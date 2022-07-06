/* eslint-disable prettier/prettier */
// Pagina de Ingreso
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { auth } from '../../../firebase/firebaseClient' // src/firebase/firebaseClient
import {
    EmailAuthProvider,
    signInWithCredential,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth'

import '../../../../public/assets/css/ingreso.css'
//imagenes
import LogoGmail from '../../../../public/assets/img/G.jpg'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Box from '@mui/material/Box'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Typography from '@mui/material/Typography'

const Ingreso = (props) => {
    const googleProvider = new GoogleAuthProvider()
    const navigate = useNavigate()
    const [send, setSend] = React.useState(false)
    const [userLoginEmail, setEmail] = React.useState(undefined)
    const [userLoginPassword, setPassword] = React.useState('')
    const [userSignupRol, setRol] = React.useState({})

    const handleClick = (e) => {
        if (userSignupRol) {
            e.preventDefault()
            console.log(userLoginEmail, userLoginPassword, userSignupRol)
            let credential = EmailAuthProvider.credential(
                userLoginEmail,
                userLoginPassword
            )
            const logIn = (usercredential) => {
                signInWithCredential(auth, usercredential)
                    .then((userCredential) => {
                        var user = userCredential.user
                        // console.log('Anonymous account successfully upgraded', user)
                        // console.log(JSON.stringify(userSignupRol))
                        // localStorage.setItem('role', JSON.stringify(userSignupRol))
                        localStorage.role = JSON.stringify(userSignupRol)
                        localStorage.userID = JSON.stringify(user.uid)
                        // navigate('/app/perfil', { state: { role: userSignupRol } })
                        navigate('/app/perfil')
                    })
                    .catch((err) => {
                        console.log('Error upgrading anonymous account', err)
                        var errorCode = err.code
                        var errorMessage = err.message
                        if (errorCode === 'auth/wrong-password') {
                            alert('Clave incorrecta.')
                        } else {
                            alert(errorMessage)
                        }
                    })
            }
            setSend(true)
            logIn(credential)
        }
    }

    const handleGoogleProvider = (e) => {
        e.preventDefault()
        if (userSignupRol) {
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
                        console.log('Account successfully upgraded', user)
                        localStorage.role = JSON.stringify(userSignupRol)
                        localStorage.userID = JSON.stringify(user.uid)
                        navigate('/app/perfil')
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
                        console.log(
                            'Error upgrading anonymous account',
                            errorMessage,
                            error
                        )
                        if (errorCode === 'auth/wrong-password') {
                            alert('Clave incorrecta.')
                        } else {
                            alert(errorMessage)
                        }
                    })
            }
            setSend(true)
            logIn()
        }
    }

    const handleClickForgetPassword = (e) => {
        e.preventDefault()
        sendPasswordResetEmail(auth, userLoginEmail)
            .then((result) => {
                console.log(`Se envio correo de restauración ${result}`)
            })
            .catch((error) => {
                console.log(
                    `Se produjo un error al enviar correo de restauración ${error}`
                )
            })
    }

    let checkStyle = {
        width: '30px',
    }
    //

    return (
        <>
            <Container fluid className="p-0">
                <Row className="ingresoFormulario  m-0 w-100">
                    <Col className="imagenIngreso" lg={6} md={6} sm={12}></Col>
                    <Col
                        className="ingresarFormulario m-0 p-0"
                        lg={5}
                        md={6}
                        sm={12}
                    >
                        <Form id="formularioIngreso" action="" className="p-2">
                            <Col className="d-flex">
                                <h2 className="headline-xl textBlanco">
                                    Bienvenido!
                                </h2>
                                <p className="body-1 textBlanco">
                                    Eres nuevo, crea fácil una cuenta,
                                    <NavLink
                                        className="body-2 BOTON-TEXT"
                                        to="/registro/"
                                    >
                                        {' Registrate'}
                                    </NavLink>
                                </p>
                                <Form.Label className="mb-0">
                                    1. Elegir rol:
                                </Form.Label>
                                <ToggleButtonGroup
                                    type="checkbox" // 'radio'
                                    name="userRol"
                                    className="mb-2 mt-2"
                                    vertical="true"
                                    // value={userSignupRol}
                                >
                                    <ToggleButton
                                        className="body-1 textBlanco d-flex flex-row align-items-center justify-content-center"
                                        value={1}
                                        id="formBasicRolPropietarioResidente"
                                        onChange={(e) => setRol(e.target.value)}
                                    >
                                        Soy Propietario/Residente
                                    </ToggleButton>
                                    <ToggleButton
                                        className="body-1 textBlanco d-flex flex-row align-items-center justify-content-center"
                                        value={2}
                                        id="formBasicRolComercianteCalificado"
                                        onChange={(e) => setRol(e.target.value)}
                                    >
                                        Soy Comerciante Calificado
                                    </ToggleButton>
                                </ToggleButtonGroup>
                                <Form.Label className="mb-0 mt-2">
                                    2. Ingresa tus datos:
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
                                                onClick={handleGoogleProvider}
                                                style={{
                                                    background: '#e9ebe6',
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={LogoGmail}
                                                    alt="Ingresar-con-cuenta-gmail"
                                                    sx={{
                                                        height: 33,
                                                        display: 'block',
                                                        maxWidth: 33,
                                                        overflow: 'hidden',
                                                        width: '100%',
                                                        borderRadius: '50%',
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
                                        <Form.Label className="mb-0">
                                            Email
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="usa tu correo electrónico"
                                            name="credential"
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-2 d-flex flex-column align-items-start"
                                        controlId="formLoginPassword"
                                        style={{ width: 'inherit' }}
                                    >
                                        <Form.Label className="mb-0">
                                            Contraseña
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="usa tu contraseña"
                                            name="password"
                                            onChange={(e) =>
                                                setPassword(e.target.value)
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
                                <Col className="pt-3 pb-2">
                                    <Button
                                        className="btn-round btn-high"
                                        variant="primary"
                                        type="submit"
                                        onClick={handleClick}
                                    >
                                        Iniciar Sesión
                                    </Button>
                                    <br />
                                    {/* TODO: Modal ingresar datos olvidaste la contaseña */}
                                    <Button
                                        className="BOTON-TEXT textBlanco pt-2"
                                        variant="primary"
                                        onClick={handleClickForgetPassword}
                                    >
                                        ¿Olvidaste la contraseña?
                                    </Button>
                                </Col>
                            </Col>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Ingreso
