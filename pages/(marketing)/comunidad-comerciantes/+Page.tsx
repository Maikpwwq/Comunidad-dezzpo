/**
 * Comunidad Comerciantes Page
 *
 * Converted to TypeScript.
 * NOTE: Imports Registro component from pages/(auth)/registro/+Page.tsx
 */
// Styles
import clsx from 'clsx'
// Components
import Registro from '../../../pages/(auth)/registro/+Page'
import { InfoSection } from '@components/layout/InfoSection'
// Bootstrap
import { Row, Col, Container } from 'react-bootstrap'
// Icon
import IcoMoon from 'react-icomoon'
import iconSet from '@assets/icomoon/selection.json'

// Benefits data
const benefits = [
    {
        title: 'Alcance y visibilidad',
        description: 'Hay personas que te están buscando y aún no saben que existes. Promociona las 24 horas del día y los 365 días del año.',
    },
    {
        title: 'Audiencia calificada y segmentada',
        description: 'Alcance sus objetivos de crecimiento, nuestro público cautivo comprende usuarios visitantes únicos del sitio web.',
    },
    {
        title: 'Mejora la penetración de tu marca',
        description: 'Posiciónese en el mercado digital, fideliza clientes y captura ventas.',
    },
    {
        title: 'Mide el rendimiento de tus anuncios',
        description: 'Adopta herramientas de gestión estratégica CEO, tendrás un Informe de resultados en tiempo real.',
    },
]

export default function Page() {
    return (
        <div className="merchants-page">
            <Container fluid className="p-0">
                <Row className="comunidad-comerciantes-titulo m-0 d-flex flex-row justify-content-start align-items-center" style={{ minHeight: '600px' }}>
                    <Col className="col-md-8 col-lg-6 ps-md-5">
                        <div className="opacidad-negro p-4 rounded-3" style={{ backdropFilter: 'blur(5px)' }}>
                            <h1 className="type-hero-title text-blanco mb-4">
                                ¿TE FALTA GESTIÓN? DÉJANOS REPRESENTAR TU TRABAJO
                            </h1>
                            <h2 className="headline-l text-blanco mb-4">
                                GARANTIZAMOS UNA NOTABLE MEJORA EN INGRESOS Y OPORTUNIDADES DE CRECIMIENTO
                            </h2>
                            <p className="body-2 text-blanco mb-4">
                                Propietarios y proyectos listos para contactar, trabajo cuando lo
                                necesitas, con cada plan de afiliación, obtendrás al menos la
                                misma cantidad de beneficios. Haz que tus clientes potenciales
                                conozcan lo que tienes para ofrecer.
                            </p>
                            <h3 className="headline-m text-verde">Solicita Tu Membresía Ahora</h3>
                        </div>
                    </Col>
                </Row>
            </Container>

            <Container fluid className="p-0">
                <Row className="comunidad-comerciantes-registro p-0 m-0 align-items-center">
                    <Col md={6} lg={6} className="d-flex justify-content-center p-5">
                        <div className="text-center" style={{ maxWidth: '500px' }}>
                            <h2 className="headline-xl mb-4">Comunidad de Comerciantes</h2>
                            <p className="body-1">Únete a la red más grande de profesionales y haz crecer tu negocio hoy mismo.</p>
                        </div>
                    </Col>
                    <Registro showLogo={false} />
                </Row>
            </Container>

            <Container fluid className="p-0 bg-verde">
                <Row className="m-0 align-items-stretch">
                    <Col lg={6} md={12} className="p-5 d-flex flex-column justify-content-center">
                        <InfoSection
                            title="Para tu negocio"
                            className="text-white mb-5"
                            description="Encuentra nuevos clientes fácilmente y mantente ocupado, con nuestros planes de publicidad tu perfil aparecerá arriba en las búsquedas de Google, accede a un Micro sitio personalizado."
                        />

                        <InfoSection
                            title="Para ti"
                            className="text-white mb-5"
                            description="Aumenta tu influencia con el respaldo de la comunidad. Gestiona tus estadísticas, la Calificación es valorada según tres aspectos:"
                        >
                            <div className="w-100 text-center mt-3">
                                <strong className="headline-s"> Gestión {'>'} Calidad {'>'} Oportunidad del servicio</strong>
                            </div>
                        </InfoSection>

                        <InfoSection
                            title="Invita A Un Amigo"
                            className="text-white"
                            description="Con el programa de referidos te premiamos por recomendar a la comunidad. Invita tus amigos a que se registren al programa compartiendo tu código único, acumula puntos, obtén descuentos y llévate premios."
                        />
                    </Col>
                    <Col
                        className="comunidad-comerciantes-beneficios p-0"
                        lg={6}
                        md={12}
                        style={{ minHeight: '600px', backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                </Row>
            </Container>

            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col lg={10} md={12}>
                        <InfoSection
                            title="El plan de beneficios con la membresía incluye"
                            description="Nosotros creamos los anuncios de contenido así que no tendrás que preocuparte de hacerlo. El costo varía según la cantidad de contenidos, el lugar de aparición, y la duración de publicación."
                            centered
                            className="mb-5"
                        />

                        <h3 className="headline-l text-center mb-5">
                            ¿Cuáles son las grandes ventajas de hacer publicidad en Internet?
                        </h3>

                        <Row>
                            {benefits.map((benefit) => (
                                <Col md={6} key={benefit.title} className="mb-4">
                                    <div className="h-100 p-4 rounded-3 bg-light">
                                        <h4 className="headline-m color-green mb-3">{benefit.title}</h4>
                                        <p className="body-2">{benefit.description}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

