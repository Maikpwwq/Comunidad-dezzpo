import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { Typography } from '@mui/material'

export const Subscribe: React.FC = () => {
    return (
        <Row className="m-0 w-100 subscribe-section p-4" style={{ backgroundColor: '#f8f9fa' }}>
            <Col lg={6} md={8} sm={10} className="mx-auto text-center">
                <Typography variant="h4" className="headline-m mb-3">
                    Suscríbete a nuestro boletín
                </Typography>
                <Typography variant="body1" className="body-1 mb-4">
                    Recibe las últimas noticias y actualizaciones de Comunidad Dezzpo directamente en tu correo.
                </Typography>
                <Form className="d-flex justify-content-center">
                    <InputGroup className="mb-3" style={{ maxWidth: '500px' }}>
                        <Form.Control
                            placeholder="Tu correo electrónico"
                            aria-label="Tu correo electrónico"
                            type="email"
                        />
                        <Button variant="primary" className="btn-high btn-green">
                            Suscribirse
                        </Button>
                    </InputGroup>
                </Form>
            </Col>
        </Row>
    )
}

export default Subscribe
