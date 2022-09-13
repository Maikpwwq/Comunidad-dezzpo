// Pagina de Inicio
import React from 'react'
import '../../../../public/assets/css/home.css'
import BuscadorNuevoProyecto from '../../components/buscador/BuscadorNuevoProyecto'
import NuestraComunidad from '../../components/nuestra-comunidad/NuestraComunidad'

import Subscribe from './Subscribe'
// imagenes

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from '@mui/material/Button'
import Container from 'react-bootstrap/Container'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MobileStepper from '@mui/material/MobileStepper'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import SwipeableViews from 'react-swipeable-views'
import { bindKeyboard } from 'react-swipeable-views-utils'
import { Typography } from '@mui/material'

const CustomSwipeableViews = bindKeyboard(SwipeableViews)

const styles = (theme) => ({
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

const Inicio = (props) => {
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

    return (
        <>
            <Container fluid className="p-0">
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
                                className="m-0 p-0"
                                lg={7}
                                md={6}
                                sm={10}
                                xs={11}
                                sx={{
                                    position: { lg: 'relative' },
                                    left: { lg: '100px' },
                                }}
                            >
                                {/* Mensaje del Banner izquierda */}
                                <div className="slogan p-0">
                                    <span className="opacidadNegro">
                                        {' '}
                                        <p className="p-description">
                                            <strong className="pb-4">
                                                Bienvenido
                                            </strong>
                                            <br />
                                            <em>
                                                {' '}
                                                Hemos facilitado el servicio,{' '}
                                                <br />
                                                haciendolo más rapido y <br />
                                                simple que nunca{' '}
                                            </em>
                                        </p>{' '}
                                        <h3 className=".headline-l textVerde">
                                            {' '}
                                            Unete a la Comunidad{' '}
                                        </h3>{' '}
                                    </span>
                                </div>
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
                        // steps={maxSteps}
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
                <Row className="m-0 w-100 mensajeBanner">
                    {/* Mensaje del Banner inferior*/}
                    <Col className="p-4" lg={7} md={8} sm={10}>
                        <p className="m-0 body-2">
                            Encuentra aqui un{' '}
                            <strong> profesional Seguro y Confiable </strong>
                            para cada trabajo. Desde iluminación y pequeños
                            arreglos, hasta diseños de{' '}
                            <strong>
                                ingeniería y remodelaciones completas.
                            </strong>
                        </p>
                    </Col>
                </Row>
            </Container>
            {/* Seccion de Registro */}
            <Container fluid className="p-0">
                {/* Seccion de como funciona la comunidad */}
                <Row id="comoFunciona" className="color-steps m-0">
                    <Col className="col-lg-8 col-md-10 col-sm-12">
                        <Typography variant="h3" className="pt-4 headline-l">
                            ¿Cómo funciona <br />
                            <strong>nuestra comunidad?</strong>
                        </Typography>
                        {/* Propietarios */}
                        <Col className="comoPropietarios">
                            <Col
                                className="comunidadTitulo m-4 w-auto"
                                md={3}
                                sm={10}
                                xs={10}
                            >
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
                                        Crea una nueva{' '}
                                        <strong className="pb-4">oferta</strong>{' '}
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
                                        Consigue hasta cuatro{' '}
                                        <strong className="pb-4">
                                            cotizaciones
                                        </strong>{' '}
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
                                            
                                        </strong>{' '}
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
                                        Filtra requerimientos por ubicación y{' '}
                                        <strong className="pb-4">
                                            postulate.
                                        </strong>{' '}
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
                                        Diligencia el{' '}
                                        <strong className="pb-4">
                                            presupuesto.
                                        </strong>{' '}
                                        Haz una{' '}
                                        <strong className="pb-4">
                                            cotizacion{' '}
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
                                        Dejanos conocer tu{' '}
                                        <strong className="pb-4">
                                            experiencia.{' '}
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
        </>
    )
}

export default Inicio
