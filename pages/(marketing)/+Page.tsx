/**
 * Home Page
 *
 * Main landing page for Comunidad Dezzpo marketplace.
 * Converted to TypeScript with V1 design patterns.
 */
import { navigate } from 'vike/client/router'
// Components
import { NuestraComunidad, QuickMatch } from '@features/marketing'
// Bootstrap
import { Row, Col, Container } from 'react-bootstrap'
// MUI
import {
    Box,
    Typography
} from '@mui/material'

export default function Page() {
    const handleClick = () => {
        navigate('/app/portal-servicios')
    }
    return (
        <div className="home-container">
            <Container fluid className="p-0 pt-4">
                <Row className="m-0 w-100 banner-comunidad d-flex justify-content-center align-items-center">
                    {/* Spacer: pushes contenedorBanner away from the background character image on xl/lg */}
                    <Col className="col m-0 p-0 d-none d-lg-flex" xl={4} lg={2}>
                    </Col>
                    <Col
                        id="contenedorBanner"
                        className="m-0 p-0 d-flex flex-column justify-content-center align-items-center"
                        xl={3}
                        lg={4}
                        md={4}
                        sm={10}
                        xs={11}
                    >
                        <Box className="slogan p-0">
                            <h1 className="type-hero-title">
                                <strong>Bienvenido</strong>
                            </h1>
                            <Typography variant="body2" className="mb-3 mt-2" sx={{ color: 'var(--content-text-color)', fontSize: '1rem', lineHeight: 1.6 }}>
                                ¡Encuentra al instante el personal profesional ideal para cada proyecto en el hogar!
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                component="button"
                                className="text-verde btn-cta"
                                onClick={handleClick}
                                sx={{
                                    cursor: 'pointer',
                                    border: '2px solid var(--background-main-green-color)',
                                    borderRadius: '30px',
                                    padding: '10px 28px',
                                    fontWeight: 600,
                                    backgroundColor: 'white',
                                    color: 'var(--primary-green-text-color)',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: 'var(--background-main-green-color)',
                                        color: 'white !important',
                                    }
                                }}
                            >
                                Portal de servicios
                            </Typography>
                        </Box>
                    </Col>
                    <Col className="col m-4 p-0 d-flex justify-content-center flex-column" xl={4} lg={5} md={7} sm={12} xs={12}>
                        <QuickMatch />
                    </Col>
                </Row>
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
