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

import { Container } from 'react-bootstrap'

export const NuestraComunidad = React.memo(function NuestraComunidad(): React.ReactElement {
    return (
        <Container fluid className="p-0 community-page" style={{ overflowX: 'hidden' }}>
            <section id="popular-categorias" className="py-4 px-3 px-md-4">
                <h2 className={clsx(styles.Title, "type-hero-title text-dark")}>
                    Nuestra <strong className="color-green">Comunidad</strong>
                </h2>
                <p className={clsx(styles.Description, "pb-4 body-1 text-muted")}>
                    Tenemos una gran cantidad de profesionales que quieren trabajar en su proyecto.
                </p>
                <CategoriasSlider />
            </section>
        </Container>
    )
})

export default NuestraComunidad
