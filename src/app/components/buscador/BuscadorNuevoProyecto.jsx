import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import ListadoCategorias from '../ListadoCategorias'
import '../../../../public/assets/css/buscador_nuevos_proyectos.css'
import IcoMoon from 'react-icomoon'
import iconSet from '../../../../public/assets/css/icomoon/selection.json'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import PropTypes from 'prop-types'

const BuscadorNuevoProyecto = ({ data, setDraftInfo, draftInfo }) => {
    const navigate = useNavigate()
    const { categoriaProfesional, tipoProyecto } = data || {}
    // const { paramCategoriaProfesional, paramTipoProyecto } = useParams()

    const [projectData, setProjectData] = useState({
        categoriaProfesional: categoriaProfesional || '', // || paramCategoriaProfesional
        tipoProyecto: tipoProyecto || '', // || paramTipoProyecto
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
    }, [projectData])

    const handleChange = (event) => {
        setProjectData({
            ...projectData,
            [event.target.name]: event.target.value,
        })
    }

    const handleClick = () => {
        navigate('/nuevo-proyecto', { state: projectData })
        // console.log(projectData)
        // setDraftInfo(projectData)
    }

    return (
        <>
            <Container fluid className="p-0">
                <Col className="col-12">
                    <div className="p-0 contenerdorFormulario center opacidadNegro">
                        <Form
                            className="p-4"
                            action=""
                            id="formularioServicios"
                        >
                            {' '}
                            <h3 className="headline-l textBlanco pb-2">
                                Solicitar asistencia
                            </h3>
                            <Form.Group
                                className="mb-3"
                                controlId="formTipoProyecto"
                            >
                                <InputGroup className="">
                                    <InputGroup.Text
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
                                    </InputGroup.Text>
                                    <Form.Label className="mb-0">
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
                                    <InputGroup.Text
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
                                    </InputGroup.Text>

                                    <Form.Label className="mb-0">
                                        ¿Qué tipo de profesional necesitas?
                                    </Form.Label>
                                </InputGroup>
                                <Form.Select
                                    className="casillaSeleccion"
                                    name="categoriaProfesional"
                                    value={projectData.categoriaProfesional}
                                    onChange={handleChange}
                                >
                                    <option>seleccionar categoria</option>{' '}
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
                                        className="animacionBoton btn btn-siguiente btn-round btn-high"
                                        variant="primary"
                                        type="submit"
                                        onClick={handleClick}
                                    >
                                        {' '}
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

export default BuscadorNuevoProyecto
