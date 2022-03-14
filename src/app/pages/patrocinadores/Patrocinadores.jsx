// Pagina de nuestros patrocinadores
import React from 'react'
import '../../../../public/assets/css/patrocinadores.css'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Patrocinadores = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="containerPatrocinadores">
                    <div className="patrocinadoresMensaje">
                        <span className="tituloDocumento">
                            {' '}
                            <h2 className="headline-xl">
                                Estos son algunos de nuestros patrocinadores
                            </h2>{' '}
                        </span>
                        <ul className="p-description">
                            <li>Bictia</li>
                        </ul>
                    </div>
                </Row>
            </Container>
        </>
    )
}

export default Patrocinadores
