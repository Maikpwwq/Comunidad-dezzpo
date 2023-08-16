export { Page }

// Pagina de Usuario - Biblioteca
import React from 'react'

// react-bootrstrap
// import { Row, Col, Container } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
// import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

const Page = () => {
    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 ">
                    <Col className="col-10 d-flex align-items-start justify-content-start">
                        <Row className="p-4" md={10}>
                            <span>
                                <h2 className="headline-xl">
                                    Descargar documentos
                                </h2>
                            </span>
                            <p className="body-1">
                                Encuentra aqui, plantillas para redactar tus
                                documentos, material de consulta, enlaces utiles
                                y más.
                            </p>
                            <p className="body-1">
                                Al ejecutar un nuevo proyecto siempre edite e
                                imprima prímero los documentos anexos, como lo
                                son cotizaciones y contratos.
                            </p>
                        </Row>
                        <Row className="w-100">
                            <Col className="col-10 p-4">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Titulo</TableCell>
                                            <TableCell>Descargar</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                CONTRATO DE ADQUISICION DE
                                                SERVICIO
                                            </TableCell>
                                            <TableCell>Pdf</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                FORMATO DE REQUERIMIENTOS DEL
                                                CLIENTE
                                            </TableCell>
                                            <TableCell>Pdf</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                FORMATO DE COTIZACIÓN DE
                                                SERVICIOS
                                            </TableCell>
                                            <TableCell>Pdf</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Col>
                        </Row>
                        <Row className="p-4" md={10}>
                            <span>
                                <h2 className="headline-xl">
                                    Material de consulta
                                </h2>
                            </span>
                            <Col className="col-10 p-4">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Titulo</TableCell>
                                            <TableCell>Descargar</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                Patologías y sistemas de
                                                mantenimiento en los inmuebles
                                            </TableCell>
                                            <TableCell>Pdf</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                MANUAL DE PROCEDIMIENTOS DE
                                                MANTENIMIENTO CORRECTIVO Y
                                                PREVENTIVO
                                            </TableCell>
                                            <TableCell>Pdf</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Reglamentaciones del Sistema de
                                                salud y seguridad en el trabajo
                                            </TableCell>
                                            <TableCell>Pdf</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Col>
                        </Row>
                        <Row className="p-4" md={10}>
                            <span>
                                <h2 className="headline-xl">
                                    Canal de youtube
                                </h2>
                            </span>
                            <p className="body-1">
                                Hemos recopilado unas listas de videos, las
                                cuales pueden ser de gran utilidad, para
                                especificar los detalles y acabados del servicio
                            </p>
                        </Row>
                        <Row className="p-4" md={10}>
                            <span>
                                <h2 className="headline-xl">
                                    Libreta de direcciones
                                </h2>
                            </span>
                            <span>Tiendas</span>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
