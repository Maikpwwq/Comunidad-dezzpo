export { Page }
export { LayoutAppPaperbase as Layout } from '#@/app/components/LayoutAppPaperbase'

import React, { useState, useEffect, useContext } from 'react'
import { UserAuthContext } from '#@/providers/UserAuthProvider'
import { navigate } from 'vite-plugin-ssr/client/router'
import { firestore, auth } from '#@/firebase/firebaseClient'
import { collection, doc, getDocFromServer } from 'firebase/firestore'
import { usePageContext } from '#R/usePageContext'

import { readDraftFromFirestore } from '#@/services/readDraftFromFirestore.service'
import { readQuotationFromFirestore } from '#@/services/readQuotationFromFirestore.service'
import { sharingInformationService } from '#@/services/sharing-information'

import '../detalle_requerimiento.css'

import { TablaSubCategoriaPresupuesto } from '../Tabla_SubCategoria_Presupuesto'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'
// import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'

const Page = () => {
    const { currentUser, updateUser } = useContext(UserAuthContext)
    const userAuthID = currentUser?.userId // Este es el id de la cuenta de Auth
    // const userAuthName = currentUser?.displayName  // Este es el id de la cuenta de Auth

    // const navigate = useNavigate()
    const pageContext = usePageContext()
    const { draftId } = pageContext.routeParams
    const [isLoaded, setIsLoaded] = useState(false)

    const _firestore = firestore
    // const _storage = storage
    // const draftRef = collection(_firestore, 'drafts')
    // const quotationRef = collection(_firestore, 'quotation')

    const [rolAuth, setRolAuth] = useState(currentUser?.rol)

    useEffect(() => {
        // Perform localStorage action
        const localRole = localStorage.getItem('role')
        const selectRole = parseInt(JSON.parse(localRole))
        setRolAuth(selectRole)
    }, [])

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
        if (!isLoaded) {
            console.log(draftId)
            const LoadDraftData = (draft) => {
                // const { draft } = data
                const {
                    draftName,
                    draftCategory,
                    draftProject,
                    draftDescription,
                    draftId,
                    draftTotal,
                    draftSubCategory,
                    draftPropietarioResidente,
                    draftCreated,
                    draftPriority,
                    draftProperty,
                    draftRooms,
                    draftPlans,
                    draftPermissions,
                    draftCity,
                    draftDirection,
                    draftPostalCode,
                    draftAtachments,
                    draftBestScheduleDate,
                    draftBestScheduleTime,
                    draftApply,
                } = draft
                // console.log('readDraftFromFirestore--', draft)
                setRequerimientoInfo({
                    ...requerimientoInfo,
                    requerimientoTitulo: draftName,
                    requerimientoCategoria: draftCategory,
                    requerimientoTipoProyecto: draftProject,
                    requerimientoDescripcion: draftDescription,
                    requerimientoId: draftId,
                    requerimientoTotal: draftTotal,
                    requerimientoCategorias: draftSubCategory || [],
                    requerimientoPropietario: draftPropietarioResidente,
                    requerimientoCreated: draftCreated,
                    requerimientoPrioridad: draftPriority,
                    requerimientoTipoPropiedad: draftProperty,
                    requerimientoCantidadObra: draftRooms,
                    requerimientoPlanos: draftPlans,
                    requerimientoPermisos: draftPermissions,
                    requerimientoCiudad: draftCity,
                    requerimientoDireccion: draftDirection,
                    requerimientoCodigoPostal: draftPostalCode,
                    requerimientoAdjuntos: draftAtachments,
                    requerimientoMejorFecha: draftBestScheduleDate,
                    requerimientoMejorHora: draftBestScheduleTime,
                    requerimientoAplicaciones: draftApply ? draftApply : [],
                })

                const appliedQuotations = draftApply[0] || 0
                console.log('dataReq', data, data.draftApply)
                if (appliedQuotations !== 0) {
                    console.log('appliedQuotations', appliedQuotations)
                    fromQuotation(appliedQuotations)
                }
            }
            if (draftId !== ' ' && draftId !== undefined) {
                fromDraft(draftId)
                const draftData = sharingInformationService.getSubject()
                draftData.subscribe((data) => {
                    if (data) {
                        const { draft } = data
                        if (draft) {
                            console.log('LoadDraftData', draft)
                            LoadDraftData(draft)    
                        }                        
                        const quotationData =
                            sharingInformationService.getSubject()
                        quotationData.subscribe((data2) => {
                            if (data2) {
                                const { quotation } = data2
                                console.log(
                                    'readQuotationFromFirestore:',
                                    quotation
                                )
                                if (quotation?.length > 0) {
                                    setCotizacionesInfo({
                                        ...cotizacionesInfo,
                                        appliedQuotations: [quotation],
                                    })
                                }
                                setIsLoaded(true)
                            }
                        })
                    }
                })
            }
        }
    }, [draftId, cotizacionesInfo, requerimientoInfo, isLoaded])

    // TODO: implementar arrow function para descargar archivos adjuntos
    const handleDescargarAdjuntos = () => {}

    const handleSeeQuotation = (e, quotationId) => {
        e.preventDefault()
        navigate(`/app/ver-cotizacion/${quotationId}`)
    }
    const handleEditQuotation = (e, quotationId) => {
        e.preventDefault()
        navigate(`/app/editar-cotizacion/${quotationId}`)
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
        const draftParamId = requerimientoInfo.requerimientoId
        navigate(`/app/cotizacion/${draftParamId}`)
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
                                        Titulo:
                                        {requerimientoInfo.requerimientoTitulo}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoCategoria"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Categoria:
                                        {
                                            requerimientoInfo.requerimientoCategoria
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoTipoProyecto"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Tipo Proyecto:
                                        {
                                            requerimientoInfo.requerimientoTipoProyecto
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoDescripcion"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Descripción:
                                        {
                                            requerimientoInfo.requerimientoDescripcion
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoPropietario"
                                        className="w-100 detail-pill ps-3"
                                    >
                                        Propietario:
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
                                        Ciudad:
                                        {requerimientoInfo.requerimientoCiudad}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoDireccion"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Dirección:
                                        {
                                            requerimientoInfo.requerimientoDireccion
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoCodigoPostal"
                                        className="w-100 detail-pill ps-3"
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
                                        FECHA DE PUBLICACIÓN:
                                        {requerimientoInfo.requerimientoCreated}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoPrioridad"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Prioridad:
                                        {
                                            requerimientoInfo.requerimientoPrioridad
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoMejorFecha"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Calendario asignado:
                                        {
                                            requerimientoInfo.requerimientoMejorFecha
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoMejorHora"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Disponibilidad de horario:
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
                                        Tipo propiedad:
                                        {
                                            requerimientoInfo.requerimientoTipoPropiedad
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoCantidadObra"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Cantidad Obra:
                                        {
                                            requerimientoInfo.requerimientoCantidadObra
                                        }
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoPlanos"
                                        className="w-100 detail-pill ps-3 mb-2"
                                    >
                                        Planos:
                                        {requerimientoInfo.requerimientoPlanos}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        name="requerimientoPermisos"
                                        className="w-100 detail-pill ps-3"
                                    >
                                        Permisos:
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
                                        Archivos adjuntos
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
                                    COTIZACIONES
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
                                            cotizacionesInfo.appliedQuotations
                                                .length > 0 &&
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
                                                                {userAuthID ==
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
                                                                {rolAuth ===
                                                                    1 && (
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
                                                                )}
                                                            </TableCell>
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
