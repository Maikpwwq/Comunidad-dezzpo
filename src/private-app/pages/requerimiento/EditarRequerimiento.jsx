import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { firestore, auth } from '../../../firebase/firebaseClient'
import { collection, doc, getDocFromServer, setDoc } from 'firebase/firestore'
import AdjuntarArchivos from '../../components/AdjuntarArchivos'

import TablaSubCategoriaPresupuesto from './Tabla_SubCategoria_Presupuesto'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

const EditarRequerimiento = () => {
    const user = auth.currentUser || {}
    const userID = user.uid || '' // Este es el id de la cuenta de Auth
    const navigate = useNavigate()
    const { state } = useLocation() || {}
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

    // TODO: draftToFirestore implementation
    const draftToFirestore = async (updateInfo, docId) => {
        const draftData = await setDoc(doc(draftRef, docId), updateInfo)
        return draftData
    }

    const handleEnviar = () => {
        const snap = draftToFirestore(
            requerimientoInfo,
            requerimientoInfo.requerimientoId
        )
        console.log(snap)
        navigate(-1)
    }

    useEffect(() => {
        console.log(draftId)
        if (draftId && draftId !== ' ' && draftId !== undefined) {
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
                    <Col className="col-10">
                        <h4 className="headline-xl">Editar Requerimiento</h4>
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
                                    onChange={handleChange}
                                    // defaultValue="@Ciudad"
                                />
                                {/* // id */}
                                <p className="p-description">
                                    Categoria servicio
                                </p>
                                <TextField
                                    className="w-100 mb-2"
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
                                    className="w-100 mb-2"
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
                                    className="w-100 mb-2"
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
                                    className="w-100 mb-2"
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
                                    className="w-100 mb-2"
                                    id="requerimientoPropietario"
                                    name="requerimientoPropietario"
                                    label="Propietario"
                                    value={
                                        requerimientoInfo.requerimientoPropietario
                                    }
                                    onChange={handleChange}
                                /> */}
                                <p className="p-description">Ubicacion</p>
                                <TextField
                                    className="w-100 mb-2"
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
                                    className="w-100 mb-2"
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
                                    className="w-100 mb-2"
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
                                <p className="p-description">Programación</p>
                                <TextField
                                    className="w-100 mb-2"
                                    id="requerimientoCreated"
                                    name="requerimientoCreated"
                                    label="FECHA DE PUBLICACIÓN"
                                    value={
                                        requerimientoInfo.requerimientoCreated
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@Created"
                                />
                                <TextField
                                    className="w-100 mb-2"
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
                                    className="w-100 mb-2"
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
                                    className="w-100 mb-2"
                                    id="requerimientoMejorHora"
                                    name="requerimientoMejorHora"
                                    label="Disponibilidad de horario"
                                    value={
                                        requerimientoInfo.requerimientoMejorHora
                                    }
                                    onChange={handleChange}
                                    // defaultValue="@PROPIETARIO"
                                />
                                <p className="p-description">
                                    Descripción Propiedad
                                </p>
                                <TextField
                                    className="w-100 mb-2"
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
                                    className="w-100 mb-2"
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
                                    className="w-100 mb-2"
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
                                    className="w-100 mb-2"
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
                                <h4 className=".headline-l pt-4">
                                    Archivos adjuntos{' '}
                                </h4>
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
