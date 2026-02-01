/**
 * Comunidad Propietarios Page
 *
 * Converted to TypeScript.
 */
// Styles
// Components
import { Link } from '@hooks'
import Registro from '../../../pages/(auth)/registro/+Page'
import { ProjectSearchForm } from '@features/projects'
// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
// Verification list items
const verificationList = [
    'Verifica Adecuadamente La Identidad.',
    'Que el personal cuente con los elementos de protección personal requeridos.',
    'Recuerda verificar los certificados técnicos y de afiliación propios de cada labor.',
    'Diligenciar y firmar debidamente el contrato de prestación de servicios.',
    'Las obras que afectan a terceros de la comunidad han de hacerse saber para conseguir su aprobación.',
    'Cuando hayas elegido el profesional, descarga y utiliza el contrato de adquisición.',
    'Reserva un 5% del presupuesto para imprevistos.',
    'Expón claramente cualquier aspecto que pueda influir en el resultado final.',
    'Si el proyecto tiene impacto energético y/o ecológico, consulta ayudas y subvenciones institucionales.',
]
export default function Page() {
    return (
        <div className="owners-page">
            <Container fluid className="p-0" style={{ overflowY: 'scroll' }}>
                <Row className="comunidad-propietarios-titulo m-0 d-flex flex-row justify-content-start align-content-start">
                    <Col className="align-items-start" md={8} sm={12} lg={6}>
                        <Col className="col-12 opacidad-negro mt-4 mb-4">
                            <p className="p-description">
                                Somos un Marketplace de servicios, promocionamos contratistas de
                                adecuaciones y acabados inmobiliarios. Compara perfiles y
                                estadísticas, con base en calificaciones de la comunidad.
                            </p>
                            <h3 className="headline-l text-verde">
                                Contrata seguro con nuestra comunidad
                            </h3>
                        </Col>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="comunidad-propietarios-registro m-0 d-flex flex-column">
                    <Col className="m-0" style={{ paddingLeft: '0px' }}>
                        <h2 className="text-blanco headline-xl">COMUNIDAD PROPIETARIOS</h2>
                        <Registro />
                    </Col>
                    <Col md={8}>
                        <div className="imagen-registro" />
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="comunidad-propietarios-buscador m-0 row">
                    <Col
                        className="justify-content-center align-items-center"
                        lg={4}
                        md={6}
                        sm={10}
                    >
                        <Col className="opacidad-negro">
                            <p className="body-2 text-blanco">
                                Con ayuda de la comunidad haz realidad la casa que deseas. Encuentra
                                un profesional Seguro y Confiable, para cada trabajo.
                            </p>
                        </Col>
                    </Col>
                    <Col className="col m-4 p-0" xl={4} lg={6} md={8} sm={12} xs={12}>
                        <ProjectSearchForm simple={false} />
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="comunidad-propietarios-consultar m-0 row p-4">
                    <Col className="col-10">
                        <Col className="col-12 m-4">
                            <Row className="w-100">
                                <h3 className="headline-l">
                                    Planea con nosotros el proyecto
                                    <Button className="btn btn-round btn-high btn-green body-1">
                                        <Link href="/blog">Nuestro Blog</Link>
                                    </Button>
                                </h3>
                            </Row>
                            <p className="body-1">
                                El espacio de tus sueños comienza con una gran idea y tenemos miles
                                de ellas.
                            </p>
                        </Col>
                        <Row>
                            <Col
                                className="d-flex flex-column align-items-baseline"
                                lg={4}
                                sm={12}
                                style={{ justifyContent: 'space-evenly' }}
                            >
                                <p className="body-2">
                                    Nuestra recomendación esencial al contratar un comerciante
                                    calificado, nunca cancelar la totalidad por adelantado.
                                </p>
                                <p className="headline-l">Propietario revisa la</p>
                                <Button className="btn btn-avanzar body-1 pe-0 text-blanco">
                                    Lista de chequeo
                                </Button>
                                <span className="body-2">
                                    3204842897
                                    <br />
                                    Lunes a viernes, 8am - 5pm
                                    <br />
                                    Sábados 9am - 2pm
                                </span>
                            </Col>
                            <Col
                                className="d-flex flex-column align-items-baseline"
                                lg={8}
                                sm={12}
                                style={{ justifyContent: 'space-evenly' }}
                            >
                                <Row className="w-100">
                                    <Col>
                                        <h3 className="headline-l">
                                            Observa cambios
                                            <Button className="btn btn-round btn-high btn-green body-1">
                                                <Link href="/blog">
                                                    Proyectos <br /> Destacados
                                                </Link>
                                            </Button>
                                        </h3>
                                    </Col>
                                    <p className="body-1">Inspírate, tenemos muchos trabajos realizados.</p>
                                </Row>
                                <Row className="w-100">
                                    <Col>
                                        <h3 className="headline-l">
                                            ¿Requieres de asesoría?
                                            <Button className="btn btn-round btn-high btn-green body-1">
                                                <Link href="/asesorias">
                                                    Pregunta a un <br /> Profesional
                                                </Link>
                                            </Button>
                                        </h3>
                                    </Col>
                                    <p className="body-1">
                                        Nuestra comunidad de comerciantes calificados te ayudarán.
                                    </p>
                                </Row>
                                <Row className="w-100">
                                    <Col>
                                        <h3 className="headline-l">
                                            Presupuestos
                                            <Button className="btn btn-round btn-high btn-green body-1">
                                                <Link href="/nuevo-proyecto">
                                                    Comenzar <br /> Cotización
                                                </Link>
                                            </Button>
                                        </h3>
                                    </Col>
                                    <p className="body-1">
                                        Saber cuánto te puede costar es importante para iniciar.
                                    </p>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="comunidad-propietarios-lista-verificacion m-0">
                    <Col className="col-8 p-0 m-0 pt-4 mt-4 pb-4 mb-4" id="listaChequeo">
                        <h2 className="headline-xl text-blanco ps-4 ms-4">LISTA DE VERIFICACIÓN</h2>
                        <ul className="body-1">
                            {verificationList.map((item, index) => (
                                <li key={index}>- {item}</li>
                            ))}
                            <span className="headline-l text-verde">
                                - Se resuelve la encuesta de satisfacción del servicio
                            </span>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
