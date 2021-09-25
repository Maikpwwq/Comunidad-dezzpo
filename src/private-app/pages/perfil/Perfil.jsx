// Pagina de Usuario - Perfil
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Perfil = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="m-0 w-100 d-flex">
                    <Col md={4}>
                        <div>
                            <img src="" alt="imagen de perfil" />
                        </div>
                        <button>+ Agregar foto de perfil</button>
                    </Col>
                    <Col md={3}>
                        <form
                            style={{
                                display: 'flex',
                                'flex-direction': 'column',
                                'align-items': 'center',
                            }}
                            action=""
                        >
                            <input type="text" placeholder="@NOMBRE USUARIO" />
                            <input type="text" placeholder="@CORREO USUARIO" />
                            <input type="text" placeholder="Profesión" />
                            <input type="text" placeholder="se unio en 2020" />
                            <input type="text" placeholder="experiencia 3" />
                            <br />
                            certificaciones
                        </form>
                    </Col>
                    <Col md={5}>
                        <span>2 ratings</span>
                    </Col>
                </Row>
                <Row className="m-0 w-100 d-flex">
                    <Col>
                        <span>
                            Mauricio Morales <br />
                            +57 312855 55 65 <br />
                            carpinteriamorales@gmail.com <br />
                        </span>
                        <img src="" alt="Mapa Ubicacion" />
                    </Col>
                </Row>
                <Row className="m-0 w-100 d-flex">
                    <Col md={7}>
                        <Row>
                            <h3>Servicios ofrecidos</h3>
                            <div>
                                <p>
                                    Proyectos de carpintería y acabados en
                                    madera para su casa o negocio <br />
                                    nos dedicamos a la realización de muebles y
                                    decoración{' '}
                                </p>
                            </div>
                        </Row>
                        <Row>
                            <h3>Gallería</h3>
                            <div>
                                <img src="" alt="" />
                            </div>
                            <div>
                                <span>comentarios y calificaciones</span>
                                <span>crear editar</span>
                                <span>educacion</span>
                                <span>crear editar</span>
                            </div>
                        </Row>
                        <Row>
                            Comentarios y calificaciones Crear/Editar Educacion
                        </Row>
                    </Col>
                    <Col md={5}>
                        <form
                            style={{
                                display: 'flex',
                                'flex-direction': 'column',
                                'align-items': 'center',
                            }}
                            action=""
                        >
                            <div>
                                <span>Datos de contacto</span>
                            </div>
                            <input
                                type="text"
                                name="ubicacion"
                                id="ubicacion"
                                placeholder="ubicación"
                            />
                            <input
                                type="text"
                                name="razonSocial"
                                id="razonSocial"
                                placeholder="Razon social"
                            />
                            <input
                                type="text"
                                name="identificacion"
                                id="identificacion"
                                placeholder="Identificación"
                            />
                            <input
                                type="text"
                                name="email"
                                id="email"
                                placeholder="Correo"
                            />
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                placeholder="Celular"
                            />
                        </form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Perfil
