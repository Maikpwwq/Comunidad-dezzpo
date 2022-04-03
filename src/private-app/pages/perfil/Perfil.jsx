// Pagina de Usuario - Perfil
import React, { useState, useEffect } from 'react'
import { auth, firestore, storage } from '../../../firebase/firebaseClient'
import { collection, doc, setDoc, getDocFromServer } from 'firebase/firestore'

import '../../../../public/assets/cssPrivateApp/perfil.css'
import ProfilePhoto from '../../../../public/assets/img/Profile.png'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

import PermMediaOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActual'

const Perfil = (props) => {
    const user = auth.currentUser
    const userID = user.uid
    const _firestore = firestore
    const _Storage = storage 
    const usersRef = collection(_firestore, 'users')

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

    const updateProfilePhoto = () => {}

    const [userInfo, setUserInfo] = useState({
        userName: ' ',
        userMail: '',
        userPhone: ' ',
        userPhotoUrl: 'https://www.google.com',
        userId: '',
        userJoined: ' ',
        userProfession: ' ',
        userExperience: ' ',
        userUbication: ' ',
        userRazonSocial: ' ',
        userIdentification: ' ',
    })

    useEffect(() => {
        if (user !== null) {
            console.log(user)
            const {
                uid,
                email,
                displayName,
                phoneNumber,
                photoURL,
                emailVerified,
                metadata,
            } = user
            // setUserInfo({
            //     ...userInfo,
                
            // })
            // resolving promise data user
            const userData = userFromFirestore(userID)
            // userData.forEach((doc) => {
            //     console.log(doc.id, " => ", doc.data())
            // })
            userData.then((docSnap) => {
                if (docSnap.exists()) {
                    // docSnap._document.data...
                    const data = docSnap.data()
                    // console.log(docSnap.data())
                    setUserInfo({
                        ...userInfo,
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

    return (
        <>
            <Container fluid className="p-0">
                <Row className="h-100">
                    <Col className="col-10">
                        <Row className="border-green_buttom m-0 w-100 d-flex">
                            <Row className="pt-4 pb-4">
                                <Col md={4}>
                                    <div>
                                        <img
                                            src={ProfilePhoto}
                                            alt="imagen de perfil"
                                            height="150px"
                                            width="150px"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        onClick={updateProfilePhoto()}
                                    >
                                        <PermMediaOutlinedIcon alt="+ Agregar foto de perfil" />
                                    </Button>
                                </Col>
                                <Col md={3}>
                                    <Box
                                        style={{
                                            display: 'flex',
                                            'flex-direction': 'column',
                                            'align-items': 'center',
                                        }}
                                        action=""
                                    >
                                        <TextField
                                            id="userName"
                                            name="userName"
                                            label="Nombre de usuario"
                                            value={userInfo.userName}
                                            defaultValue="@NOMBRE USUARIO"
                                            variant="filled"
                                        />
                                        <TextField
                                            id="userProfession"
                                            label="Profesión"
                                            value={userInfo.userProfession}
                                            defaultValue="@PROFESIÓN"
                                            variant="filled"
                                        />
                                        <TextField
                                            id="userJoined"
                                            name="userJoined"
                                            label="Activo desde"
                                            value={userInfo.userJoined}
                                            defaultValue="@SeUnioDesdeHace"
                                            variant="filled"
                                        />
                                        <TextField
                                            id="userExperience"
                                            name="userExperience"
                                            label="Experiencia"
                                            value={userInfo.userExperience}
                                            defaultValue="@TiempoExperiencia"
                                            variant="filled"
                                        />
                                        <br />
                                        certificaciones
                                    </Box>
                                </Col>
                                <Col md={5}>
                                    <span>2 ratings</span>
                                </Col>
                            </Row>
                        </Row>
                        <Row className="m-0 w-100 d-flex justify-content-start">
                            <Col className="col-4 pt-4 pb-4">
                                <span className="p-4 p-description textBlanco fondoVerde">
                                    {userInfo.userName} <br />
                                    {userInfo.userPhone} <br />
                                    {userInfo.userMail} <br />
                                </span>
                                <img src="" alt="Mapa Ubicacion" />
                            </Col>
                        </Row>
                        <Row className="pt-4 pb-4 m-0 w-100 d-flex">
                            <Col md={7}>
                                <Row>
                                    <Col>
                                        <h3 className="headline-l">
                                            Servicios ofrecidos
                                        </h3>
                                        <div>
                                            <p className="body-1">
                                                Proyectos de carpintería y
                                                acabados en madera para su casa
                                                o negocio nos dedicamos a la
                                                realización de muebles y
                                                decoración{' '}
                                            </p>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <h3 className="headline-l">Gallería</h3>
                                        <div>
                                            <img src="" alt="" />
                                        </div>
                                        <div>
                                            <span>
                                                comentarios y calificaciones
                                            </span>
                                            <span>crear editar</span>
                                            <span>educacion</span>
                                            <span>crear editar</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    Comentarios y calificaciones Crear/Editar
                                    Educacion
                                </Row>
                            </Col>
                            <Col md={5} className="info-user_backgound">
                                <Box
                                    style={{
                                        display: 'flex',
                                        'flex-direction': 'column',
                                        'align-items': 'center',
                                    }}
                                    action=""
                                >
                                    <div>
                                        <span className="p-description">
                                            Datos de contacto
                                        </span>
                                    </div>
                                    <TextField
                                        id="userRazonSocial"
                                        name="userRazonSocial"
                                        label="Razón Social"
                                        value={userInfo.userRazonSocial}
                                        defaultValue="Razón Social"
                                        variant="filled"
                                    />
                                    <TextField
                                        id="userUbication"
                                        name="userUbication"
                                        label="Ubicación"
                                        value={userInfo.userUbication}
                                        defaultValue="ubicación"
                                        variant="filled"
                                    />
                                    <TextField
                                        id="userIdentification"
                                        name="userIdentification"
                                        label="Identificación"
                                        value={userInfo.userIdentification}
                                        defaultValue="Identificación"
                                        variant="filled"
                                    />
                                    <TextField
                                        id="userMail"
                                        name="userMail"
                                        label="Correo de usuario"
                                        value={userInfo.userMail}
                                        defaultValue="@CORREO USUARIO"
                                        variant="filled"
                                    />
                                    <TextField
                                        id="userPhone"
                                        label="Celular"
                                        name="userPhone"
                                        value={userInfo.userPhone}
                                        defaultValue="Celular"
                                        variant="filled"
                                    />
                                </Box>
                            </Col>
                        </Row>
                    </Col>
                    <Col className="col-2 h-100 fondoGris">SideContent</Col>
                </Row>
            </Container>
        </>
    )
}

export default Perfil
