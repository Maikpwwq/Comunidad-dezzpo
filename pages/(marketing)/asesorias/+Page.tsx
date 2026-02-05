/**
 * Asesorías Page
 *
 * Converted to TypeScript.
 */
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { navigate } from 'vike/client/router'
// Styles
// Services
import { updateAsesoriaToFirestore } from '@services/asesoriaService'
// Components
import { Link } from '@hooks'
// Bootstrap
import { Row, Col, Container, Button, Form } from 'react-bootstrap'
// MUI
import ChatIcon from '@mui/icons-material/Chat'
import EmailIcon from '@mui/icons-material/Email'
interface AsesoriaInfo {
    asesoriaTitulo: string
    asesoriaDescription: string
    asesoriaSelect: string
}
export default function Page() {
    const asesoriaID = uuidv4()
    const [asesoriaInfo, setAsesoriaInfo] = useState<AsesoriaInfo>({
        asesoriaTitulo: '',
        asesoriaDescription: '',
        asesoriaSelect: '',
    })
    const handleBlogButton = () => {
        navigate('/blog')
    }
    const handleSubmit = async () => {
        try {
            await updateAsesoriaToFirestore({
                updateInfo: asesoriaInfo,
                docId: asesoriaID,
            })
        } catch (error) {
            console.error('Error submitting asesoria:', error)
        }
    }
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        event.preventDefault()
        setAsesoriaInfo({
            ...asesoriaInfo,
            [event.target.name]: event.target.value,
        })
    }
    return (
        <div className="consulting-page">
            <Container fluid className="p-0">
                <Row className="asesorias-titulo m-0 w-100">
                    <Col className="align-items-end" lg={6} md={8} sm={10} xs={12}>
                        <Col className="opacidad-negro">
                            <h1 className="type-hero-title text-blanco">ASESORÍAS EN VIVO</h1>
                            <br />
                            <p className="asesoria-message p-description">
                                Consulta a un profesional de la comunidad, y resuelve ya las dudas
                                que tengas en cuanto a técnicas, especificaciones de materiales,
                                alcance, tiempo y costo, de tu nuevo proyecto.
                            </p>
                        </Col>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="asesorias-preguntas m-0 w-100">
                    <Col className="row">
                        <Col className="col pb-4" md={6} sm={12}>
                            <h2 className="headline-xl">¿Requieres de una asesoría?</h2>
                            <p className="body-1">
                                Nuestra comunidad de comerciantes calificados te ayudarán con tus
                                inquietudes.
                            </p>
                            <h2 className="headline-xl">Realiza una pregunta a un profesional</h2>
                            <p className="body-1">Obtén ayuda gratuita de la comunidad.</p>
                            <br />
                            <Form className="pb-4">
                                <Form.Group className="mb-3" controlId="formasesoriaSelect">
                                    <Form.Label className="body-2">Seleccionar categoría</Form.Label>
                                    <Form.Select
                                        name="asesoriaSelect"
                                        value={asesoriaInfo.asesoriaSelect}
                                        onChange={handleChange}
                                    >
                                        <optgroup>
                                            <option value="">Selecciona</option>
                                            <option value="Nuevo">Nuevo</option>
                                            <option value="Controversial">Controversial</option>
                                            <option value="Destacado">Destacado</option>
                                        </optgroup>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formAsesoriaTitulo">
                                    <Form.Label className="body-2">
                                        Dale un título a tu pregunta
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Dale un título a tu pregunta"
                                        name="asesoriaTitulo"
                                        value={asesoriaInfo.asesoriaTitulo}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formAsesoriaDescription">
                                    <Form.Label className="body-2">¿Qué quisieras conocer?</Form.Label>
                                    <br />
                                    <Form.Text className="text-muted">
                                        Recuerda entre más detallado puedas describirlo mejores
                                        respuestas obtendrás.
                                    </Form.Text>
                                    <Form.Control
                                        as="textarea"
                                        style={{ height: '100px' }}
                                        placeholder="¿Aquí tus dudas?"
                                        name="asesoriaDescription"
                                        value={asesoriaInfo.asesoriaDescription}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Button
                                    className="btn btn-round btn-high btn-avanzar"
                                    onClick={handleSubmit}
                                >
                                    PUBLICAR
                                </Button>
                            </Form>
                        </Col>
                        <Col className="col pt-4 pb-4" md={6} sm={12}>
                            <span className="chat-asesor headline-xl mb-4">
                                Contacta Con Un Asesor
                                <br />
                                en Tiempo Real En Nuestro Chat <ChatIcon className="ms-1" />
                            </span>
                            <Button className="btn btn-round btn-high btn-avanzar">
                                <a
                                    className="body-1 ps-3 text-blanco"
                                    href="https://wa.me/573204842897?text=Hola%20estoy%20interesado%20en%20saber%20acerca%20de%20como%20Dezzpo%20..."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    CHAT EN VIVO
                                </a>
                            </Button>
                        </Col>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="asesorias-blog m-0 w-100">
                    <Row className="col">
                        <Col className="m-4" md={6} sm={10}>
                            <p className="body-2 text-blanco">
                                Postulando una pregunta, estás creando una cuenta gratuita y
                                accediendo a aceptar nuestra
                                <Link href="/legal" className="ms-1 me-1">
                                    política de privacidad
                                </Link>
                                y los <Link href="/legal">términos de uso.</Link>
                            </p>
                            <h3 className="headline-l">
                                Historial de preguntas de la comunidad
                            </h3>
                            <p className="body-1 text-blanco">
                                Revisa las últimas preguntas y respuestas de la comunidad, y
                                participa.
                            </p>
                        </Col>
                        <Col className="pb-4" md={4} sm={10}>
                            <Button
                                className="btn btn-round btn-middle btn-blog"
                                onClick={handleBlogButton}
                            >
                                <EmailIcon className="me-2" />
                                BLOG DE LA COMUNIDAD
                            </Button>
                        </Col>
                    </Row>
                </Row>
            </Container>
        </div>
    )
}
