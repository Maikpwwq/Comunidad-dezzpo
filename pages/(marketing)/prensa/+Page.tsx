/**
 * Prensa (Press) Page
 *
 * Converted to TypeScript.
 */

export const documentProps = {
    title: 'Prensa | Comunidad Dezzpo',
    description: 'Noticias y comunicados de prensa de Comunidad Dezzpo.',
}

// Styles
import '@assets/css/prensa.css'

// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

// Press documents (placeholder data)
const documents = ['Estudios', 'Estudios', 'Estudios', 'Estudios']

export default function Page() {
    return (
        <Container fluid className="p-0">
            <Row className="pageContainer">
                <Col className="prensaMensaje">
                    <span className="tituloDocumento">
                        <h3 className="headline-l">Consulta por título de documento</h3>
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
