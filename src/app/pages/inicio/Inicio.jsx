// Pagina de Inicio
import React from 'react'
import '../../../../public/assets/css/home.css'
import BuscadorNuevoProyecto from '../../components/buscador/BuscadorNuevoProyecto'
import NuestraComunidad from '../../components/nuestra-comunidad/NuestraComunidad'

import Subscribe from './Subscribe'
import DirectionalButton from '../../components/DirectionalButton/DirectionalButton'
// imagenes

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MobileStepper from '@mui/material/MobileStepper'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import SwipeableViews from 'react-swipeable-views'
import { bindKeyboard } from 'react-swipeable-views-utils'

const CustomSwipeableViews = bindKeyboard(SwipeableViews)

const styles = (theme) => ({
    stepper: {
        position: 'relative',
        top: '300px',
        zIndex: 1000,
        background: 'transparent',
        height: '0px',
        padding: 0,
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
                    <MobileStepper
                        // variant=
                        sx={classes.stepper}
                        // steps={maxSteps}
                        // position="static"
                        activeStep={activeStep}
                        nextButton={
                            <Button
                                size="lg"
                                onClick={handleNext}
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
                                lg={6}
                                md={6}
                                sm={12}
                            >
                                {/* Mensaje del Banner izquierda */}
                                <div className="slogan">
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
                </Box>
                <DirectionalButton />
            </Container>
            <Container fluid className="p-0">
                <Row className="m-0 w-100 mensajeBanner">
                    {/* Mensaje del Banner inferior*/}
                    <Col className="p-4" lg={7} md={8} sm={10}>
                        <p className="m-0 p-description">
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
                <Row id="comoFunciona" className="m-0">
                    <Col className="">
                        <h3 className="pt-4 headline-l">
                            ¿Como funciona <br />
                            <strong>nuestra comunidad?</strong>
                        </h3>
                        {/* Propietarios */}
                        <Col className="comoPropietarios">
                            <Col
                                className="comunidadTitulo m-4 w-auto"
                                md={3}
                                sm={10}
                                xs={10}
                            >
                                <h4 className="headline-s textAzul">
                                    PROPIETARIOS
                                </h4>
                            </Col>
                            <Row className="">
                                <Col
                                    className="nuevoProyecto p-4 comoCard"
                                    md={3}
                                    sm={6}
                                >
                                    <p className="m-auto headline-l pb-2 justify-content-center">
                                        1
                                    </p>
                                    <p className="body-1 flex-column">
                                        <strong className="pb-4">
                                            Crea una nueva oferta gratis.
                                        </strong>{' '}
                                        Describe tu proyecto <br />
                                    </p>
                                </Col>
                                <Col
                                    className="seleccionaPerfiles p-4 comoCard"
                                    md={3}
                                    sm={6}
                                >
                                    <p className="m-auto headline-l pb-2 justify-content-center">
                                        2
                                    </p>
                                    <p className="body-1 flex-column">
                                        <strong className="pb-4">
                                            Consigue hasta cuatro cotizaciones y
                                            selecciona el perfil adecuado para
                                            el servicio.
                                        </strong>{' '}
                                        El profesional se pondrá en contacto con
                                        tigo. <br />
                                    </p>
                                </Col>
                                <Col
                                    className="calificaServicio p-4 comoCard"
                                    md={3}
                                    sm={6}
                                >
                                    <p className="m-auto headline-l pb-2 justify-content-center">
                                        3
                                    </p>
                                    <p className="body-1 flex-column">
                                        <strong className="pb-4">
                                            Califica y comenta.
                                        </strong>{' '}
                                        Finalizo el proyecto, <br />
                                        Dejanos conocer tu experiencia. <br />
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                        {/* Comerciantes Calificados */}
                        <Col className="comoComerciantes">
                            <Col className="comunidadTitulo p-4 w-auto" md={3}>
                                <h4 className="headline-s textAzul">
                                    COMERCIANTES <br />
                                    CALIFICADOS
                                </h4>
                            </Col>
                            <Row className="">
                                <Col
                                    className="buscarOfertas p-4 comoCard"
                                    md={3}
                                    sm={6}
                                >
                                    <p className="m-auto headline-l pb-2 justify-content-center">
                                        1
                                    </p>
                                    <p className="body-1 flex-column">
                                        <strong className="pb-4">
                                            Observa las oferta indicadas para
                                            ti.
                                        </strong>{' '}
                                        Filtra requerimientos por ubicación y
                                        postulate. <br />
                                    </p>
                                </Col>
                                <Col
                                    className="cargaPresupuesto p-4 comoCard"
                                    md={3}
                                    sm={6}
                                >
                                    <p className="m-auto headline-l pb-2 justify-content-center">
                                        2
                                    </p>
                                    <p className="body-1 flex-column">
                                        <strong className="pb-4">
                                            Diligencia el presupuesto.
                                        </strong>
                                        Haz una cotizacion detallada con los
                                        datos suministrados, en caso de ser
                                        escogido por el propietario para
                                        desarrollar el servicio, nos pagaras una
                                        comisión por el servicio prestado <br />
                                    </p>
                                </Col>
                                <Col
                                    className="calificaPropietario p-4 comoCard"
                                    md={3}
                                    sm={6}
                                >
                                    <p className="m-auto headline-l pb-2 justify-content-center">
                                        3
                                    </p>
                                    <p className="body-1 flex-column">
                                        <strong className="pb-4">
                                            Califica y comenta.
                                        </strong>
                                        Finalizo el proyecto, <br />
                                        Dejanos conocer tu experiencia. <br />
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
