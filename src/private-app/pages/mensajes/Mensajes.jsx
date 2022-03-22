// Pagina de Usuario - Mensajes
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextareaAutosize from '@mui/material/TextareaAutosize'

const Mensajes = (props) => {
    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex align-items-start">
                    <Col md={6}>
                        <h2 className="headline-xl">Mensajes</h2>

                        <FormControl
                            fullWidth
                            style={{
                                display: 'flex',
                                'flex-direction': 'column',
                                'align-items': 'center',
                            }}
                        >
                            <InputLabel forHtml="bandejaMensajes">
                                Adicionar metodo
                            </InputLabel>
                            <Select
                                name="bandejaMensajes"
                                id="bandejaMensajes"
                                autoWidth
                                label="Bandeja Mensajes"
                            >
                                <MenuItem value="">
                                    <em>Categoría</em>
                                </MenuItem>
                                <MenuItem value="nuevosMensajes">
                                    Nuevos Mensajes
                                </MenuItem>
                                <MenuItem value="inquietudesPropietarios">
                                    Consultar inquietudes de los propietarios{' '}
                                </MenuItem>
                                <MenuItem value="AsesoriaProfesional">
                                    Asesorias con un profesional
                                </MenuItem>
                            </Select>
                            {/*Desplegar consuta bandeja de entrada*/}
                        </FormControl>
                        <div>
                            <label for="nuevosMensajes">Nuevos Mensajes </label>
                            <br />
                            <TextareaAutosize
                                minRows={3}
                                cols="30"
                                placeholder="Nuevos Mensajes"
                            ></TextareaAutosize>
                            <label for="inquietudesPropietarios ">
                                Consultar inquietudes de los propietarios{' '}
                            </label>
                            <TextareaAutosize
                                maxRows={3}
                                cols="30"
                                placeholder="Consultar inquietudes de los propietarios"
                            ></TextareaAutosize>
                            <label for="AsesoriaProfesional">
                                Asesorias con un profesional
                            </label>
                            <TextareaAutosize
                                maxRows={3}
                                cols="30"
                                placeholder="Asesorias con un profesional"
                            ></TextareaAutosize>
                        </div>
                    </Col>
                </Row>
                <Row className="m-0 w-100 d-flex pt-3">
                    Titulo: xxxxx
                    <Col md={10}>
                        HILO DE CONVERSACIÓN
                        <div className="">
                            {/*Desplegar hilo conversaciones*/}
                            <p className="body-1">
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
