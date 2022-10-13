import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { firestore, auth } from '../../../firebase/firebaseClient'
import { collection, doc, getDocFromServer } from 'firebase/firestore'

import TablaSubCategoriaPresupuesto from './Tabla_SubCategoria_Presupuesto'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'

const VerRequerimiento = () => {
    const user = auth.currentUser || {}
    const userID = user.uid || '' // Este es el id de la cuenta de Auth
    const { state } = useLocation() || {}
    const navigate = useNavigate()
    const { draftId } = state || ' '
    const _firestore = firestore
    // const _storage = storage
    const draftRef = collection(_firestore, 'drafts')
    const quotationRef = collection(_firestore, 'quotation')

    const localRole = localStorage.getItem('role')
    const selectRole = parseInt(JSON.parse(localRole))
    const [userRol, setUserRol] = useState({
        rol: selectRole ? selectRole : 2,
    })

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
        requerimientoCategorias: [],
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

    const handleSeeQuotation = (e, quotationId) => {
        e.preventDefault()
        navigate('/app/ver-cotizacion', {
            state: {
                quotationId: quotationId,
            },
        })
    }
    const handleEditQuotation = (e, quotationId) => {
        e.preventDefault()
        navigate('/app/editar-cotizacion', {
            state: {
                quotationId: quotationId,
            },
        })
    }
    const handleHire = (e, quotationId, proponentId) => {
        e.preventDefault()
        navigate('/app/contratar', {
            state: {
                draftId: draftId,
                quotationId: quotationId,
                proponentId: proponentId,
            },
        })
    }

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
                            className="btn-TEXT textBlanco"
                            variant="primary"
                            // onClick={}
                        >
                            REALIZA UNA PREGUNTA ABIERTA AL PROPIETARÍO
                        </Button>
                        <Row className="p-0 pt-4 pb-4 w-100">
                            <Col className="col" md={6} sm={12}>
                                <Typography
                                    variant="body1"
                                    className="p-description w-100"
                                >
                                    Presupuesto.
                                </Typography>
                                <Row className="m-0 w-100 pb-2 d-flex">
                                    <Typography
                                        variant="body1"
                                        name="requerimientoTotal"
                                        className="w-100"
                                    >
                                        Total: $
                                        {requerimientoInfo.requerimientoTotal}
                                    </Typography>
                                </Row>
                                <Typography
                                    variant="body1"
                                    className="p-description w-100"
                                >
                                    Categoria servicio.
                                </Typography>
                                <Row className="m-0 w-100 pb-2 d-flex">
                                    <Typography
                                        variant="body1"
                                        name="requerimientoTitulo"
                                        className="w-100"
                                    >
                                        Titulo:
                                        {requerimientoInfo.requerimientoTitulo}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoCategoria"
                                        className="w-100"
                                    >
                                        Categoria:
                                        {
                                            requerimientoInfo.requerimientoCategoria
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoTipoProyecto"
                                        className="w-100"
                                    >
                                        Tipo Proyecto:
                                        {
                                            requerimientoInfo.requerimientoTipoProyecto
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoDescripcion"
                                        className="w-100"
                                    >
                                        Descripción:
                                        {
                                            requerimientoInfo.requerimientoDescripcion
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoPropietario"
                                        className="w-100"
                                    >
                                        Propietario:
                                        {
                                            requerimientoInfo.requerimientoPropietario
                                        }
                                    </Typography>
                                </Row>
                                <Typography
                                    variant="body1"
                                    className="p-description w-100"
                                >
                                    Ubicacion.
                                </Typography>
                                <Row className="m-0 w-100 pb-2 d-flex">
                                    <Typography
                                        variant="body1"
                                        name="requerimientoCiudad"
                                        className="w-100"
                                    >
                                        Ciudad:
                                        {requerimientoInfo.requerimientoCiudad}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoDireccion"
                                        className="w-100"
                                    >
                                        Dirección:
                                        {
                                            requerimientoInfo.requerimientoDireccion
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoCodigoPostal"
                                        className="w-100"
                                    >
                                        Codigo Postal:
                                        {
                                            requerimientoInfo.requerimientoCodigoPostal
                                        }
                                    </Typography>
                                </Row>
                            </Col>
                            <Col className="col" md={6} sm={12}>
                                <Typography
                                    variant="body1"
                                    className="p-description w-100"
                                >
                                    Programación.
                                </Typography>
                                <Row className="m-0 w-100 pb-2 d-flex">
                                    <Typography
                                        variant="body1"
                                        name="requerimientoCreated"
                                        className="w-100"
                                    >
                                        FECHA DE PUBLICACIÓN:
                                        {requerimientoInfo.requerimientoCreated}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoPrioridad"
                                        className="w-100"
                                    >
                                        Prioridad:
                                        {
                                            requerimientoInfo.requerimientoPrioridad
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoMejorFecha"
                                        className="w-100"
                                    >
                                        Calendario asignado:
                                        {
                                            requerimientoInfo.requerimientoMejorFecha
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoMejorHora"
                                        className="w-100"
                                    >
                                        Disponibilidad de horario:
                                        {
                                            requerimientoInfo.requerimientoMejorHora
                                        }
                                    </Typography>
                                </Row>
                                <Typography
                                    variant="body1"
                                    className="p-description w-100"
                                >
                                    Descripción Propiedad.
                                </Typography>
                                <Row className="m-0 w-100 pb-2 d-flex">
                                    <Typography
                                        variant="body1"
                                        name="requerimientoTipoPropiedad"
                                        className="w-100"
                                    >
                                        Tipo propiedad:
                                        {
                                            requerimientoInfo.requerimientoTipoPropiedad
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoCantidadObra"
                                        className="w-100"
                                    >
                                        Cantidad Obra:
                                        {
                                            requerimientoInfo.requerimientoCantidadObra
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoPlanos"
                                        className="w-100"
                                    >
                                        Planos:
                                        {requerimientoInfo.requerimientoPlanos}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoPermisos"
                                        className="w-100"
                                    >
                                        Permisos:
                                        {
                                            requerimientoInfo.requerimientoPermisos
                                        }
                                    </Typography>
                                </Row>
                                <Row className="m-0 w-100 pb-2 d-flex">
                                    <Typography
                                        variant="body1"
                                        className="p-description w-100"
                                    >
                                        Archivos adjuntos:
                                    </Typography>
                                    <Button
                                        className="btn btn-round btn-high"
                                        onClick={handleDescargarAdjuntos}
                                    >
                                        Descargar
                                    </Button>
                                </Row>
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
                                            className="btn-TEXT textBlanco"
                                            variant="primary"
                                            onClick={handleCotizar}
                                        >
                                            + ASIGNAR NUEVA COTIZACION
                                        </Button>
                                    )}
                                </p>
                                {/* TODO: poblar tabla de cotizaciones */}
                                <Table
                                    sx={{
                                        display: { sm: 'grid', xs: 'grid' },
                                        overflowX: 'scroll',
                                    }}
                                >
                                    <TableHead>
                                        <TableRow
                                            className="w-100"
                                            sx={{ display: 'table' }}
                                        >
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
                                                                {/* TODOS PUEDEN, VER SI ES COMERCIANTE PROPONENTE EDITAR */}
                                                                {userID ==
                                                                proponentId ? (
                                                                    <Button
                                                                        className="btn btn-round btn-middle"
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            handleEditQuotation(
                                                                                e,
                                                                                quotationId
                                                                            )
                                                                        }
                                                                    >
                                                                        AJUSTAR
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        className="btn btn-round btn-high"
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            handleSeeQuotation(
                                                                                e,
                                                                                quotationId
                                                                            )
                                                                        }
                                                                    >
                                                                        VER
                                                                        COTIZACION
                                                                    </Button>
                                                                )}
                                                                {/* USUARIO PROPIETARIO / RESIDENTE PUEDE CONTRATAR */}
                                                                {userRol.rol ==
                                                                1 ? (
                                                                    <Button
                                                                        className="btn btn-round btn-middle"
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            handleHire(
                                                                                e,
                                                                                quotationId,
                                                                                proponentId
                                                                            )
                                                                        }
                                                                    >
                                                                        CONTRATAR
                                                                    </Button>
                                                                ) : (
                                                                    <></>
                                                                )}
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

export default VerRequerimiento
