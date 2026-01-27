/**
 * CategoriasServicios Component
 *
 * Full list of service categories displayed in columns.
 * Migrated from src/index/components/categorias-servicios/CategoriasServicios.jsx
 */

import React, { useMemo } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

import { ListadoCategorias } from '@assets/data/ListadoCategorias'
import '@assets/css/categorias_servicios.css'

interface CategoryItem {
    key: number
    label: string
    rol: string
    icon: React.ReactNode
}

export interface CategoriasServiciosProps {
    /** Custom title */
    title?: string
    /** Number of columns to display */
    columns?: number
}

export function CategoriasServicios({
    title = 'Nuestro comerciantes y servicios',
    columns = 4,
}: CategoriasServiciosProps): React.ReactElement {
    // Split categories into columns
    const categoryColumns = useMemo(() => {
        const categorias = ListadoCategorias as CategoryItem[]
        const itemsPerColumn = Math.ceil(categorias.length / columns)
        const result: CategoryItem[][] = []

        for (let i = 0; i < columns; i++) {
            result.push(categorias.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn))
        }

        return result
    }, [columns])

    const renderCategoryList = (items: CategoryItem[]) => (
        <ul className="body-1">
            {items.map((categoria) => (
                <li key={categoria.key}>
                    {categoria.icon} {'> '}
                    {categoria.label} {'> '}
                    {categoria.rol}
                </li>
            ))}
        </ul>
    )

    return (
        <Container fluid className="p-0">
            <Row id="categoriasServicios" className="m-0">
                <Col className="col-12 w-80 m-4 p-4">
                    <div className="tituloServicios">
                        <h2 className="headline-xl">{title}</h2>
                    </div>
                    <br />
                    <Row className="contratistasReformas">
                        {categoryColumns.map((columnItems, index) => (
                            <Col key={index} className="col-md-3 p-0" sm={12}>
                                {renderCategoryList(columnItems)}
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default CategoriasServicios
