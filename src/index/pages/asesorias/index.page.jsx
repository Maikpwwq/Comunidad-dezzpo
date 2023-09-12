export { Page }

// Pagina de Asesorias
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import '#@/assets/css/asesorias.css'
import { Link } from '#R/Link'
import { navigate } from 'vite-plugin-ssr/client/router'
import { updateAsesoriaToFirestore } from '#@/services/updateAsesoriaToFirestore.service'
// import { sharingInformationService } from '#@/services/sharing-information'

// react-bootrstrap
// import { Row, Col, Container, Button, Form } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ChatIcon from '@mui/icons-material/Chat';
// <ChatIcon className="ms-1"/> 

const Page = (props) => {
    // const navigate = useNavigate()
    const asesoriaID = uuidv4()
    const [asesoriaInfo, setAsesoriaInfo] = useState({
        asesoriaTitulo: '',
        asesoriaDescription: '',
        asesoriaSelect: '',
    })

    const handleClickChat = () => {}

    const handleBlogButton = () => {
        navigate('/blog')
    }

    const toAsesoria = async (updateInfo, docId) => {
        console.log('updateAsesoriaToFirestore', updateInfo, docId)
        await updateAsesoriaToFirestore({
            updateInfo, docId
        })
    }

    const handleClick = () => {
        console.log('asesoriaInfo', asesoriaInfo)
        toAsesoria(asesoriaInfo, asesoriaID)
            .then((data) => {
                if (data) {
                    const res = data.data()
                    console.log(data, res)
                }
            })
        // const asesoriaData = sharingInformationService.getSubject()
        // asesoriaData.subscribe((data) => {
        //     if (data) {
        //         const { sendAsesoria } = data
        //         console.log('Asesoria Detail load:', sendAsesoria)
        //     }
        // })
    }

    const handleChange = (event) => {
        event.preventDefault()
        setAsesoriaInfo({
            ...asesoriaInfo,
            [event.target.name]: event.target.value,
        })
    }


    return (
        <>
            <Container fluid className="p-0">
                <Row className="asesoriasTitulo m-0 w-100">
                    <Col
                        className="align-items-end"
                        lg={6}
                        md={8}
                        sm={10}
                        xs={12}
                    >
                        <Col className="opacidadNegro">
                            <h2 className="headline-xl textBlanco">
                                ASESORÍAS EN VIVO
                            </h2>
                            <br />
                            <p className="asesoriaMessage p-description">
                                Consulta a un profesional de la comunidad, y
                                resulve ya las dudas que tengas en cuanto a
                                tecnicas, especificaciones de materiales,
                                alcance, tiempo y costo, de tu nuevo proyecto.
                            </p>
                        </Col>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="asesoriasPreguntas m-0 w-100">
                    <Col className="row">
                        <Col className="col pb-4" md={6} sm={12}>
                            <h2 className="headline-xl">
                                ¿Requieres de una asesoria?
                            </h2>
                            <p className="body-1">
                                Nuestra comunidad de comerciantes calificados te
                                ayudaran con tus inquietudes.
                            </p>
                            <h2 className="headline-xl">
                                Realiza una pregunta a un profesional
                            </h2>
                            <p className="body-1">
                                Obten ayuda gratuita de la comunidad.
                            </p>
                            <br />
                            <Form className="pb-4" action="">
                                <Form.Group
                                    className="mb-3"
                                    controlId="formasesoriaSelect"
                                >
                                    <Form.Label className="body-2">
                                        Seleccionar categoria
                                    </Form.Label>
                                    <Form.Select
                                        name="asesoriaSelect"
                                        value={asesoriaInfo.asesoriaSelect}
                                        onChange={handleChange}
                                    >
                                        <optgroup>
                                            <option value="">Selecciona</option>
                                            <option value="Nuevo">Nuevo</option>
                                            <option value="Controversial">
                                                Controversial
                                            </option>
                                            <option value="Destacado">
                                                Destacado
                                            </option>
                                        </optgroup>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formAsesoriaTitulo"
                                >
                                    <Form.Label className="body-2">
                                        Dale un titulo a tu pregunta
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Dale un titulo a tu pregunta"
                                        name="asesoriaTitulo"
                                        value={asesoriaInfo.asesoriaTitulo}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formAsesoriaDescription"
                                >
                                    <Form.Label className="body-2">
                                        ¿Qué quisieras conocer?
                                    </Form.Label>
                                    <br />
                                    <Form.Text className="text-muted">
                                        Recuerda entre mas detallado puedas
                                        describirlo mejores respuestas
                                        obtendras.
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
                                    onClick={handleClick}
                                >
                                    PUBLICAR
                                </Button>
                            </Form>
                        </Col>
                        <Col className="col pt-4 pb-4" md={6} sm={12}>
                            <span className="chatAsesor headline-xl mb-4">
                                Contacta Con Un Asesor
                                <br />
                                en Tiempo Real En Nuestro Chat <ChatIcon className="ms-1"/> 
                            </span>
                            <Button
                                className="btn btn-round btn-high btn-avanzar"
                                onClick={handleClickChat}
                            >
                                <a
                                    className="body-1 ps-3 textBlanco"
                                    href="https://api.whatsapp.com/send?phone=573196138057"
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
                <Row className="asesoriasBlog m-0 w-100">
                    <Row className="col">
                        <Col className="m-4" md={6} sm={10}>
                            <p className="body-2 textBlanco">
                                Postulando una pregunta, estas creando una
                                cuenta gratuita y accediento a aceptar nuestra
                                <Link href="/legal" className="ms-1 me-1">
                                    politica de privacidad
                                </Link>
                                y los <Link href="/legal">terminos de uso.</Link>
                            </p>
                            <h3 className=".headline-l">
                                Historial de preguntas de la comunidad
                            </h3>
                            <p className="body-1 textBlanco">
                                Revisa las ultimas preguntas y respuestas de la
                                comunidad, y participa.
                            </p>
                        </Col>
                        <Col className="pb-4" md={4} sm={10}>
                            <Button
                                className="btn btn-round btn-middle btn-blog"
                                onClick={handleBlogButton}
                            >
                                {/* BLOG DE LA COMUNIDAD */}
                            </Button>
                        </Col>
                    </Row>
                </Row>
            </Container>
        </>
    )
}
