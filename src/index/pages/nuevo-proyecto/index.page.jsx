export { Page }

// Pagina de NuevoProyecto
import React, { useState, useContext, useEffect } from 'react'
// import PropTypes from 'prop-types'
// import { Link } from '#R/Link'
import { navigate } from 'vike/client/router'
import { DirectionalButton } from '#@/index/components/DirectionalButton/DirectionalButton'
// import ScrollToTopOnMount from '#@/index/components/ScrollToTop'
import { AdjuntarArchivos } from '#@/app/components/AdjuntarArchivos'
import { SeleccionarCategoria } from '#@/index/components/SeleccionarCategoria'
import { v4 as uuidv4 } from 'uuid'
import {
    collection,
    doc,
    setDoc,
    // getDocFromServer,
    getDocs,
} from 'firebase/firestore'
import { firestore, auth } from '#@/firebase/firebaseClient'
import '#@/assets/css/nuevo_proyecto.css'
import { Ubicacion } from '#@/index/components/ubicacion/Ubicacion'
import { BuscadorNuevoProyecto } from '#@/index/components/buscador/BuscadorNuevoProyecto'
import { Page as Registro } from '#@/index/pages/registro/index.page'
import { Page as Ingreso } from '#@/index/pages/ingreso/index.page'
import { SubCategorias } from '#@/index/components/sub-categorias/SubCategorias'
import { PasoAPaso } from '#@/index/components/paso_a_paso/Paso_A_Paso'
import { TablaSubCategoriaCantidades } from './Tabla_SubCategoria_Cantidades'
import { usePageContext } from '#R/usePageContext'
import { UserAuthContext } from '#@/providers/UserAuthProvider'

// react-bootrstrap
// import { Row, Col, Container, Button, Form } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import AddLocationIcon from '@mui/icons-material/AddLocation'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

const Page = () => {
    const draftID = uuidv4()
    const { currentUser } = useContext(UserAuthContext)
    const userId = currentUser?.userId
    const pageContext = usePageContext()
    console.log('nuevo-proyecto', pageContext.routeParams)
    const paramCategoriaProfesional =
        pageContext.routeParams?.CategoriaProfesional
    const paramTipoProyecto = pageContext.routeParams?.TipoProyecto
    // const { paramCategoriaProfesional, paramTipoProyecto } =
    //     pageContext.routeParams['*']
    // console.log('nuevo-proyecto', paramCategoriaProfesional, paramTipoProyecto)
    // let requerimiento
    // useEffect(() => {
    //     // Perform localStorage action
    //     requerimiento = localStorage.requerimiento || undefined
    // }, [])
    // console.log('requerimiento-local', requerimiento)
    // console.log(requerimiento.draftId)
    const [hideRegister] = useState(currentUser?.isAuth) // , setHideRegister
    const [showMore, setShowMore] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const _firestore = firestore

    const categoriaRef = collection(_firestore, 'categoriasServicios')
    const draftRef = collection(_firestore, 'drafts')
    // categoria
    const [categoriaInfo, setCategoriaInfo] = useState({
        selected: [],
        quatities: [],
        data: [],
        subCatLength: 0,
    })
    const [activeStep, setActiveStep] = useState(0)
    const [draftInfo, setDraftInfo] = useState({
        draftCategory: paramCategoriaProfesional || 0,
        draftSubCategory: '',
        draftProject: paramTipoProyecto || undefined,
        draftId: draftID,
        draftTotal: 0,
        draftName: '',
        draftDescription: '',
        draftPropietarioResidente: userId || '',
        draftCreated: '',
        draftPriority: '',
        draftCity: '',
        draftDirection: '',
        draftSize: '',
        draftRooms: '',
        draftPlans: '',
        draftPermissions: '',
        draftAtachments: '',
        draftBestScheduleDate: '',
        draftBestScheduleTime: '',
        draftProperty: '',
        draftPostalCode: '',
        draftApply: [],
    })

    const [openModal, setOpen] = useState(false)
    const [categoriesIndex, setCategoriesIndex] = useState(0)
    const handleOpen = () => setOpen(true)
    const handleCloseModal = () => setOpen(false)

    const handleNext = () => {
        if (categoriesIndex < categoriaInfo.subCatLength - 1) {
            setCategoriesIndex(categoriesIndex + 1)
        }
    }
    const handleBack = () => {
        if (categoriesIndex > 0) {
            setCategoriesIndex(categoriesIndex - 1)
        }
    }

    const draftToFirestore = async (updateInfo, projectID) => {
        // console.log(updateInfo)
        await setDoc(doc(draftRef, projectID), updateInfo, { merge: true })
    }

    useEffect(() => {
        if (!isLoaded) {
            const categoriasFromFirestore = async () => {
                try {
                    // 'aPTAljOeD48FbniBg6Lw' main document categories
                    const subCategoriaRef = collection(
                        doc(categoriaRef, 'aPTAljOeD48FbniBg6Lw'),
                        draftInfo.draftCategory
                    )
                    const categoriaData = await getDocs(subCategoriaRef)
                    return categoriaData
                } catch (err) {
                    console.log(
                        'Error al obtener los datos de la colleccion categorias: ',
                        err
                    )
                }
            }
            if (!!draftInfo.draftProject && !!draftInfo.draftCategory) {
                categoriasFromFirestore()
                    .then((docSnap) => {
                        if (docSnap) {
                            const data = docSnap.docs.map((element) => ({
                                ...element.data(),
                            }))
                            // TODO: Pasar la data por hojas que agrupen hasta seis subCategorias
                            if (data.length > 0) {
                                // console.log(
                                //     data
                                //     draftInfo.draftCategory,
                                //     categoriaProfesional
                                // )
                                let i = 0
                                let j = 0
                                let response = [[], [], [], [], [], []]
                                data.map((element) => {
                                    if (i < 6) {
                                        if (!response[j]) {
                                            response[j] = []
                                        }
                                        response[j].push(element)
                                        i++
                                    } else {
                                        j++
                                        i = 0
                                    }
                                })
                                // console.log(response[0])
                                if (response[0].length > 0) {
                                    setCategoriaInfo({
                                        ...categoriaInfo,
                                        data: response,
                                        subCatLength: (data.length - 1) / 6,
                                    })
                                    // console.log(categoriaInfo)
                                    setIsLoaded(true)
                                }
                            }
                        } else {
                            console.log(
                                'No se encontro información en la colleccion proyectos!'
                            )
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        }
    }, [
        categoriaInfo,
        isLoaded,
        categoriaRef,
        draftInfo.draftCategory,
        draftInfo.draftProject,
    ])

    const handleShowMore = () => {
        setShowMore(!showMore)
    }

    const handleSave = () => {
        // hideRegister ? navigate('/app/directorio-requerimientos') : goForward()
        // console.log(draftInfo)
        const snap = draftToFirestore(draftInfo, draftInfo.draftId)
        // setHideRegister(true)
        snap.then(() => {
            // console.log(docSnap)
            navigate('/app/directorio-requerimientos')
        })
    }

    // TODO Crear funcion para leer los borradores de requerimientos desde firebase y desde local storage
    const goForward = () => {
        if (activeStep < steps.length) {
            let active = activeStep + 1
            setActiveStep(active)
        }
        // TODO Almacenar requerimiento en local storage hasta que se realice el almacenamiento final
        localStorage.requerimiento = JSON.stringify(draftInfo)
    }

    const handleChange = (event) => {
        event.preventDefault()
        // console.log('Detecto:', event, draftInfo)
        setDraftInfo({
            ...draftInfo,
            [event.target.name]: event.target.value,
        })
        if (event.target.name === 'draftCategory') {
            setIsLoaded(false)
        }
    }

    const handleComeBack = () => {
        if (activeStep > 0) {
            let active = activeStep - 1
            setActiveStep(active)
        }
    }

    const steps = [
        'Categoria/Subcategoria',
        'Elige tus ajustes',
        'Programa la visita',
        'Registrarse',
    ]

    return (
        <>
            <Container fluid className="p-0" style={{ position: 'relative' }}>
                <PasoAPaso activeStep={activeStep} steps={steps} />
                {/* <div className="pasos-fixed"></div> */}
                {activeStep == 0 && (
                    <Col>
                        {(draftInfo.draftProject === undefined ||
                            draftInfo.draftCategory === undefined) && (
                            <Row className="nuevoProyectoBuscador">
                                <Col
                                    className="align-items-start p-4 m-4"
                                    md={5}
                                    sm={8}
                                >
                                    <Col className="opacidadNegro p-0">
                                        <p className="headline-l textBlanco m-4 p-0">
                                            Con ayuda de la comunidad haz
                                            realidad la casa que deseas.
                                            Encuentra un profesional Seguro y
                                            Confiable, para cada trabajo. Desde
                                            iluminación y pequeños arreglos,
                                            hasta diseños de ingeniería y
                                            remodelaciones completas.
                                        </p>
                                    </Col>
                                </Col>
                                {/* Se importa formulario nuevo proyecto */}
                                <Col
                                    className="col m-4 p-0"
                                    xl={4}
                                    lg={6}
                                    xm={6}
                                    md={8}
                                    sm={12}
                                    xs={12}
                                >
                                    <BuscadorNuevoProyecto
                                        // data={{paramCategoriaProfesional, paramTipoProyecto}}
                                        setDraftInfo={setDraftInfo}
                                        draftInfo={draftInfo}
                                    ></BuscadorNuevoProyecto>
                                </Col>
                            </Row>
                        )}
                        {/* <ScrollToTopOnMount /> */}
                        {!!draftInfo.draftProject &&
                            draftInfo.draftCategory !== 0 && (
                                <>
                                    <Row className="w-100 m-0">
                                        <Col className="p-4" lg={8} md={10}>
                                            <p className="body-1">
                                                Al seleccionar categorías podrás
                                                ir agregando uno a uno todos los
                                                servicios que vas a solicitar.
                                                Luego en el siguiente paso
                                                podrás modificar la cantidad de
                                                obra que requieres.
                                            </p>
                                            <SeleccionarCategoria
                                                setDraftInfo={setDraftInfo}
                                                draftInfo={draftInfo}
                                                setIsLoaded={setIsLoaded}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="categorias w-100 m-0 p-4">
                                        <Col className="p-0 pt-4 col-10 categorias-contenedor">
                                            <Row className="w-100 m-0">
                                                {categoriaInfo.data[
                                                    categoriesIndex
                                                ] &&
                                                    categoriaInfo.data[
                                                        categoriesIndex
                                                    ].map((item, index) => {
                                                        // console.log("SubCategorias", item, index)
                                                        return (
                                                            <>
                                                                {item.subCategoria && (
                                                                    <SubCategorias
                                                                        key={
                                                                            index
                                                                        }
                                                                        item={
                                                                            item
                                                                        }
                                                                        setCategoriaInfo={
                                                                            setCategoriaInfo
                                                                        }
                                                                        categoriaInfo={
                                                                            categoriaInfo
                                                                        }
                                                                    />
                                                                )}
                                                            </>
                                                        )
                                                    })}
                                            </Row>
                                            <DirectionalButton
                                                handleNext={handleNext}
                                                handleBack={handleBack}
                                            />
                                        </Col>
                                    </Row>

                                    <Col className="col-10">
                                        <Row className="pt-4 pb-4 w-100 justify-content-center">
                                            <Button
                                                onClick={goForward}
                                                style={{ paddingRight: '10px' }}
                                                className="p-2 ps-4 pe-4 btn-round btn-high body-1 w-auto"
                                                variant="primary"
                                                // type="submit"
                                            >
                                                Guardar y continuar
                                            </Button>
                                            <span className="p-4 w-auto">
                                                {' '}
                                            </span>
                                            <Button
                                                onClick={handleComeBack}
                                                className="btn-round btn-middle w-auto"
                                                variant="secondary"
                                                // type="submit"
                                            >
                                                <KeyboardBackspaceIcon /> Volver
                                                atrás
                                            </Button>
                                        </Row>
                                    </Col>
                                </>
                            )}
                    </Col>
                )}
                {activeStep == 1 && (
                    <Col className="nuevoProyectoBuscador2 align-items-baseline p-2 ps-4">
                        {/* <ScrollToTopOnMount /> */}
                        <TablaSubCategoriaCantidades
                            categoriaInfo={categoriaInfo}
                            setDraftInfo={setDraftInfo}
                            draftInfo={draftInfo}
                        />
                        <Typography
                            variant="h3"
                            className="p-description w-100 center mt-4 mb-4"
                        >
                            Elije tus ajustes
                        </Typography>
                        <Col
                            className="p-4 align-items-start cardFrame"
                            xl={6}
                            lg={8}
                            md={10}
                            sm={12}
                        >
                            <Form className="m-4">
                                <p className="body-1">
                                    Crea una oferta. <br />
                                    Dejanos conocer un poco más hacerca del
                                    proyecto que vas a postular. * Campos
                                    requeridos
                                </p>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formNewProjectName"
                                >
                                    <Form.Label className="body-2">
                                        Dale un titulo a tu requerimiento *
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        style={{ height: '100px' }}
                                        placeholder="¿Cual es el titulo de tu requerimiento?"
                                        name="draftName"
                                        value={draftInfo.draftName}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formNewProjectDescription"
                                >
                                    <Form.Label className="body-2">
                                        Describe el tipo de servicio que
                                        necesitas *
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        style={{ height: '100px' }}
                                        placeholder="¿Que servicio requieres?"
                                        name="draftDescription"
                                        value={draftInfo.draftDescription}
                                        onChange={handleChange}
                                    />
                                    <Form.Text className="text-muted">
                                        Provee información adicional aquí, como
                                        especificaciones de tecnica y materiales
                                        requeridos que el comerciante calificado
                                        deba conocer.
                                    </Form.Text>
                                </Form.Group>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    className="pb-2"
                                    onClick={handleShowMore}
                                >
                                    Ofrece mayores detalles
                                    {showMore ? (
                                        <ExpandLessIcon />
                                    ) : (
                                        <ExpandMoreIcon />
                                    )}
                                </Typography>
                                {showMore && (
                                    <Box>
                                        <Form.Group
                                            className="mb-3"
                                            controlId="formNewProjectSize"
                                        >
                                            <Form.Label className="body-">
                                                Escoge el tamaño
                                            </Form.Label>
                                            <Form.Select
                                                name="draftSize"
                                                value={draftInfo.draftSize}
                                                onChange={handleChange}
                                            >
                                                <option>
                                                    Selecciona el tamaño del
                                                    proyecto
                                                </option>
                                                <option value="sencillo">
                                                    Sencillo
                                                </option>
                                                <option value="mediano">
                                                    Mediano
                                                </option>
                                                <option value="doble">
                                                    Doble
                                                </option>
                                                <option value="grande">
                                                    Grande
                                                </option>
                                                <option value="Otra">
                                                    Otro
                                                </option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group
                                            className="mb-3"
                                            controlId="formNewProjectProperty"
                                        >
                                            <Form.Label className="body-">
                                                ¿Qué tipo de propiedad es?
                                            </Form.Label>
                                            <Form.Select
                                                name="draftProperty"
                                                value={draftInfo.draftProperty}
                                                onChange={handleChange}
                                            >
                                                <option>
                                                    Selecciona el tipo de
                                                    propiedad
                                                </option>
                                                <option value="Colonial">
                                                    Propiedad Colonial (1800 -
                                                    1920)
                                                </option>
                                                <option value="SubUrbana">
                                                    Propiedad suburbana
                                                    (1920-1960)
                                                </option>
                                                <option value="Moderna">
                                                    Propiedad moderna
                                                    (1960-presente)
                                                </option>
                                                <option value="Otra">
                                                    Otra
                                                </option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group
                                            className="mb-3"
                                            controlId="formNewProjectRooms"
                                        >
                                            <Form.Label className="body-">
                                                ¿Cuantas habitaciones y/o
                                                espacios seran intervenidos?
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Por favor especifica"
                                                name="draftRooms"
                                                value={draftInfo.draftRooms}
                                                onChange={handleChange}
                                            />
                                            <Form.Text className="text-muted">
                                                Podremos estimar mejor la
                                                cantidad de obra.
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group
                                            className="mb-3"
                                            controlId="formNewProjectPlans"
                                        >
                                            <Form.Label className="body-">
                                                ¿Han sido diseñados planos
                                                arquitectonicos para este
                                                proyecto?
                                            </Form.Label>
                                            <Form.Select
                                                name="draftPlans"
                                                value={draftInfo.draftPlans}
                                                onChange={handleChange}
                                            >
                                                <option>
                                                    Selecciona el estado actual
                                                </option>
                                                <option value="Aproved">
                                                    Aprobados
                                                </option>
                                                <option value="Aplied">
                                                    Aplicado
                                                </option>
                                                <option value="NotAplied">
                                                    Sin aplicar aun
                                                </option>
                                                <option value="NotSure">
                                                    No estoy seguro
                                                </option>
                                                <option value="NotNeed">
                                                    No son necesarios en esta
                                                    oportunidad
                                                </option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group
                                            className="mb-3"
                                            controlId="formNewProjectPermissions"
                                        >
                                            <Form.Label className="body-">
                                                ¿Cúal es el estado de los
                                                permisos para este proyecto?
                                            </Form.Label>
                                            <Form.Select
                                                name="draftPermissions"
                                                value={
                                                    draftInfo.draftPermissions
                                                }
                                                onChange={handleChange}
                                            >
                                                <option>
                                                    Selecciona el estado actual
                                                </option>
                                                <option value="Aproved">
                                                    Aprobados
                                                </option>
                                                <option value="Aplied">
                                                    Aplicado
                                                </option>
                                                <option value="NotAplied">
                                                    Sin aplicar aun
                                                </option>
                                                <option value="NotSure">
                                                    No estoy seguro
                                                </option>
                                                <option value="NotNeed">
                                                    No son necesarios en esta
                                                    oportunidad
                                                </option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Box>
                                )}
                                <Col className="col-10">
                                    <Row className="pt-4 pb-4 w-100 justify-content-center">
                                        <Button
                                            onClick={goForward}
                                            style={{ paddingRight: '10px' }}
                                            className="p-2 ps-4 pe-4 btn-round btn-high body-1 w-auto"
                                            variant="primary"
                                            // type="submit"
                                        >
                                            Guardar y continuar
                                        </Button>
                                        <span className="p-4 w-auto"> </span>
                                        <Button
                                            onClick={handleComeBack}
                                            className="btn-round btn-middle w-auto"
                                            variant="secondary"
                                            // type="submit"
                                        >
                                            <KeyboardBackspaceIcon /> Volver
                                            atras
                                        </Button>
                                    </Row>
                                </Col>
                            </Form>
                        </Col>
                    </Col>
                )}
                {activeStep == 2 && (
                    <Col className="nuevoProyectoBuscador3 align-items-baseline p-2 ps-4">
                        {/* <ScrollToTopOnMount /> */}
                        <Typography
                            variant="h3"
                            className="p-description w-100 center"
                        >
                            {/* Cómo, dónde y cuándo */}
                            Programa la visita
                        </Typography>
                        <Col
                            className="p-4 align-items-start cardFrame"
                            xl={6}
                            lg={8}
                            md={10}
                            sm={12}
                        >
                            <Form>
                                <Form.Group
                                    className="m-4"
                                    controlId="formNewProjectBestSchedule"
                                >
                                    <Form.Label className="body-2">
                                        ¿Con cuál disponibilidad de horario y
                                        tiempo cuenta usted para atender la
                                        prestación del servicio? *
                                    </Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="Dispone de algun horario en particular"
                                        name="draftBestScheduleDate"
                                        value={draftInfo.draftBestScheduleDate}
                                        onChange={handleChange}
                                    />
                                    <Form.Control
                                        type="time"
                                        placeholder="Dispone de algun horario en particular"
                                        name="draftBestScheduleTime"
                                        value={draftInfo.draftBestScheduleTime}
                                        onChange={handleChange}
                                    />
                                    <Form.Text className="text-muted">
                                        Podremos validar la agenda disponible de
                                        comerciantes profesionales.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group
                                    className="m-4"
                                    controlId="formNewProjectPostalCode"
                                >
                                    <Form.Label className="body-2">
                                        Registra la dirección donde se requiere
                                        el servicio.
                                        <Row
                                            className="w-100 flex"
                                            style={{
                                                justifyContent: 'flex-start',
                                            }}
                                            sx={{
                                                flexWrap: {
                                                    lg: 'nowrap',
                                                    md: 'nowrap',
                                                    sm: 'wrap',
                                                },
                                            }}
                                        >
                                            <Form.Control
                                                type="text"
                                                placeholder="Registra la dirección"
                                                name="draftDirection"
                                                value={draftInfo.draftDirection}
                                                onChange={handleChange}
                                            />
                                            <Button
                                                className="body-2 ms-2 pb-2 textVerde w-auto"
                                                onClick={handleOpen}
                                            >
                                                <AddLocationIcon />
                                                {'Seleccionar en el mapa'}
                                            </Button>
                                        </Row>
                                    </Form.Label>
                                </Form.Group>
                                {/* <Form.Group
                                    className="mb-3"
                                    controlId="formNewProjectPostalCode"
                                >
                                    <Form.Label className="body-2 text-white">
                                        ¿Cual es el codigo postal de la
                                        propiedad?
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Registre Codigo Postal"
                                        name="draftPostalCode"
                                        value={draftInfo.draftPostalCode}
                                        onChange={handleChange}
                                    />
                                    <Form.Text className="text-muted">
                                        Nos permitira validar comerciantes
                                        profesionales activos en la zona o bien
                                        registra tu dirección.
                                        <Button
                                            className="body-2"
                                            onClick={handleOpen}
                                        >
                                            {', aquí'}
                                        </Button>
                                    </Form.Text>
                                </Form.Group> */}
                                <Form.Group
                                    className="m-4"
                                    controlId="formNewProjectAtachments"
                                >
                                    <Form.Label className="body-2">
                                        Cargar fotos, imagenes y documentos
                                        relacionados.
                                    </Form.Label>
                                    <Row>
                                        <Box className="cargarArchivos">
                                            {/* TODO: Pasar un Id de usuario valido en este punto no esta registrado */}
                                            <AdjuntarArchivos
                                                name={'draftAtachments'}
                                                multiple={true}
                                                idPerson={userId}
                                                rol={1}
                                                route={`profiles/${userId}/draft`}
                                                functionState={setDraftInfo}
                                                state={draftInfo}
                                            ></AdjuntarArchivos>
                                        </Box>
                                        <Form.Control
                                            type="text"
                                            filled
                                            name="draftDirection"
                                            value={draftInfo.draftAtachments}
                                            className="w-50"
                                        />
                                    </Row>
                                    {/* <Form.Control
                                        name="draftAtachments"
                                        // value={draftInfo.draftAtachments}
                                        // onChange={handleChange}
                                        type="file"
                                    /> */}
                                </Form.Group>
                                <Modal
                                    open={openModal}
                                    onClose={handleCloseModal}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Ubicacion
                                        setLocInfo={setDraftInfo}
                                        locInfo={draftInfo}
                                        setOpen={setOpen}
                                    />
                                </Modal>
                                <Col className="col-10">
                                    <Row className="pt-4 pb-4 w-100 justify-content-center">
                                        <Button
                                            onClick={
                                                !hideRegister
                                                    ? goForward
                                                    : handleSave
                                            }
                                            style={{ paddingRight: '10px' }}
                                            className="p-2 ps-4 pe-4 btn-round btn-high btn-main body-1 w-auto"
                                            variant="primary"
                                            // type="submit"
                                        >
                                            Guardar y finalizar
                                        </Button>
                                        <span className="p-4 w-auto"> </span>
                                        <Button
                                            onClick={handleComeBack}
                                            className="btn-round btn-middle w-auto"
                                            variant="secondary"
                                            // type="submit"
                                        >
                                            <KeyboardBackspaceIcon /> Volver
                                            atras
                                        </Button>
                                    </Row>
                                </Col>
                            </Form>
                        </Col>
                    </Col>
                )}
                {/* Detalles de contacto */}
                {activeStep == 3 && !hideRegister ? (
                    <Row className="nuevoProyectoMensaje w-100">
                        {/* <ScrollToTopOnMount /> */}
                        <Col className="p-4 col-10">
                            <h3 className="headline-xl textBlanco">
                                Por ultimo ingresa tus datos de contacto
                            </h3>
                            <p className="body-1 textBlanco">
                                Hasta cuatro Comerciantes calificados te
                                contactaran para aplicar con una cotización a tu
                                proyecto. <br />
                                Para garantizar la mejor respuesta asegúrate que
                                tus datos son exactos, solo compartiremos tu
                                <br /> numero con los comerciantes calificados
                                interesados, por favor responde a su llamada.
                            </p>
                        </Col>

                        <Registro
                            setDraftInfo={setDraftInfo}
                            draftInfo={draftInfo}
                            // draftId={draftInfo.draftID}
                            handleSave={handleSave}
                            showLogo={false}
                            className="pb-4"
                        ></Registro>

                        <Ingreso
                            setDraftInfo={setDraftInfo}
                            draftInfo={draftInfo}
                            // draftId={draftInfo.draftID}
                            handleSave={handleSave}
                            showLogo={false}
                            className="pb-4"
                        ></Ingreso>
                    </Row>
                ) : (
                    <></>
                )}
            </Container>
        </>
    )
}

Page.propTypes = {
    // classes: PropTypes.object.isRequired,
}
