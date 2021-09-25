// Pagina de Usuario - Mensajes
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Mensajes = (props) => {
    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex align-items-start">
                    <Col md={6}>
                        <form
                            style={{
                                display: 'flex',
                                'flex-direction': 'column',
                                'align-items': 'center',
                            }}
                            action=""
                        >
                            <select name="bandejaMensajes" id="bandejaMensajes">
                                {' '}
                                Categoría
                                <option value="nuevosMensajes">
                                    Nuevos Mensajes
                                </option>
                                <option value="inquietudesPropietarios ">
                                    Consultar inquietudes de los propietarios{' '}
                                </option>
                                <option value="AsesoriaProfesional">
                                    Asesorias con un profesional
                                </option>
                            </select>
                            {/*Desplegar consuta bandeja de entrada*/}
                        </form>
                        <div>
                            <label for="nuevosMensajes">Nuevos Mensajes </label>
                            <br />
                            <textarea rows="3" cols="30"></textarea>
                            <label for="inquietudesPropietarios ">
                                Consultar inquietudes de los propietarios{' '}
                            </label>
                            <textarea rows="3" cols="30"></textarea>
                            <label for="AsesoriaProfesional">
                                Asesorias con un profesional
                            </label>
                            <textarea rows="3" cols="30"></textarea>
                        </div>
                    </Col>
                </Row>
                <Row className="m-0 w-100 d-flex pt-3">
                    Titulo: xxxxx
                    <Col md={10}>
                        HILO DE CONVERSACIÓN
                        <div className="">
                            {/*Desplegar hilo conversaciones*/}
                            <p>
                                Publicado el 23/05/2019 a las10:30 am, por
                                @Nombre usuario{' '}
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Mensajes
