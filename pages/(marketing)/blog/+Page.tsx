/**
 * Blog Page - Testimonios de Propietarios
 *
 * Converted to TypeScript.
 */
// Styles
// Assets
import BlogEntrada1 from '@assets/img/BlogEntrada1.png'
import User1 from '@assets/img/iconos/User1.svg'
import BlogEntrada2 from '@assets/img/BlogEntrada2.png'
import User2 from '@assets/img/iconos/User2.svg'
import BlogEntrada3 from '@assets/img/BlogEntrada3.png'
import User3 from '@assets/img/iconos/User3.svg'
// Bootstrap
import { Row, Col, Container } from 'react-bootstrap'
// Testimonial data
const testimonials = [
    {
        id: 1,
        user: User1,
        image: BlogEntrada1,
        text: 'No encontraba en quien depositar mi confianza, la restauracion de mis muebles es una realidad y estoy feliz',
    },
    {
        id: 2,
        user: User2,
        image: BlogEntrada2,
        text: 'La familia se crecio y la casa esta nuevamente llena de vida, contratar la ampliación de los espacios fue algo muy sencillo',
    },
    {
        id: 3,
        user: User3,
        image: BlogEntrada3,
        text: 'Pasaron años antes de que me decidiera, ahora los problemas de humedad ya son cosas del pasado',
    },
]
export default function Page() {
    return (
        <div className="blog-page">
            <Container fluid className="p-0">
                <Row className="blog-titulo m-0 w-100 d-flex align-items-center" style={{ minHeight: '300px' }}>
                    <Col className="p-5 text-center">
                        <h1 className="type-hero-title text-blanco">BLOG</h1>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="testimonio-propietarios m-0 w-100 py-5">
                    <Col className="mt-4 mb-4">
                        <Col className="text-center mb-5">
                            <h3 className="headline-xl">Testimonios de Propietarios</h3>
                        </Col>
                        {testimonials.map((testimonial) => (
                            <Container key={testimonial.id} className="mb-5">
                                <Row className="align-items-center">
                                    <Col md={4} className="d-flex flex-column align-items-center text-center">
                                        <div className="mb-3">
                                            <img
                                                src={testimonial.user}
                                                alt="Imagen Perfil"
                                                height="130px"
                                                width="130px"
                                                className="rounded-circle"
                                            />
                                        </div>
                                        <span className="headline-s">USUARIO</span>
                                        <span className="body-2 text-verde fw-bold">ACREDITADO</span>
                                    </Col>
                                    <Col md={4} className="p-4 text-center">
                                        <p className="body-1 fst-italic">"{testimonial.text}"</p>
                                    </Col>
                                    <Col md={4} className="d-flex justify-content-center">
                                        <img
                                            src={testimonial.image}
                                            alt="Imagen Servicio"
                                            className="img-fluid rounded-3"
                                            style={{ maxHeight: '170px', objectFit: 'cover' }}
                                        />
                                    </Col>
                                </Row>
                            </Container>
                        ))}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
