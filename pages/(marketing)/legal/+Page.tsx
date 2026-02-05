import clsx from 'clsx'
import { Row, Col, Container } from 'react-bootstrap'
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
            <Row className="m-0 w-100 p-5 d-flex align-items-center" style={{ minHeight: '300px', background: 'rgba(0,0,0,0.5)' }}>
                <Col>
                    <h1 className="type-hero-title text-blanco text-center">Legal</h1>
                </Col>
            </Row>
            <Container className="py-5">
                <Row className="justify-content-center">
                    {legalDocuments.map((doc, index) => (
                        <Col key={index} lg={5} md={6} sm={12} className="mb-4">
                            <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                            >
                                <div className="p-4 rounded-3 h-100 bg-white shadow-sm transition-hover hover-lift border-start border-5 border-success d-flex flex-column justify-content-between">
                                    <div>
                                        <h3 className="headline-m text-dark mb-2">
                                            {doc.title}
                                        </h3>
                                        {doc.subtitle && (
                                            <p className="body-1 text-muted mb-0">
                                                {doc.subtitle}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-end mt-3">
                                        <DownloadIcon className="text-success" fontSize="large" />
                                    </div>
                                </div>
                            </a>
                        </Col>
                    ))}
                </Row>
            </Container>
        </Container>
    )
}
