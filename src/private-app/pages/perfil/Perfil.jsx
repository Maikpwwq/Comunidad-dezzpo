// Pagina de Usuario - Perfil
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { auth, firestore, storage } from '../../../firebase/firebaseClient'
import { collection, doc, getDocFromServer, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'

import '../../../../public/assets/cssPrivateApp/perfil.css'
// import ProfilePhoto from '../../../../public/assets/img/Profile.png'
// import Bogota from '../../../../public/assets/img/Bogota.png'

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
    const user = auth.currentUser || {}
    const userID = user.uid || '' // Este es el id de la cuenta de Auth
    const { state } = useLocation() || {}
    const localRole = localStorage.getItem('role')
    const selectRole = parseInt(JSON.parse(localRole))
    const [userRol, setUserRol] = useState({
        rol: selectRole,
    })
    // console.log(userRol.rol)
    // Este es el id como parametro de busqueda o consulta de un perfil especifico
    const userId =
        state != undefined && state != null && state.id != undefined
            ? state.id
            : ' '
    const consult = userId !== null && userId !== ' ' ? true : false
    const userConsultId = consult ? userId : userID
    console.log(userId, consult, userConsultId)
    // console.log(userID)
    // console.log(userConsultId)
    const _firestore = firestore
    const _storage = storage
    // const usersRef = collection(_firestore, 'users')
    const usersProResRef = collection(_firestore, 'usersPropietariosResidentes')
    const usersComCalRef = collection(
        _firestore,
        'usersComerciantesCalificados'
    )

    // const userToFirestore = async (updateInfo, userID) => {
    //     await setDoc(doc(usersRef, userID), updateInfo, { merge: true })
    // }

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
                console.log(userConsultId, userRol.rol)
                return userData
            } else if (userRol.rol === 2) {
                const userData = await getDocFromServer(
                    doc(usersComCalRef, firestoreUserID)
                )
                console.log(userConsultId, userRol.rol)
                return userData
            }
        } catch (err) {
            console.log('Error getting user: ', err)
        }
    }

    const [userInfo, setUserInfo] = useState({
        userName: ' ',
        userMail: '',
        userPhone: ' ',
        userPhotoUrl: ' ',
        userGalleryUrl: [],
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
        const profilesRef = ref(_storage, `profiles/${userConsultId}`)
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
                            // const userLoadRol = userToFirestore(
                            //     photoInfo,
                            //     userConsultId
                            // )
                            if (userRol.rol === 1) {
                                const userLoadRol = userProResToFirestore(
                                    photoInfo,
                                    userConsultId
                                )
                                userLoadRol
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
                            } else if (userRol.rol === 2) {
                                const userLoadRol = userComCalToFirestore(
                                    photoInfo,
                                    userConsultId
                                )
                                userLoadRol
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
                            }
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

    const updateGalleryPhoto = (event) => {
        const file = event.target.files
        const fileId = uuidv4()
        const userGalleryRef = ref(
            _storage,
            `profiles/${userConsultId}/${fileId}`
        )
        if (file[0] instanceof Blob) {
            console.log(file[0])
            try {
                uploadBytes(userGalleryRef, file[0]).then((response) => {
                    const { bucket, path_ } = response.ref._location
                    const base = `gs://${bucket}/${path_}`
                    console.log(
                        'Se cargo una imagen a la galleria de usuario del storage',
                        base
                    )
                    const gsReference = ref(_storage, base)
                    getDownloadURL(gsReference)
                        .then((url) => {
                            setUserInfo({
                                ...userInfo,
                                userGalleryUrl: [url],
                            })
                            const photoInfo = { userGalleryUrl: [url] }
                            if (userRol.rol === 1) {
                                const userLoadRol = userProResToFirestore(
                                    photoInfo,
                                    userConsultId
                                )
                                userLoadRol
                                    .then((docSnap) => {
                                        console.log(
                                            'Se actualiza URL de imagen a la galeria de usuario del firestore',
                                            docSnap
                                        )
                                    })
                                    .catch((error) => {
                                        console.log(
                                            'No se pudo actualizar URL de imagen a la galeria de usuario del firestore',
                                            error
                                        )
                                    })
                            } else if (userRol.rol === 2) {
                                const userLoadRol = userComCalToFirestore(
                                    photoInfo,
                                    userConsultId
                                )
                                userLoadRol
                                    .then((docSnap) => {
                                        console.log(
                                            'Se actualiza URL de imagen a la galeria de usuario del firestore',
                                            docSnap
                                        )
                                    })
                                    .catch((error) => {
                                        console.log(
                                            'No se pudo actualizar URL de imagen a la galeria de usuario del firestore',
                                            error
                                        )
                                    })
                            }
                            // userToFirestore(photoInfo, userConsultId)
                            //     .then((docSnap) => {
                            //         console.log(
                            //             'Se actualiza URL de imagen a la galeria de usuario del firestore',
                            //             docSnap
                            //         )
                            //     })
                            //     .catch((error) => {
                            //         console.log(
                            //             'No se pudo actualizar URL de imagen a la galeria de usuario del firestore',
                            //             error
                            //         )
                            //     })
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
        // if (state.role == 1 || state.role == 2) {
        //     setUserRol({ rol: state.role })
        //     console.log(userRol, state.role)
        // }
        // if (!isNaN(JSON.parse(localRole))) {
        //     console.log(JSON.parse(localRole))
        //     setUserRol({ rol: JSON.parse(localRole)})
        // }
        console.log(userRol, state)
        if (user !== null && !isNaN(userRol.rol) && userRol.rol !== '') {
            // console.log(user)
            const {
                uid,
                email,
                displayName,
                phoneNumber,
                photoURL,
                emailVerified,
                metadata,
            } = user
            // resolving promise data user
            console.log(userConsultId, userRol.rol)
            const userData = userFromFirestore(userConsultId)

            // userData.forEach((doc) => {
            //     console.log(doc.id, " => ", doc.data())
            // })
            userData.then((docSnap) => {
                // docSnap.exists()
                if (docSnap) {
                    // docSnap._document.data...
                    const data = docSnap.data()
                    console.log(data)
                    if (data) {
                        setUserInfo({
                            ...userInfo,
                            userPhone: data.userPhone || phoneNumber,
                            userPhotoUrl: data.userPhotoUrl || photoURL,
                            userId: data.userId || uid,
                            userMail: data.userMail || email,
                            userName: data.userName || displayName,
                            userGalleryUrl: data.GalleryUrl || [],
                            userJoined: metadata.creationTime,
                            userProfession: data.userProfession,
                            userExperience: data.userExperience,
                            userUbication: data.userUbication,
                            userRazonSocial: data.userRazonSocial,
                            userIdentification: data.userIdentification,
                            userDescription: data.userDescription,
                        })
                    }
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
                <Row className="h-100 pt-4 pb-4">
                    <Col className="col-10">
                        <Row className="border-green_buttom perfil-banner m-0 w-100 d-flex">
                            <Row className="pt-4 pb-4">
                                <Col className="pe-0" md={4}>
                                    <div
                                        className="d-flex flex-inline-row"
                                        style={{
                                            'justify-content': 'center',
                                            'align-items': 'baseline',
                                        }}
                                    >
                                        <img
                                            src={userInfo.userPhotoUrl}
                                            alt="imagen de perfil"
                                            height="150px"
                                            width="150px"
                                            style={{
                                                'border-radius': '50%',
                                            }}
                                        />

                                        <label
                                            htmlFor="icon-button-file"
                                            style={{
                                                position: 'relative',
                                                right: '50px',
                                            }}
                                        >
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
                                    </div>
                                </Col>
                                <Col md={3} className="p-0">
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
                                            id="userExperience"
                                            name="userExperience"
                                            label="Experiencia"
                                            value={userInfo.userExperience}
                                            defaultValue="@TiempoExperiencia"
                                            variant="filled"
                                        />
                                    </Box>
                                </Col>
                                <Col
                                    className="user-stadistics d-flex flex-column justify-content-end align-items-center"
                                    md={5}
                                >
                                    <div className="ps-4 pe-4 opacidadNegro">
                                        <span>2 ratings</span>
                                        <br />
                                        certificaciones
                                    </div>
                                </Col>
                            </Row>
                        </Row>
                        <Row className="mapa-ubicacion m-0 w-100 d-flex justify-content-start align-items-end">
                            {/* <img
                                className="p-0"
                                src={Bogota}
                                alt="Mapa Ubicacion"
                                width="100%"
                                height="330px"
                            /> */}
                            <Col className="col-6 p-0 align-items-start">
                                <span className="p-4 p-description textBlanco fondoVerde">
                                    {userInfo.userRazonSocial} <br />
                                    {userInfo.userPhone} <br />
                                    {userInfo.userMail} <br />
                                </span>
                            </Col>
                        </Row>
                        <Row className="pt-4 m-0 w-100 d-flex align-items-start">
                            <Col md={7}>
                                <Row className="pt-4 pb-4">
                                    <Col>
                                        <h3 className="headline-l">
                                            Servicios ofrecidos
                                        </h3>
                                        <p
                                            className="body-1 pe-4"
                                            style={{
                                                'text-align': 'justify',
                                            }}
                                        >
                                            {userInfo.userDescription}
                                        </p>
                                    </Col>
                                </Row>
                                <Col>Certificaciones</Col>
                                <Row>
                                    <Col>
                                        <h3 className="headline-l">Gallería</h3>
                                        <Row className="w-100">
                                            <span className="w-auto">
                                                <img
                                                    src="http://placeimg.com/150/150/tech"
                                                    alt="galleria-usuario"
                                                />
                                            </span>

                                            <label
                                                htmlFor="icon-button-file"
                                                style={{
                                                    position: 'relative',
                                                    right: '50px',
                                                    width: 'auto',
                                                }}
                                            >
                                                <Input
                                                    accept="image/*"
                                                    id="icon-button-file"
                                                    type="file"
                                                    onClick={updateGalleryPhoto}
                                                />
                                                <Button
                                                    type="submit"
                                                    id="galleryPhoto"
                                                    name="galleryPhoto"
                                                    variant="contained"
                                                    component="span"
                                                >
                                                    <PermMediaOutlinedIcon alt="+ Agregar foto a la galeria de usuario" />
                                                </Button>
                                            </label>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className="pt-4 pb-4">
                                    Comentarios
                                    <Button>Crear</Button>
                                    <Button>Editar</Button>
                                </Row>
                                <Row className="">
                                    Calificaciones
                                    <Button>Crear</Button>
                                    <Button>Editar</Button>
                                </Row>
                            </Col>
                            <Col
                                md={5}
                                className="pt-4 pb-4 info-user_backgound"
                            >
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
                                        id="userJoined"
                                        name="userJoined"
                                        label="Activo desde"
                                        value={userInfo.userJoined}
                                        defaultValue="@SeUnioDesdeHace"
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
                    {/* <Col className="col-2 h-100 fondoGris">SideContent</Col> */}
                </Row>
            </Container>
        </>
    )
}

export default Perfil
