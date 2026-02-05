/**
 * CategoriasServicios Component
 *
 * Full list of service categories displayed in columns.
 * Migrated from src/index/components/categorias-servicios/CategoriasServicios.jsx
 */

import React, { useMemo } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import clsx from 'clsx'

import styles from './CategoriasServicios.module.scss'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'
import { CategoryIcons } from '@assets/data/CategoryIcons'

interface CategoryItem {
    key: number
    label: string
    rol: string
    iconName: string
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
        <ul className={styles.CategoryList}>
            {items.map((categoria) => {
                const IconComponent = CategoryIcons[categoria.iconName]
                return (
                    <li key={categoria.key}>
                        {IconComponent && (
                            <IconComponent fontSize="small" className="mx-2 my-1" />
                        )}
                        {' > '}
                        {categoria.label} {' > '}
                        {categoria.rol}
                    </li>
                )
            })}
        </ul>
    )

    return (
        <Container fluid className="p-0">
            <Row className="m-0">
                <Col className={clsx(styles.Container)}>
                    <div className={styles.TitleWrapper}>
                        <h2 className={styles.Title}>{title}</h2>
                    </div>
                    <br />
                    <Row>
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
