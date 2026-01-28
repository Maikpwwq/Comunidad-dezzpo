import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { Typography } from '@mui/material'
import clsx from 'clsx'

import styles from './Subscribe.module.scss'

export const Subscribe: React.FC = () => {
    return (
        <Row className={clsx(styles.Section, "m-0 w-100 p-4")}>
            <Col lg={6} md={8} sm={10} className="mx-auto text-center">
                <Typography variant="h4" className={clsx(styles.Title, "mb-3")}>
                    Suscríbete a nuestro boletín
                </Typography>
                <Typography variant="body1" className={clsx(styles.Description, "mb-4")}>
                    Recibe las últimas noticias y actualizaciones de Comunidad Dezzpo directamente en tu correo.
                </Typography>
                <Form className="d-flex justify-content-center">
                    <InputGroup className="mb-3" style={{ maxWidth: '500px' }}>
                        <Form.Control
                            placeholder="Tu correo electrónico"
                            aria-label="Tu correo electrónico"
                            type="email"
                        />
                        <Button variant="primary" className={styles.SubmitButton}>
                            Suscribirse
                        </Button>
                    </InputGroup>
                </Form>
            </Col>
        </Row>
    )
}

export default Subscribe
