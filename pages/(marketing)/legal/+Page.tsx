/**
 * Legal Page - Terms & Privacy
 *
 * Converted to TypeScript.
 */
// Styles
// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
// MUI
import DownloadIcon from '@mui/icons-material/Download'
// Legal documents data
const legalDocuments = [
    {
        title: 'Términos y condiciones de uso',
        subtitle: 'Propietarios',
        url: 'https://drive.google.com/file/d/1_bGEdb1nTqY0-NpixhWZQVR7vXpN0tJM/view?usp=sharing',
    },
    {
        title: 'Términos y condiciones de uso',
        subtitle: 'Comerciantes Calificados',
        url: 'https://drive.google.com/file/d/1w7Da1cFH3_MjLy7CUZaV3QBHARpn_ogk/view?usp=sharing',
    },
    {
        title: 'Política de privacidad',
        subtitle: null,
        url: 'https://drive.google.com/file/d/10I8CNmXfatwNigiICp7UP40WQyMENC_f/view?usp=sharing',
    },
    {
        title: 'Cookies',
        subtitle: null,
        url: '#',
    },
]
export default function Page() {
    return (
        <Container fluid className="legal-page p-0">
            <Row className="legalContainer">
                {legalDocuments.map((doc) => (
                    <Col key={doc.title + (doc.subtitle || '')} className="m-4">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            <h3 className="headline-l text-blanco">
                                {doc.title}
                                {doc.subtitle && (
                                    <>
                                        <br />
                                        {doc.subtitle}
                                    </>
                                )}{' '}
                                <DownloadIcon fontSize="large" />
                            </h3>
                        </a>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}
