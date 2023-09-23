export { Page }
export { LayoutAppPaperbase as Layout } from '#@/app/components/LayoutAppPaperbase'

import React, { useState, useEffect } from 'react'
import { navigate } from 'vite-plugin-ssr/client/router'
import { auth } from '#@/firebase/firebaseClient'
import { usePageContext } from '#R/usePageContext'
import { AdjuntarArchivos } from '#@/app/components/AdjuntarArchivos'

import { readDraftFromFirestore } from '#@/services/readDraftFromFirestore.service'
import { readQuotationFromFirestore } from '#@/services/readQuotationFromFirestore.service'
import { updateDraftToFirestore } from '#@/services/updateDraftToFirestore.service'
import { sharingInformationService } from '#@/services/sharing-information'

import '../detalle_requerimiento.css'

import { TablaSubCategoriaPresupuesto } from '../Tabla_SubCategoria_Presupuesto'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const Page = () => {
    const user = auth?.currentUser || {}
    const userID = user?.uid || '' // Este es el id de la cuenta de Auth
    // const _storage = storage
    const pageContext = usePageContext()
    const { draftId } = pageContext.routeParams

    let selectRole
    useEffect(() => {
        // Perform localStorage action
        const localRole = localStorage.getItem('role')
        selectRole = parseInt(JSON.parse(localRole))
    }, [])
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
    const [isLoaded, setIsLoaded] = useState(false)

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

    const toDraft = (updateInfo, docId) => {
        updateDraftToFirestore({
            updateInfo,
            docId,
        })
    }

    const handleEnviar = () => {
        const updateInfo = requerimientoInfo
        const docId = requerimientoInfo.requerimientoId
        toDraft(updateInfo, docId)
        setIsLoaded(false)
        const draftData = sharingInformationService.getSubject()
        draftData.then((data) => {
            if (data) {
                const { sendDraft } = data
                console.log('updateDraftToFirestore:', sendDraft)
            }
        })
        navigate(-1)
    }

    useEffect(() => {
        if (!isLoaded) {
            console.log(draftId)
            const LoadDraftData = (data) => {
                const { draft } = data
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
                console.log('readDraftFromFirestore:', draft)
                setRequerimientoInfo({
                    ...requerimientoInfo,
                    requerimientoTitulo: draftName,
                    requerimientoCategoria: draftCategory,
                    requerimientoTipoProyecto: draftProject,
                    requerimientoDescripcion: draftDescription,
                    requerimientoId: draftId,
                    requerimientoTotal: draftTotal,
                    requerimientoCategorias: draftSubCategory,
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
                    requerimientoAplicaciones: draftApply,
                })
                // console.log(data, data.draftApply)
                const appliedQuotations = draftApply[0]
                fromQuotation(appliedQuotations)
            }

            if (draftId && draftId !== ' ' && draftId !== undefined) {
                fromDraft(draftId)
                const draftData = sharingInformationService.getSubject()
                draftData.then((data) => {
                    if (data) {
                        LoadDraftData(data)
                        const quotationData =
                            sharingInformationService.getSubject()
                        quotationData.subscribe((data2) => {
                            if (data2) {
                                const { quotation } = data2
                                console.log(
                                    'readQuotationFromFirestore:',
                                    quotation
                                )
                                setCotizacionesInfo({
                                    ...cotizacionesInfo,
                                    appliedQuotations: [quotation],
                                })
                                setIsLoaded(true)
                            }
                        })
                    }
                })
            }
        }
    }, [draftId, cotizacionesInfo, requerimientoInfo])

    const handleChange = (event) => {
        setRequerimientoInfo({
            ...requerimientoInfo,
            [event.target.name]: event.target.value,
        })
    }

    // TODO: implementar arrow function para descargar archivos adjuntos
    const handleAdjuntos = () => {}

    return (
        <>
            <Container fluid className="p-0">
                <Row className="h-100 pt-4 pb-4">
                    <Col className="col-10 cardFrame">
                        <Typography variant="h5" className="headline-xl p-4">
                            Editar Requerimiento
                        </Typography>
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
                                {/* TODO: Estado Select aplicado aprovado contratacion
                                liquidación */}
                                <TextField
                                    className="w-100 mb-4 mt-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="requerimientoTotal"
                                    name="requerimientoTotal"
                                    label="Total"
                                    value={requerimientoInfo.requerimientoTotal}
                                    onChange={handleChange}
                                    // defaultValue="@Ciudad"
                                />
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    align="start"
                                    className="p-description w-100"
                                >
                                    Categoria servicio
                                </Typography>
                                <TextField
                                    className="w-100 mb-4 mt-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="requerimientoTitulo"
                                    name="requerimientoTitulo"
                                    label="Titulo"
                                    value={
                                        requerimientoInfo.requerimientoTitulo
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@Titulo"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="requerimientoCategoria"
                                    name="requerimientoCategoria"
                                    label="Categoria"
                                    value={
                                        requerimientoInfo.requerimientoCategoria
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@Categoria"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="requerimientoTipoProyecto"
                                    name="requerimientoTipoProyecto"
                                    label="Tipo Proyecto?"
                                    value={
                                        requerimientoInfo.requerimientoTipoProyecto
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@TipoProyecto"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="requerimientoDescripcion"
                                    name="requerimientoDescripcion"
                                    label="Descripción"
                                    value={
                                        requerimientoInfo.requerimientoDescripcion
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@Descripción"
                                />
                                {/* <TextField
                                    className="w-100 mb-4"
                                    id="requerimientoPropietario"
                                    name="requerimientoPropietario"
                                    label="Propietario"
                                    value={
                                        requerimientoInfo.requerimientoPropietario
                                    }
                                    onChange={handleChange}
                                /> */}
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    align="start"
                                    className="p-description w-100"
                                >
                                    Ubicacion
                                </Typography>
                                <TextField
                                    className="w-100 mb-4 mt-4  fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="requerimientoCiudad"
                                    name="requerimientoCiudad"
                                    label="Ciudad"
                                    value={
                                        requerimientoInfo.requerimientoCiudad
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@Ciudad"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="requerimientoDireccion"
                                    name="requerimientoDireccion"
                                    label="Dirección"
                                    value={
                                        requerimientoInfo.requerimientoDireccion
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@Direccion"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="requerimientoCodigoPostal"
                                    name="requerimientoCodigoPostal"
                                    label="Codigo Postal"
                                    value={
                                        requerimientoInfo.requerimientoCodigoPostal
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@CodigoPostal"
                                />
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
                                <TextField
                                    className="w-100 mb-4 mt-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="requerimientoCreated"
                                    name="requerimientoCreated"
                                    label="Fecha de publicación"
                                    value={
                                        requerimientoInfo.requerimientoCreated
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@Created"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="requerimientoPrioridad"
                                    name="requerimientoPrioridad"
                                    label="Prioridad"
                                    value={
                                        requerimientoInfo.requerimientoPrioridad
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@PRIORIDAD"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="requerimientoMejorFecha"
                                    name="requerimientoMejorFecha"
                                    label="Calendario asignado"
                                    value={
                                        requerimientoInfo.requerimientoMejorFecha
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@PROPIETARIO"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="requerimientoMejorHora"
                                    name="requerimientoMejorHora"
                                    label="Disponibilidad de horario"
                                    value={
                                        requerimientoInfo.requerimientoMejorHora
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@PROPIETARIO"
                                />
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    align="start"
                                    className="p-description w-100"
                                >
                                    Descripción Propiedad
                                </Typography>
                                <TextField
                                    className="w-100 mb-4 mt-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="requerimientoTipoPropiedad"
                                    name="requerimientoTipoPropiedad"
                                    label="Tipo propiedad"
                                    value={
                                        requerimientoInfo.requerimientoTipoPropiedad
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@TipoPropiedad"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="requerimientoCantidadObra"
                                    name="requerimientoCantidadObra"
                                    label="Cantidad Obra"
                                    value={
                                        requerimientoInfo.requerimientoCantidadObra
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@CantidadObra"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="requerimientoPlanos"
                                    name="requerimientoPlanos"
                                    label="Planos"
                                    value={
                                        requerimientoInfo.requerimientoPlanos
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@PLANOS"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="requerimientoPermisos"
                                    name="requerimientoPermisos"
                                    label="Permisos"
                                    value={
                                        requerimientoInfo.requerimientoPermisos
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@PERMISOS"
                                />
                                {/* TODO: Agregar el handleAdjuntos*/}
                                <Typography
                                    variant="h6"
                                    className="p-description w-100 p-1"
                                >
                                    Archivos adjuntos
                                </Typography>
                                <Button
                                    className="btn btn-round btn-high"
                                    onClick={handleAdjuntos}
                                >
                                    Adjuntar
                                </Button>
                                <AdjuntarArchivos
                                    name={'draftAtachments'}
                                    multiple={true}
                                    idPerson={userID}
                                    rol={userRol.rol}
                                    route={`profiles/${userID}/draft`}
                                    functionState={setRequerimientoInfo}
                                    state={requerimientoInfo}
                                ></AdjuntarArchivos>
                            </Col>
                        </Row>
                        {/* TODO: Cambiar esta tabla por la de crear nuevo proyecto */}
                        <TablaSubCategoriaPresupuesto
                            requerimientoCategorias={
                                requerimientoInfo.requerimientoCategorias
                            }
                            requerimientoTotal={
                                requerimientoInfo.requerimientoTotal
                            }
                        />
                        <Row className="pb-4 w-100">
                            <Col className="">
                                <Button
                                    type="submit"
                                    className="btn btn-primary"
                                    onClick={handleEnviar}
                                >
                                    Guardar cambios
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
