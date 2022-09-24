// Pagina de Usuario - Perfil
import React, { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { auth, firestore, storage } from '../../../firebase/firebaseClient'
import { collection, doc, getDocFromServer, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { format, formatDistance, subDays, parse, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

import '../../../../public/assets/cssPrivateApp/perfil.css'
// import ProfilePhoto from '../../../../public/assets/img/Profile.png'
// import Bogota from '../../../../public/assets/img/Bogota.png'
import MapaPerfil from './MapaPerfil'
import CincoEstrellas from './CincoEstrellas'
import Comentarios from '../../../private-app/components/Comentarios'
import ChipsCategories from '../../components/ChipsCategories'
import ListadoCategorias from '../../../app/components/ListadoCategorias'
import AdjuntarArchivos from '../../components/AdjuntarArchivos'
// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'


const Perfil = (props) => {
    const user = auth.currentUser || {}
    const userID = user.uid || '' // Este es el id de la cuenta de Auth
    let isLoaded = false
    let { id } = useParams() // Este es el id de la busqueda
    // console.log(id)
    const { state } = useLocation() || {} // No se pasa mas?
    const localRole = localStorage.getItem('role')
    const selectRole = parseInt(JSON.parse(localRole))
    const [userRol, setUserRol] = useState({
        rol: selectRole ? selectRole : 2,
    })
    // Este es el id que se obtienen como parametro de busqueda o consulta de un perfil especifico
    const userId =
        state != undefined && state != null && state.id != undefined
            ? state.id
            : id
    const consult = userId !== null && userId !== undefined ? true : false
    const userConsultId = consult ? userId : userID
    // console.log(userConsultId)
    // console.log(userId, consult, userConsultId)
    // console.log(userID)
    // console.log(userConsultId)
    const _firestore = firestore
    const usersProResRef = collection(_firestore, 'usersPropietariosResidentes')
    const usersComCalRef = collection(
        _firestore,
        'usersComerciantesCalificados'
    )

    const userFromFirestore = async (firestoreUserID) => {
        try {
            if (userRol.rol === 1) {
                const userData = await getDocFromServer(
                    doc(usersProResRef, firestoreUserID)
                )
                // console.log(userConsultId, userRol.rol)
                return userData
            } else if (userRol.rol === 2) {
                const userData = await getDocFromServer(
                    doc(usersComCalRef, firestoreUserID)
                )
                // console.log(userConsultId, userRol.rol)
                return userData
            }
        } catch (err) {
            console.log('Error getting user: ', err)
        }
    }

    const [userInfo, setUserInfo] = useState({
        userName: '',
        userMail: '',
        userPhone: '',
        userChannelUrl: undefined,
        userPhotoUrl: '',
        userGalleryUrl: [],
        userCreatedDrafts: [],
        userId: '',
        userJoined: '',
        userProfession: '',
        userExperience: '',
        userCategorie: '',
        userClasification: '',
        userGrade: '',
        userCategories: [],
        userCategoriesChips: [],
        userDirection: '',
        userCiudad: '',
        userCodigoPostal: '',
        userRazonSocial: '',
        userIdentification: '',
        userDescription: '',
    })

    useEffect(() => {
        // console.log(userRol, state)
        if (!isLoaded) {
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
                // console.log(userConsultId, userRol.rol, user)
                const userData = userFromFirestore(userConsultId)

                // userData.forEach((doc) => {
                //     console.log(doc.id, " => ", doc.data())
                // })
                userData.then((docSnap) => {
                    // docSnap.exists()
                    if (docSnap) {
                        // docSnap._document.data...
                        const data = docSnap.data()
                        const creationTime = data.userJoined
                            ? data.userJoined
                            : metadata.creationTime
                        //console.log(creationTime)
                        const formatedTime = parse(
                            creationTime,
                            'dd-MM-yyyy',
                            new Date()
                        )
                        // const formatedTime = parseISO(creationTime)
                        // const formatedTime = new Date(creationTime)
                        //console.log(creationTime, formatedTime)
                        const distanceTime = formatDistance(
                            formatedTime,
                            new Date(),
                            { addSuffix: true },
                            { locale: es }
                        )
                        //console.log(distanceTime)
                        if (data) {
                            const chipsInfo = []
                            if (data.userCategories) {
                                data.userCategories.forEach((chip) => {
                                    // console.log(chip)
                                    ListadoCategorias.forEach((cat) => {
                                        if (chip === cat.label) {
                                            chipsInfo.push(cat)
                                        }
                                    })
                                })
                            }
                            setUserInfo({
                                ...userInfo,
                                userChannelUrl: data.userChannelUrl
                                    ? data.userChannelUrl
                                    : '',
                                userPhone: data.userPhone || phoneNumber,
                                userPhotoUrl: data.userPhotoUrl || photoURL,
                                userId: data.userId || uid,
                                userMail: data.userMail || email,
                                userName: data.userName || displayName,
                                userGalleryUrl: data.userGalleryUrl || [],
                                userJoined: distanceTime,
                                userProfession: data.userProfession
                                    ? data.userProfession
                                    : '',
                                userExperience: data.userExperience
                                    ? data.userExperience
                                    : '',
                                userCategorie: data.userCategorie
                                    ? data.userCategorie
                                    : '',
                                userClasification: data.userClasification
                                    ? data.userClasification
                                    : '',
                                userCategories: data.userCategories
                                    ? data.userCategories
                                    : '',
                                userCategoriesChips:
                                    chipsInfo.length > 0 ? chipsInfo : [],
                                userGrade: data.userGrade ? data.userGrade : '',
                                userDirection: data.userDirection
                                    ? data.userDirection
                                    : '',
                                userCiudad: data.userCiudad
                                    ? data.userCiudad
                                    : '',
                                userCodigoPostal: data.userCodigoPostal
                                    ? data.userCodigoPostal
                                    : '',
                                userRazonSocial: data.userRazonSocial
                                    ? data.userRazonSocial
                                    : '',
                                userIdentification: data.userIdentification
                                    ? data.userIdentification
                                    : '',
                                userDescription: data.userDescription
                                    ? data.userDescription
                                    : '',
                            })
                            // chipsInfoAdapter(data.userCategories)
                        }
                        isLoaded = true
                    } else {
                        console.log(
                            'No se encontro información relacionada con este usuario!'
                        )
                    }
                })
            }
        }
    }, [])

    // console.log(userInfo.userCategoriesChips)

    return (
        <>
            <Container fluid className="p-0">
                <Row className="h-100 pt-4 pb-4">
                    <Col className="col" md={10} sm={12}>
                        <Row className="border-green_buttom perfil-banner m-0 w-100 d-flex">
                            <Col className="ms-4 pt-4 pb-4 align-items-start">
                                <div
                                    className="d-flex flex-inline-row"
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'baseline',
                                    }}
                                >
                                    <img
                                        src={userInfo.userPhotoUrl}
                                        alt="imagen de perfil"
                                        height="150px"
                                        width="150px"
                                        style={{
                                            borderRadius: '50%',
                                        }}
                                    />

                                    {!consult && (
                                        <AdjuntarArchivos
                                            name={'profilePhoto'}
                                            multiple={false}
                                            idPerson={userConsultId}
                                            rol={userRol.rol}
                                            route={`profiles/${userConsultId}`}
                                            functionState={setUserInfo}
                                            state={userInfo}
                                        ></AdjuntarArchivos>
                                    )}
                                </div>
                                <Col
                                    md={4}
                                    className="p-2 d-flex flex-column align-items-center opacidadNegro"
                                >
                                    {/* user-stadistics justify-content-end */}
                                    <CincoEstrellas />
                                    <span>2 ratings</span>
                                    <br />
                                    certificaciones
                                    <Box
                                        className="m-2 w-100"
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            backgroundColor: '#ececec',
                                        }}
                                        action=""
                                    >
                                        <TextField
                                            id="userRazonSocial"
                                            name="userRazonSocial"
                                            label="Razón Social"
                                            value={userInfo.userRazonSocial}
                                            // defaultValue="Razón Social"
                                            variant="filled"
                                            className="w-100"
                                        />
                                        <TextField
                                            id="userProfession"
                                            label="Profesión"
                                            value={userInfo.userProfession}
                                            // defaultValue="@PROFESIÓN"
                                            variant="filled"
                                            className="w-100"
                                        />
                                        <TextField
                                            id="userExperience"
                                            name="userExperience"
                                            label="Experiencia"
                                            value={userInfo.userExperience}
                                            // defaultValue="@TiempoExperiencia"
                                            variant="filled"
                                            className="w-100"
                                        />
                                    </Box>
                                </Col>
                            </Col>
                        </Row>
                        {/* p-description textBlanco fondoVerde */}
                        <MapaPerfil userInfo={userInfo} />
                        <Row className="pt-4 m-0 w-100 d-flex align-items-start">
                            <Col md={7}>
                                <Row className="p-4 pb-0">
                                    <Col>
                                        <h3 className="headline-l">
                                            Calificaciones
                                            {/* <Button>Crear</Button> <Button>Editar</Button> */}
                                        </h3>
                                        <CincoEstrellas />
                                    </Col>
                                </Row>
                                <Row className="p-4 pb-0">
                                    <Col>
                                        {userRol.rol === 1 ? (
                                            <h3 className="headline-l">
                                                Presentación
                                            </h3>
                                        ) : (
                                            <>
                                                <h3 className="headline-l">
                                                    Servicios ofrecidos
                                                </h3>
                                                {userInfo.userCategoriesChips
                                                    .length > 0 ? (
                                                    <ChipsCategories
                                                        listadoCategorias={
                                                            userInfo.userCategoriesChips
                                                        }
                                                        editableContent={false}
                                                    />
                                                ) : (
                                                    <></>
                                                )}
                                            </>
                                        )}
                                        <p
                                            className="body-1 pe-4"
                                            style={{
                                                textAlign: 'justify',
                                            }}
                                        >
                                            {userInfo.userDescription}
                                        </p>
                                    </Col>
                                </Row>
                                <Row className="p-4 pb-0">
                                    <Col>
                                        <h3 className="headline-l">
                                            Certificaciones
                                        </h3>
                                    </Col>
                                </Row>
                            </Col>
                            <Col
                                md={5}
                                className="pt-4 pb-4 info-user_backgound"
                            >
                                <Box
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
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
                                        // defaultValue="@NOMBRE USUARIO"
                                        variant="filled"
                                    />
                                    <TextField
                                        id="userJoined"
                                        name="userJoined"
                                        label="Activo desde"
                                        value={userInfo.userJoined}
                                        // defaultValue="@SeUnioDesdeHace"
                                        variant="filled"
                                    />
                                    <TextField
                                        id="userDirection"
                                        name="userDirection"
                                        label="Ubicación"
                                        value={userInfo.userDirection}
                                        // defaultValue="ubicación"
                                        variant="filled"
                                    />
                                    <TextField
                                        id="userMail"
                                        name="userMail"
                                        label="Correo de usuario"
                                        value={userInfo.userMail}
                                        // defaultValue="@CORREO USUARIO"
                                        variant="filled"
                                    />
                                    <TextField
                                        id="userPhone"
                                        label="Celular"
                                        name="userPhone"
                                        value={userInfo.userPhone}
                                        // defaultValue="Celular"
                                        variant="filled"
                                    />
                                </Box>
                            </Col>
                        </Row>
                        <Row className="p-0 m-0 w-100 d-flex align-items-start">
                            <Row className="pt-4 pb-4 p-0">
                                <Col className="p-0">
                                    <h3 className="headline-l mb-4">
                                        Gallería
                                    </h3>
                                    <Row className="w-100">
                                        {userInfo.userGalleryUrl.map(
                                            (imagen, index) => {
                                                console.log(imagen)
                                                return (
                                                    <Box
                                                        key={index}
                                                        component="img"
                                                        src={imagen}
                                                        alt="galleria-usuario"
                                                        sx={{
                                                            height: 400,
                                                            display: 'block',
                                                            maxWidth: 400,
                                                            overflow: 'hidden',
                                                            width: '100%',
                                                            borderRadius: '5%',
                                                        }}
                                                        className="p-2"
                                                    ></Box>
                                                )
                                            }
                                        )}
                                        {!consult && (
                                            <AdjuntarArchivos
                                                name={'galleryPhoto'}
                                                multiple={true}
                                                idPerson={userConsultId}
                                                rol={userRol.rol}
                                                route={`profiles/${userConsultId}`}
                                                functionState={setUserInfo}
                                                state={userInfo}
                                            ></AdjuntarArchivos>
                                        )}
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="p-0">
                                {userInfo.userChannelUrl && (
                                    <Row className="p-0 m-0 w-100">
                                        <Col className="p-0">
                                            <Comentarios
                                                userID={userConsultId}
                                                channelUrl={
                                                    userInfo.userChannelUrl
                                                }
                                                nickname={userInfo.userName}
                                            />
                                        </Col>
                                    </Row>
                                )}
                            </Row>
                        </Row>
                    </Col>
                    {/* <Col className="col-2 h-100 fondoGris">SideContent</Col> */}
                </Row>
            </Container>
        </>
    )
}

export default Perfil
