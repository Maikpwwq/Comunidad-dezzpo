export { Page }
export { LayoutAppPaperbase as Layout} from '#@/app/components/LayoutAppPaperbase'

// Pagina de Usuario - InvitarAmigos
import React, {useContext} from 'react'
import { UserAuthContext } from '#@/providers/UserAuthProvider'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'

const Page = (props) => {
    const { currentUser } = useContext(UserAuthContext)
    const copyReferedLink = () => {
        const referenced = `www.dezzpo.com/app/perfil/${currentUser.userId}`
        // document.execCommand("copy")
        navigator.clipboard.writeText(referenced)
    }

    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex align-items-start pt-4 pb-4">
                    <Col className="col-10">
                        <span>
                            <h2 className="headline-xl">
                                Programa de referidos
                            </h2>
                        </span>
                        <Col className="p-4">
                            <p className="body-1">
                                Con el programa de referidos te premiamos por
                                recomendar la comunidad y, ayuda así la
                                Transformación digital inmobiliaria.
                                <br /> <br />
                                Invita tus amigos a que se registren al programa
                                compartiendo tu código único, envía el Link a
                                tus contactos, acumula puntos, obtén descuentos
                                y llévate premios.
                            </p>
                        </Col>

                        <Button onClick={copyReferedLink}>Copiar tu Link</Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
