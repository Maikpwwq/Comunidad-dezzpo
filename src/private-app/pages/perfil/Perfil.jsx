// Pagina de Usuario - Perfil
import React, { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { auth } from '../../../firebase/firebaseClient'
import { format, formatDistance, subDays, parse, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import readUserFromFirestore from 'services/readUserFromFirestore.service'
import { sharingInformationService } from 'services/sharing-information'

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
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'

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

    const userData = () => {
        const firestoreUserID = userID
        const userSelectedRol = userRol.rol
        console.log(firestoreUserID, userSelectedRol)
        readUserFromFirestore({
            firestoreUserID,
            userSelectedRol,
        })
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
        userVotes: {
            reviews: [],
            mean: 0,
            votes: 0,
        },
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

                userData()

                const productData = sharingInformationService.getSubject()
                productData.subscribe((data) => {
                    if (!!data) {
                        console.log('Detail load:', data)
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
                            userCiudad: data.userCiudad ? data.userCiudad : '',
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
                        <Row className="border-green_bottom m-0 w-100 d-flex flex-nowrap">
                            {/* perfil-banner */}
                            <div
                                className="d-flex flex-inline-row w-auto"
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

                            <Box
                                className="m-2 w-auto"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    backgroundColor: '#ececec',
                                }}
                                action=""
                            >
                                <Typography variant="h4" id="userRazonSocial">
                                    {userInfo.userRazonSocial}
                                </Typography>
                                <Typography variant="h5" id="userProfession">
                                    {userInfo.userProfession}
                                </Typography>
                                <Typography variant="h6" id="userExperience">
                                    Experiencia: {userInfo.userExperience}
                                </Typography>
                                <CincoEstrellas />
                                <span>
                                    {userInfo.userVotes.votes} Personas votaron
                                </span>
                            </Box>
                        </Row>
                        {/* p-description textBlanco fondoVerde */}
                        <Row className="pt-4 m-0 w-100 d-flex align-items-start">
                            <Col md={5} className="pt-4 pb-4">
                                <Typography
                                    variant="h6"
                                    className="textVerde p-description"
                                    align="center"
                                >
                                    Datos de contacto
                                </Typography>
                                <Box
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'start',
                                    }}
                                    action=""
                                    className="p-4 cardFrame"
                                >
                                    <Typography
                                        variant="subtitle1"
                                        className=""
                                    >
                                        Nombre de usuario
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        className="ps-3 pe-3 detail-pill"
                                        name="userName"
                                    >
                                        {userInfo.userName}
                                    </Typography>

                                    <Typography
                                        variant="subtitle1"
                                        className=""
                                    >
                                        Activo desde
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        className="ps-3 pe-3 detail-pill"
                                        name="userJoined"
                                    >
                                        {userInfo.userJoined}
                                    </Typography>

                                    <Typography
                                        variant="subtitle1"
                                        className=""
                                    >
                                        Ubicación
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        className="ps-3 pe-3 detail-pill"
                                        name="userDirection"
                                    >
                                        {userInfo.userDirection}
                                    </Typography>

                                    <Typography
                                        variant="subtitle1"
                                        className=""
                                    >
                                        Correo de usuario
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        className="ps-3 pe-3 detail-pill"
                                        name="userMail"
                                    >
                                        {userInfo.userMail}
                                    </Typography>

                                    <Typography
                                        variant="subtitle1"
                                        className=""
                                    >
                                        Celular
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        className="ps-3 pe-3 detail-pill"
                                        name="userPhone"
                                    >
                                        {userInfo.userPhone}
                                    </Typography>
                                </Box>
                            </Col>
                            <Col md={7}>
                                <Typography
                                    variant="h5"
                                    className="textVerde headline-l"
                                    align="left"
                                >
                                    Ubicación
                                </Typography>
                                <MapaPerfil userInfo={userInfo} />
                            </Col>
                        </Row>
                        <Row className="m-0 w-100 d-flex align-items-start">
                            <Col md={10} className="p-0">
                                <Typography
                                    variant="h5"
                                    className="textVerde headline-l pt-4 pb-4"
                                    align="left"
                                >
                                    Acerca de mi
                                </Typography>
                                <Typography
                                    className="body-1"
                                    style={{
                                        textAlign: 'justify',
                                    }}
                                >
                                    {userInfo.userDescription}
                                </Typography>
                                <Button>
                                    <PictureAsPdfIcon /> Portafolio de servicios
                                </Button>
                                {userRol.rol === 2 && (
                                    <>
                                        <Typography
                                            variant="h5"
                                            className="textVerde headline-l pt-4 pb-4"
                                            align="left"
                                        >
                                            Habilidades
                                        </Typography>
                                        {userInfo.userCategoriesChips.length >
                                            0 && (
                                            <ChipsCategories
                                                listadoCategorias={
                                                    userInfo.userCategoriesChips
                                                }
                                                editableContent={false}
                                            />
                                        )}
                                    </>
                                )}
                                {/* TODO: Implementar las certificaciones obtenidas
                                <Row className="p-4 pb-0">
                                    <Col>
                                        <Typography
                                            variant="h5"
                                            className="headline-l"
                                        >
                                            Certificaciones
                                        </Typography>
                                    </Col>
                                </Row> */}
                            </Col>
                        </Row>
                        <Row className="p-0 m-0 w-100 d-flex align-items-start">
                            <Col className="col-10 p-0">
                                <Typography
                                    variant="h5"
                                    className="textVerde headline-l pt-4 pb-4 w-100"
                                    align="left"
                                >
                                    Portafolio
                                </Typography>
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

                                <Typography
                                    variant="h5"
                                    align="left"
                                    className="textVerde headline-l pt-4 pb-4 w-100"
                                >
                                    Comentarios
                                </Typography>
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
