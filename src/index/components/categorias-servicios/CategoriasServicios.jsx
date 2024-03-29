export { CategoriasServicios }

import * as React from 'react'
import '#@/assets/css/categorias_servicios.css'
import { ListadoCategorias } from '../ListadoCategorias'
// react-bootrstrap
// import { Row, Col, Container } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const CategoriasServicios = () => {
    const sliceUno = ListadoCategorias.slice(0, 16)
    const sliceDos = ListadoCategorias.slice(16, 32)
    const sliceTres = ListadoCategorias.slice(32, 48)
    const sliceCuatro = ListadoCategorias.slice(48, 65)

    return (
        <>
            <Container fluid className="p-0">
                <Row id="categoriasServicios" className="m-0">
                    <Col className="col-12 w-80 m-4 p-4">
                        <div className="tituloServicios">
                            <h2 className="headline-xl">
                                Nuestro comerciantes y servicios
                            </h2>
                        </div>
                        <br />
                        <Row className="contratistasReformas">
                            <Col className="col-md-3 p-0" sm="12">
                                <ul className="body-1">
                                    {sliceUno.map((categoria, index) => {
                                        return (
                                            <li key={index}>
                                                {categoria.icon} {'> '}
                                                {categoria.label} {'> '}
                                                {categoria.rol}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </Col>
                            <Col className="col-md-3 p-0" sm="12">
                                <ul className="body-1">
                                    {sliceDos.map((categoria, index) => {
                                        return (
                                            <li key={index}>
                                                {categoria.icon} {'> '}
                                                {categoria.label} {'> '}
                                                {categoria.rol}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </Col>
                            <Col className="col-md-3 p-0" sm="12">
                                <ul className="body-1">
                                    {sliceTres.map((categoria, index) => {
                                        return (
                                            <li key={index}>
                                                {categoria.icon} {'> '}
                                                {categoria.label} {'> '}
                                                {categoria.rol}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </Col>
                            <Col className="col-md-3 p-0" sm="12">
                                <ul className="body-1">
                                    {sliceCuatro.map((categoria, index) => {
                                        return (
                                            <li key={index}>
                                                {categoria.icon} {'> '}
                                                {categoria.label} {'> '}
                                                {categoria.rol}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
