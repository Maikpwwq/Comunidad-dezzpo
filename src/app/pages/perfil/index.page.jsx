export { Page }
export { LayoutAppPaperbase as Layout } from '#@/app/components/LayoutAppPaperbase'

// Pagina de Usuario - Perfil
import React, { useState, useContext, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { sharingInformationService } from '#@/services/sharing-information'
import { formatDistance, parse } from 'date-fns' // format, , subDays, parseISO
import es from 'date-fns/locale/es'
import { readUserFromFirestore } from '#@/services/readUserFromFirestore.service'
import { auth } from '#@/firebase/firebaseClient'
// import { UserAuthContext } from '#@/providers/UserAuthProvider'
import { UserAuthContext } from '#@/providers/UserAuthProvider'

import '#@/assets/cssPrivateApp/perfil.css'
import ProfilePhoto from '#@/assets/img/Profile.png'
// import Bogota from '#@/assets/img/Bogota.png'
import { MapaPerfil } from '#@/app/components/MapaPerfil'
import { CincoEstrellas } from '#@/app/components/CincoEstrellas'
import { Comentarios } from '#@/app/components/Comentarios'
import { ChipsCategories } from '#@/app/components/ChipsCategories'
import { ListadoCategorias } from '#@/index/components/ListadoCategorias'
import { AdjuntarArchivos } from '#@/app/components/AdjuntarArchivos'
import { usePageContext } from '#R/usePageContext'
// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
// import {Button, Box} from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'

import MailIcon from '@mui/icons-material/Mail'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import LinkIcon from '@mui/icons-material/Link'
// import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

const Page = () => {
    const { currentUser } = useContext(UserAuthContext)

    const pageContext = usePageContext()
    // const { userAuth } = props
    // const [authUser, setAuthUser ] = useState({

    // })
    // TODO bring before render userAuth
    // const userAuth = pageContext.pageProps.userAuth
    const userAuth = useMemo(() => auth?.currentUser, [])
    // const urlPath = pageContext.urlPathname
    // console.log('Perfil user', pageContext) // .user
    // const user = auth?.currentUser
    const userAuthID = currentUser?.userId // Este es el id de la cuenta de Auth
    const userAuthName = currentUser?.displayName // Este es el id de la cuenta de Auth
    const [isLoaded, setIsLoaded] = useState(false)

    let id = pageContext.routeParams.id // ['*']
    // console.log('routeParamsPerfil', id)

    const [userRol, setUserRol] = useState({
        rol: null,
    })

    // Este es el id que se obtienen como parametro de busqueda o consulta de un perfil especifico
    const userId = id
    // state != undefined && state != null && state.id != undefined
    //     ? state.id
    //     : id
    const consult = userId === userAuthID ? false : true
    // userId !== null && userId !== undefined ? true : false
    const userConsultId = consult ? userId : userAuthID
    // console.log(userConsultId)
    // console.log(userId, consult, userConsultId)
    // console.log(userAuthID)
    // console.log(userConsultId)

    const [userInfo, setUserInfo] = useState({
        userName: '',
        userMail: '',
        userPhone: '',
        userChannelUrl: undefined,
        userPhotoUrl: ProfilePhoto,
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
        userLikes: {
            likedsProfiles: [],
            likedsDrafts: [],
        },
        userWebSite: '',
    })

    const determineDistanceTime = (metadata) => {
        const creationTime = metadata.creationTime
        //console.log(creationTime)
        const formatedTime = parse(creationTime, 'dd-MM-yyyy', new Date())
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

    useEffect(() => {
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

            // let distanceTime
            // if (metadata) {
            //     distanceTime = determineDistanceTime(metadata)
            // }

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
                userWebSite,
            } = currentUser
            // console.log('Detail load:', currentUser)
            let chipsInfo = []
            if (userCategories) {
                const chipsCategories = (userCategories) => {
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
                userChannelUrl: userChannelUrl ? userChannelUrl : '',
                userPhone: userPhone ? userPhone : '',
                userPhotoUrl: userPhotoUrl ? userPhotoUrl : ProfilePhoto,
                userId: userId ? userId : '',
                userMail: userMail,
                userName: userName ? userName : '',
                userGalleryUrl: userGalleryUrl || [],
                userJoined: userJoined ? userJoined : '',
                userProfession: userProfession ? userProfession : '',
                userExperience: userExperience ? userExperience : '',
                // userCategorie: userCategorie
                //     ? userCategorie
                //     : '',
                // userClasification: userClasification
                //     ? userClasification
                //     : '',
                // userCategories: userCategories
                //     ? userCategories
                //     : '',
                userCategoriesChips: chipsInfo, // .length > 0 ? chipsInfo : []
                userGrade: userGrade ? userGrade : '',
                userDirection: userDirection ? userDirection : '',
                userCiudad: userCiudad ? userCiudad : '',
                userCodigoPostal: userCodigoPostal ? userCodigoPostal : '',
                userRazonSocial: userRazonSocial ? userRazonSocial : '',
                userIdentification: userIdentification
                    ? userIdentification
                    : '',
                userDescription: userDescription ? userDescription : '',
                userWebSite: userWebSite ? userWebSite : '',
            })
            // chipsInfoAdapter(userCategories)
        }

        const userData = () => {
            const firestoreUserID = userConsultId
            const userConsultRol = 2
            const userSelectedRol = userConsultRol // userRol.rol
            // console.log(firestoreUserID, userSelectedRol)
            readUserFromFirestore({
                firestoreUserID,
                userSelectedRol,
            })
        }

        if (!isLoaded) {
            // Perform localStorage action
            const localRole = localStorage.getItem('role')
            const selectRole = parseInt(JSON.parse(localRole))
            setUserRol({ rol: selectRole })
            // console.log('selectRole', selectRole, userRol.rol)

            // console.log(userRol, state)
            if (!isNaN(userRol.rol) && userRol.rol !== undefined) {
                userData()
                const productData = sharingInformationService.getSubject()
                productData.subscribe((data) => {
                    if (data) {
                        const { currentUser, authUser } = data
                        // console.log('perfilPage', currentUser, authUser)
                        if (currentUser) {
                            LoadCurrentData(currentUser)
                            setIsLoaded(true)
                        }

                        // if (authUser) {
                        //     LoadAuthData(authUser)
                        //     setIsLoaded(true)
                        // }
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
                //     setIsLoaded(true)
                // }
            }
        }
    }, [isLoaded, userConsultId, userInfo, userRol.rol, userAuth])

    // console.log(userInfo.userCategoriesChips)

    const copyUserWebSiteLink = () => {
        const referenced = `${userInfo?.userWebSite}`
        navigator.clipboard.writeText(referenced)
    }

    return (
        <>
            <Container fluid className="p-0">
                {/* <Row className="h-100 pt-4 pb-4"></Row> */}
                <Col className="col-12 w-100 fondoVerde">
                    <Row
                        className="border-green_bottom m-0 w-100 d-flex flex-nowrap"
                        sx={{ flexDirection: { sm: 'col' } }}
                    >
                        {/* perfil-banner */}
                        <div
                            className="d-flex flex-inline-row w-auto position-relative"
                            style={{
                                justifyContent: 'center',
                                alignItems: 'baseline',
                                top: '1.8rem',
                            }}
                        >
                            <img
                                src={userInfo.userPhotoUrl}
                                alt="imagen de perfil"
                                height="184px"
                                width="184px"
                                style={{
                                    borderRadius: '50%',
                                    border: '8px solid var(--background-light-gray-color)',
                                    background: 'white',
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
                    </Row>
                </Col>
                <Col className="col mx-auto pt-4" md={10} sm={12}>
                    <Box
                        className="m-2 w-auto"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            // backgroundColor: '#ececec',
                        }}
                        action=""
                    >
                        <Typography
                            variant="h3"
                            id="userRazonSocial"
                            sx={{ maxWidth: '480px' }}
                            className="textGris fw-bold"
                        >
                            {userInfo?.userRazonSocial}{' '}
                            {/* <a
                                target="_blank"
                                referrerPolicy="origin"
                                rel="external noreferrer"
                                href={userInfo?.userWebSite}
                            ></a> */}
                            {!!userInfo?.userWebSite && (
                                <Tooltip title="Copiar sitio web">
                                    <LinkIcon
                                        onClick={copyUserWebSiteLink}
                                        fontSize="large"
                                        className="p-1"
                                    />
                                </Tooltip>
                            )}
                        </Typography>
                        <Typography
                            variant="h5"
                            id="userProfession"
                            className="textGris fw-light"
                        >
                            {userInfo.userProfession}
                        </Typography>
                        <Typography
                            variant="body-2"
                            id="userExperience"
                            className="textGris fw-lighter"
                        >
                            Experiencia: {userInfo.userExperience}
                        </Typography>
                        <CincoEstrellas />
                        <span className="textGris fs-6 fw-lighter">
                            {userInfo.userVotes.votes} Personas votaron
                        </span>
                    </Box>
                    {/* p-description textBlanco fondoVerde */}
                    <Row className="p-0 m-0 w-100 d-flex align-items-start">
                        <Col md={10} className="col-10 pt-4 pb-4">
                            <Typography
                                variant="h5"
                                className="textVerde headline-l pb-4"
                                align="left"
                            >
                                Datos de contacto
                            </Typography>
                            <Box
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-evenly',
                                }}
                                action=""
                                className="p-4 cardFrame"
                            >
                                {/* <Typography
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
                                    </Typography> */}

                                {/* <Typography
                                        variant="subtitle1"
                                        className=""
                                    >
                                        Correo de usuario
                                    </Typography> */}

                                <Typography
                                    variant="body2"
                                    className="ps-3 pe-3 detail-pill"
                                    name="userMail"
                                >
                                    <MailIcon fontSize="large" />{' '}
                                    {userInfo.userMail}
                                </Typography>

                                {/* <Typography
                                        variant="subtitle1"
                                        className=""
                                    >
                                        Celular
                                    </Typography> */}

                                <Typography
                                    variant="body2"
                                    className="ps-3 pe-3 detail-pill"
                                    name="userPhone"
                                >
                                    <PhoneIphoneIcon fontSize="large" />{' '}
                                    {userInfo.userPhone}
                                </Typography>
                            </Box>
                        </Col>
                    </Row>
                    <Row className="p-0 m-0 w-100 d-flex align-items-start">
                        <Col className="p-0 col-10">
                            <Row className="m-0 d-flex w-100 justify-content-start">
                                <Typography
                                    variant="h5"
                                    className="textVerde headline-l w-auto pt-4 pb-4"
                                    align="left"
                                >
                                    Acerca de mi
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    className="w-auto"
                                >
                                    Activo desde
                                </Typography>
                                <Typography
                                    variant="body2"
                                    className="ps-3 pe-3 w-auto"
                                    name="userJoined"
                                >
                                    {userInfo.userJoined}
                                </Typography>
                            </Row>
                            <Typography
                                className="body-1"
                                style={{
                                    textAlign: 'justify',
                                }}
                            >
                                {userInfo.userDescription}
                            </Typography>
                            <Button className="p-4">
                                <PictureAsPdfIcon /> Portafolio de servicios
                            </Button>
                        </Col>
                    </Row>
                    <Row className="p-0 m-0 w-100 d-flex align-items-start">
                        <Col md={10} className="col-10 py-4">
                            {userInfo.userCategoriesChips.length > 0 && (
                                <>
                                    <Typography
                                        variant="h5"
                                        className="textVerde headline-l py-4"
                                        align="left"
                                    >
                                        Habilidades
                                    </Typography>

                                    <ChipsCategories
                                        listadoCategorias={
                                            userInfo.userCategoriesChips
                                        }
                                        editableContent={false}
                                    />
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
                        <Col className="col-10 py-4">
                            {userInfo.userGalleryUrl.length > 0 ||
                                (!consult && (
                                    <>
                                        <Typography
                                            variant="h5"
                                            className="textVerde headline-l pt-4 pb-4 w-100"
                                            align="left"
                                        >
                                            Portafolio
                                        </Typography>
                                        <Row className="w-100 pb-4">
                                            {userInfo.userGalleryUrl.map(
                                                (imagen, index) => {
                                                    // console.log(imagen)
                                                    return (
                                                        <Box
                                                            key={index}
                                                            component="img"
                                                            src={imagen}
                                                            alt="galleria-usuario"
                                                            sx={{
                                                                height: 400,
                                                                display:
                                                                    'block',
                                                                maxWidth: 400,
                                                                overflow:
                                                                    'hidden',
                                                                width: 'auto !important',
                                                                borderRadius:
                                                                    '5%',
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
                                    </>
                                ))}
                            {userInfo.userDirection && (
                                <>
                                    <Col className="col-12">
                                        <Row className="m-0 d-flex w-100 justify-content-start">
                                            <Typography
                                                variant="h5"
                                                className="textVerde headline-l w-auto pt-4 pb-4"
                                                align="left"
                                            >
                                                Ubicación
                                            </Typography>
                                            {/* <Typography
                                            variant="subtitle1"
                                            className="w-auto"
                                        >
                                            Ubicación
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            className="ps-3 pe-3 w-auto"
                                            name="userDirection"
                                        >
                                            {userInfo.userDirection}
                                        </Typography> */}
                                        </Row>
                                        <MapaPerfil userInfo={userInfo} />
                                    </Col>
                                </>
                            )}
                            {userInfo.userChannelUrl && (
                                <>
                                    <Typography
                                        variant="h5"
                                        align="left"
                                        className="textVerde headline-l pt-4 pb-4 w-100"
                                    >
                                        Comentarios
                                    </Typography>

                                    <Comentarios
                                        channelUrl={userInfo.userChannelUrl}
                                        userID={userAuthID}
                                        nickname={userAuthName}
                                        // ID y Nombre del perfil que comenta
                                        // userID={userInfo.userId} no
                                        // nickname={userInfo.userName} no
                                    />
                                </>
                            )}
                        </Col>
                    </Row>
                </Col>
                {/* <Col className="col-2 h-100 fondoGris">SideContent</Col> */}
            </Container>
        </>
    )
}

Page.propTypes = {
    userAuth: PropTypes.object,
}
