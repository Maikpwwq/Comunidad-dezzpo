// Pagina de Usuario - Ajustes
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { auth, firestore } from '../../../firebase/firebaseClient'
import { collection, doc, setDoc, getDocFromServer } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'

import '../../../../public/assets/cssPrivateApp/ajustes.css'
import Ubicacion from '../../../app/pages/ubicacion/Ubicacion'
import SnackBarAlert from '../../../app/components/SnackBarAlert'
import ChipsCategories from '../../components/ChipsCategories'
import ListadoCategorias from '../../../app/components/ListadoCategorias'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormGroup from '@mui/material/FormGroup'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import Modal from '@mui/material/Modal'

const Ajustes = (props) => {
    const user = auth.currentUser || {}
    const userID = user.uid || ''
    const _firestore = firestore
    const { state } = useLocation() || {}
    const localRole = localStorage.getItem('role')
    const selectRole = parseInt(JSON.parse(localRole))
    const [userRol, setUserRol] = useState({
        rol: selectRole,
    })
    console.log(userRol.rol)
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success',
    })
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const usersProResRef = collection(_firestore, 'usersPropietariosResidentes')
    const usersComCalRef = collection(
        _firestore,
        'usersComerciantesCalificados'
    )

    const userProResToFirestore = async (updateInfo, userID) => {
        await setDoc(doc(usersProResRef, userID), updateInfo, { merge: true })
    }

    const userComCalToFirestore = async (updateInfo, userID) => {
        await setDoc(doc(usersComCalRef, userID), updateInfo, { merge: true })
    }

    const userFromFirestore = async (firestoreUserID) => {
        try {
            if (userRol.rol === 1) {
                const userData = await getDocFromServer(
                    doc(usersProResRef, firestoreUserID)
                )
                return userData
            } else if (userRol.rol === 2) {
                const userData = await getDocFromServer(
                    doc(usersComCalRef, firestoreUserID)
                )
                return userData
            }
        } catch (err) {
            console.log('Error getting user: ', err)
        }
    }

    const [userEditInfo, setUserEditInfo] = useState({
        userName: '',
        userMail: '',
        userPhone: '',
        userPhotoUrl: '',
        userGalleryUrl: [],
        userCreatedDrafts: [],
        userId: '',
        userJoined: '',
        userProfession: '',
        userExperience: '',
        userCategorie: '',
        userClasification: [],
        userGrade: '',
        userCategories: '',
        userDirection: '',
        userCiudad: '',
        userCodigoPostal: '',
        userRazonSocial: '',
        userIdentification: '',
        userDescription: '',
    })

    useEffect(() => {
        console.log(userRol.rol, user)
        if (user !== null && userRol.rol) {
            const {
                uid,
                email,
                displayName,
                phoneNumber,
                photoURL,
                emailVerified,
                // metadata,
            } = user
            const userData = userFromFirestore(userID)
            userData.then((docSnap) => {
                // docSnap.exists()
                if (docSnap) {
                    const data = docSnap.data()
                    setUserEditInfo({
                        ...userEditInfo,
                        userPhone: data.userPhone || phoneNumber,
                        userPhotoUrl: data.userPhotoUrl || photoURL,
                        userId: uid,
                        userMail: email,
                        userName: displayName,
                        userJoined: data.userJoined,
                        userProfession: data.userProfession,
                        userExperience: data.userExperience,
                        userCategorie: data.userCategorie,
                        userClasification: data.userClasification,
                        userGrade: data.userGrade,
                        userCategories: data.userCategories,
                        userDirection: data.userDirection,
                        userCiudad: data.userCiudad,
                        userCodigoPostal: data.userCodigoPostal,
                        userRazonSocial: data.userRazonSocial,
                        userIdentification: data.userIdentification,
                        userDescription: data.userDescription,
                    })
                    console.log(user, userEditInfo)
                } else {
                    console.log(
                        'No se encontro información relacionada con este usuario!'
                    )
                }
            })
        }
    }, [user])

    const handleAlert = (message, severity) => {
        setAlert({ ...alert, open: true, message: message, severity: severity })
    }

    const handleCloseAlert = (event, reason) => {
        // console.log(reason, event)
        if (reason === 'clickaway') {
            return
        } else {
            setAlert({ ...alert, open: false, message: '' })
        }
    }

    const handleChange = (event) => {
        setUserEditInfo({
            ...userEditInfo,
            [event.target.name]: event.target.value,
        })
    }

    const handleSubmit = () => {
        if (userRol.rol === 1) {
            const snap = userProResToFirestore(userEditInfo, user.uid)
            snap.then((docSnap) => {
                handleAlert(
                    'Se actualizó correctamente su información!',
                    'success'
                )
                // console.log(docSnap)
            })
        } else if (userRol.rol === 2) {
            const snap = userComCalToFirestore(userEditInfo, user.uid)
            snap.then((docSnap) => {
                handleAlert(
                    'Se actualizó correctamente su información!',
                    'success'
                )
                // console.log(docSnap)
            })
        }
        sendInfo()
    }
    // Firebase Auth
    const sendInfo = () => {
        event.preventDefault()
        // console.log('enviando datos...')
        const profile = {
            displayName: userEditInfo.userName,
            phoneNumber: userEditInfo.userPhone,
            photoURL: userEditInfo.userPhotoUrl,
        }
        if (user !== null) {
            // console.log(auth)
            updateProfile(user, profile)
                .then((result) => {
                    console.log(`Se actualizo el perfil de usuario ${result}`)
                })
                .catch((error) => {
                    console.log(
                        `Se produjo un error al actualizar el perfil de usuario ${error}`
                    )
                })
        }
    }

    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex align-items-start pb-4 pt-4">
                    <Col className="col-10">
                        {alert.open && (
                            <SnackBarAlert
                                message={alert.message}
                                onClose={handleCloseAlert}
                                severity={alert.severity} // success, error, warning, info, default
                                open={alert.open}
                            />
                        )}
                        <Row className="p-0 info-user_backgound">
                            <FormGroup
                                action=""
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <div className="w-100">
                                    <h3 className="p-description pb-4 pt-4">
                                        Datos de contacto
                                    </h3>
                                </div>
                                <hr />
                                <TextField
                                    id="userName"
                                    name="userName"
                                    label="Nombre de usuario"
                                    value={userEditInfo.userName}
                                    onChange={handleChange}
                                    // defaultValue="@NOMBRE USUARIO"
                                    className="pb-4 pe-4"
                                />
                                <TextField
                                    id="userMail"
                                    name="userMail"
                                    label="Correo de usuario"
                                    value={userEditInfo.userMail}
                                    // onChange={handleChange}
                                    // defaultValue="@CORREO USUARIO"
                                    variant="filled"
                                    className="pb-4 pe-4"
                                />
                                <TextField
                                    id="userJoined"
                                    name="userJoined"
                                    label="Activo desde"
                                    value={userEditInfo.userJoined}
                                    // onChange={handleChange}
                                    // defaultValue="@SeUnioDesdeHace"
                                    variant="filled"
                                    className="pb-4 pe-4"
                                />
                                {userRol.rol === 2 ? (
                                    <>
                                        <TextField
                                            id="userProfession"
                                            name="userProfession"
                                            label="Profesión"
                                            value={userEditInfo.userProfession}
                                            onChange={handleChange}
                                            // defaultValue="@PROFESIÓN"
                                            className="pb-4 pe-4"
                                        />
                                        <TextField
                                            id="userExperience"
                                            name="userExperience"
                                            label="Experiencia"
                                            value={userEditInfo.userExperience}
                                            onChange={handleChange}
                                            // defaultValue="@TiempoExperiencia"
                                            className="pb-4 pe-4"
                                        />
                                        <TextField
                                            id="userRazonSocial"
                                            name="userRazonSocial"
                                            label="Razón Social"
                                            value={userEditInfo.userRazonSocial}
                                            onChange={handleChange}
                                            // defaultValue="Razón Social"
                                            className="pb-4 pe-4"
                                        />
                                    </>
                                ) : (
                                    <></>
                                )}
                                <TextField
                                    id="userDirection"
                                    name="userDirection"
                                    label="Ubicación"
                                    value={userEditInfo.userDirection}
                                    variant="filled"
                                    // onChange={handleChange}
                                    // defaultValue="ubicación"
                                    className="pb-4 pe-4"
                                />
                                <TextField
                                    id="userCiudad"
                                    name="userCiudad"
                                    label="Ciudad"
                                    value={userEditInfo.userCiudad}
                                    variant="filled"
                                    // onChange={handleChange}
                                    // defaultValue="ubicación"
                                    className="pb-4 pe-4"
                                />
                                <TextField
                                    id="userIdentification"
                                    name="userIdentification"
                                    label="Identificación"
                                    value={userEditInfo.userIdentification}
                                    onChange={handleChange}
                                    // defaultValue="Identificación"
                                    className="pb-4 pe-4"
                                />

                                <TextField
                                    id="userPhone"
                                    label="Celular"
                                    name="userPhone"
                                    value={userEditInfo.userPhone}
                                    onChange={handleChange}
                                    // defaultValue="Celular"
                                    className="pb-4 pe-4"
                                />
                                <Row className="pb-4 w-100">
                                    <Col className="col-6">
                                        <Button
                                            className="body-2"
                                            onClick={handleOpen}
                                        >
                                            {'Registrar ubicación'}
                                        </Button>
                                        <Modal
                                            open={open}
                                            onClose={handleClose}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                        >
                                            <Ubicacion
                                                setLocInfo={setUserEditInfo}
                                                locInfo={userEditInfo}
                                                setOpen={setOpen}
                                            />
                                        </Modal>
                                    </Col>
                                    <Col className="col-6">
                                        <Button
                                            type="submit"
                                            className="btn btn-primary"
                                            onClick={handleSubmit}
                                        >
                                            Guardar cambios
                                        </Button>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Row>
                    </Col>
                    <Col className="col-10">
                        <hr />
                        <Row className="">
                            <label
                                htmlFor="ofertaServicios"
                                className="p-description pb-4 w-100"
                            >
                                {userRol.rol === 2
                                    ? 'Servicios ofrecidos'
                                    : 'Presentación'}
                            </label>
                            <TextareaAutosize
                                value={userEditInfo.userDescription}
                                onChange={handleChange}
                                name="userDescription"
                                id="ofertaServicios"
                                placeholder={
                                    userRol.rol === 2
                                        ? 'Registra los servicios que ofreces (max. 400 caracteres).'
                                        : 'Registra tu presentación (max. 400 caracteres).'
                                }
                                cols="30"
                                minRows={4}
                                className="w-100"
                            ></TextareaAutosize>
                            {userRol.rol === 2 ? (
                                <Col className="pt-2">
                                    <p className="body-1 m-0">
                                        Selecciona hasta cuatro categorias para
                                        mostrar en tu perfil de usuario
                                    </p>
                                    <ChipsCategories
                                        setUserEditInfo={setUserEditInfo}
                                        userEditInfo={userEditInfo}
                                        listadoCategorias={ListadoCategorias}
                                    />
                                </Col>
                            ) : (
                                <></>
                            )}
                            <Row className="pb-2 pt-2 w-100">
                                <Col className="">
                                    <Button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={handleSubmit}
                                    >
                                        Guardar cambios
                                    </Button>
                                </Col>
                            </Row>
                        </Row>
                    </Col>
                    <Col className="col-10">
                        <hr />
                        <p className="p-description">Confirma tu identidad</p>
                        <p className="body-1">
                            Adjunta tu documento de identificación para...
                        </p>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Ajustes
