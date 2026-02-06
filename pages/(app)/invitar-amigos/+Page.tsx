/**
 * Invitar Amigos (Referrals) Page
 *
 * Converted to TypeScript.
 */
import { useAuth } from '@hooks/useAuth'
// Bootstrap
import { Row, Col, Container } from 'react-bootstrap'
// MUI
import { Button, Typography } from '@mui/material'
export default function Page() {
    const { currentUser } = useAuth()
    const copyReferedLink = () => {
        const referenced = `www.dezzpo.com/app/perfil/${currentUser?.userId}`
        navigator.clipboard.writeText(referenced)
    }
    return (
        <Container fluid className="p-0 h-100">
            <Row className="m-0 w-100 d-flex align-items-start pt-4 pb-4">
                <Col className="col-10">
                    <Typography className="type-hero-title">Programa de referidos</Typography>
                    <Col className="p-4">
                        <p className="type-body">
                            Con el programa de referidos te premiamos por recomendar la
                            comunidad y, ayuda así la Transformación digital inmobiliaria.
                            <br />
                            <br />
                            Invita tus amigos a que se registren al programa compartiendo tu
                            código único, envía el Link a tus contactos, acumula puntos, obtén
                            descuentos y llévate premios.
                        </p>
                    </Col>
                    <Button className="me-6 btn btn-buscador" onClick={copyReferedLink}>
                        Copiar tu Link
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}
