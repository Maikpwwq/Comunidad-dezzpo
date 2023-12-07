// Pagina de Legal
import React from 'react'
import '#@/assets/css/legal.css'

// react-bootrstrap
// import { Row, Col, Container } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import DownloadIcon from '@mui/icons-material/Download'

const Page = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="legalContainer">
                    <Col className="m-4">
                        <a
                            href="https://drive.google.com/file/d/1_bGEdb1nTqY0-NpixhWZQVR7vXpN0tJM/view?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <h3 className="headline-l textBlanco">
                                Terminos y condiciones de uso
                                <br /> Propietarios{' '}
                                <DownloadIcon fontSize="large" />
                            </h3>
                        </a>
                    </Col>
                    <Col className="m-4">
                        <a
                            href="https://drive.google.com/file/d/1w7Da1cFH3_MjLy7CUZaV3QBHARpn_ogk/view?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <h3 className="headline-l textBlanco">
                                Terminos y condiciones de uso
                                <br /> Comercientes Calificados{' '}
                                <DownloadIcon fontSize="large" />
                            </h3>
                        </a>
                    </Col>
                    {/* Aviso tratamiento de datos personales. 
                        "https://drive.google.com/file/d/1R3uRi3zZ0MmjN3VoUp3GvLGvZ3bCaT6e/view?usp=sharing" */}
                    <Col className="m-4">
                        <a
                            href="https://drive.google.com/file/d/10I8CNmXfatwNigiICp7UP40WQyMENC_f/view?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <h3 className="headline-l textBlanco">
                                Politica de privacidad{' '}
                                <DownloadIcon fontSize="large" />
                            </h3>
                        </a>
                    </Col>
                    <Col className="m-4">
                        <a
                            href="http://www.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <h3 className="headline-l textBlanco">
                                Cookies <DownloadIcon fontSize="large" />{' '}
                            </h3>
                        </a>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Page