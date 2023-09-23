export { BuscadorNuevoProyecto }

import React, { useEffect, useState } from 'react'
import { Link } from '#R/Link'
import { navigate } from 'vite-plugin-ssr/client/router'
import { ListadoCategorias } from '#@/index/components/ListadoCategorias'
import '#@/assets/css/buscador_nuevos_proyectos.css'
import StorefrontIcon from '@mui/icons-material/Storefront'
// import IcoMoon from 'react-icomoon'
// import iconSet from '#@/assets/css/icomoon/selection.json'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'

const BuscadorNuevoProyecto = ({ setDraftInfo, draftInfo }) => {
    console.log('BuscadorNuevoProyecto', draftInfo)
    const [isLoaded, setIsLoaded] = useState(false)
    const [projectData, setProjectData] = useState({
        categoriaProfesional: undefined,
        tipoProyecto: undefined,
    })

    useEffect(() => {
        if (!isLoaded) {
            if (
                draftInfo &&
                projectData.categoriaProfesional &&
                projectData.tipoProyecto
            ) {
                setDraftInfo({
                    ...draftInfo,
                    draftCategory: projectData.categoriaProfesional,
                    draftProject: projectData.tipoProyecto,
                })
                // console.log('BuscadorChanged')
                setIsLoaded(true)
            }
        }
    }, [projectData, draftInfo, setDraftInfo, isLoaded])

    const handleChange = (event) => {
        setProjectData({
            ...projectData,
            [event.target.name]: event.target.value,
        })
        setIsLoaded(false)
    }

    const handleClick = () => {
        const route = `/nuevo-proyecto/${projectData.tipoProyecto}/${projectData.categoriaProfesional}`
        navigate(route)
    }

    return (
        <>
            <Container fluid className="p-0">
                <Col className="col-12">
                    <div className="p-4 contenerdorFormulario center ms-2 me-2">
                        <h3 className="headline-l pt-4 pb-2">
                            Solicitar servicios
                        </h3>

                        <Link
                            href="/app/portal-servicios"
                            className="body-2 btn-menu-comunidad me-0 mt-2 w-auto"
                        >
                            <StorefrontIcon className="me-1" />
                            <strong>Visitar Directorio de Comerciantes</strong>
                        </Link>

                        <Typography variant="body1" className="my-3 pt-2">
                            O registra un nuevo requerimiento
                        </Typography>
                        <Form
                            className="p-4 pt-0"
                            action=""
                            id="formularioServicios"
                        >
                            {/* {' asistencia '} */}

                            <Form.Group
                                className="mb-3"
                                controlId="formTipoProyecto"
                            >
                                <InputGroup className="">
                                    {/* <InputGroup.Text
                                        id="basic-addon1"
                                        style={{
                                            border: 'none',
                                            background: 'none',
                                        }}
                                    >
                                        <IcoMoon
                                            iconSet={iconSet}
                                            icon="LupaFomularioIcono"
                                            style={{
                                                height: '21px',
                                                marginRight: '8px',
                                                width: 'auto',
                                            }}
                                        />
                                    </InputGroup.Text> */}
                                    <Form.Label className="body-1 mb-0">
                                        ¿Qué tipo de proyecto es?
                                    </Form.Label>
                                </InputGroup>
                                <Form.Select
                                    className="casillaSeleccion"
                                    name="tipoProyecto"
                                    value={projectData.tipoProyecto}
                                    onChange={handleChange}
                                >
                                    <option value="">seleccionar uno</option>
                                    {/* <option value="Persona">Persona</option> */}
                                    {/* Domicilio, Oficina, Edificio, Organización, Aliado */}
                                    <option value="Hogar">Hogar</option>
                                    <option value="Negocio">Negocio</option>
                                    <option value="PH">
                                        Propiedad Horizontal
                                    </option>
                                    <option value="Inmobiliaria">
                                        Inmobiliaria
                                    </option>
                                    <option value="Alianzas">Alianzas</option>
                                </Form.Select>
                            </Form.Group>
                            {/* type="text" value="Selecciona un profesional listado #1" */}
                            <Form.Group
                                className="mb-2"
                                controlId="formCategoriaProfesional"
                            >
                                <InputGroup className="">
                                    {/* <InputGroup.Text
                                        id="basic-addon1"
                                        style={{
                                            border: 'none',
                                            background: 'none',
                                        }}
                                    >
                                        <IcoMoon
                                            iconSet={iconSet}
                                            icon="LupaFomularioIcono"
                                            style={{
                                                height: '21px',
                                                marginRight: '8px',
                                                width: 'auto',
                                            }}
                                        />
                                    </InputGroup.Text> */}

                                    <Form.Label className="body-1 mb-0">
                                        ¿Qué tipo de profesional necesitas?
                                    </Form.Label>
                                </InputGroup>
                                <Form.Select
                                    className="casillaSeleccion"
                                    name="categoriaProfesional"
                                    value={projectData.categoriaProfesional}
                                    onChange={handleChange}
                                >
                                    <option>seleccionar categoria</option>
                                    {ListadoCategorias.map((categoria) => {
                                        const { label, key } = categoria
                                        return (
                                            <option key={key} value={label}>
                                                {label}
                                            </option>
                                        )
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Col className="pt-4 pb-2">
                                    <Button
                                        className="animacionBoton body-1 btn-buscador btn btn-round btn-high"
                                        variant="primary"
                                        // type="submit"
                                        onClick={handleClick}
                                    >
                                        <strong>Siguiente</strong>
                                    </Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </div>
                </Col>
            </Container>
        </>
    )
}

BuscadorNuevoProyecto.propTypes = {
    // data: PropTypes.object,
    setDraftInfo: PropTypes.func,
    draftInfo: PropTypes.object,
}
