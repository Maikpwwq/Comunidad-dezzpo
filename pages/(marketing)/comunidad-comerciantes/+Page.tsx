/**
 * Comunidad Comerciantes Page
 *
 * Converted to TypeScript.
 * NOTE: Imports Registro component from pages/(auth)/registro/+Page.tsx
 */
// Styles
// Components - Import Registro page component
import Registro from '../../../pages/(auth)/registro/+Page'
// Bootstrap
import { Row, Col, Container } from 'react-bootstrap'
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
                <Row className="comunidad-comerciantes-titulo m-0 d-flex flex-row justify-content-start">
                    <Col className="col-md-8 col-lg-6 align-items-start">
                        <Col className="opacidad-negro">
                            <span className="pitch-comerciantes">
                                <h2 className="headline-xl text-blanco">
                                    ¿TE FALTA GESTIÓN?, DÉJANOS REPRESENTAR TU TRABAJO GARANTIZAMOS
                                    UNA NOTABLE MEJORA EN INGRESOS Y OPORTUNIDADES DE CRECIMIENTO
                                </h2>
                            </span>
                            <p className="body-2">
                                Propietarios y proyectos listos para contactar, trabajo cuando lo
                                necesitas, con cada plan de afiliación, obtendrás al menos la
                                misma cantidad de beneficios. Haz que tus clientes potenciales
                                conozcan lo que tienes para ofrecer.
                            </p>
                            <h3 className="headline-l text-verde">Solicita Tu Membresía Ahora</h3>
                        </Col>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="comunidad-comerciantes-registro p-4 m-0">
                    <Col md={6} lg={6}>
                        <h1 className="type-hero-title center">Comunidad de Comerciantes</h1>
                    </Col>
                    <Registro showLogo={false} />
                </Row>
            </Container>
            <Container fluid className="p-0 bg-verde">
                <Row className="p-0" style={{ alignItems: 'inherit' }}>
                    <Col className="colLeft p-0 ps-4 m-0" lg={6} md={12} sm={12}>
                        <div className="p-4 m-4">
                            <span className="pitch-comerciantes subrayar">
                                <h3 className="headline-l text-blanco">Para tu negocio</h3>
                            </span>
                            <p>
                                Encuentra nuevos clientes fácilmente y mantente ocupado, con
                                nuestros planes de publicidad tu perfil aparecerá arriba en las
                                búsquedas de Google, accede a un Micro sitio personalizado.
                            </p>
                            <span className="pitch-comerciantes subrayar">
                                <h3 className="headline-l text-blanco">Para ti</h3>
                            </span>
                            <p>
                                Aumenta tu influencia con el respaldo de la comunidad, Gestiona
                                tus estadísticas, la Calificación es valorada según tres aspectos:
                                <br />
                                <br />
                                <strong>{`>`} Gestión {`>`} Calidad {`>`} Oportunidad del servicio.</strong>
                            </p>
                            <span className="pitch-comerciantes subrayar">
                                <h3 className="headline-l text-blanco">Invita A Un Amigo</h3>
                            </span>
                            <p>
                                Con el programa de referidos te premiamos por recomendar a la
                                comunidad. Invita tus amigos a que se registren al programa
                                compartiendo tu código único, acumula puntos, obtén descuentos y
                                llévate premios.
                            </p>
                        </div>
                    </Col>
                    <Col
                        className="comunidad-comerciantes-beneficios p-0 justify-content-start"
                        lg={6}
                        md={12}
                        sm={12}
                    />
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="comunidad-comerciantes-beneficios-2 m-0">
                    <Col className="p-4" md={8}>
                        <span className="pt-4 pb-4 pitch-comerciantes">
                            <h2 className="headline-xl">
                                El plan de beneficios con la membresía incluye
                            </h2>
                        </span>
                        <br />
                        <p className="body-2">
                            Nosotros creamos los anuncios de contenido así que no tendrás que
                            preocuparte de hacerlo. El costo varía según la cantidad de
                            contenidos, el lugar de aparición, y la duración de publicación.
                        </p>
                        <br />
                        <span className="pitch-comerciantes">
                            <h3 className="headline-l">
                                ¿Cuáles son las grandes ventajas de hacer publicidad en Internet?
                            </h3>
                        </span>
                        <br />
                        <ul>
                            {benefits.map((benefit) => (
                                <li key={benefit.title} className="body-1 pb-4">
                                    <span className="pitch-comerciantes">
                                        <p className="body-2">{benefit.title}</p>
                                    </span>
                                    {benefit.description}
                                </li>
                            ))}
                        </ul>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
