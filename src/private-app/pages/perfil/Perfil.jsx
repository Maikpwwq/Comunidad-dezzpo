// Pagina de Usuario - Perfil
import React, { useState, useEffect } from 'react'
import { auth, firestore, storage } from '../../../firebase/firebaseClient'
import { collection, doc, getDocFromServer, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import '../../../../public/assets/cssPrivateApp/perfil.css'
// import ProfilePhoto from '../../../../public/assets/img/Profile.png'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

import PermMediaOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActual'

const Input = styled('input')({
    display: 'none',
})

const Perfil = (props) => {
    const user = auth.currentUser
    const userID = user.uid
    const _firestore = firestore
    const _storage = storage
    const usersRef = collection(_firestore, 'users')

    const userToFirestore = async (updateInfo, userID) => {
        await setDoc(doc(usersRef, userID), updateInfo, { merge: true })
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

    const [userInfo, setUserInfo] = useState({
        userName: ' ',
        userMail: '',
        userPhone: ' ',
        userPhotoUrl: ' ',
        userId: ' ',
        userJoined: ' ',
        userProfession: ' ',
        userExperience: ' ',
        userUbication: ' ',
        userRazonSocial: ' ',
        userIdentification: ' ',
        userDescription: ' ',
    })

    const updateProfilePhoto = (event) => {
        const file = event.target.files
        const profilesRef = ref(_storage, `profiles/${userID}`)
        if (file[0] instanceof Blob) {
            console.log(file[0])
            try {
                uploadBytes(profilesRef, file[0]).then((response) => {
                    const { bucket, path_ } = response.ref._location
                    const base = `gs://${bucket}/${path_}`
                    console.log(
                        'Se cargo una imagen de perfil al storage',
                        base
                    )
                    const gsReference = ref(_storage, base)
                    getDownloadURL(gsReference)
                        .then((url) => {
                            setUserInfo({
                                ...userInfo,
                                userPhotoUrl: url,
                            })
                            const photoInfo = { userPhotoUrl: url }
                            userToFirestore(photoInfo, userID)
                                .then((docSnap) => {
                                    console.log(
                                        'Se actualiza URL imagen de perfil a firestore',
                                        docSnap
                                    )
                                })
                                .catch((error) => {
                                    console.log(
                                        'No se pudo actualizar la imagen de perfil en firestore',
                                        error
                                    )
                                })
                        })
                        .catch((error) => {
                            console.log(
                                'No se encontro una URL en el storage',
                                error
                            )
                        })
                })
            } catch (e) {
                console.log('La imagen de perfil no se cargo al storage', e)
            }
        }
    }

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
                        userPhotoUrl: data.userPhotoUrl || photoURL,
                        userId: uid,
                        userMail: email,
                        userName: displayName,
                        userJoined: metadata.creationTime,
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
                                            src={userInfo.userPhotoUrl}
                                            alt="imagen de perfil"
                                            height="150px"
                                            width="150px"
                                            style={{
                                                'border-radius': '50%',
                                            }}
                                        />
                                    </div>
                                    <label htmlFor="icon-button-file">
                                        <Input
                                            accept="image/*"
                                            id="icon-button-file"
                                            type="file"
                                            onClick={updateProfilePhoto}
                                        />
                                        <Button
                                            type="submit"
                                            id="profilePhoto"
                                            name="profilePhoto"
                                            variant="contained"
                                            component="span"
                                        >
                                            <PermMediaOutlinedIcon alt="+ Agregar foto de perfil" />
                                        </Button>
                                    </label>
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
                                            id="userRazonSocial"
                                            name="userRazonSocial"
                                            label="Razón Social"
                                            value={userInfo.userRazonSocial}
                                            defaultValue="Razón Social"
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
                            <Col className="col-4 pt-4 pb-4 align-items-start">
                                <span className="p-4 p-description textBlanco fondoVerde">
                                    {userInfo.userRazonSocial} <br />
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
                                                {userInfo.userDescription}
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
                                        id="userName"
                                        name="userName"
                                        label="Nombre de usuario"
                                        value={userInfo.userName}
                                        defaultValue="@NOMBRE USUARIO"
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
