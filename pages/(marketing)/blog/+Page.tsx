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
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
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
                <Row className="blog-titulo m-0 w-100">
                    <Col>
                        <h1 className="type-hero-title text-blanco">BLOG</h1>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="testimonio-propietarios m-0 w-100">
                    <Col className="mt-4 mb-4">
                        <Col>
                            <h3 className="headline-l">Testimonios de Propietarios</h3>
                        </Col>
                        {testimonials.map((testimonial) => (
                            <Container key={testimonial.id} fluid className="p-0">
                                <Row>
                                    <Col>
                                        <span>usuario:</span>
                                        <div>
                                            <img
                                                src={testimonial.user}
                                                alt="Imagen Perfil"
                                                height="130px"
                                                width="130px"
                                            />
                                        </div>
                                        <span>ACREDITADO</span>
                                    </Col>
                                    <Col>
                                        <p className="body-1">{testimonial.text}</p>
                                    </Col>
                                    <Col>
                                        <img
                                            src={testimonial.image}
                                            alt="Imagen Servicio"
                                            height="170px"
                                            width="330px"
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
