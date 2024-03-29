export { Page }
// Set the Layout for all `/app/**/*.page.js`
export { LayoutAppPaperbase as Layout } from '#@/app/components/LayoutAppPaperbase'

// Pagina de Usuario - Ajustes
import React, { useState, useContext, useEffect, useMemo } from 'react'
import { auth } from '#@/firebase/firebaseClient'
import { formatDistance, parse } from 'date-fns' // parseISO, format, subDays
import es from 'date-fns/locale/es'
import { usePageContext } from '#R/usePageContext'

// import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext'
// import sendbirdSelectors from '@sendbird/uikit-react/sendbirdSelectors'

// import { newOpenChannelSendbird } from '#@/services/newOpenChannelSendbird.service'
import { sharingInformationService } from '#@/services/sharing-information'
import { readUserFromFirestore } from '#@/services/readUserFromFirestore.service'
import { updateUserToFirestore } from '#@/services/updateUserToFirestore.service'

import '#@/assets/cssPrivateApp/ajustes.css'
import { Ubicacion } from '#@/index/components/ubicacion/Ubicacion'
import { SnackBarAlert } from '#@/index/components/SnackBarAlert'
import { ChipsCategories } from '#@/app/components/ChipsCategories'
import { ListadoCategorias } from '#@/index/components/ListadoCategorias'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
// import {Button} from '@mui/material'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormGroup from '@mui/material/FormGroup'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import { UserAuthContext } from '#@/providers/UserAuthProvider'

const Page = () => {
    const { currentUser } = useContext(UserAuthContext)
    // console.log('auth', auth?.currentUser)
    const pageContext = usePageContext()
    let id = pageContext.routeParams.id // ['*']
    // console.log('routeParamsPerfil', id)
    const userAuth = useMemo(() => auth?.currentUser, [])
    const userAuthID = currentUser?.userId || id 
    const userAuthName = currentUser?.displayName || ''
    const [isLoaded, setIsLoaded] = useState(false)
    const [isChannelLoad, setIsChannelLoad] = useState(false)
    const [saved, setSaved] = useState(true)

    // const globalStore = useSendbirdStateContext()
    // const sbSdk = sendbirdSelectors?.getSdk(globalStore)
    // const connect = sendbirdSelectors?.getConnect(globalStore)
    // const createChannel = sendbirdSelectors?.getCreateOpenChannel(globalStore)

    const [userRol, setUserRol] = useState({
        rol: currentUser.rol,
    })

    // console.log(userRol.rol)
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success',
    })
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const [userEditInfo, setUserEditInfo] = useState({
        userName: '',
        userMail: '',
        userPhone: '',
        userPhotoUrl: '',
        userGalleryUrl: [],
        userCreatedDrafts: [],
        userId: '',
        userJoined: '',
        userProfession: '',
        userExperience: '',
        userChannelUrl: '',
        // userCategorie: '',
        // userClasification: [],
        // userGrade: '',
        userCategories: [],
        userDirection: '',
        userCiudad: '',
        userCodigoPostal: '',
        userRazonSocial: '',
        userIdentification: '',
        userDescription: '',
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
        const LoadAuthData = () => {
            const {
                uid,
                email,
                displayName,
                phoneNumber,
                photoURL,
                emailVerified,
                metadata,
            } = userAuth

            let distanceTime
            if (metadata) {
                distanceTime = determineDistanceTime(metadata)
            }

            setUserEditInfo({
                ...userEditInfo,
                userPhone: phoneNumber,
                userPhotoUrl: photoURL,
                userId: uid,
                userMail: email,
                userName: displayName,
                userJoined: distanceTime,
            })
        }

        // const createUserChannel = (userName, userId) => {
        //     // Sendbird new open channel
        //     console.log(
        //         'Ajustes creando nuevo open channel',
        //         userName,
        //         userAuthID,
        //         userId
        //     )
            // newOpenChannelSendbird(
            //     {
            //         uid: userAuthID,
            //         displayName: userName,
            //         sbSdk,
            //         connect,
            //         createChannel,
            //     }
            //     // setChannelUrl,
            //     // userEditInfo,
            //     // setUserEditInfo,
            // )

            // Limit to load one time
            // setIsChannelLoad(true)

            // const currentURL = sharingInformationService.getSubject()
            // currentURL.subscribe((data) => {
            //     if (data) {
            //         const { channelURL } = data
            //         console.log('newOpenChannelSendbird:', channelURL, data)
            //         if (channelURL) {
            //             setUserEditInfo({
            //                 ...userEditInfo,
            //                 userChannelUrl: channelURL,
            //             })
            //         }
            //     }
            // })
        // }

        const LoadCurrentData = (currentUser) => {
            const {
                userId,
                userName,
                userMail,
                userPhone,
                userPhotoUrl,
                userGalleryUrl,
                userCreatedDrafts,
                userJoined,
                userProfession,
                userExperience,
                userCategories,
                userDirection,
                userCiudad,
                userCodigoPostal,
                userRazonSocial,
                userIdentification,
                userDescription,
                userChannelUrl,
                userWebSite,
                // userCategorie,
                // userClasification,
                // userGrade,
            } = currentUser

            
            // TODO: Activate with sendbird provider
            // Sendbird new open channel
            // console.log(
            //     'create new open channel',
            //     userChannelUrl,
            //     userEditInfo.userChannelUrl
            // )
            // if (
            //     userChannelUrl === undefined ||
            //     (userChannelUrl === '' && isChannelLoad === false)
            // ) {
            //     console.log(
            //         'conditioanl',
            //         userName,
            //         userId,
            //         userAuthName,
            //         userAuthID
            //     )
            //     createUserChannel(userName, userId)
            // }

            setUserEditInfo({
                ...userEditInfo,
                userPhone: userPhone || '',
                userPhotoUrl: userPhotoUrl || '',
                userGalleryUrl: userGalleryUrl || [],
                userCreatedDrafts: userCreatedDrafts || [],
                userId: userId,
                userMail: userMail,
                userName: userName || '',
                userJoined: userJoined || '',
                userProfession: userProfession || '',
                userExperience: userExperience || '',
                userChannelUrl: userChannelUrl || '',
                // userCategorie: userCategorie,
                // userClasification: userClasification,
                // userGrade: userGrade,
                userCategories: userCategories || [],
                userDirection: userDirection || '',
                userCiudad: userCiudad || '',
                userCodigoPostal: userCodigoPostal || '',
                userRazonSocial: userRazonSocial || '',
                userIdentification: userIdentification || '',
                userDescription: userDescription || '',
                userWebSite: userWebSite || '',
            })
        }

        const userData = (firestoreUserID, userSelectedRol) => {            
            readUserFromFirestore({
                firestoreUserID,
                userSelectedRol,
            })
        }

        if (!isLoaded) {
            // Perform localStorage action
            const localRole = localStorage.getItem('role')
            const selectRole = parseInt(JSON.parse(localRole))
            setUserRol({ rol: selectRole }) // ...userRol ,
            console.log('selectRole', selectRole, userRol.rol)

            if (!isNaN(userRol.rol) && userRol.rol !== undefined) {
                // Load and expose user data from firestore
                const firestoreUserID = userAuthID
                const userSelectedRol = userRol.rol
                console.log(
                    'readUserFromFirestore',
                    firestoreUserID,
                    userSelectedRol
                )
                userData(firestoreUserID, userSelectedRol)

                const userInformation = sharingInformationService.getSubject()
                userInformation.subscribe((data) => {
                    if (data) {
                        const { currentUser, authUser } = data
                        console.log('ajustesPage:', currentUser, authUser)
                        if (currentUser) {
                            LoadCurrentData(currentUser)
                            setIsLoaded(true)
                        }

                        // if (userAuth !== null && userAuth !== undefined) {
                        //     console.log('authUser', userAuth)
                        //     LoadAuthData(userAuth)
                        //     // setIsLoaded(true)
                        // }

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
            }
        }
    }, [
        userAuth,
        userAuthID,
        userEditInfo,
        userRol.rol,
        isLoaded,
        userAuthName,
        // sbSdk,
        // connect,
        // createChannel,
        isChannelLoad,
    ])

    const handleAlert = (message, severity) => {
        setAlert({ ...alert, open: true, message: message, severity: severity })
    }

    const handleCloseAlert = (event, reason) => {
        // console.log(reason, event)
        if (reason === 'clickaway') {
            return
        } else {
            setAlert({ ...alert, open: false, message: '' })
        }
    }

    const handleChange = (event) => {
        setUserEditInfo({
            ...userEditInfo,
            [event.target.name]: event.target.value,
        })
    }

    const snap = () => {
        const firestoreUserID = userAuthID
        const userSelectedRol = userRol.rol
        console.log(firestoreUserID, userSelectedRol, userEditInfo)
        updateUserToFirestore({
            firestoreUserID,
            userSelectedRol,
            userEditInfo,
        })
    }

    const handleSubmit = () => {
        try {
            snap()
            setSaved(false)
            const userData = sharingInformationService.getSubject()
            userData
            handleAlert('Se actualizó correctamente su información!', 'success')
        } catch (err) {
            handleAlert(
                'No se actualizó correctamente su información, intente de nuevo!',
                'error'
            )
        }
    }

    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex align-items-start pb-4 pt-4">
                    <Typography
                        variant="h6"
                        className="p-description pb-4 pt-4 w-100"
                    >
                        Datos de contacto
                    </Typography>
                    <Col className="col-10 cardFrame">
                        {alert.open && (
                            <SnackBarAlert
                                message={alert.message}
                                onClose={handleCloseAlert}
                                severity={alert.severity} // success, error, warning, info, default
                                open={alert.open}
                            />
                        )}
                        <Row className="p-0 pt-4">
                            <FormGroup
                                action=""
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                className="pt-4"
                            >
                                <Row className="m-0 w-100 d-flex flex-row pb-4 pt-4">
                                    <Col
                                        className="mb-4"
                                        sx={{
                                            width: {
                                                xs: '100%',
                                                sm: '100%',
                                                lg: '33%',
                                                md: '50%',
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            className="w-auto"
                                        >
                                            Correo de usuario
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            className="ps-3 pe-3 detail-pill w-auto"
                                            name="userMail"
                                        >
                                            {userEditInfo.userMail}
                                        </Typography>
                                    </Col>
                                    <Col
                                        className="mb-4"
                                        sx={{
                                            width: {
                                                xs: '100%',
                                                sm: '100%',
                                                lg: '33%',
                                                md: '50%',
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            className="w-auto"
                                        >
                                            Activo desde
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            className="ps-3 pe-3 detail-pill w-auto"
                                            name="userJoined"
                                        >
                                            {userEditInfo.userJoined}
                                        </Typography>
                                    </Col>
                                    <Col
                                        className="mb-4"
                                        sx={{
                                            width: {
                                                xs: '100%',
                                                sm: '100%',
                                                lg: '33%',
                                                md: '50%',
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            className="w-auto"
                                        >
                                            Ubicación
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            className="ps-3 pe-3 detail-pill w-auto"
                                            name="userDirection"
                                        >
                                            {userEditInfo.userDirection}
                                        </Typography>
                                    </Col>
                                    <Col
                                        className="mb-4"
                                        sx={{
                                            width: {
                                                xs: '100%',
                                                sm: '100%',
                                                lg: '33%',
                                                md: '50%',
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            className="w-auto"
                                        >
                                            Ciudad
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            className="ps-3 pe-3 detail-pill w-auto"
                                            name="userCiudad"
                                        >
                                            {userEditInfo.userCiudad}
                                        </Typography>
                                    </Col>
                                </Row>
                                <TextField
                                    style={{ borderRadius: '30px' }}
                                    id="userName"
                                    name="userName"
                                    label="Nombre de usuario"
                                    value={userEditInfo.userName}
                                    onChange={handleChange}
                                    // defaultValue="@NOMBRE USUARIO"
                                    className="mb-4 me-4 fondoBlanco"
                                />
                                {userRol.rol === 2 ? (
                                    <>
                                        <TextField
                                            style={{ borderRadius: '30px' }}
                                            id="userProfession"
                                            name="userProfession"
                                            label="Profesión"
                                            value={userEditInfo.userProfession}
                                            onChange={handleChange}
                                            // defaultValue="@PROFESIÓN"
                                            className="mb-4 me-4 fondoBlanco"
                                        />
                                        <TextField
                                            style={{ borderRadius: '30px' }}
                                            id="userExperience"
                                            name="userExperience"
                                            label="Experiencia"
                                            value={userEditInfo.userExperience}
                                            onChange={handleChange}
                                            // defaultValue="@TiempoExperiencia"
                                            className="mb-4 me-4 fondoBlanco"
                                        />
                                        <TextField
                                            style={{ borderRadius: '30px' }}
                                            id="userRazonSocial"
                                            name="userRazonSocial"
                                            label="Razón Social"
                                            value={userEditInfo.userRazonSocial}
                                            onChange={handleChange}
                                            // defaultValue="Razón Social"
                                            className="mb-4 me-4 fondoBlanco"
                                        />
                                    </>
                                ) : (
                                    <></>
                                )}
                                <TextField
                                    style={{ borderRadius: '30px' }}
                                    id="userWebSite"
                                    name="userWebSite"
                                    label="Sitio web"
                                    value={userEditInfo.userWebSite}
                                    onChange={handleChange}
                                    // defaultValue="Identificación"
                                    className="mb-4 me-4 fondoBlanco"
                                />

                                <TextField
                                    style={{ borderRadius: '30px' }}
                                    id="userPhone"
                                    label="Celular"
                                    name="userPhone"
                                    value={userEditInfo.userPhone}
                                    onChange={handleChange}
                                    // defaultValue="Celular"
                                    className="mt-2 mb-4 me-4 fondoBlanco"
                                />

                                <TextField
                                    style={{ borderRadius: '30px' }}
                                    id="userIdentification"
                                    name="userIdentification"
                                    label="Identificación"
                                    value={userEditInfo.userIdentification}
                                    onChange={handleChange}
                                    // defaultValue="Identificación"
                                    className="mb-4 me-4 fondoBlanco"
                                />

                                <Row className="pb-4 w-100">
                                    <Col className="col-6">
                                        <Button
                                            className="body-2"
                                            onClick={handleOpen}
                                        >
                                            {'Registrar ubicación'}
                                        </Button>
                                        <Modal
                                            open={open}
                                            onClose={handleClose}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                        >
                                            <Ubicacion
                                                setLocInfo={setUserEditInfo}
                                                locInfo={userEditInfo}
                                                setOpen={setOpen}
                                            />
                                        </Modal>
                                    </Col>
                                    <Col className="col-6">
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
                        </Row>
                    </Col>
                    <Col className="col-10">
                        <Row className="">
                            <Typography
                                variant="h6"
                                htmlFor="ofertaServicios"
                                className="p-description pb-4 pt-4 w-100"
                            >
                                {userRol.rol === 2
                                    ? 'Servicios ofrecidos'
                                    : 'Presentación'}
                            </Typography>
                            <TextareaAutosize
                                value={userEditInfo.userDescription}
                                onChange={handleChange}
                                name="userDescription"
                                id="ofertaServicios"
                                placeholder={
                                    userRol.rol === 2
                                        ? 'Registra los servicios que ofreces (max. 400 caracteres).'
                                        : 'Registra tu presentación (max. 400 caracteres).'
                                }
                                cols="30"
                                minRows={4}
                                className="w-100"
                                style={{ borderRadius: '30px' }}
                            ></TextareaAutosize>
                            {userRol.rol === 2 ? (
                                <Col className="pt-2">
                                    <p className="body-1 m-0">
                                        Selecciona hasta cuatro categorias para
                                        mostrar en tu perfil de usuario
                                    </p>
                                    <ChipsCategories
                                        setUserEditInfo={setUserEditInfo}
                                        userEditInfo={userEditInfo}
                                        listadoCategorias={ListadoCategorias}
                                        saved={saved}
                                    />
                                </Col>
                            ) : (
                                <></>
                            )}
                            <Row className="pb-2 pt-2 w-100">
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
                        </Row>
                    </Col>
                    <Col className="col-10">
                        <Typography
                            variant="h6"
                            htmlFor="ofertaServicios"
                            className="p-description pb-4 pt-4 w-100"
                        >
                            Confirma tu identidad
                        </Typography>

                        <Typography variant="body1" className="body-1">
                            Adjunta tu documento de identificación para...
                        </Typography>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
