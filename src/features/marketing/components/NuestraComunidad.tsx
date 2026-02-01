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

import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'

export function NuestraComunidad(): React.ReactElement {
    return (
        <Container fluid className="p-0 community-page">
            <Col id="popular-categorias" className="m-4 p-4">
                <Col className="w-80">
                    <h2 className={styles.Title}>
                        Nuestra <strong>Comunidad</strong>
                    </h2>
                    <p className={clsx(styles.Description, "pb-4")}>
                        Tenemos una gran cantidad de profesionales que quieren trabajar en su proyecto.
                    </p>
                    <CategoriasSlider />
                </Col>
            </Col>
        </Container>
    )
}

export default NuestraComunidad
