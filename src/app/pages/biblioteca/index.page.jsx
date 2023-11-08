export { Page }
export { LayoutAppPaperbase as Layout } from '#@/app/components/LayoutAppPaperbase'

// Pagina de Usuario - Biblioteca
import React from 'react'

// react-bootrstrap
// import { Row, Col, Container } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
// import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

const documentosA = [
    {
        title: 'Contrato De Adquisición De Servicios',
    },
    {
        title: 'Formato De Requerimientos Del Cliente',
    },
    {
        title: 'Formato De Cotización De Servicios',
    },
]

const documentosB = [
    {
        title: 'Patologías Y Sistemas De Mantenimiento En Los Inmuebles',
    },
    {
        title: 'Manual De Procedimientos De Mantenimiento Correctivo Y Preventivo',
    },
    {
        title: 'Reglamentaciones Del Sistema De Salud Y Seguridad En El Trabajo',
    },
]

const Page = () => {
    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 ">
                    <Col className="col-10 d-flex align-items-start justify-content-start">
                        <Row className="p-4" md={10}>
                            <Typography className="headline-xl" variant="">
                                Descargar documentos{' '}
                            </Typography>
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
                                            <TableCell className="table-head">Titulo</TableCell>
                                            <TableCell className="table-head">Descargar</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {documentosA.map((item, index) => {
                                            const { title } = item
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell className="body-1">
                                                        {title}
                                                    </TableCell>
                                                    <TableCell className="body-1">Pdf</TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </Col>
                        </Row>
                        <Row className="p-4" md={10}>
                            <Typography className="headline-xl" variant="">
                                Material de consulta{' '}
                            </Typography>
                            <Col className="col-10 p-4">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="table-head">Titulo</TableCell>
                                            <TableCell className="table-head">Descargar</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {documentosB.map((item, index) => {
                                            const { title } = item
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell className="body-1">
                                                        {title}
                                                    </TableCell>
                                                    <TableCell className="body-1">Pdf</TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </Col>
                        </Row>
                        <Row className="p-4" md={10}>
                            <Typography className="headline-xl" variant="">
                                Canal de YouTube{' '}
                            </Typography>
                            <p className="body-1">
                                Hemos recopilado unas listas de videos, las
                                cuales pueden ser de gran utilidad, para
                                especificar los detalles y acabados del servicio
                            </p>
                        </Row>
                        <Row className="p-4" md={10}>
                            <Typography className="headline-xl" variant="">
                                Libreta de direcciones{' '}
                            </Typography>
                            <span className="btn btn-round btn-high">Tiendas</span>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
