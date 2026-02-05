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
            <Row className="page-container">
                <Col className="prensa-mensaje">
                    <span className="titulo-documento">
                        <h1 className="type-hero-title">Consulta por título de documento</h1>
                    </span>
                    <ul className="body-2">
                        {documents.map((doc, index) => (
                            <li key={index}>{doc}</li>
                        ))}
                    </ul>
                </Col>
            </Row>
        </Container>
    )
}
