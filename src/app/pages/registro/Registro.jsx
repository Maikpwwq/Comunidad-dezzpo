// Pagina de registro
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import withSendBird from '@sendbird/uikit-react/withSendBird'
import SendbirdSelectors from '@sendbird/uikit-react/sendBirdSelectors'
import { NavLink, useNavigate } from 'react-router-dom'
import { auth, firestore } from '../../../firebase/firebaseClient' // src/firebase/firebaseClient
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, doc, setDoc } from 'firebase/firestore'
import { format } from 'date-fns'

import '../../../../public/assets/css/registro.css'
// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

// const styles = () => ({
//     selectRolBtn: {
//         backgroundColor: '#2283bd',
//         '&:hover': { backgroundColor: '#2594c2' },
//     },
// })

const Registro = (props) => {
    const { showLogo, connect, createChannel, sbSdk } = props

    // useEffect(() => {
    //     conectarSB()
    // }, [connect])

    const _firestore = firestore
    // const usersRef = collection(_firestore, 'users')
    const usersProResRef = collection(_firestore, 'usersPropietariosResidentes')
    const usersComCalRef = collection(
        _firestore,
        'usersComerciantesCalificados'
    )

    const [send, setSend] = useState(false)
    const [userSignupEmail, setEmail] = useState(null)
    const [userSignupPassword, setPassword] = useState('')
    const [userSignupRol, setRol] = useState(null)
    const [channelUrl, setChannelUrl] = useState(null)

    const navigate = useNavigate()

    // const userToFirestore = async (updateInfo, userID) => {
    //     await setDoc(doc(usersRef, userID), updateInfo)
    // }

    const userProResToFirestore = async (updateInfo, userID) => {
        await setDoc(doc(usersProResRef, userID), updateInfo)
    }

    const userComCalToFirestore = async (updateInfo, userID) => {
        await setDoc(doc(usersComCalRef, userID), updateInfo)
    }

    const handleSelectRol = (e, rol) => {
        setRol(e)
        // console.log(e, rol, userSignupRol)
    }

    const conectarSB = (userId) => {
        connect(userId)
            .then((user) => {
                console.log('user', user)
            })
            .catch((error) => {
                console.log('error', error)
            })
    }

    const crearCanal = (userId) => {
        // console.log(sdk)
        if (typeof sbSdk.GroupChannelParams == 'function') {
            const param = new sbSdk.GroupChannelParams()
            param.addUserIds([userId])
            param.setName('Comentarios')
            // console.log('param', param)
            createChannel(param)
                .then((channel) => {
                    const { url, name, coverUrl, members } = channel
                    setChannelUrl(url)
                    console.log('channel', url, name, coverUrl, members)
                })
                .catch((error) => {
                    console.log('error', error)
                })
        }
    }

    const handleClick = (e) => {
        e.preventDefault()
        if (userSignupRol) {
            const signUp = (email, password) => {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        if (typeof connect == 'function') {
                            conectarSB(user.uid)
                        }
                        if (
                            typeof createChannel == 'function' &&
                            typeof sbSdk === 'object'
                        ) {
                            crearCanal(user.uid)
                        }
                        var user = userCredential.user
                        console.log('Anonymous account successfully upgraded', user)
                        const data = {
                            userMail: user.email,
                            userJoined: format(new Date(), 'dd-MM-yyyy'), // toString(new Date()), //user.metadata.creationTime
                            userId: user.uid,
                            channelUrl: channelUrl,
                            // userName: user.displayName,
                        }
                        console.log(userSignupRol, channelUrl)
                        if (userSignupRol == 1) {
                            userProResToFirestore(data, user.uid)
                        }
                        if (userSignupRol == 2) {
                            userComCalToFirestore(data, user.uid)
                        }
                        // userToFirestore(data, user.uid)
                        // localStorage.setItem('role', JSON.stringify(userSignupRol))
                        localStorage.role = JSON.stringify(userSignupRol)
                        localStorage.userID = JSON.stringify(user.uid)
                        navigate('/app/ajustes')
                    })
                    .catch((err) => {
                        console.log('Error upgrading anonymous account', err)
                        console.log(err.code)
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
            signUp(userSignupEmail, userSignupPassword)
        }
    }

    return (
        <>
            <Container fluid className="p-0">
                <Row id="registrate" className="m-0">
                    {showLogo == false ? (
                        <></>
                    ) : (
                        <Col
                            className="registrateImagen m-0"
                            md={6}
                            sm={12}
                        ></Col>
                    )}
                    <Col
                        className="registrateformulario m-0 p-0 pt-2 pb-4"
                        md={6}
                        sm={12}
                    >
                        <Form
                            id="formularioRegistro"
                            action=""
                            className="p-4"
                            // preventDefault="true"
                        >
                            <Col className="d-flex">
                                <h2 className="headline-xl textBlanco">
                                    REGISTRATE
                                </h2>
                                <p className="body-1 textBlanco">
                                    Bienvenido a todos los beneficios de dezzpo.{' '}
                                    <NavLink className="body-2" to="/ingreso/">
                                        {'¿Ya tienes una cuenta?'}
                                    </NavLink>
                                </p>

                                <Form.Label className="mb-0 mt-2">
                                    Elegir rol:
                                </Form.Label>
                                <ToggleButtonGroup
                                    name="userRol"
                                    // className="mb-2"
                                    vertical="true"
                                    orientation="vertical"
                                    // exclusive
                                    aria-label="Elegir rol:"
                                    onChange={handleSelectRol}
                                    // size="small"
                                    value={userSignupRol}
                                    color="primary"
                                >
                                    <ToggleButton
                                        className="body-1 select-rol textBlanco d-flex flex-row align-items-center justify-content-center"
                                        value={1} // "SoyPropietarioResidente" //
                                        id="formBasicRolPropietarioResidente"
                                        aria-label="Soy Propietario/Residente"
                                        // style={{
                                        //     backgroundColor: '#2283bd',
                                        //     '&:hover': {
                                        //         backgroundColor: '#2594c2',
                                        //     },
                                        // }}
                                        //onChange={(e) => setRol(e.target.value)}
                                    >
                                        Soy Propietario/Residente
                                    </ToggleButton>
                                    <ToggleButton
                                        className="body-1 select-rol textBlanco d-flex flex-row align-items-center justify-content-center"
                                        value={2} // "SoyComercianteCalificado" //
                                        id="formBasicRolComercianteCalificado"
                                        aria-label="Soy Comerciante Calificado"
                                        //onChange={(e) => setRol(e.target.value)}
                                    >
                                        Soy Comerciante Calificado
                                    </ToggleButton>
                                </ToggleButtonGroup>
                                <Form.Group
                                    className="w-80 pt-4 mb-2 d-flex flex-column align-items-start"
                                    controlId="formBasicName"
                                >
                                    <Form.Label className="mb-0">
                                        Nombre de usuario
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Elija su usuario"
                                        name="username"
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="w-80 mb-2 d-flex flex-column align-items-start"
                                    controlId="formSignupEmail"
                                >
                                    <Form.Label className="mb-0">
                                        Email
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Registre una cuenta de email valida"
                                        name="email"
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="w-80 mb-2 d-flex flex-column align-items-start"
                                    controlId="formSignupPassword"
                                >
                                    <Form.Label className="mb-0">
                                        Contraseña
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Registre una clave"
                                        name="password"
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="w-80 mb-2 d-flex flex-column align-items-start"
                                    controlId="formBasicPassword"
                                >
                                    <Form.Label className="mb-0">
                                        Confirme la Contraseña
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="De nuevo la clave"
                                        name="confirmPassword"
                                    />
                                </Form.Group>
                                {/* <Form.Group
                                    className="mb-2 mt-2"
                                    controlId="formBasicCheckboxRobot"
                                >
                                    <Form.Check
                                        className="d-flex flex-row align-items-center justify-content-center"
                                        type="checkbox"
                                        label="No soy un robot"
                                    />
                                </Form.Group> */}
                                <Col className="pt-2">
                                    <Button
                                        className="btn-round btn-high"
                                        variant="primary"
                                        type="submit"
                                        onClick={handleClick}
                                    >
                                        Crear Cuenta
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

Registro.propTypes = {
    showLogo: PropTypes.bool,
    connect: PropTypes.func.isRequired,
    createChannel: PropTypes.func.isRequired,
    sbSdk: PropTypes.object.isRequired,
}

export default withSendBird(Registro, (state) => ({
    // Mapping context state to props
    connect: SendbirdSelectors.getConnect(state),
    createChannel: SendbirdSelectors.getCreateChannel(state),
    sbSdk: SendbirdSelectors.getSdk(state),
}))
