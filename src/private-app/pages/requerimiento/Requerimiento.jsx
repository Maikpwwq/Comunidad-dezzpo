import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { firestore, storage } from '../../../firebase/firebaseClient'
import { collection, doc, getDocFromServer } from 'firebase/firestore'

import TablaSubCategoriaPresupuesto from './Tabla_SubCategoria_Presupuesto'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

const Requerimiento = () => {
    const { state } = useLocation() || {}
    const navigate = useNavigate()
    const { draftId } = state || ' '
    const _firestore = firestore
    // const _storage = storage
    const draftRef = collection(_firestore, 'drafts')
    const quotationRef = collection(_firestore, 'quotation')

    const [cotizacionesInfo, setCotizacionesInfo] = useState({
        appliedQuotations: [],
    })
    const [requerimientoInfo, setRequerimientoInfo] = useState({
        requerimientoTitulo: '',
        requerimientoCategoria: '',
        requerimientoTipoProyecto: '',
        requerimientoDescripcion: '',
        requerimientoId: '',
        requerimientoTotal: 0,
        requerimientoCategorias: '',
        requerimientoPropietario: '',
        requerimientoCreated: '',
        requerimientoPrioridad: '',
        requerimientoTipoPropiedad: '',
        requerimientoCantidadObra: '',
        requerimientoPlanos: '',
        requerimientoPermisos: '',
        requerimientoCiudad: '',
        requerimientoDireccion: '',
        requerimientoCodigoPostal: '',
        requerimientoAdjuntos: '',
        requerimientoMejorFecha: '',
        requerimientoMejorHora: '',
        requerimientoAplicaciones: '',
    })

    const draftFromFirestore = async (projectID) => {
        const draftData = await getDocFromServer(doc(draftRef, projectID))
        // console.log(draftData)
        return draftData
    }

    const quotationFromFirestore = async (docId) => {
        const quotationData = await getDocFromServer(doc(quotationRef, docId))
        // console.log(quotationData)
        return quotationData
    }

    useEffect(() => {
        console.log(draftId)
        if (draftId !== ' ' && draftId !== undefined) {
            const snap = draftFromFirestore(draftId)
            snap.then((docSnap) => {
                // docSnap.exists()
                // console.log(docSnap)
                if (docSnap) {
                    // docSnap._document.data...
                    const data = docSnap.data()
                    // console.log(data)
                    if (data) {
                        setRequerimientoInfo({
                            ...requerimientoInfo,
                            requerimientoTitulo: data.draftName,
                            requerimientoCategoria: data.draftCategory,
                            requerimientoTipoProyecto: data.draftProject,
                            requerimientoDescripcion: data.draftDescription,
                            requerimientoId: data.draftId,
                            requerimientoTotal: data.draftTotal,
                            requerimientoCategorias: data.draftSubCategory,
                            requerimientoPropietario:
                                data.draftPropietarioResidente,
                            requerimientoCreated: data.draftCreated,
                            requerimientoPrioridad: data.draftPriority,
                            requerimientoTipoPropiedad: data.draftProperty,
                            requerimientoCantidadObra: data.draftRooms,
                            requerimientoPlanos: data.draftPlans,
                            requerimientoPermisos: data.draftPermissions,
                            requerimientoCiudad: data.draftCity,
                            requerimientoDireccion: data.draftDirection,
                            requerimientoCodigoPostal: data.draftPostalCode,
                            requerimientoAdjuntos: data.draftAtachments,
                            requerimientoMejorFecha: data.draftBestScheduleDate,
                            requerimientoMejorHora: data.draftBestScheduleTime,
                            requerimientoAplicaciones: data.draftApply,
                        })
                        // console.log(data, data.draftApply)
                        const snap2 = quotationFromFirestore(data.draftApply[0])
                        snap2.then((docQuotation) => {
                            // console.log(docQuotation.data())
                            setCotizacionesInfo({
                                ...cotizacionesInfo,
                                appliedQuotations: [docQuotation.data()],
                            })
                        })
                    }
                }
            })
        }
    }, [draftId])

    // TODO: implementar arrow function para descargar archivos adjuntos
    const handleDescargarAdjuntos = () => {}

    const handleCotizar = () => {
        navigate('/app/cotizacion', {
            state: { draftId: requerimientoInfo.requerimientoId },
        })
    }

    return (
        <>
            <Container fluid className="p-0">
                <Row className="h-100 pt-4 pb-4">
                    <Col className="col-10">
                        <h4 className="headline-xl">Detalle Requerimiento</h4>
                        <Button
                            className="BOTON-TEXT textBlanco"
                            variant="primary"
                            // onClick={}
                        >
                            REALIZA UNA PREGUNTA ABIERTA AL PROPIETARÍO
                        </Button>
                        <Row className="p-0 pt-4 pb-4 w-100">
                            <Col className="col" md={6} sm={12}>
                                <p className="p-description">Presupuesto</p>
                                {/* TODO: Estado Select aplicado aprovado contratacion
                                liquidación */}
                                <TextField
                                    className="w-100"
                                    id="requerimientoTotal"
                                    name="requerimientoTotal"
                                    label="Total"
                                    value={requerimientoInfo.requerimientoTotal}
                                    // defaultValue="@Ciudad"
                                    variant="filled"
                                />
                                {/* // id */}
                                <p className="p-description">
                                    Categoria servicio
                                </p>
                                <TextField
                                    className="w-100"
                                    id="requerimientoTitulo"
                                    name="requerimientoTitulo"
                                    label="Titulo"
                                    value={
                                        requerimientoInfo.requerimientoTitulo
                                    }
                                    // defaultValue="@Titulo"
                                    variant="filled"
                                />
                                <TextField
                                    className="w-100"
                                    id="requerimientoCategoria"
                                    name="requerimientoCategoria"
                                    label="Categoria"
                                    value={
                                        requerimientoInfo.requerimientoCategoria
                                    }
                                    // defaultValue="@Categoria"
                                    variant="filled"
                                />
                                <TextField
                                    className="w-100"
                                    id="requerimientoTipoProyecto"
                                    name="requerimientoTipoProyecto"
                                    label="Tipo Proyecto?"
                                    value={
                                        requerimientoInfo.requerimientoTipoProyecto
                                    }
                                    // defaultValue="@TipoProyecto"
                                    variant="filled"
                                />
                                <TextField
                                    className="w-100"
                                    id="requerimientoDescripcion"
                                    name="requerimientoDescripcion"
                                    label="Descripción"
                                    value={
                                        requerimientoInfo.requerimientoDescripcion
                                    }
                                    // defaultValue="@Descripción"
                                    variant="filled"
                                />
                                <TextField
                                    className="w-100"
                                    id="requerimientoPropietario"
                                    name="requerimientoPropietario"
                                    label="Propietario"
                                    value={
                                        requerimientoInfo.requerimientoPropietario
                                    }
                                    // defaultValue="@PROPIETARIO"
                                    variant="filled"
                                />
                                <p className="p-description">Ubicacion</p>
                                <TextField
                                    className="w-100"
                                    id="requerimientoCiudad"
                                    name="requerimientoCiudad"
                                    label="Ciudad"
                                    value={
                                        requerimientoInfo.requerimientoCiudad
                                    }
                                    // defaultValue="@Ciudad"
                                    variant="filled"
                                />
                                <TextField
                                    className="w-100"
                                    id="requerimientoDireccion"
                                    name="requerimientoDireccion"
                                    label="Direccion"
                                    value={
                                        requerimientoInfo.requerimientoDireccion
                                    }
                                    // defaultValue="@Direccion"
                                    variant="filled"
                                />
                                <TextField
                                    className="w-100"
                                    id="requerimientoCodigoPostal"
                                    name="requerimientoCodigoPostal"
                                    label="Codigo Postal"
                                    value={
                                        requerimientoInfo.requerimientoCodigoPostal
                                    }
                                    // defaultValue="@CodigoPostal"
                                    variant="filled"
                                />
                            </Col>
                            <Col className="col" md={6} sm={12}>
                                <p className="p-description">Programación</p>
                                <TextField
                                    className="w-100"
                                    id="requerimientoCreated"
                                    name="requerimientoCreated"
                                    label="FECHA DE PUBLICACIÓN"
                                    value={
                                        requerimientoInfo.requerimientoCreated
                                    }
                                    // defaultValue="@Created"
                                    variant="filled"
                                />
                                <TextField
                                    className="w-100"
                                    id="requerimientoPrioridad"
                                    name="requerimientoPrioridad"
                                    label="Prioridad"
                                    value={
                                        requerimientoInfo.requerimientoPrioridad
                                    }
                                    // defaultValue="@PRIORIDAD"
                                    variant="filled"
                                />
                                <TextField
                                    className="w-100"
                                    id="requerimientoMejorFecha"
                                    name="requerimientoMejorFecha"
                                    label="Calendario asignado"
                                    value={
                                        requerimientoInfo.requerimientoMejorFecha
                                    }
                                    // defaultValue="@PROPIETARIO"
                                    variant="filled"
                                />
                                <TextField
                                    className="w-100"
                                    id="requerimientoMejorHora"
                                    name="requerimientoMejorHora"
                                    label="Disponibilidad de horario"
                                    value={
                                        requerimientoInfo.requerimientoMejorHora
                                    }
                                    // defaultValue="@PROPIETARIO"
                                    variant="filled"
                                />
                                <p className="p-description">
                                    Descripción Propiedad
                                </p>
                                <TextField
                                    className="w-100"
                                    id="requerimientoTipoPropiedad"
                                    name="requerimientoTipoPropiedad"
                                    label="Tipo propiedad"
                                    value={
                                        requerimientoInfo.requerimientoTipoPropiedad
                                    }
                                    // defaultValue="@TipoPropiedad"
                                    variant="filled"
                                />
                                <TextField
                                    className="w-100"
                                    id="requerimientoCantidadObra"
                                    name="requerimientoCantidadObra"
                                    label="Cantidad Obra"
                                    value={
                                        requerimientoInfo.requerimientoCantidadObra
                                    }
                                    // defaultValue="@CantidadObra"
                                    variant="filled"
                                />
                                <TextField
                                    className="w-100"
                                    id="requerimientoPlanos"
                                    name="requerimientoPlanos"
                                    label="Planos"
                                    value={
                                        requerimientoInfo.requerimientoPlanos
                                    }
                                    // defaultValue="@PLANOS"
                                    variant="filled"
                                />
                                <TextField
                                    className="w-100"
                                    id="requerimientoPermisos"
                                    name="requerimientoPermisos"
                                    label="Permisos"
                                    value={
                                        requerimientoInfo.requerimientoPermisos
                                    }
                                    // defaultValue="@PERMISOS"
                                    variant="filled"
                                />
                                <h4 className=".headline-l pt-4">
                                    Archivos adjuntos{' '}
                                </h4>
                                <Button
                                    className="btn btn-round btn-high"
                                    onClick={handleDescargarAdjuntos}
                                >
                                    Descargar
                                </Button>
                            </Col>
                        </Row>
                        <TablaSubCategoriaPresupuesto
                            requerimientoCategorias={
                                requerimientoInfo.requerimientoCategorias
                            }
                            requerimientoTotal={
                                requerimientoInfo.requerimientoTotal
                            }
                        />
                        <Row>
                            <Col>
                                <p className="headline-l">
                                    COTIZACIONES{' '}
                                    {requerimientoInfo.requerimientoAplicaciones
                                        .length < 4 && (
                                        <Button
                                            className="BOTON-TEXT textBlanco"
                                            variant="primary"
                                            onClick={handleCotizar}
                                        >
                                            + ASIGNAR NUEVA COTIZACION
                                        </Button>
                                    )}
                                </p>
                                {/* TODO: poblar tabla de cotizaciones */}
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Comerciante calificado
                                            </TableCell>
                                            <TableCell>Alcance</TableCell>
                                            <TableCell>Descripción</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cotizacionesInfo.appliedQuotations &&
                                            cotizacionesInfo.appliedQuotations.map(
                                                (item) => {
                                                    const {
                                                        proponentId,
                                                        scope,
                                                        description,
                                                        quotationId,
                                                    } = item
                                                    return (
                                                        <TableRow
                                                            key={quotationId}
                                                        >
                                                            {' '}
                                                            <TableCell>
                                                                {proponentId}
                                                            </TableCell>
                                                            <TableCell>
                                                                {scope}
                                                            </TableCell>
                                                            <TableCell>
                                                                {description}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button className="btn btn-round btn-high">
                                                                    DESCARGAR
                                                                    COTIZACION
                                                                </Button>
                                                            </TableCell>{' '}
                                                        </TableRow>
                                                    )
                                                }
                                            )}
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

export default Requerimiento
