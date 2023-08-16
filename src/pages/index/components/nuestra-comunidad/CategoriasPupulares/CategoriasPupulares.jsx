export { CategoriasPupulares }

import React from 'react'
import styled from 'styled-components'
import Col from 'react-bootstrap/Col'

const CategoriasPupularesStyle = styled.div``

export { CategoriasPupulares }

const CategoriasPupulares = () => {
    return (
        <CategoriasPupularesStyle>
            {/* CategoriasPupulares */}
            <Col className="categoriasPopulares mt-4 p-4">
                <h3 className=".headline-l">
                    o encuentralos dentro de las categorías populares:
                </h3>
                <ul className="body-2 textBlanco pt-4">
                    <li>
                        Pintor y decorador; Pintura y decoracion de interiores.
                    </li>
                    <li>
                        Electricista; Instalación y validación de acometidas
                        electricas.
                    </li>
                    <li>
                        Instaladores de techos y cubiertas; mantenimiento de
                        cubiertas.
                    </li>
                    <li>Maestro; Construcciones y ampliaciones. </li>
                    <li>Plomero; reparacion de fugas. </li>
                    <li>Carpinteria; instalacion de closets, más. </li>
                </ul>
            </Col>
        </CategoriasPupularesStyle>
    )
}
