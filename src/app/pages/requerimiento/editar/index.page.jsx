export { Page }
export { LayoutAppPaperbase as Layout } from '#@/app/components/LayoutAppPaperbase'

import React, { useState, useEffect, useContext } from 'react'
import { UserAuthContext } from '#@/providers/UserAuthProvider'
import { navigate } from 'vike/client/router'
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
    const { currentUser, updateUser } = useContext(UserAuthContext)
    const userAuthID = currentUser?.userId  // Este es el id de la cuenta de Auth
    // const userAuthName = currentUser?.displayName  // Este es el id de la cuenta de Auth

    // const _storage = storage
    const pageContext = usePageContext()
    const { draftId } = pageContext.routeParams

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
        draftName: '',
                    draftCategory: '',
                    draftProject: '',
                    draftDescription: '',
                    draftId: draftId,
                    draftTotal: 0,
                    draftSubCategory: [],
                    draftPropietarioResidente: '',
                    draftCreated: '',
                    draftPriority: '',
                    draftProperty: '',
                    draftRooms: '',
                    draftPlans: '',
                    draftPermissions: '',
                    draftCity: '',
                    draftDirection: '',
                    draftPostalCode: '',
                    draftAtachments: '',
                    draftBestScheduleDate: '',
                    draftBestScheduleTime: '',
                    draftApply: [],
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
        draftData?.then((data) => {
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
            const LoadDraftData = (draft) => {
                // const { draft } = data
                // const {
                //     draftName,
                //     draftCategory,
                //     draftProject,
                //     draftDescription,
                //     draftId,
                //     draftTotal,
                //     draftSubCategory,
                //     draftPropietarioResidente,
                //     draftCreated,
                //     draftPriority,
                //     draftProperty,
                //     draftRooms,
                //     draftPlans,
                //     draftPermissions,
                //     draftCity,
                //     draftDirection,
                //     draftPostalCode,
                //     draftAtachments,
                //     draftBestScheduleDate,
                //     draftBestScheduleTime,
                //     draftApply,
                // } = draft
                // console.log('readDraftFromFirestore:', draft)
                setRequerimientoInfo({
                    ...requerimientoInfo,
                    draft
                })
                // console.log(data, data.draftApply)
                const appliedQuotations = draft.draftApply[0] || 0
                console.log('dataReq', draft, draft.draftApply)
                if (appliedQuotations !== 0) {
                    console.log('appliedQuotations', appliedQuotations)
                    fromQuotation(appliedQuotations)
                }
            }

            if (draftId && draftId !== ' ' && draftId !== undefined) {
                fromDraft(draftId)
                const draftData = sharingInformationService.getSubject()
                draftData.subscribe((data) => {
                    if (data) {
                        const { draft } = data
                        if (draft) {
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
                                    id="draftTotal"
                                    name="draftTotal"
                                    label="Total"
                                    value={requerimientoInfo.draftTotal}
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
                                    id="draftName"
                                    name="draftName"
                                    label="Titulo"
                                    value={
                                        requerimientoInfo.draftName
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@Titulo"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="draftCategory"
                                    name="draftCategory"
                                    label="Categoria"
                                    value={
                                        requerimientoInfo.draftCategory
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@Categoria"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="draftProject"
                                    name="draftProject"
                                    label="Tipo Proyecto?"
                                    value={
                                        requerimientoInfo.draftProject
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@TipoProyecto"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="draftDescription"
                                    name="draftDescription"
                                    label="Descripción"
                                    value={
                                        requerimientoInfo.draftDescription
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
                                        requerimientoInfo.draftPropietarioResidente
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
                                    id="draftCity"
                                    name="draftCity"
                                    label="Ciudad"
                                    value={
                                        requerimientoInfo.draftCity
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@Ciudad"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="draftDirection"
                                    name="draftDirection"
                                    label="Dirección"
                                    value={
                                        requerimientoInfo.draftDirection
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@Direccion"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="draftPostalCode"
                                    name="draftPostalCode"
                                    label="Codigo Postal"
                                    value={
                                        requerimientoInfo.draftPostalCode
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
                                    id="draftCreated"
                                    name="draftCreated"
                                    label="Fecha de publicación"
                                    value={
                                        requerimientoInfo.draftCreated
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@Created"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="draftPriority"
                                    name="draftPriority"
                                    label="Prioridad"
                                    value={
                                        requerimientoInfo.draftPriority
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@PRIORIDAD"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="draftBestScheduleDate"
                                    name="draftBestScheduleDate"
                                    label="Calendario asignado"
                                    value={
                                        requerimientoInfo.draftBestScheduleDate
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@PROPIETARIO"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="draftBestScheduleTime"
                                    name="draftBestScheduleTime"
                                    label="Disponibilidad de horario"
                                    value={
                                        requerimientoInfo.draftBestScheduleTime
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
                                    id="draftProperty"
                                    name="draftProperty"
                                    label="Tipo propiedad"
                                    value={
                                        requerimientoInfo.draftProperty
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@TipoPropiedad"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="draftRooms"
                                    name="draftRooms"
                                    label="Cantidad Obra"
                                    value={
                                        requerimientoInfo.draftRooms
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@CantidadObra"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="draftPlans"
                                    name="draftPlans"
                                    label="Planos"
                                    value={
                                        requerimientoInfo.draftPlans
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@PLANOS"
                                />
                                <TextField
                                    className="w-100 mb-4 fondoBlanco"
                                    style={{ borderRadius: '15px' }}
                                    id="draftPermissions"
                                    name="draftPermissions"
                                    label="Permisos"
                                    value={
                                        requerimientoInfo.draftPermissions
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
                                    idPerson={userAuthID}
                                    rol={rolAuth}
                                    route={`profiles/${userAuthID}/draft`}
                                    functionState={setRequerimientoInfo}
                                    state={requerimientoInfo}
                                ></AdjuntarArchivos>
                            </Col>
                        </Row>
                        {/* TODO: Cambiar esta tabla por la de crear nuevo proyecto */}
                        <TablaSubCategoriaPresupuesto
                            requerimientoCategorias={
                                requerimientoInfo.draftSubCategory
                            }
                            requerimientoTotal={
                                requerimientoInfo.draftTotal
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
