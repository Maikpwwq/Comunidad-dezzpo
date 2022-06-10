// Pagina de Usuario - Ajustes
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { auth, firestore } from '../../../firebase/firebaseClient'
import { collection, doc, setDoc, getDocFromServer } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'

import '../../../../public/assets/cssPrivateApp/ajustes.css'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormGroup from '@mui/material/FormGroup'
import TextareaAutosize from '@mui/material/TextareaAutosize'

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

    const usersProResRef = collection(_firestore, 'usersPropietariosResidentes')
    const usersComCalRef = collection(
        _firestore,
        'usersComerciantesCalificados'
    )

    const userProResToFirestore = async (updateInfo, userID) => {
        await setDoc(doc(usersProResRef, userID), updateInfo)
    }

    const userComCalToFirestore = async (updateInfo, userID) => {
        await setDoc(doc(usersComCalRef, userID), updateInfo)
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
        userId: '',
        userJoined: '',
        userProfession: '',
        userExperience: '',
        userUbication: '',
        userRazonSocial: '',
        userIdentification: '',
        userDescription: '',
    })

    useEffect(() => {
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
                        userUbication: data.userUbication,
                        userRazonSocial: data.userRazonSocial,
                        userIdentification: data.userIdentification,
                        userDescription: data.userDescription,
                    })
                } else {
                    console.log(
                        'No se encontro información relacionada con este usuario!'
                    )
                }
            })
        }
    }, [user])

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
                console.log(docSnap) 
            })
        } else if (userRol.rol === 2) {
            const snap = userComCalToFirestore(userEditInfo, user.uid)
            snap.then((docSnap) => {
                console.log(docSnap)
            })
        }
        sendInfo()
    }
    // Firebase Auth
    const sendInfo = () => {
        event.preventDefault()
        console.log('enviando datos...')
        const profile = {
            displayName: userEditInfo.userName,
            phoneNumber: userEditInfo.userPhone,
            photoURL: userEditInfo.userPhotoUrl,
        }
        if (user !== null) {
            console.log(auth)
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
                        <Row className="pb-4 info-user_backgound">
                            <div>
                                <FormGroup
                                    action=""
                                    style={{
                                        display: 'flex',
                                        'flex-direction': 'row',
                                        'align-items': 'center',
                                    }}
                                >
                                    <div className="pb-4 w-100">
                                        <h3 className="body-1 pb-4">
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
                                        defaultValue="@NOMBRE USUARIO"
                                        className="pb-4 pe-4"
                                    />
                                    <TextField
                                        id="userMail"
                                        name="userMail"
                                        label="Correo de usuario"
                                        value={userEditInfo.userMail}
                                        // onChange={handleChange}
                                        defaultValue="@CORREO USUARIO"
                                        variant="filled"
                                        className="pb-4 pe-4"
                                    />
                                    <TextField
                                        id="userJoined"
                                        name="userJoined"
                                        label="Activo desde"
                                        value={userEditInfo.userJoined}
                                        // onChange={handleChange}
                                        defaultValue="@SeUnioDesdeHace"
                                        variant="filled"
                                        className="pb-4 pe-4"
                                    />
                                    {userRol.rol === 2 ? (
                                        <>
                                            <TextField
                                                id="userProfession"
                                                name="userProfession"
                                                label="Profesión"
                                                value={
                                                    userEditInfo.userProfession
                                                }
                                                onChange={handleChange}
                                                defaultValue="@PROFESIÓN"
                                                className="pb-4 pe-4"
                                            />
                                            <TextField
                                                id="userExperience"
                                                name="userExperience"
                                                label="Experiencia"
                                                value={
                                                    userEditInfo.userExperience
                                                }
                                                onChange={handleChange}
                                                defaultValue="@TiempoExperiencia"
                                                className="pb-4 pe-4"
                                            />
                                            <TextField
                                                id="userRazonSocial"
                                                name="userRazonSocial"
                                                label="Razón Social"
                                                value={
                                                    userEditInfo.userRazonSocial
                                                }
                                                onChange={handleChange}
                                                defaultValue="Razón Social"
                                                className="pb-4 pe-4"
                                            />
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    <TextField
                                        id="userUbication"
                                        name="userUbication"
                                        label="Ubicación"
                                        value={userEditInfo.userUbication}
                                        onChange={handleChange}
                                        defaultValue="ubicación"
                                        className="pb-4 pe-4"
                                    />
                                    <TextField
                                        id="userIdentification"
                                        name="userIdentification"
                                        label="Identificación"
                                        value={userEditInfo.userIdentification}
                                        onChange={handleChange}
                                        defaultValue="Identificación"
                                        className="pb-4 pe-4"
                                    />

                                    <TextField
                                        id="userPhone"
                                        label="Celular"
                                        name="userPhone"
                                        value={userEditInfo.userPhone}
                                        onChange={handleChange}
                                        defaultValue="Celular"
                                        className="pb-4 pe-4"
                                    />

                                    <Row className="pb-4 w-100">
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

                                    <label
                                        htmlFor="ofertaServicios"
                                        className="body-1 pb-4 w-100"
                                    >
                                        {userRol.rol === 2
                                            ? 'Servicios ofrecidos'
                                            : 'Presentación'}
                                    </label>
                                    <hr />
                                    <TextareaAutosize
                                        value={userEditInfo.userDescription}
                                        onChange={handleChange}
                                        name="userDescription"
                                        id="ofertaServicios"
                                        placeholder="Registra los servicios que ofreces"
                                        cols="30"
                                        minRows={8}
                                        className="w-100"
                                    ></TextareaAutosize>
                                    <Row className="pb-4 w-100">
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
                                </FormGroup>
                            </div>
                        </Row>
                    </Col>

                    <Col className="col-10 pt-4">
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
