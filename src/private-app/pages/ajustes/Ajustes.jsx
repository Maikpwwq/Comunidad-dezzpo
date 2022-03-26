// Pagina de Usuario - Ajustes
import React, { useState, useEffect } from 'react'
import { auth } from '../../../firebase/firebaseClient'
import { updateProfile } from 'firebase/auth'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import TextField from '@mui/material/TextField'
import FormGroup from '@mui/material/FormGroup'
import TextareaAutosize from '@mui/material/TextareaAutosize'

const Ajustes = (props) => {
    const user = auth.currentUser

    const [userEditInfo, setUserEditInfo] = useState({
        userName: 'Michael Arias Fajardo',
        userMail: '',
        userPhone: '3196138057',
        userPhotoUrl: '',
        userId: '',
        userJoined: 'se unio en 2020',
        userProfession: 'soldador',
        userExperience: '4 años',
        userUbication: 'Soacha, cundinamarca',
        userRazonSocial: 'Comunidad Dezzpo',
        userIdentification: 'private',
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
            setUserEditInfo({
                ...userEditInfo,
                userPhone: phoneNumber,
                userPhotoUrl: photoURL,
                userId: uid,
                userMail: email,
                userName: displayName,
                userJoined: metadata.creationTime,
            })
        }
    }, [user])

    const handleChange = (event) => {
        setUserEditInfo({
            ...userEditInfo,
            [event.target.name]: event.target.value,
        })

        sendInfo()
    }

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
                // updateCurrentUser(auth, profile)
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
                <Col className="m-0 w-100 d-flex align-items-start justify-content-start">
                    <Row md={10}>
                        <div>
                            <FormGroup
                                action=""
                                style={{
                                    display: 'flex',
                                    'flex-direction': 'column',
                                    'align-items': 'center',
                                }}
                            >
                                <div>
                                    <span className="body-1">
                                        Datos de contacto
                                    </span>
                                </div>
                                <TextField
                                    id="userName"
                                    name="userName"
                                    label="Nombre de usuario"
                                    value={userEditInfo.userName}
                                    onChange={handleChange}
                                    defaultValue="@NOMBRE USUARIO"
                                />
                                <TextField
                                    id="userProfession"
                                    label="Profesión"
                                    value={userEditInfo.userProfession}
                                    onChange={handleChange}
                                    defaultValue="@PROFESIÓN"
                                />
                                <TextField
                                    id="userJoined"
                                    name="userJoined"
                                    label="Activo desde"
                                    value={userEditInfo.userJoined}
                                    onChange={handleChange}
                                    defaultValue="@SeUnioDesdeHace"
                                />
                                <TextField
                                    id="userExperience"
                                    name="userExperience"
                                    label="Experiencia"
                                    value={userEditInfo.userExperience}
                                    onChange={handleChange}
                                    defaultValue="@TiempoExperiencia"
                                />
                                <TextField
                                    id="userRazonSocial"
                                    name="userRazonSocial"
                                    label="Razón Social"
                                    value={userEditInfo.userRazonSocial}
                                    onChange={handleChange}
                                    defaultValue="Razón Social"
                                />
                                <TextField
                                    id="userUbication"
                                    name="userUbication"
                                    label="Ubicación"
                                    value={userEditInfo.userUbication}
                                    onChange={handleChange}
                                    defaultValue="ubicación"
                                />
                                <TextField
                                    id="userIdentification"
                                    name="userIdentification"
                                    label="Identificación"
                                    value={userEditInfo.userIdentification}
                                    onChange={handleChange}
                                    defaultValue="Identificación"
                                />
                                <TextField
                                    id="userMail"
                                    name="userMail"
                                    label="Correo de usuario"
                                    value={userEditInfo.userMail}
                                    // onChange={handleChange}
                                    defaultValue="@CORREO USUARIO"
                                    variant="filled"
                                />
                                <TextField
                                    id="userPhone"
                                    label="Celular"
                                    name="userPhone"
                                    value={userEditInfo.userPhone}
                                    onChange={handleChange}
                                    defaultValue="Celular"
                                />

                                <label for="ofertaServicios">
                                    Servicios ofrecidos
                                </label>
                                <TextareaAutosize
                                    name="ofertaServicios"
                                    id="ofertaServicios"
                                    placeholder="Registra los servicios que ofreces"
                                    cols="30"
                                    minRows={8}
                                ></TextareaAutosize>
                            </FormGroup>
                            <p>Confirma tu identidad</p>
                        </div>
                    </Row>
                </Col>
            </Container>
        </>
    )
}

export default Ajustes
