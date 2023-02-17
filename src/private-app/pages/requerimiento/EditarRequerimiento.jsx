import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { auth } from '@/firebase/firebaseClient'
import AdjuntarArchivos from '../../components/AdjuntarArchivos'

import readDraftFromFirestore from '@/services/readUserFromFirestore.service'
import readQuotationFromFirestore from '@/services/readQuotationFromFirestore.service'
import updateDraftToFirestore from '@/services/updateDraftToFirestore.service'
import { sharingInformationService } from '@/services/sharing-information'

import './detalle_requerimiento.css'

import TablaSubCategoriaPresupuesto from './Tabla_SubCategoria_Presupuesto'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const EditarRequerimiento = () => {
    const user = auth.currentUser || {}
    const userID = user.uid || '' // Este es el id de la cuenta de Auth
    const navigate = useNavigate()
    const { state } = useLocation() || {}
    const { draftId } = state || ' '
    // const _storage = storage

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
        const draftData = sharingInformationService.getSubject()
        draftData.then((data) => {
            if (!!data) {
                console.log('Detail load:', data)
            }
        })
        navigate(-1)
    }

    useEffect(() => {
        console.log(draftId)
        if (draftId && draftId !== ' ' && draftId !== undefined) {
            fromDraft(draftId)
            const draftData = sharingInformationService.getSubject()
            draftData.then((data) => {
                if (!!data) {
                    console.log('Detail load:', data)
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
                    const appliedQuotations = data.draftApply[0]
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
                                    Archivos adjuntos{' '}
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

export default EditarRequerimiento
