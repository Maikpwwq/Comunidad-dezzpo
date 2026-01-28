import React, { useEffect, useState } from 'react'
import Link from '@hooks/Link'
import { navigate } from 'vike/client/router'
import { CategorySelect } from './CategorySelect'
import '@assets/css/buscador_nuevos_proyectos.css'
import StorefrontIcon from '@mui/icons-material/Storefront'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

interface ProjectSearchBarProps {
    setDraftInfo?: (info: any) => void
    draftInfo?: any
}

export const ProjectSearchBar = ({ setDraftInfo, draftInfo }: ProjectSearchBarProps) => {
    // Local state to manage form if props aren't provided (standalone mode)
    const [localDraftInfo, setLocalDraftInfo] = useState({
        draftCategory: 0,
        tipoProyecto: ''
    })

    // Use props if available, otherwise local state
    const currentInfo = draftInfo || localDraftInfo
    const updateInfo = setDraftInfo || setLocalDraftInfo

    const [isLoaded, setIsLoaded] = useState(false)
    const [projectData, setProjectData] = useState({
        draftCategory: 0,
        tipoProyecto: '',
    })

    useEffect(() => {
        if (!isLoaded) {
            if (
                currentInfo &&
                projectData.draftCategory &&
                projectData.tipoProyecto
            ) {
                updateInfo({
                    ...currentInfo,
                    draftCategory: projectData.draftCategory,
                    draftProject: projectData.tipoProyecto,
                })
                setIsLoaded(true)
            }
        }
    }, [projectData, currentInfo, updateInfo, isLoaded])

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setProjectData({
            ...projectData,
            [event.target.name]: event.target.value,
        })
        setIsLoaded(false)
    }

    const handleClick = () => {
        const route = `/nuevo-proyecto/${projectData.tipoProyecto}/${projectData.draftCategory}`
        navigate(route)
    }

    return (
        <Container fluid className="p-0">
            <Col className="col-12">
                <div className="p-4 contenerdorFormulario center ms-2 me-2">
                    <h3 className="headline-l pt-4 pb-2">
                        Solicitar servicios
                    </h3>

                    <Link
                        href="/app/portal-servicios"
                        className="body-2 btn-menu-comunidad me-0 mt-2 px-4 w-auto"
                    >
                        <StorefrontIcon className="me-1" />
                        <strong>Visitar Directorio <br /> de Comerciantes</strong>
                    </Link>

                    <Typography variant="body1" className="mt-3 pt-2 pb-2">
                        O prueba
                    </Typography>
                    <Typography variant="body2" className="mb-3">
                        Registrar un nuevo requerimiento
                    </Typography>
                    <Form
                        className="p-4 pt-0"
                        id="formularioServicios"
                    >
                        <Form.Group
                            className="mb-3"
                            controlId="formTipoProyecto"
                        >
                            <InputGroup className="">
                                <Form.Label className="body-1 mb-0">
                                    ¿Qué tipo de proyecto es?
                                </Form.Label>
                            </InputGroup>
                            <Box className="mt-1">
                                <Form.Select
                                    className="casillaSeleccion"
                                    name="tipoProyecto"
                                    value={projectData.tipoProyecto}
                                    onChange={handleChange}
                                >
                                    <option value="">seleccionar uno</option>
                                    <option value="Hogar">Hogar</option>
                                    <option value="Negocio">Negocio</option>
                                    <option value="PH">Propiedad Horizontal</option>
                                    <option value="Inmobiliaria">Inmobiliaria</option>
                                    <option value="Alianzas">Alianzas</option>
                                </Form.Select>
                            </Box>
                        </Form.Group>

                        <Form.Group
                            className="mb-2"
                            controlId="formCategoriaProfesional"
                        >
                            <InputGroup className="">
                                <Form.Label className="body-1 mb-0">
                                    ¿Qué tipo de profesional necesitas?
                                </Form.Label>
                            </InputGroup>
                            <CategorySelect
                                setDraftInfo={setProjectData}
                                draftInfo={projectData}
                                setIsLoaded={setIsLoaded}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Col className="pt-4 pb-2">
                                <Button
                                    className="animacionBoton body-1 btn-buscador btn btn-round btn-high"
                                    variant="primary"
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
    )
}

export default ProjectSearchBar
