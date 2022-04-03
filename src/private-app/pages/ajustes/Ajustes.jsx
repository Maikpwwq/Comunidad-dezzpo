// Pagina de Usuario - Ajustes
import React, { useState, useEffect } from 'react'
import { auth, firestore } from '../../../firebase/firebaseClient'
import { collection, doc, setDoc, getDocFromServer } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormGroup from '@mui/material/FormGroup'
import TextareaAutosize from '@mui/material/TextareaAutosize'

const Ajustes = (props) => {
    const user = auth.currentUser
    const userID = user.uid
    const _firestore = firestore
    const usersRef = collection(_firestore, 'users')

    const userToFirestore = async (updateInfo, userID) => {
        await setDoc(doc(usersRef, userID), updateInfo)
    }

    const userFromFirestore = async (firestoreUserID) => {
        try {
            const userData = await getDocFromServer(
                doc(usersRef, firestoreUserID)
            )
            return userData
        } catch (err) {
            console.log('Error getting user: ', err)
        }
    }

    const [userEditInfo, setUserEditInfo] = useState({
        userName: ' ',
        userMail: ' ',
        userPhone: ' ',
        userPhotoUrl: 'https://www.google.com',
        userId: ' ',
        userJoined: ' ',
        userProfession: ' ',
        userExperience: ' ',
        userUbication: ' ',
        userRazonSocial: ' ',
        userIdentification: ' ',
    })

    useEffect(() => {
        if (user !== null) {
            const {
                uid,
                email,
                displayName,
                phoneNumber,
                photoURL,
                emailVerified,
                metadata,
            } = user
            // setUserEditInfo({
            //     ...userEditInfo,

            // })
            const userData = userFromFirestore(userID)
            userData.then((docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data()
                    setUserEditInfo({
                        ...userEditInfo,
                        userPhone: data.userPhone || phoneNumber,
                        userPhotoUrl: photoURL,
                        userId: uid,
                        userMail: email,
                        userName: displayName,
                        userJoined: metadata.creationTime,
                        userProfession: data.userProfession,
                        userExperience: data.userExperience,
                        userUbication: data.userUbication,
                        userRazonSocial: data.userRazonSocial,
                        userIdentification: data.userIdentification,
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
        const snap = userToFirestore(userEditInfo, user.uid)
        sendInfo()
        snap.then((docSnap) => {
            console.log(docSnap)
        })
    }
    // Firebase Auth
    const sendInfo = () => {
        event.preventDefault()
        console.log('enviando datos...')
        const profile = {
            displayName: userEditInfo.userName,
            phoneNumber: userEditInfo.userPhone,
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
                <Row className="m-0 w-100 d-flex align-items-start justify-content-start">
                    <Row className="pb-4" md={10}>
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
                                    id="userProfession"
                                    name="userProfession"
                                    label="Profesión"
                                    value={userEditInfo.userProfession}
                                    onChange={handleChange}
                                    defaultValue="@PROFESIÓN"
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
                                <TextField
                                    id="userExperience"
                                    name="userExperience"
                                    label="Experiencia"
                                    value={userEditInfo.userExperience}
                                    onChange={handleChange}
                                    defaultValue="@TiempoExperiencia"
                                    className="pb-4 pe-4"
                                />
                                <TextField
                                    id="userRazonSocial"
                                    name="userRazonSocial"
                                    label="Razón Social"
                                    value={userEditInfo.userRazonSocial}
                                    onChange={handleChange}
                                    defaultValue="Razón Social"
                                    className="pb-4 pe-4"
                                />
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
                                    Servicios ofrecidos
                                </label>
                                <hr />
                                <TextareaAutosize
                                    name="ofertaServicios"
                                    id="ofertaServicios"
                                    placeholder="Registra los servicios que ofreces"
                                    cols="30"
                                    minRows={8}
                                    className="w-100"
                                ></TextareaAutosize>
                            </FormGroup>
                        </div>
                    </Row>
                    <Col className="pt-4" md={10}>
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
