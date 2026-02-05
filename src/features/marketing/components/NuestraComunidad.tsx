/**
 * NuestraComunidad Component
 *
 * Community section on home page with categories slider.
 * Migrated from src/index/components/nuestra-comunidad/NuestraComunidad.jsx
 */

import React from 'react'
import { CategoriasSlider } from './CategoriasSlider'
import clsx from 'clsx'

import styles from './NuestraComunidad.module.scss'

import { Container, Col } from 'react-bootstrap'

export const NuestraComunidad = React.memo(function NuestraComunidad(): React.ReactElement {
    return (
        <Container fluid className="p-0 community-page">
            <Col id="popular-categorias" className="m-4 p-4">
                <Col className="w-80">
                    <h2 className={clsx(styles.Title, "type-hero-title text-dark")}>
                        Nuestra <strong className="color-green">Comunidad</strong>
                    </h2>
                    <p className={clsx(styles.Description, "pb-4 body-1 text-muted")}>
                        Tenemos una gran cantidad de profesionales que quieren trabajar en su proyecto.
                    </p>
                    <CategoriasSlider />
                </Col>
            </Col>
        </Container>
    )
})

export default NuestraComunidad
