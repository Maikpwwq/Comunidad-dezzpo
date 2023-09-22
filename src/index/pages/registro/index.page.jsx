export { Page }

// Pagina de registro
import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Link } from '#R/Link'
import { navigate } from 'vite-plugin-ssr/client/router'
import { SnackBarAlert } from '#@/index/components/SnackBarAlert'
import { UserAuthContext } from '#@/providers/UserAuthProvider'
// import { newOpenChannelSendbird } from '#@/services/newOpenChannelSendbird.service'
import { auth, firestore } from '#@/firebase/firebaseClient' // src/firebase/firebaseClient
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth'
import { collection, doc, setDoc } from 'firebase/firestore'
import format from 'date-fns/format'

import '#@/assets/css/registro.css'
//imagenes
import LogoGmail from '#@/assets/img/G.jpg'
// react-bootrstrap
import Paper from '@mui/material/Paper'
// import {
//     Row,
//     Col,
//     Container,
//     Button,
//     Form,
//     ToggleButtonGroup,
//     ToggleButton,
// } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import DownloadIcon from '@mui/icons-material/Download';

// const styles = () => ({
//     selectRolBtn: {
//         backgroundColor: '#2283bd',
//         '&:hover': { backgroundColor: '#2594c2' },
//     },
// })

const Page = (props) => {
    const {
        showLogo,
        // draftId,
        setDraftInfo,
        draftInfo,
        handleSave,
    } = props
    // sessionStorage.draftId = draftID

    const { currentUser, updateUser } = useContext(UserAuthContext) 

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success',
    })
    const googleProvider = new GoogleAuthProvider()
    const _firestore = firestore
    // const usersRef = collection(_firestore, 'users')
    const usersProResRef = collection(_firestore, 'usersPropietariosResidentes')
    const usersComCalRef = collection(
        _firestore,
        'usersComerciantesCalificados'
    )

    const [send, setSend] = useState(false)
    const [step, setStep] = useState(1)
    const [userSignupName, setName] = useState(undefined)
    const [userSignupEmail, setEmail] = useState(undefined)
    const [userSignupPassword, setPassword] = useState('')
    const [userSignupRol, setRol] = useState(undefined)
    // const [channelUrl, setChannelUrl] = useState(null)

    // const navigate = useNavigate()

    // const userToFirestore = async (updateInfo, userID) => {
    //     await setDoc(doc(usersRef, userID), updateInfo)
    // }

    const userProResToFirestore = async (updateInfo, userID) => {
        console.log(updateInfo)
        await setDoc(doc(usersProResRef, userID), updateInfo)
    }

    const userComCalToFirestore = async (updateInfo, userID) => {
        await setDoc(doc(usersComCalRef, userID), updateInfo)
    }

    const handleSelectRol = (e) => {
        setRol(e[0])
        // console.log('handleSelectRol', e, userSignupRol)
        setStep(2)        
    }

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

    const onSuccess = (user) => {
        const { uid, email, displayName } = user
        console.log('onSigninSuccess', userSignupRol, uid)
  
        updateUser({
            displayName: displayName,
            userId: uid,
            isAuth: true,    
            updated: false,
            rol: userSignupRol[0],
        })

        // Sendbird new open channel
        // newOpenChannelSendbird(uid, displayName, setChannelUrl)

        const data = {
                            userMail: email,
                            userJoined: format(new Date(), 'dd-MM-yyyy'), // toString(new Date()), //user.metadata.creationTime
                            userId: uid,
                            userChannelUrl: '',
                            createdDrafts: [],
                            userName: displayName || userSignupName,
        }

        if (userSignupRol == 1) {
            if (draftInfo) {
                data.createdDrafts.push(draftInfo.draftId)
            }
            userProResToFirestore(data, uid)
        }
        if (userSignupRol == 2) {
            userComCalToFirestore(data, uid)
        }
        localStorage.role = JSON.stringify(userSignupRol) // localStorage.setItem('role', JSON.stringify(userSignupRol))
        localStorage.userID = JSON.stringify(uid)
        handleAlert('Cuenta actualizada con éxito!', 'success')
        if (draftInfo) {
            setDraftInfo({
                ...draftInfo,
                draftPropietarioResidente: uid,
            })
            handleSave()
        } else {
            navigate(`/app/ajustes/${uid}`)
        }
    }


    const handleClick = (e) => {
        e.preventDefault()
        if (userSignupRol) {
            const signUp = (email, password) => {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        var user = userCredential.user
                        onSuccess(user)
                    })
                    .catch((err) => {
                        // console.log('Error upgrading anonymous account', err)
                        // console.log(err.code)
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
            signUp(userSignupEmail, userSignupPassword)
        }
    }

    const handleGoogleProvider = (e) => {
        e.preventDefault()
        if (userSignupRol) {
            const signUp = () => {
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
                        // const credential =
                        //     GoogleAuthProvider.credentialFromError(error)
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
            signUp()
            setSend(true)
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
                            className="registrateImagen m-0 d-flex align-items-center justify-content-start"
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
                        className="registrateformulario m-0 p-0 mb-4 mt-4"
                        lg={4}
                        md={5}
                        sm={10}
                        xs={10}
                    >
                        <Paper
                            elevation={16}
                            id="formularioRegistro"
                            className="pt-4 pb-4"
                        >
                            <Form
                                action=""
                                className="p-2"
                                // preventDefault="true"
                            >
                                <Col className="d-flex pt-4 pb-4">
                                    <Typography
                                        variant="h4"
                                        className="headline-xl"
                                    >
                                        Registrate
                                    </Typography>
                                    {step == 1 ? (
                                        <>
                                            <Form.Label className="mb-0 pt-4 body-1">
                                                Primero, elige tu rol
                                            </Form.Label>
                                            <ToggleButtonGroup
                                                name="userRol"
                                                className="mb-5 mt-2 align-items-center"
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
                                                    className="body-1 p-3 btn-round btn-high btn-buscador w-auto select-rol d-flex flex-row align-items-center justify-content-center"
                                                    value={1} // "SoyPropietarioResidente" //
                                                    id="formBasicRolPropietarioResidente"
                                                    aria-label="Soy Propietario/Residente"
                                                >
                                                    Soy propietario/residente
                                                </ToggleButton>
                                                <br className="mb-2 mt-2" />
                                                <ToggleButton
                                                    className="body-1 p-3 btn-round btn-middle w-auto select-rol d-flex flex-row align-items-center justify-content-center"
                                                    value={2} // "SoyComercianteCalificado" //
                                                    id="formBasicRolComercianteCalificado"
                                                    aria-label="Soy Comerciante Calificado"
                                                >
                                                    Soy comerciante calificado
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </>
                                    ) : (
                                        <>
                                            <Form.Label className="mb-0 body-1 pt-4">
                                                {userSignupRol == 1
                                                    ? 'Soy propietario/residente'
                                                    : 'Soy comerciante calificado'}
                                            </Form.Label>
                                            <ul className="align-items-center mt-2 w-100">
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
                                                            alt="Registrarse-con-cuenta-gmail"
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
                                                            Registrarse con
                                                            Gmail
                                                        </Typography>
                                                    </Button>
                                                </li>
                                                {/* <li className="body-1 pt-2">
                                            <Button className="btn btn-round btn-middle">
                                                Registrarse con Facebook
                                            </Button>
                                        </li> */}
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
                                                    controlId="formBasicName"
                                                    style={{ width: 'inherit' }}
                                                >
                                                    <Form.Label className="mb-0 body-1">
                                                        Nombre de usuario
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="elija su usuario"
                                                        name="username"
                                                        onChange={(e) =>
                                                            setName(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </Form.Group>
                                                <Form.Group
                                                    className="w-80 mb-2 d-flex flex-column align-items-start"
                                                    controlId="formSignupEmail"
                                                    style={{ width: 'inherit' }}
                                                >
                                                    <Form.Label className="mb-0 body-1">
                                                        Email
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        placeholder="registre una cuenta de email valida"
                                                        name="email"
                                                        onChange={(e) =>
                                                            setEmail(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </Form.Group>
                                                <Form.Group
                                                    className="w-80 mb-2 d-flex flex-column align-items-start"
                                                    controlId="formSignupPassword"
                                                    style={{ width: 'inherit' }}
                                                >
                                                    <Form.Label className="mb-0 body-1">
                                                        Contraseña
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        placeholder="registre una clave"
                                                        name="password"
                                                        onChange={(e) =>
                                                            setPassword(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </Form.Group>
                                                <Form.Group
                                                    className="w-80 mb-2 d-flex flex-column align-items-start"
                                                    controlId="formBasicPassword"
                                                    style={{ width: 'inherit' }}
                                                >
                                                    <Form.Label className="mb-0 body-1">
                                                        Confirmar contraseña
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        placeholder="de nuevo la clave"
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
                                            </Col>
                                            <Col className="pt-4 pb-3">
                                                    {/* Aviso tratamiento de datos personales. */}
                                                    <a
                                                        href="https://drive.google.com/file/d/1R3uRi3zZ0MmjN3VoUp3GvLGvZ3bCaT6e/view?usp=sharing"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <h3 className="body-2 btn-TEXT textVerde2">
                                                            Aviso tratamiento de datos personales <DownloadIcon fontSize='small'/>.
                                                        </h3>
                                                    </a>
                                                <Button
                                                    className="btn-buscador btn-round btn-high body-1"
                                                    variant="primary"
                                                    type="submit"
                                                    onClick={handleClick}
                                                >
                                                    Crear Cuenta
                                                </Button>
                                                <br />
                                            </Col>
                                            {alert.open && (
                                                <SnackBarAlert
                                                    message={alert.message}
                                                    onClose={handleClose}
                                                    severity={alert.severity} // success, error, warning, info, default
                                                    open={alert.open}
                                                />
                                            )}
                                        </>
                                    )}
                                    <p className="body-1 pt-2">
                                        {/* Bienvenido a todos los beneficios de dezzpo. */}
                                        <Link
                                                    className="body-2 btn-TEXT textVerde2"
                                                    href="/ingreso/"
                                        >
                                                    {/* {'¿Ya tienes una cuenta?'} */}
                                                    {'Ingresar'}
                                        </Link>
                                    </p>
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
    draftId: PropTypes.string,
    setDraftInfo: PropTypes.func,
    draftInfo: PropTypes.object,
    handleSave: PropTypes.func,
}
