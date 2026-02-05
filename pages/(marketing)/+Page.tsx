/**
 * Home Page
 *
 * Main landing page for Comunidad Dezzpo marketplace.
 * Converted to TypeScript with V1 design patterns.
 */
import { useState } from 'react'
import { navigate } from 'vike/client/router'
// Styles
// Components
import { ProjectSearchForm } from '@features/projects'
import { NuestraComunidad, Subscribe } from '@features/marketing'
// Bootstrap
// Bootstrap
import { Row, Col, Container } from 'react-bootstrap'
// MUI
import { useTheme } from '@mui/material/styles'
import {
    Box,
    Button,
    MobileStepper,
    Typography
} from '@mui/material'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
// Swipeable views
import SwipeableViews from 'react-swipeable-views'
import { bindKeyboard } from 'react-swipeable-views-utils'
const CustomSwipeableViews = bindKeyboard(SwipeableViews)
const styles = {
    stepper: {
        position: 'relative' as const,
        bottom: '-25px',
        zIndex: 1000,
        background: 'transparent',
        height: '0px',
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row' as const,
    },
}
export default function Page() {
    const theme = useTheme()
    const maxSteps = 2
    const [activeStep, setActiveStep] = useState(0)
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }
    const handleStepChange = (step: number) => {
        setActiveStep(step)
    }
    const handleClick = () => {
        navigate('/registro/')
    }
    return (
        <div className="home-container">
            <Container fluid className="p-0 pt-4">
                <Box sx={{ width: '100%', flexGrow: 1 }}>
                    <CustomSwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={activeStep}
                        onChangeIndex={handleStepChange}
                        enableMouseEvents
                    >
                        {/* Banner Principal */}
                        <Row className="m-0 w-100 banner-comunidad d-flex justify-content-center">
                            <Col className="image-container" lg={2} md={3} sm={12} xs={11}>
                                {/* Image placeholder / spacing column if image is background */}
                            </Col>
                            <Col
                                id="contenedorBanner"
                                className="m-0 p-0 pt-4 d-flex flex-column justify-content-center align-items-center"
                                xl={5}
                                lg={5}
                                md={5}
                                sm={10}
                                xs={11}
                            >
                                <Box className="slogan p-0 ps-4">
                                    <h1 className="type-hero-title">
                                        <strong>Bienvenido</strong>
                                    </h1>
                                    <Typography variant="body2" className="mb-4 mt-2">
                                        ¡Encuentra al instante el personal profesional ideal para cada proyecto en el hogar!
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        className="text-verde btn btn-round btn-high"
                                        sx={{ backgroundColor: 'transparent !important', border: '2px solid var(--background-main-green-color)' }}
                                        onClick={handleClick}
                                    >
                                        Unete a la Comunidad
                                    </Typography>
                                </Box>
                            </Col>
                            <Col className="col m-4 p-0 d-flex justify-content-center" xl={4} lg={4} md={4} sm={12} xs={12}>
                                <ProjectSearchForm simple={false} />
                            </Col>
                        </Row>
                        {/* Subscribe Section */}
                        <Subscribe />
                    </CustomSwipeableViews>
                    <MobileStepper
                        sx={styles.stepper}
                        className="pb-4 mb-4"
                        steps={maxSteps}
                        activeStep={activeStep}
                        nextButton={
                            <Button
                                size="large"
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
                                size="large"
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
            {/* Description Banner */}
            <Container fluid className="p-0">
                <Row className="m-0 pt-4 w-100 mensaje-banner">
                    <Col className="p-4" lg={7} md={8} sm={10}>
                        <Typography variant="body2" className="m-0 body-2">
                            <strong>
                                Explora en Comunidad Dezzpo una red profesional confiable para todo tipo de trabajos,
                                desde soluciones de mantenimiento e instalaciones pequeñas hasta acabados inmobiliarios
                                y remodelaciones completas. Nuestro marketplace te ofrece la posibilidad de elegir
                                contratistas especializados con estadísticas verificadas. ¡Únete ahora y comienza a
                                hacer realidad tus proyectos!
                            </strong>
                        </Typography>
                    </Col>
                </Row>
            </Container>
            {/* How It Works Section */}
            <Container fluid className="p-0">
                <Row id="como-funciona" className="color-steps m-0">
                    <Col className="col-lg-8 col-md-10 col-sm-12 pt-4 pb-4">
                        <Typography variant="h3" className="pt-4 headline-l">
                            ¿Cómo funciona <br />
                            <strong>nuestra comunidad?</strong>
                        </Typography>
                        {/* Propietarios Section */}
                        <Col className="como-propietarios">
                            <Col className="comunidad-titulo m-4 w-auto" md={3}>
                                <h4 className="headline-s">Propietarios</h4>
                            </Col>
                            <Row className="ms-1 me-1 w-100">
                                <StepCard
                                    number={1}
                                    color="#0f71b7"
                                    className="nuevo-proyecto"
                                    text={<>Crea una nueva <strong>oferta</strong> gratis.</>}
                                />
                                <StepCard
                                    number={2}
                                    color="#30347b"
                                    className="selecciona-perfiles"
                                    text={<>Consigue hasta cuatro <strong>cotizaciones</strong> y selecciona el perfil adecuado.</>}
                                />
                                <StepCard
                                    number={3}
                                    color="#149ba1"
                                    className="califica-servicio"
                                    text="Califica y comenta."
                                />
                            </Row>
                        </Col>
                        {/* Comerciantes Section */}
                        <Col className="como-comerciantes">
                            <Col className="comunidad-titulo m-4 w-auto" md={3}>
                                <h4 className="headline-s">Comerciantes calificados</h4>
                            </Col>
                            <Row className="ms-1 me-1 w-100">
                                <StepCard
                                    number={1}
                                    color="#ec6f27"
                                    className="buscar-ofertas"
                                    text={<>Observa las ofertas indicadas para ti. Filtra por ubicación y <strong>postulate.</strong></>}
                                />
                                <StepCard
                                    number={2}
                                    color="#e42620"
                                    className="carga-presupuesto"
                                    text={<>Diligencia el <strong>presupuesto.</strong> Haz una <strong>cotización</strong> detallada.</>}
                                />
                                <StepCard
                                    number={3}
                                    color="#c6b61e"
                                    className="califica-propietario"
                                    text={<>Califica y comenta. Dejanos conocer tu <strong>experiencia.</strong></>}
                                />
                            </Row>
                        </Col>
                    </Col>
                </Row>
            </Container>
            {/* Community Section */}
            <NuestraComunidad />
        </div>
    )
}
// Step Card Component (extracted for cleaner code)
interface StepCardProps {
    number: number
    color: string
    className: string
    text: React.ReactNode
}
function StepCard({ number, color, className, text }: StepCardProps) {
    return (
        <Col className={`${className} como-card p-0 mb-4 me-2`} lg={2} md={3} sm={3}>
            <Typography
                className="how-numbers headline-l pb-2 pt-2 justify-content-center"
                sx={{ backgroundColor: color }}
            >
                {number}
            </Typography>
            <p className="body-1 p-4 d-inline-block">{text}</p>
        </Col>
    )
}
