import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
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
            console.log('BuscadorChanged')
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
        console.log(projectData)
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
                                    {/* <option value="administradores PH">
                                        {' '}
                                        administradores PH{' '}
                                    </option>
                                    <option value="Afinadores de muros y acabados">
                                        {' '}
                                        Afinadores de muros y acabados{' '}
                                    </option>
                                    <option value=" Aisladores acústicos ">
                                        {' '}
                                        Aisladores acústicos{' '}
                                    </option>
                                    <option value="Integradores Control de acceso ">
                                        {' '}
                                        Integradores Control de acceso{' '}
                                    </option>
                                    <option value="Albañiles">
                                        {' '}
                                        Albañiles{' '}
                                    </option>
                                    <option value="Artesanos">
                                        {' '}
                                        Artesanos{' '}
                                    </option>
                                    <option value="Arquitectos">
                                        {' '}
                                        Arquitectos{' '}
                                    </option>
                                    <option value="Toderos"> Toderos </option>
                                    <option value="Técnico en automatización">
                                        {' '}
                                        Técnico en automatización{' '}
                                    </option>
                                    <option value=" Técnico en domótica ">
                                        {' '}
                                        Técnico en domótica{' '}
                                    </option>
                                    <option value="Carpinteros">
                                        {' '}
                                        Carpinteros{' '}
                                    </option>
                                    <option value="Carpinteros del aluminio">
                                        {' '}
                                        Carpinteros del aluminio
                                    </option>
                                    <option value="Carpinteros de metales ">
                                        {' '}
                                        Carpinteros de metales{' '}
                                    </option>
                                    <option value="Cerrajeros ">
                                        {' '}
                                        Cerrajeros{' '}
                                    </option>
                                    <option value="Constructoras">
                                        {' '}
                                        Constructoras{' '}
                                    </option>
                                    <option value=" Instaladores Cocinas ">
                                        {' '}
                                        Instaladores Cocinas{' '}
                                    </option>
                                    <option value="Instaladores Baños ">
                                        {' '}
                                        Instaladores Baños{' '}
                                    </option>
                                    <option value="Controladores de plagas">
                                        {' '}
                                        Controladores de plagas{' '}
                                    </option>
                                    <option value="Centros de diseño grafico">
                                        {' '}
                                        Centros de diseño grafico{' '}
                                    </option>
                                    <option value="Técnico en drenajes e inundaciones">
                                        {' '}
                                        Técnico en drenajes e inundaciones{' '}
                                    </option>
                                    <option value="Electricistas">
                                        {' '}
                                        Electricistas{' '}
                                    </option>
                                    <option value=" Geólogos ">
                                        {' '}
                                        Geólogos{' '}
                                    </option>
                                    <option value="Ferreteros ">
                                        Ferreteros{' '}
                                    </option>
                                    <option value=" Técnico en gasodomésticos y refrigeración ">
                                        {' '}
                                        Técnico en gasodomésticos y
                                        refrigeración{' '}
                                    </option>
                                    <option value="Impermeabilizadores">
                                        {' '}
                                        Impermeabilizadores{' '}
                                    </option>
                                    <option value="Instaladores de Adoquín">
                                        Instaladores de Adoquín
                                    </option>
                                    <option value="Instaladores de cableado estructurado">
                                        {' '}
                                        Instaladores de cableado estructurado{' '}
                                    </option>
                                    <option value="Instaladores de cerámica ">
                                        {' '}
                                        Instaladores de cerámica{' '}
                                    </option>
                                    <option value="Instaladores de cubiertas">
                                        {' '}
                                        Instaladores de cubiertas{' '}
                                    </option>
                                    <option value="Instaladores de parques">
                                        {' '}
                                        Instaladores de parques{' '}
                                    </option>
                                    <option value="Instaladores de ventanas">
                                        {' '}
                                        Instaladores de ventanas{' '}
                                    </option>
                                    <option value=" Jardineros ">
                                        {' '}
                                        Jardineros{' '}
                                    </option>
                                    <option value=" Lavanderías ">
                                        {' '}
                                        Lavanderías{' '}
                                    </option>
                                    <option value=" Técnicos de Tanques de agua ">
                                        {' '}
                                        Técnicos de Tanques de agua{' '}
                                    </option>
                                    <option value=" Técnicos de Limpiezas técnicas ">
                                        {' '}
                                        Técnicos de Limpiezas técnicas{' '}
                                    </option>
                                    <option value=" Maestros de Obra ">
                                        {' '}
                                        Maestros de Obra{' '}
                                    </option>
                                    <option value=" Ayudantes de mudanzas ">
                                        {' '}
                                        Ayudantes de mudanzas{' '}
                                    </option>
                                    <option value=" Ayudantes de movilizaciones ">
                                        {' '}
                                        Ayudantes de movilizaciones{' '}
                                    </option>
                                    <option value="Mecanicos">
                                        {' '}
                                        Mecanicos{' '}
                                    </option>
                                    <option value=" Paisajistas ">
                                        {' '}
                                        Paisajistas{' '}
                                    </option>
                                    <option value="Pintores ">Pintores </option>
                                    <option value="Plomeros ">Plomeros </option>
                                    <option value="Tecnicos de redes">
                                        Tecnicos de redes
                                    </option>
                                    <option value=" Reparadores de piscinas ">
                                        {' '}
                                        Reparadores de piscinas{' '}
                                    </option>
                                    <option value=" Asistentes de servicio domestico ">
                                        {' '}
                                        Asistentes de servicio domestico{' '}
                                    </option>
                                    <option value=" Técnico en seguridad electrónica ">
                                        {' '}
                                        Técnico en seguridad electrónica{' '}
                                    </option>
                                    <option value=" Tapicería ">
                                        {' '}
                                        Tapiceros{' '}
                                    </option>
                                    <option value=" Trabajadores de piedras ">
                                        {' '}
                                        Trabajadores de piedras{' '}
                                    </option> */}
                                    <option value="Acabados en muros">
                                        {' '}
                                        Acabados en muros{' '}
                                    </option>
                                    <option value="Administraciones PH">
                                        {' '}
                                        Administraciones PH{' '}
                                    </option>
                                    <option value="Aislamiento acústico">
                                        {' '}
                                        Aislamiento acústico{' '}
                                    </option>
                                    <option value="Albañilería">
                                        {' '}
                                        Albañilería{' '}
                                    </option>
                                    <option value="Arquitectura">
                                        {' '}
                                        Arquitectura{' '}
                                    </option>
                                    <option value="Artesanías y manualidades ">
                                        {' '}
                                        Artesanías y manualidades{' '}
                                    </option>
                                    <option value="Asistencia toderos">
                                        {' '}
                                        Asistencia toderos{' '}
                                    </option>
                                    <option value="Automatización">
                                        {' '}
                                        Automatización{' '}
                                    </option>
                                    <option value="Carpintería">
                                        {' '}
                                        Carpintería{' '}
                                    </option>
                                    <option value="Carpintería en aluminio">
                                        Carpintería en aluminio
                                    </option>
                                    <option value="Carpintería metálica">
                                        Carpintería metálica
                                    </option>
                                    <option value="Cerrajería">
                                        {' '}
                                        Cerrajería{' '}
                                    </option>
                                    <option value="Construcción obra">
                                        {' '}
                                        Construcción obra{' '}
                                    </option>
                                    <option value="Control de acceso">
                                        {' '}
                                        Control de acceso{' '}
                                    </option>
                                    <option value="Control de plagas">
                                        {' '}
                                        Control de plagas{' '}
                                    </option>
                                    <option value="Diseño e impresión">
                                        {' '}
                                        Diseño e impresión{' '}
                                    </option>
                                    <option value="Domótica"> Domótica </option>
                                    <option value="Drenajes e inundaciones">
                                        {' '}
                                        Drenajes e inundaciones{' '}
                                    </option>
                                    <option value="Electricidad">
                                        {' '}
                                        Electricidad{' '}
                                    </option>
                                    <option value="Estudios de suelos">
                                        {' '}
                                        Estudios de suelos{' '}
                                    </option>
                                    <option value="Ferreterías">
                                        Ferreterías
                                    </option>
                                    <option value="Gasodomésticos y refrigeración">
                                        {' '}
                                        Gasodomésticos y refrigeración{' '}
                                    </option>
                                    <option value="Impermeabilización">
                                        {' '}
                                        Impermeabilización{' '}
                                    </option>
                                    <option value="Instalación de adoquín">
                                        Instalación de adoquín
                                    </option>
                                    <option value="Instalación de cableado estructurado">
                                        {' '}
                                        Instalación de cableado estructurado{' '}
                                    </option>
                                    <option value="Instalación de cerámica">
                                        {' '}
                                        Instalación de cerámica{' '}
                                    </option>
                                    <option value="Instalación de cubiertas">
                                        {' '}
                                        Instalación de cubiertas{' '}
                                    </option>
                                    <option value="Instalación de parques">
                                        {' '}
                                        Instalación de parques{' '}
                                    </option>
                                    <option value="Instalación de ventanas">
                                        {' '}
                                        Instalación de ventanas{' '}
                                    </option>
                                    <option value="Jardinería">
                                        {' '}
                                        Jardinería{' '}
                                    </option>
                                    <option value="Lavandería">
                                        {' '}
                                        Lavandería{' '}
                                    </option>
                                    <option value="Limpiezas técnicas">
                                        {' '}
                                        Limpiezas técnicas{' '}
                                    </option>
                                    <option value="Maestro Obra">
                                        {' '}
                                        Maestro Obra{' '}
                                    </option>
                                    <option value="Mecanica">Mecanica</option>
                                    <option value="Movilizar pesos">
                                        {' '}
                                        Movilizar pesos{' '}
                                    </option>
                                    <option value="Mudanzas"> Mudanzas </option>
                                    <option value="Paisajismo">
                                        {' '}
                                        Paisajismo{' '}
                                    </option>
                                    <option value="Pintura">Pintura </option>
                                    <option value="Plomería">Plomería </option>
                                    <option value="Redes cableado estructurado">
                                        Redes cableado estructurado{' '}
                                    </option>
                                    <option value="Reformas Cocinas">
                                        {' '}
                                        Reformas Cocinas{' '}
                                    </option>
                                    <option value="Reformas Baños">
                                        {' '}
                                        Reformas Baños{' '}
                                    </option>
                                    <option value="Reformas Piscinas">
                                        {' '}
                                        Reformas Piscinas{' '}
                                    </option>
                                    <option value="Servicio doméstico">
                                        {' '}
                                        Servicio doméstico{' '}
                                    </option>
                                    <option value="Sistemas de Seguridad y alarmas">
                                        {' '}
                                        Sistemas de Seguridad y alarmas{' '}
                                    </option>
                                    <option value="Tanques de agua">
                                        {' '}
                                        Tanques de agua{' '}
                                    </option>
                                    <option value="Tapicería">
                                        {' '}
                                        Tapicería{' '}
                                    </option>
                                    <option value="Trabajos en piedra">
                                        {' '}
                                        Trabajos en piedra{' '}
                                    </option>
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
