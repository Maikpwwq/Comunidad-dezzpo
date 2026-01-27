// Pagina de Inicio
import React from 'react'
import '@assets/css/home.css'
import BuscadorNuevoProyecto from '@index/components/buscador/BuscadorNuevoProyecto'
import NuestraComunidad from '@index/components/nuestra-comunidad/NuestraComunidad'
import { navigate } from 'vike/client/router'
import Subscribe from './Subscribe'
// import { AllFontStyles } from '@index/components/AllFontStyles'

// imagenes

// react-bootrstrap
// import { Row, Col, Container } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import { useTheme } from '@mui/material/styles'
// import {Button, Box} from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MobileStepper from '@mui/material/MobileStepper'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import SwipeableViews from 'react-swipeable-views'
import { bindKeyboard } from 'react-swipeable-views-utils'
import { Typography } from '@mui/material'
// import { LogosServicios } from './LogosServicios'

const CustomSwipeableViews = bindKeyboard(SwipeableViews)

const styles = () => ({
    stepper: {
        position: 'relative',
        bottom: '-25px',
        zIndex: 1000,
        background: 'transparent',
        height: '0px',
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
    },
})

// const slideRenderer = ({ key, index }) => (
//     <div key={key}>
//         {console.log(key, index)}
//         {index === 0 && (

//         )}
//         {index === 1 && }
//         {index === 2 && (

//         )}
//         {index === 3 && }
//     </div>
// )

const Page = () => {
    const theme = useTheme()
    const classes = styles(theme)
    // const { imagenes } = [{ numero: 1 }, { numero: 2 }, { numero: 3 }]
    const maxSteps = 2 // imagenes.length
    const [activeStep, setActiveStep] = React.useState(0)
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleStepChange = (step) => {
        setActiveStep(step)
    }

    const handleClick = () => {
        const route = '/registro/'
        navigate(`${route}`)
    }

    return (
        <>
            <Container fluid className="p-0 pt-4">
                <Box sx={{ width: '100%', flexGrow: 1 }}>
                    <CustomSwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={activeStep}
                        onChangeIndex={handleStepChange}
                        enableMouseEvents
                        // slideRenderer={slideRenderer}
                    >
                        <Row className="m-0 w-100 bannerComunidad">
                            {/* imagen fondo */}
                            <Col
                                id="contenedorBanner"
                                className="m-0 p-0 pt-4"
                                xl={7}
                                lg={6}
                                md={5}
                                sm={10}
                                xs={11}
                            >
                                {/* Mensaje del Banner izquierda */}
                                <Box className="slogan p-0">
                                    <Typography variant="h2">
                                        <strong>Bienvenido</strong>
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        className="mb-4 mt-2"
                                    >
                                        ¡Encuentra al instante el personal profesional ideal para cada proyecto en el hogar!
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        className="textVerde btn btn-round btn-high"
                                        sx={{
                                            backgroundColor:
                                                'transparent !important',
                                        }}
                                        onClick={handleClick}
                                    >
                                        Unete a la Comunidad
                                    </Typography>
                                </Box>
                            </Col>
                            {/* Formulario nuevo proyecto */}
                            <Col
                                className="col m-4 p-0"
                                xl={4}
                                lg={6}
                                xm={6}
                                md={8}
                                sm={12}
                                xs={12}
                            >
                                <BuscadorNuevoProyecto></BuscadorNuevoProyecto>
                            </Col>
                        </Row>
                        <Subscribe />
                        {/* TODO: CREAR PIEZAS VISUALES PARA EL BANNER */}
                        {/* <Row className="m-0 w-100">
                            Quieres prestar servicios!
                        </Row>
                        <Row className="m-0 w-100">Ayudame a elegir!</Row> */}
                    </CustomSwipeableViews>
                    <MobileStepper
                        // variant=
                        sx={classes.stepper}
                        className="pb-4 mb-4"
                        steps={maxSteps}
                        // position="static"
                        activeStep={activeStep}
                        nextButton={
                            <Button
                                size="lg"
                                onClick={handleNext}
                                className="arrow-next"
                                disabled={activeStep === maxSteps - 1}
                            >
                                {theme.direction === 'rtl' ? (
                                    <KeyboardArrowLeft fontSize="large" />
                                ) : (
                                    <KeyboardArrowRight fontSize="large" />
                                )}
                            </Button>
                        }
                        backButton={
                            <Button
                                size="lg"
                                onClick={handleBack}
                                className="arrow-back"
                                disabled={activeStep === 0}
                            >
                                {theme.direction === 'rtl' ? (
                                    <KeyboardArrowRight fontSize="large" />
                                ) : (
                                    <KeyboardArrowLeft fontSize="large" />
                                )}
                            </Button>
                        }
                    />
                </Box>
            </Container>
            <Container fluid className="p-0">
                <Row className="m-0 pt-4 w-100 mensajeBanner">
                    {/* Mensaje del Banner inferior*/}
                    <Col className="p-4" lg={7} md={8} sm={10}>
                        <Typography variant="body-2" className="m-0 body-2">
                            <strong>
                                Explora en Comunidad Dezzpo una red profesional
                                confiable para todo tipo de trabajos, desde
                                soluciones de mantenimiento e instalaciones
                                pequeñas hasta acabados inmobiliarios y
                                remodelaciones completas. Nuestro marketplace te
                                ofrece la posibilidad de elegir contratistas
                                especializados con estadísticas verificadas.
                                ¡Únete ahora y comienza a hacer realidad tus
                                proyectos!
                            </strong>
                        </Typography>
                    </Col>
                </Row>
            </Container>
            {/* <AllFontStyles /> */}
            {/* Seccion de Registro */}
            <Container fluid className="p-0">
                {/* Seccion de como funciona la comunidad */}
                <Row id="comoFunciona" className="color-steps m-0">
                    <Col className="col-lg-8 col-md-10 col-sm-12 pt-4 pb-4">
                        <Typography variant="h3" className="pt-4 headline-l">
                            ¿Cómo funciona <br />
                            <strong>nuestra comunidad?</strong>
                        </Typography>
                        {/* Propietarios */}
                        <Col className="comoPropietarios">
                            <Col className="comunidadTitulo m-4 w-auto" md={3}>
                                <h4 className="headline-s">Propietarios</h4>
                            </Col>
                            <Row className="ms-1 me-1 w-100">
                                <Col
                                    className="nuevoProyecto comoCard p-0 mb-4 me-2"
                                    lg={2}
                                    md={3}
                                    sm={3}
                                >
                                    <Typography
                                        className="how-numbers headline-l pb-2 pt-2 justify-content-center"
                                        sx={{ backgroundColor: '#0f71b7' }}
                                    >
                                        1
                                    </Typography>
                                    <p className="body-1 p-4 d-inline-block">
                                        Crea una nueva
                                        <strong className="pb-4 ms-1 me-1">
                                            oferta
                                        </strong>
                                        gratis.
                                        {/* Describe tu proyecto <br /> */}
                                    </p>
                                </Col>
                                <Col
                                    className="seleccionaPerfiles comoCard p-0 mb-4 me-2"
                                    lg={2}
                                    md={3}
                                    sm={3}
                                >
                                    <Typography
                                        className="how-numbers headline-l pb-2 pt-2 justify-content-center"
                                        sx={{ backgroundColor: '#30347b' }}
                                    >
                                        2
                                    </Typography>
                                    <p className="body-1 p-4 d-inline-block">
                                        Consigue hasta cuatro
                                        <strong className="pb-4 ms-1 me-1">
                                            cotizaciones
                                        </strong>
                                        y selecciona el perfil adecuado para el
                                        servicio.
                                        {/* El profesional se pondrá en contacto con
                                        tigo. <br /> */}
                                    </p>
                                </Col>
                                <Col
                                    className="calificaServicio comoCard p-0 mb-4"
                                    lg={2}
                                    md={3}
                                    sm={3}
                                >
                                    <Typography
                                        className="how-numbers headline-l pb-2 pt-2 justify-content-center"
                                        sx={{ backgroundColor: '#149ba1' }}
                                    >
                                        3
                                    </Typography>
                                    <p className="body-1 p-4 d-inline-block">
                                        Califica y comenta.
                                        {/* <strong className="pb-4">
                                            
                                        </strong>
                                        Finalizo el proyecto, <br />
                                        Dejanos conocer tu experiencia. <br /> */}
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                        {/* Comerciantes Calificados */}
                        <Col className="comoComerciantes">
                            <Col className="comunidadTitulo m-4 w-auto" md={3}>
                                <h4 className="headline-s">
                                    Comerciantes calificados
                                </h4>
                            </Col>
                            <Row className="ms-1 me-1 w-100">
                                <Col
                                    className="buscarOfertas comoCard p-0 mb-4 me-2"
                                    lg={2}
                                    md={3}
                                    sm={3}
                                >
                                    <Typography
                                        className="how-numbers headline-l pb-2 pt-2 justify-content-center"
                                        sx={{ backgroundColor: '#ec6f27' }}
                                    >
                                        1
                                    </Typography>
                                    <p className="body-1 p-4 d-inline-block">
                                        Observa las oferta indicadas para ti.
                                        <br />
                                        Filtra requerimientos por ubicación y
                                        <strong className="pb-4 ms-1 me-1">
                                            postulate.
                                        </strong>
                                    </p>
                                </Col>
                                <Col
                                    className="cargaPresupuesto comoCard p-0 mb-4 me-2"
                                    lg={2}
                                    md={3}
                                    sm={3}
                                >
                                    <Typography
                                        className="how-numbers headline-l pb-2 pt-2 justify-content-center"
                                        sx={{ backgroundColor: '#e42620' }}
                                    >
                                        2
                                    </Typography>
                                    <p className="body-1 p-4 d-inline-block">
                                        Diligencia el
                                        <strong className="pb-4 ms-1 me-1">
                                            presupuesto.
                                        </strong>
                                        Haz una
                                        <strong className="pb-4 ms-1 me-1">
                                            cotizacion
                                        </strong>
                                        detallada con los datos suministrados.
                                        {/* en caso de ser escogido por el
                                        propietario para desarrollar el
                                        servicio, nos pagaras una comisión por
                                        el servicio prestado <br /> */}
                                    </p>
                                </Col>
                                <Col
                                    className="calificaPropietario comoCard p-0 mb-4"
                                    lg={2}
                                    md={3}
                                    sm={3}
                                >
                                    <Typography
                                        className="how-numbers headline-l pb-2 pt-2 justify-content-center"
                                        sx={{ backgroundColor: '#c6b61e' }}
                                    >
                                        3
                                    </Typography>
                                    <p className="body-1 p-4 d-inline-block">
                                        Califica y comenta. <br />
                                        Finalizó el proyecto, <br />
                                        Dejanos conocer tu
                                        <strong className="pb-4 ms-1 me-1">
                                            experiencia.
                                        </strong>
                                        <br />
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                    </Col>
                </Row>
            </Container>
            {/* seccion de categorias y servicios */}
            <NuestraComunidad></NuestraComunidad>
            {/* <LogosServicios /> */}
        </>
    )
}

export default Page