// Pagina de Usuario - Portal_Servicios
import React from 'react'
import { storage } from '../../../firebase/firebaseClient'
import { ref, getDownloadURL } from 'firebase/storage'

import ServiceCard from '../../components/ServiceCard'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

const Portal_Servicios = (props) => {
    const _storage = storage
    // const pathReference = ref(_snapStorage, 'Asesorias2.png')
    // const gsReference = ref(
    //     storage,
    //     'gs://app-comunidad-dezzpo.appspot.com/Asesorias2.png'
    // )

    getDownloadURL(
        ref(_storage, 'gs://app-comunidad-dezzpo.appspot.com/AsiTrabajamos2.png')
    )
        .then((url) => {
            console.log(url)
        })
        .catch((error) => {
            console.log(error)
        })

    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex">
                    <ServiceCard />
                </Row>
                <Row className="m-0 w-100 d-flex">
                    <Col className="col-10 p-4">
                        <h2 className="headline-xl">
                            Busqueda Local Servicios: Buscar comerciantes
                            Calificados
                        </h2>
                        <p className="body-2"> Comerciantes profesionales </p>
                        <p className="body-1">Publica un proyecto gratis</p>
                        <Col className="col-10 p-4">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Miembro</TableCell>
                                        <TableCell>
                                            Oferta de Servicios
                                        </TableCell>
                                        <TableCell>Certificaciones</TableCell>
                                        <TableCell>Calificaciones</TableCell>
                                        <TableCell>Se unio el</TableCell>
                                        <TableCell>Ubicación</TableCell>
                                        <TableCell>Contactar</TableCell>
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
                                        <TableCell>DATA...</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Col>
                    </Col>
                </Row>
                <Row className="m-0 w-100 d-flex">
                    <Col className="p-4">
                        <span>
                            <h2 className="headline-xl">
                                Buscar Requerimientos: Obtener o Aplicar con
                                Cotizaciones
                            </h2>
                        </span>
                        <p className="body-2">Proyectos activos </p>
                        <p className="body-1">Aplica a un Proyecto Gratis</p>
                        <Col className="col-10 p-4">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Imagenes</TableCell>
                                        <TableCell>Descripción</TableCell>
                                        <TableCell>
                                            Fecha de Publicación
                                        </TableCell>
                                        <TableCell>Valor Aproximado</TableCell>
                                        <TableCell>Se unio el</TableCell>
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
                                        <TableCell>DATA...</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Col>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Portal_Servicios
