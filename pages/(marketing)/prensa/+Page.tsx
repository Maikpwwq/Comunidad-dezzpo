/**
 * Prensa (Press) Page
 *
 * Converted to TypeScript.
 */
// Styles
// Bootstrap
// Bootstrap
import { Row, Col, Container } from 'react-bootstrap'
// Press documents (placeholder data)
const documents = ['Estudios', 'Estudios', 'Estudios', 'Estudios']
export default function Page() {
    return (
        <Container fluid className="p-0">
            <Row className="page-container" style={{ minHeight: '600px' }}>
                <Col className="prensa-mensaje d-flex flex-column justify-content-center align-items-center text-center p-5">
                    <div className="opacidad-negro p-5 rounded-3">
                        <h1 className="type-hero-title text-blanco mb-4">Consulta por título de documento</h1>
                        <ul className="list-unstyled body-1 text-blanco">
                            {documents.map((doc, index) => (
                                <li key={index} className="mb-2 hover-underline cursor-pointer">{doc}</li>
                            ))}
                        </ul>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}
