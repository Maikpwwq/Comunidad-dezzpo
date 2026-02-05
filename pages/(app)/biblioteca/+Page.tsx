/**
 * Biblioteca (Library) Page
 *
 * Converted to TypeScript.
 * Downloads, reference materials, and resources for users.
 */
// Bootstrap
import { Row, Col, Container } from 'react-bootstrap'
// MUI
import {
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from '@mui/material'
// Document data
const documentosA = [
    { title: 'Contrato De Adquisición De Servicios' },
    { title: 'Formato De Requerimientos Del Cliente' },
    { title: 'Formato De Cotización De Servicios' },
]
const documentosB = [
    { title: 'Patologías Y Sistemas De Mantenimiento En Los Inmuebles' },
    { title: 'Manual De Procedimientos De Mantenimiento Correctivo Y Preventivo' },
    { title: 'Reglamentaciones Del Sistema De Salud Y Seguridad En El Trabajo' },
]
export default function Page() {
    return (
        <Container fluid className="p-0 h-100">
            <Row className="m-0 w-100">
                <Col className="col-10 d-flex align-items-start justify-content-start">
                    <Row className="p-4" md={10}>
                        <Typography className="headline-xl">Descargar documentos</Typography>
                        <p className="body-1">
                            Encuentra aquí, plantillas para redactar tus documentos, material de
                            consulta, enlaces útiles y más.
                        </p>
                        <p className="body-1">
                            Al ejecutar un nuevo proyecto siempre edite e imprima primero los
                            documentos anexos, como lo son cotizaciones y contratos.
                        </p>
                    </Row>
                    <Row className="w-100">
                        <Col className="col-10 p-4">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="table-head">Título</TableCell>
                                        <TableCell className="table-head">Descargar</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {documentosA.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="body-1">{item.title}</TableCell>
                                            <TableCell className="body-1">Pdf</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Col>
                    </Row>
                    <Row className="p-4" md={10}>
                        <Typography className="headline-xl">Material de consulta</Typography>
                        <Col className="col-10 p-4">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="table-head">Título</TableCell>
                                        <TableCell className="table-head">Descargar</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {documentosB.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="body-1">{item.title}</TableCell>
                                            <TableCell className="body-1">Pdf</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Col>
                    </Row>
                    <Row className="p-4" md={10}>
                        <Typography className="headline-xl">Canal de YouTube</Typography>
                        <p className="body-1">
                            Hemos recopilado unas listas de videos, las cuales pueden ser de gran
                            utilidad, para especificar los detalles y acabados del servicio
                        </p>
                    </Row>
                    <Row className="p-4" md={10}>
                        <Typography className="headline-xl">Libreta de direcciones</Typography>
                        <span className="btn btn-round btn-high">Tiendas</span>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
