/**
 * ProjectSearchForm Component
 *
 * Form for creating new project requests.
 * Migrated from src/index/components/buscador/BuscadorNuevoProyecto.jsx
 */

import React, { useEffect, useState, useCallback } from 'react'
import { navigate } from 'vike/client/router'
import Link from '@hooks/Link'
import clsx from 'clsx'

import styles from './ProjectSearchForm.module.scss'

// MUI
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import StorefrontIcon from '@mui/icons-material/Storefront'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'

// Local
import { CategorySelector } from './CategorySelector'
import { PROJECT_TYPES, type ProjectDraftInfo, type ProjectType } from '../types'


export interface ProjectSearchFormProps {
    /** External draft info */
    draftInfo?: ProjectDraftInfo
    /** State setter for draft info */
    setDraftInfo?: (info: ProjectDraftInfo) => void
    /** Simple mode (hides extra links) - default true for Home page match */
    simple?: boolean
    /** Optional loader state setter */
    setIsLoaded?: (loaded: boolean) => void
}

interface LocalProjectData {
    draftCategory: string | number
    tipoProyecto: ProjectType | ''
}

export function ProjectSearchForm({
    draftInfo,
    setDraftInfo,
    simple = true,
    setIsLoaded: parentSetIsLoaded,
}: ProjectSearchFormProps): React.ReactElement {
    const [isLoaded, setIsLoaded] = useState(false)
    const [projectData, setProjectData] = useState<LocalProjectData>({
        draftCategory: 0,
        tipoProyecto: '',
    })

    // Sync local state to parent when both fields are set
    useEffect(() => {
        if (
            !isLoaded &&
            draftInfo &&
            setDraftInfo &&
            projectData.draftCategory &&
            projectData.tipoProyecto
        ) {
            setDraftInfo({
                ...draftInfo,
                draftCategory: projectData.draftCategory,
                draftProject: projectData.tipoProyecto,
            })
            setIsLoaded(true)
        }
    }, [projectData, draftInfo, setDraftInfo, isLoaded])

    const handleProjectTypeChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setProjectData(prev => ({
                ...prev,
                tipoProyecto: e.target.value as ProjectType | '',
            }))
            // Update local or parent loading state
            setIsLoaded(false)
            if (parentSetIsLoaded) parentSetIsLoaded(false)
        },
        [parentSetIsLoaded]
    )

    const handleCategoryChange = useCallback((newData: ProjectDraftInfo) => {
        setProjectData(prev => ({
            ...prev,
            draftCategory: newData.draftCategory ?? 0,
        }))
    }, [])

    const handleSubmit = useCallback(() => {
        const route = `/nuevo-proyecto/${projectData.tipoProyecto}/${projectData.draftCategory}`
        navigate(route)
    }, [projectData])

    const isValid = projectData.tipoProyecto && projectData.draftCategory !== 0

    return (
        <Container fluid className="p-0">
            <Col className="col-12">
                <div className={clsx(styles.Container, "p-4 center ms-2 me-2")}>
                    <h3 className={clsx(styles.Headline, "pt-2 pb-2 text-center")}>Solicitar servicios</h3>

                    {!simple && (
                        <>
                            <Link
                                href="/app/portal-servicios"
                                className={clsx(styles.NavLink, styles.BodyText, "me-0 mt-2 px-4 w-auto")}
                            >
                                <StorefrontIcon className="me-1" />
                                <strong>
                                    Visitar Directorio <br /> de Comerciantes
                                </strong>
                            </Link>

                            <Typography variant="body1" className="mt-3 pt-2 pb-2">
                                O prueba
                            </Typography>
                            <Typography variant="body2" className="mb-3">
                                Registrar un nuevo requerimiento
                            </Typography>
                        </>
                    )}

                    <Form className="p-4 pt-0" id="formularioServicios">
                        {/* Project Type */}
                        <Form.Group className="mb-3" controlId="formTipoProyecto">
                            <InputGroup>
                                <Form.Label className={clsx(styles.BodyText, "mb-0")}>
                                    ¿Qué tipo de proyecto es?
                                </Form.Label>
                            </InputGroup>
                            <Box className="mt-1">
                                <Form.Select
                                    className={styles.Select}
                                    name="tipoProyecto"
                                    value={projectData.tipoProyecto}
                                    onChange={handleProjectTypeChange}
                                >
                                    {PROJECT_TYPES.map(({ value, label }) => (
                                        <option key={value || 'empty'} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Box>
                        </Form.Group>

                        {/* Category */}
                        <Form.Group className="mb-2" controlId="formCategoriaProfesional">
                            <InputGroup>
                                <Form.Label className={clsx(styles.BodyText, "mb-0")}>
                                    ¿Qué tipo de profesional necesitas?
                                </Form.Label>
                            </InputGroup>
                            <CategorySelector
                                setDraftInfo={handleCategoryChange}
                                draftInfo={projectData as ProjectDraftInfo}
                                setIsLoaded={setIsLoaded}
                            />
                        </Form.Group>

                        {/* Submit */}
                        <Form.Group>
                            <Col className="pt-4 pb-2">
                                <Button
                                    className={clsx(styles.SubmitButton, styles.BodyText)}
                                    variant="primary"
                                    onClick={handleSubmit}
                                    disabled={!isValid}
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

export default ProjectSearchForm
