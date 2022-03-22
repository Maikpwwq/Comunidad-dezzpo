// Pagina de Usuario - ConfiguracionPrivacidad
import React from 'react'

// react-booTableRowsTableRowap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

const ConfiguracionPrivacidad = (props) => {
    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="p-4">
                    <Col className="m-0 w-100 d-flex align-items-start justify-content-start">
                        <h2 className="headline-xl">
                            Configuracion de privacidad
                        </h2>
                        <Row md={10}>
                            <Col className="col-10 p-4">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Configuracion</TableCell>
                                            <TableCell>Privacidad</TableCell>
                                            <TableCell>Editar</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                Quien puede ver las
                                                publicaciones de tu perfil{' '}
                                            </TableCell>
                                            <TableCell>Publico</TableCell>
                                            <TableCell>
                                                <Button>Editar</Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Quien puede responder a tus
                                                solicitudes{' '}
                                            </TableCell>
                                            <TableCell>Publico</TableCell>
                                            <TableCell>
                                                <Button>Editar</Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Quien puede ver tu lista de
                                                amigos{' '}
                                            </TableCell>
                                            <TableCell>Publico</TableCell>
                                            <TableCell>
                                                <Button>Editar</Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Quien puede buscarte con el
                                                numero de telefono que
                                                proporcionaste{' '}
                                            </TableCell>
                                            <TableCell>Publico</TableCell>
                                            <TableCell>
                                                <Button>Editar</Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Quien puede buscarte con el
                                                correo elecTableRowonico que
                                                proporcionaste{' '}
                                            </TableCell>
                                            <TableCell>Publico</TableCell>
                                            <TableCell>
                                                <Button>Editar</Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default ConfiguracionPrivacidad
