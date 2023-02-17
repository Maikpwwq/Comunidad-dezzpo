import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { firestore, auth } from '@/firebase/firebaseClient'
import { collection, doc, getDocFromServer } from 'firebase/firestore'

import readDraftFromFirestore from '@/services/readDraftFromFirestore.service'
import readQuotationFromFirestore from '@/services/readQuotationFromFirestore.service'
import { sharingInformationService } from '@/services/sharing-information'

import './detalle_requerimiento.css'

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

    const fromDraft = (draftId) => {
        readDraftFromFirestore({
            draftId,
        })
    }

    const fromQuotation = (docId) => {
        readQuotationFromFirestore({
            docId,
        })
    }

    useEffect(() => {
        console.log(draftId)
        if (draftId !== ' ' && draftId !== undefined) {
            fromDraft(draftId)
            const draftData = sharingInformationService.getSubject()
            draftData.subscribe((data) => {
                if (!!data) {
                    console.log(data)
                    setRequerimientoInfo({
                        ...requerimientoInfo,
                        requerimientoTitulo: data.draftName,
                        requerimientoCategoria: data.draftCategory,
                        requerimientoTipoProyecto: data.draftProject,
                        requerimientoDescripcion: data.draftDescription,
                        requerimientoId: data.draftId,
                        requerimientoTotal: data.draftTotal,
                        requerimientoCategorias: data.draftSubCategory || [],
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
                        requerimientoAplicaciones: data.draftApply
                            ? data.draftApply
                            : [],
                    })
                    // console.log(data, data.draftApply)
                    const appliedQuotations = data.draftApply[0] || []
                    fromQuotation(appliedQuotations)
                    const quotationData = sharingInformationService.getSubject()
                    quotationData.subscribe((data) => {
                        if (!!data) {
                            console.log('Detail load:', data)
                            setCotizacionesInfo({
                                ...cotizacionesInfo,
                                appliedQuotations: [data],
                            })
                        }
                    })
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
                        <Typography variant="h5" className="headline-xl">
                            Detalle Requerimiento
                        </Typography>
                        <Button
                            className="btn-TEXT textBlanco"
                            variant="primary"
                            // onClick={}
                        >
                            REALIZA UNA PREGUNTA ABIERTA AL PROPIETARÍO
                        </Button>
                        <Row className="p-0 pt-4 pb-4 w-100 align-items-start">
                            <Col className="col" md={6} sm={12}>
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    align="start"
                                    className="p-description w-100"
                                >
                                    Presupuesto
                                </Typography>
                                <Row className="m-0 w-100 pb-2 d-flex">
                                    <Typography
                                        variant="body1"
                                        name="requerimientoTotal"
                                        className="w-100 detail-pill ps-3"
                                    >
                                        Total: $
                                        {requerimientoInfo.requerimientoTotal}
                                    </Typography>
                                </Row>
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    align="start"
                                    className="p-description w-100"
                                >
                                    Categoria servicio
                                </Typography>
                                <Row className="m-0 w-100 pb-2 d-flex">
                                    <Typography
                                        variant="body1"
                                        name="requerimientoTitulo"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Titulo:{' '}
                                        {requerimientoInfo.requerimientoTitulo}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoCategoria"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Categoria:{' '}
                                        {
                                            requerimientoInfo.requerimientoCategoria
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoTipoProyecto"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Tipo Proyecto:{' '}
                                        {
                                            requerimientoInfo.requerimientoTipoProyecto
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoDescripcion"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Descripción:{' '}
                                        {
                                            requerimientoInfo.requerimientoDescripcion
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoPropietario"
                                        className="w-100 detail-pill ps-3"
                                    >
                                        Propietario:{' '}
                                        {
                                            requerimientoInfo.requerimientoPropietario
                                        }
                                    </Typography>
                                </Row>
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    align="start"
                                    className="p-description w-100"
                                >
                                    Ubicacion
                                </Typography>
                                <Row className="m-0 w-100 pb-2 d-flex">
                                    <Typography
                                        variant="body1"
                                        name="requerimientoCiudad"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Ciudad:{' '}
                                        {requerimientoInfo.requerimientoCiudad}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoDireccion"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Dirección:{' '}
                                        {
                                            requerimientoInfo.requerimientoDireccion
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoCodigoPostal"
                                        className="w-100 detail-pill ps-3"
                                    >
                                        Codigo Postal:{' '}
                                        {
                                            requerimientoInfo.requerimientoCodigoPostal
                                        }
                                    </Typography>
                                </Row>
                            </Col>
                            <Col className="col" md={6} sm={12}>
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    align="start"
                                    className="p-description w-100"
                                >
                                    Programación
                                </Typography>
                                <Row className="m-0 w-100 pb-2 d-flex">
                                    <Typography
                                        variant="body1"
                                        name="requerimientoCreated"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        FECHA DE PUBLICACIÓN:{' '}
                                        {requerimientoInfo.requerimientoCreated}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoPrioridad"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Prioridad:{' '}
                                        {
                                            requerimientoInfo.requerimientoPrioridad
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoMejorFecha"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Calendario asignado:{' '}
                                        {
                                            requerimientoInfo.requerimientoMejorFecha
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoMejorHora"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Disponibilidad de horario:{' '}
                                        {
                                            requerimientoInfo.requerimientoMejorHora
                                        }
                                    </Typography>
                                </Row>
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    align="start"
                                    className="p-description w-100"
                                >
                                    Descripción Propiedad
                                </Typography>
                                <Row className="m-0 w-100 pb-2 d-flex">
                                    <Typography
                                        variant="body1"
                                        name="requerimientoTipoPropiedad"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Tipo propiedad:{' '}
                                        {
                                            requerimientoInfo.requerimientoTipoPropiedad
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoCantidadObra"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Cantidad Obra:{' '}
                                        {
                                            requerimientoInfo.requerimientoCantidadObra
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoPlanos"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Planos:{' '}
                                        {requerimientoInfo.requerimientoPlanos}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoPermisos"
                                        className="w-100 detail-pill ps-3"
                                    >
                                        Permisos:{' '}
                                        {
                                            requerimientoInfo.requerimientoPermisos
                                        }
                                    </Typography>
                                </Row>
                                <Row className="m-0 w-100 pb-2 d-flex">
                                    <Typography
                                        variant="h6"
                                        className="p-description w-100 p-1"
                                    >
                                        Archivos adjuntos{' '}
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
                                            className="w-100 ps-4"
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
