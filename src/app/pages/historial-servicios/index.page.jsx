export { Page }
export { LayoutAppPaperbase as Layout } from '#@/app/components/LayoutAppPaperbase'

// Pagina de Usuario - HistorialServicios
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

const Page = () => {
    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex align-items-start pt-4 pb-4">
                    <Col className="col-10" md={10}>
                        <h2 className="headline-xl"> Proyectos Publicados</h2>
                        <div className="p-4">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Imagenes</TableCell>
                                        <TableCell>Descripción</TableCell>
                                        <TableCell>
                                            Fecha de publicación
                                        </TableCell>
                                        <TableCell>valor aproximado</TableCell>
                                        <TableCell>Ubicación</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <h2 className="headline-xl">Proyectos cerrados</h2>
                        <div className="p-4">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Imagenes</TableCell>
                                        <TableCell>Descripción</TableCell>
                                        <TableCell>
                                            Fecha de publicación
                                        </TableCell>
                                        <TableCell>valor aproximado</TableCell>
                                        <TableCell>Ubicación</TableCell>
                                        <TableCell>Postular</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <h2 className="headline-xl">
                            Requerimientos guardados
                        </h2>
                        <div className="p-4">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>imagenes</TableCell>
                                        <TableCell>Descripción</TableCell>
                                        <TableCell>
                                            fecha de publicación
                                        </TableCell>
                                        <TableCell>valor aproximado</TableCell>
                                        <TableCell>Ubicación</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <h2 className="headline-xl">
                            Requerimientos solicitados
                        </h2>
                        <div className="p-4">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>imagenes</TableCell>
                                        <TableCell>Descripción</TableCell>
                                        <TableCell>
                                            fecha de publicación
                                        </TableCell>
                                        <TableCell>valor aproximado</TableCell>
                                        <TableCell>Ubicación</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                        <TableCell>DATA...</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
