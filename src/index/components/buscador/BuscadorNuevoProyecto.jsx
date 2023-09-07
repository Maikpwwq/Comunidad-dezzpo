export { BuscadorNuevoProyecto }

import React, { useEffect, useState } from 'react'
import { Link } from '#R/Link'
import { navigate } from 'vite-plugin-ssr/client/router'
import { ListadoCategorias } from '../ListadoCategorias'
import '#@/assets/css/buscador_nuevos_proyectos.css'
import IcoMoon from 'react-icomoon'
import iconSet from '#@/assets/css/icomoon/selection.json'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import PropTypes from 'prop-types'

const BuscadorNuevoProyecto = ({ data, setDraftInfo, draftInfo }) => {
    const { categoriaProfesional, tipoProyecto } = data || {}
    // const { paramCategoriaProfesional, paramTipoProyecto } = useParams()

    const [projectData, setProjectData] = useState({
        categoriaProfesional: categoriaProfesional, // || paramCategoriaProfesional
        tipoProyecto: tipoProyecto, // || paramTipoProyecto
    })

    useEffect(() => {
        if (draftInfo) {
            setDraftInfo({
                ...draftInfo,
                draftCategory: projectData.categoriaProfesional,
                draftProject: projectData.tipoProyecto,
            })
            // console.log('BuscadorChanged')
        }
    }, [projectData, draftInfo, setDraftInfo])

    const handleChange = (event) => {
        setProjectData({
            ...projectData,
            [event.target.name]: event.target.value,
        })
    }

    const handleClick = () => {
        navigate(
            `/nuevo-proyecto/${projectData.categoriaProfesional}/${projectData.tipoProyecto}`
        )
        // console.log(projectData)
        // setDraftInfo(projectData)
    }

    return (
        <>
            <Container fluid className="p-0">
                <Col className="col-12">
                    <div className="p-4 contenerdorFormulario center ms-2 me-2">
                        <Form
                            className="p-4"
                            action=""
                            id="formularioServicios"
                        >
                            {/* {' asistencia '} */}
                            <h3 className="headline-l pb-2">
                                Solicitar servicios
                            </h3>
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
                                    {/*  */}
                                    <Button
                                        className="animacionBoton body-1 btn-buscador btn btn-round btn-high"
                                        variant="primary"
                                        type="submit"
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
    data: PropTypes.object,
    setDraftInfo: PropTypes.func,
    draftInfo: PropTypes.object,
}
