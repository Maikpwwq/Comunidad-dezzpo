// Pagina de Usuario - Perfil
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

import PermMediaOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActual'

const Perfil = (props) => {
    const [userName, setUserName] = React.useState('nombre persona')
    const [userMail, setUserMail] = React.useState('prueba@gmail.com')
    const [userProfession, setUserProfession] = React.useState('soldador')
    const [userJoin, setUserJoin] = React.useState('se unio en 2020')
    const [userExperience, setUserExperience] = React.useState('experiencia 3')
    const [contactoUbication, setContactoUbication] =
        React.useState('experiencia 3')
    const [contactoRazonSocial, setContactoRazonSocial] =
        React.useState('experiencia 3')
    const [contactoIdentification, setContactoIdentification] =
        React.useState('experiencia 3')
    const [contactoMail, setContactoMail] = React.useState('experiencia 3')
    const [contactoPhone, setContactoPhone] = React.useState('experiencia 3')

    const handleChange = () => {}

    return (
        <>
            <Container fluid className="p-0">
                <Row className="h-100">
                    <Col className="col-10">
                        <Row className="m-0 w-100 d-flex">
                            <Row className="pt-4 pb-4">
                                <Col md={4}>
                                    <div>
                                        <img src="" alt="imagen de perfil" />
                                    </div>
                                    <PermMediaOutlinedIcon />
                                    <Button>+ Agregar foto de perfil</Button>
                                </Col>
                                <Col md={3}>
                                    <Box
                                        style={{
                                            display: 'flex',
                                            'flex-direction': 'column',
                                            'align-items': 'center',
                                        }}
                                        action=""
                                    >
                                        <TextField
                                            id="userName"
                                            label="Nombre de usuario"
                                            value={userName}
                                            onChange={handleChange}
                                            defaultValue="@NOMBRE USUARIO"
                                        />
                                        <TextField
                                            id="userMail"
                                            label="Correo de usuario"
                                            value={userMail}
                                            onChange={handleChange}
                                            defaultValue="@CORREO USUARIO"
                                        />
                                        <TextField
                                            id="userProfession"
                                            label="Profesión"
                                            value={userProfession}
                                            onChange={handleChange}
                                            defaultValue="@PROFESIÓN"
                                        />
                                        <TextField
                                            id="userJoin"
                                            label="Correo de usuario"
                                            value={userJoin}
                                            onChange={handleChange}
                                            defaultValue="@SeUnioDesdeHace"
                                        />
                                        <TextField
                                            id="userExperience"
                                            label="Experiencia"
                                            value={userExperience}
                                            onChange={handleChange}
                                            defaultValue="@TiempoExperiencia"
                                        />
                                        <br />
                                        certificaciones
                                    </Box>
                                </Col>
                                <Col md={5}>
                                    <span>2 ratings</span>
                                </Col>
                            </Row>
                        </Row>
                        <Row className="m-0 w-100 d-flex justify-content-start">
                            <Col className="col-4 pt-4 pb-4">
                                <span className="p-4 p-description textBlanco fondoVerde">
                                    Mauricio Morales <br />
                                    +57 312855 55 65 <br />
                                    carpinteriamorales@gmail.com <br />
                                </span>
                                <img src="" alt="Mapa Ubicacion" />
                            </Col>
                        </Row>
                        <Row className="pt-4 pb-4 m-0 w-100 d-flex">
                            <Col md={7}>
                                <Row>
                                    <Col>
                                        <h3 className="headline-l">
                                            Servicios ofrecidos
                                        </h3>
                                        <div>
                                            <p className="body-1">
                                                Proyectos de carpintería y
                                                acabados en madera para su casa
                                                o negocio <br />
                                                nos dedicamos a la realización
                                                de muebles y decoración{' '}
                                            </p>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <h3 className="headline-l">Gallería</h3>
                                        <div>
                                            <img src="" alt="" />
                                        </div>
                                        <div>
                                            <span>
                                                comentarios y calificaciones
                                            </span>
                                            <span>crear editar</span>
                                            <span>educacion</span>
                                            <span>crear editar</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    Comentarios y calificaciones Crear/Editar
                                    Educacion
                                </Row>
                            </Col>
                            <Col md={5}>
                                <Box
                                    style={{
                                        display: 'flex',
                                        'flex-direction': 'column',
                                        'align-items': 'center',
                                    }}
                                    action=""
                                >
                                    <div>
                                        <span className="p-description">
                                            Datos de contacto
                                        </span>
                                    </div>
                                    <TextField
                                        id="contactoUbication"
                                        label="Ubicación"
                                        value={contactoUbication}
                                        onChange={handleChange}
                                        defaultValue="ubicación"
                                        variant="filled"
                                    />
                                    <TextField
                                        id="contactoRazonSocial"
                                        label="Razón Social"
                                        value={contactoRazonSocial}
                                        onChange={handleChange}
                                        defaultValue="Razón Social"
                                        variant="filled"
                                    />
                                    <TextField
                                        id="contactoIdentification"
                                        label="Identificación"
                                        value={contactoIdentification}
                                        onChange={handleChange}
                                        defaultValue="Identificación"
                                        variant="filled"
                                    />
                                    <TextField
                                        id="contactoMail"
                                        label="Correo"
                                        value={contactoMail}
                                        onChange={handleChange}
                                        defaultValue="Correo"
                                        variant="filled"
                                    />
                                    <TextField
                                        id="contactoPhone"
                                        label="Celular"
                                        value={contactoPhone}
                                        onChange={handleChange}
                                        defaultValue="Celular"
                                        variant="filled"
                                    />
                                </Box>
                            </Col>
                        </Row>
                    </Col>
                    <Col className="col-2 h-100 fondoGris">SideContent</Col>
                </Row>
            </Container>
        </>
    )
}

export default Perfil
