import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { firestore, storage } from '../../../firebase/firebaseClient'
import { collection, doc, getDocFromServer } from 'firebase/firestore'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

const Requerimiento = () => {
    const { state } = useLocation() || {}
    const { draftId } = state || ' '
    const _firestore = firestore
    // const _storage = storage
    const draftRef = collection(_firestore, 'drafts')

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
    })

    const draftFromFirestore = async (projectID) => {
        const draftData = await getDocFromServer(doc(draftRef, projectID))
        console.log(draftData)
        return draftData
    }

    useEffect(() => {
        console.log(draftId)
        if (draftId !== ' ' && draftId !== undefined) {
            const snap = draftFromFirestore(draftId)
            snap.then((docSnap) => {
                // docSnap.exists()
                console.log(docSnap)
                if (docSnap) {
                    // docSnap._document.data...
                    const data = docSnap.data()
                    console.log(data)
                    if (data) {
                        setRequerimientoInfo({
                            ...requerimientoInfo,
                            requerimientoTitulo: data.draftName,
                            requerimientoCategoria: data.draftCategory,
                            requerimientoTipoProyecto: data.draftProject,
                            requerimientoDescripcion: data.draftDescription,
                            requerimientoId: data.draftId,
                            requerimientoTotal: data.draftTotal,
                            requerimientoSubCategory: data.draftSubCategory,
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
                        })
                    }
                }
            })
        }
    }, [draftId])

    return (
        <>
            <Container fluid className="p-0">
                <Row className="h-100 pt-4 pb-4">
                    <Col className="col-10">
                        <span className="p-description">
                            Detalle Requerimiento
                        </span>
                        Estado
                        {/* // Select aplicado aprovado contratacion
                        liquidación */}
                        <Row>
                            <Col className="col-4">
                                {/* // id */}
                                <TextField
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
                                    id="requerimientoPropietario"
                                    name="requerimientoPropietario"
                                    label="Propietario"
                                    value={
                                        requerimientoInfo.requerimientoPropietario
                                    }
                                    // defaultValue="@PROPIETARIO"
                                    variant="filled"
                                />
                            </Col>
                            <Col className="col-4">
                                <TextField
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
                                    id="requerimientoPropietario"
                                    name="requerimientoPropietario"
                                    label="Disponibilidad de horario"
                                    value={
                                        requerimientoInfo.requerimientoPropietario
                                    }
                                    // defaultValue="@PROPIETARIO"
                                    variant="filled"
                                />
                                <TextField
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
                                    id="requerimientoPermisos"
                                    name="requerimientoPermisos"
                                    label="Permisos"
                                    value={
                                        requerimientoInfo.requerimientoPermisos
                                    }
                                    // defaultValue="@PERMISOS"
                                    variant="filled"
                                />
                            </Col>
                            <Col className="col-4">
                                <h4>Ubicacion</h4>
                                <TextField
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
                        </Row>
                        <Row>
                            <Col>
                                <h4 className=".headline-l">COTIZACIONES </h4>
                                <Button className="btn btn-round btn-high">
                                    DESCARGAR COTIZACION
                                </Button>
                                - + ASIGNAR NUEVA COTIZACION
                                <h4 className=".headline-l">
                                    Archivos adjuntos{' '}
                                </h4>
                                <Button className="btn btn-round btn-high">
                                    Descargar
                                </Button>
                                <Button
                                    className="BOTON-TEXT textBlanco"
                                    variant="primary"
                                    type="submit"
                                    // onClick={}
                                >
                                    REALIZA UNA PREGUNTA ABIERTA AL PROPIETARÍO
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Requerimiento
