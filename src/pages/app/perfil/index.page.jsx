export { Page }

// Pagina de Usuario - Perfil
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { sharingInformationService } from '#@/services/sharing-information'
import { format, formatDistance, subDays, parse, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import readUserFromFirestore from '#@/services/readUserFromFirestore.service'
import { auth } from '#@/firebase/firebaseClient'

import '#@/assets/cssPrivateApp/perfil.css'
// import ProfilePhoto from '#@/assets/img/Profile.png'
// import Bogota from '#@/assets/img/Bogota.png'
import { MapaPerfil } from './MapaPerfil'
import { CincoEstrellas } from './CincoEstrellas'
import { Component as Comentarios } from '#@/pages/app/components/Comentarios'
import { ChipsCategories } from '#@/pages/app/components/ChipsCategories'
import { ListadoCategorias } from '#@/pages/index/components/ListadoCategorias'
import { AdjuntarArchivos } from '#@/pages/app/components/AdjuntarArchivos'
import { usePageContext } from '#@/pages/app/renderer/usePageContext'
// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'

const Page = () => {
    const pageContext = usePageContext()
    // const { userAuth } = props
    // const [authUser, setAuthUser ] = useState({

    // })
    // TODO bring before render userAuth
    // const userAuth = pageContext.pageProps.userAuth
    const userAuth = auth?.currentUser
    // const urlPath = pageContext.urlPathname
    console.log('Perfil user', pageContext.pageProps)
    // const user = auth?.currentUser
    const userAuthID = userAuth? userAuth.uid : '' // Este es el id de la cuenta de Auth
    const userAuthName = userAuth? userAuth.displayName : '' // Este es el id de la cuenta de Auth
    const [isLoaded, setIsLoaded] =  useState(false)
   
    let id = pageContext.routeParams.id
    console.log('routeParamsPerfil', id)

    // const { state } = {}
    let selectRole
    useEffect(() => {
        // Perform localStorage action
        const localRole = localStorage.getItem('role')
        selectRole = parseInt(JSON.parse(localRole))
    }, [])
    const [userRol, setUserRol] = useState({
        rol: 2, // selectRole ? selectRole :
    })
    // Este es el id que se obtienen como parametro de busqueda o consulta de un perfil especifico
    const userId = id
    // state != undefined && state != null && state.id != undefined
    //     ? state.id
    //     : id
    const consult = userId !== null && userId !== undefined ? true : false
    const userConsultId = consult ? userId : userAuthID
    // console.log(userConsultId)
    // console.log(userId, consult, userConsultId)
    // console.log(userAuthID)
    // console.log(userConsultId)

    const userData = () => {
        const firestoreUserID = userConsultId
        const userSelectedRol = userRol.rol
        // console.log(firestoreUserID, userSelectedRol)
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
        // userCategorie: '',
        // userClasification: '',
        // userGrade: '',
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

    const determineDistanceTime = (metadata) => {
        const creationTime = metadata.creationTime
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
                        return distanceTime
    }

    const LoadAuthData = (userAuth) => {

        const {
            uid,
            email,
            displayName,
            phoneNumber,
            photoURL,
            //emailVerified,
            // metadata,
        } = userAuth

        // const distanceTime = determineDistanceTime(metadata)

        setUserInfo({
            ...userInfo,
            userPhone: phoneNumber,
            userPhotoUrl: photoURL,
            userId: uid,
            userMail: email,
            userName: displayName,
            // userJoined: distanceTime,
        })
    }

    const LoadCurrentData = (currentUser) => {
        const {
            userJoined,
            userCategories,
            userChannelUrl,
            userPhone,
            userPhotoUrl,
            userId,
            userMail,
            userName,
            userGalleryUrl,
            userProfession,
            userExperience,
            // userCategorie,
            // userClasification,
            // userCategoriesChips,
            userGrade,
            userDirection,
            userCiudad,
            userCodigoPostal,
            userRazonSocial,
            userIdentification,
            userDescription,
        } = currentUser
        // console.log('Detail load:', data)
        let chipsInfo = []
        if (userCategories) {
            const chipsCategories = (userCategories) =>{
                const chipsInfo = []
                userCategories.forEach((chip) => {
                    // console.log(chip)
                    ListadoCategorias.forEach((cat) => {
                        if (chip === cat.label) {
                            chipsInfo.push(cat)
                        }
                    })
                })
                return chipsInfo
            }
        
            chipsInfo = chipsCategories(userCategories)
        }
        setUserInfo({
            ...userInfo,
            userChannelUrl: userChannelUrl
                ? userChannelUrl
                : '',
            userPhone: userPhone ? userPhone
            : '',
            userPhotoUrl: userPhotoUrl ? userPhotoUrl
            : '',
            userId: userId ? userId
            : '',
            userMail: userMail ? userMail
            : '',
            userName: userName ? userName
            : '',
            userGalleryUrl: userGalleryUrl || [],
            userJoined: userJoined ? userJoined
            : '',
            userProfession: userProfession
                ? userProfession
                : '',
            userExperience: userExperience
                ? userExperience
                : '',
            // userCategorie: userCategorie
            //     ? userCategorie
            //     : '',
            // userClasification: userClasification
            //     ? userClasification
            //     : '',
            // userCategories: userCategories
            //     ? userCategories
            //     : '',
            userCategoriesChips:
                chipsInfo, // .length > 0 ? chipsInfo : []
            userGrade: userGrade ? userGrade : '',
            userDirection: userDirection ? userDirection : '',
            userCiudad: userCiudad ? userCiudad : '',
            userCodigoPostal: userCodigoPostal
                ? userCodigoPostal
                : '',
            userRazonSocial: userRazonSocial
                ? userRazonSocial
                : '',
            userIdentification: userIdentification
                ? userIdentification
                : '',
            userDescription: userDescription
                ? userDescription
                : '',
        })
        // chipsInfoAdapter(userCategories)

    }

    useEffect(() => {
        // console.log(userRol, state)
        if (!isLoaded) {
            if (!isNaN(userRol.rol) &&
            userRol.rol !== '') {
                userData()
                const productData = sharingInformationService.getSubject()
                productData.subscribe((data) => {
                    if (data) {
                        console.log('perfilPage', data)
                        const { currentUser, authUser } = data
                        if (currentUser){
                            LoadCurrentData(currentUser)
                            setIsLoaded(true)
                        } else if (authUser){ 
                            LoadAuthData(authUser)
                            setIsLoaded(true)
                        }
                    } else {
                        console.log(
                            'No se encontro información relacionada con este usuario!'
                        )
                    }
                })
                // if (
                //     userAuth !== null &&
                //     userAuth !== undefined
                // ) {
                //     console.log("authUser", userAuth )
                //     LoadAuthData(userAuth)
                // }
            }
        }
    }, [])

    // console.log(userInfo.userCategoriesChips)

    return (
        <>
            <Container fluid className="p-0">
                <Row className="h-100 pt-4 pb-4">
                    <Col className="col" md={10} sm={12}>
                        <Row
                            className="border-green_bottom m-0 w-100 d-flex flex-nowrap"
                            sx={{ flexDirection: { sm: 'col' } }}
                        >
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
                            <Col className="p-0 col-10">
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

                                {userInfo.userChannelUrl && (
                                    <Comentarios
                                        channelUrl={userInfo.userChannelUrl}
                                        userID={userAuthID}
                                        nickname={userAuthName}
                                        // ID y Nombre del perfil que comenta
                                        // userID={userInfo.userId} no
                                        // nickname={userInfo.userName} no
                                    />
                                )}
                            </Col>
                        </Row>
                    </Col>
                    {/* <Col className="col-2 h-100 fondoGris">SideContent</Col> */}
                </Row>
            </Container>
        </>
    )
}

Page.propTypes = {
    userAuth: PropTypes.object,
}
