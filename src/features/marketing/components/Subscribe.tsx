import React, { useState } from 'react'
import { Row, Col, Button, Form, InputGroup } from 'react-bootstrap'
import { Typography } from '@mui/material'
import clsx from 'clsx'
import { registerSubscription } from '@services/subscriptionService'

import styles from './Subscribe.module.scss'

export const Subscribe: React.FC = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubscribe = async () => {
        if (!email) return
        setLoading(true)
        setStatus('idle')
        setMessage('')

        try {
            await registerSubscription(email)
            setStatus('success')
            setMessage('¡Gracias por suscribirte! Te mantendremos informado.')
            setEmail('')
        } catch (error: any) {
            console.error(error)
            setStatus('error')
            setMessage(error.message || 'Ocurrió un error al suscribirte. Inténtalo de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Row className={clsx(styles.Section, "m-0 w-100 p-4")}>
            <Col lg={6} md={8} sm={10} className="mx-auto text-center">
                <Typography variant="h4" className={clsx(styles.Title, "mb-3")}>
                    Suscríbete a nuestro boletín
                </Typography>
                <Typography variant="body1" className={clsx(styles.Description, "mb-4")}>
                    Recibe las últimas noticias y actualizaciones de Comunidad Dezzpo directamente en tu correo.
                </Typography>
                <Form className="d-flex flex-column align-items-center" onSubmit={(e) => { e.preventDefault(); handleSubscribe(); }}>
                    <InputGroup className="mb-3" style={{ maxWidth: '500px' }}>
                        <Form.Control
                            placeholder="Tu correo electrónico"
                            aria-label="Tu correo electrónico"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading || status === 'success'}
                        />
                        <Button
                            variant="primary"
                            className={styles.SubmitButton}
                            onClick={handleSubscribe}
                            disabled={loading || !email || status === 'success'}
                        >
                            {loading ? 'Suscribiendo...' : 'Suscribirse'}
                        </Button>
                    </InputGroup>
                    {status === 'success' && <p className="text-success fw-bold">{message}</p>}
                    {status === 'error' && <p className="text-danger">{message}</p>}
                </Form>
            </Col>
        </Row>
    )
}

export default Subscribe
