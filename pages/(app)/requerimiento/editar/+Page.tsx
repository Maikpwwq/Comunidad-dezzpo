import React, { useState, useEffect } from 'react'
// Hooks
import { usePageContext } from '@hooks/usePageContext'
import { useAuth } from '@hooks/useAuth'
// Services
import { getDraft, updateDraft } from '@services/drafts'
// Components
// @ts-ignore
import { AdjuntarArchivos } from '@components/common'
import TablaSubCategoriaPresupuesto from '../components/TablaSubCategoriaPresupuesto'
// Bootstrap
import { Row, Col, Container } from 'react-bootstrap'
// MUI
import { Button, TextField, Typography } from '@mui/material'
// CSS
export default function Page() {
    const { currentUser } = useAuth()
    const userAuthID = currentUser?.userId
    const userAuthRol = currentUser?.role
    const pageContext = usePageContext()
    const { draftId } = pageContext.routeParams
    const [rolAuth, setRolAuth] = useState<number | undefined>(userAuthRol as number | undefined)
    useEffect(() => {
        const localRole = localStorage.getItem('role')
        if (localRole) {
            try {
                if (localRole !== "undefined" && localRole !== null) {
                    const selectRole = parseInt(JSON.parse(localRole))
                    if (!isNaN(selectRole)) {
                        setRolAuth(selectRole)
                    }
                }
            } catch (e) {
                console.error('Error parsing role', e)
            }
        }
    }, [])
    const [formData, setFormData] = useState<any>({
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
        draftAtachments: [],
        draftBestScheduleDate: '',
        draftBestScheduleTime: '',
        draftApply: [],
    })
    const [isLoaded, setIsLoaded] = useState(false)
    const handleEnviar = async () => {
        if (!draftId) return
        try {
            await updateDraft({
                draftId: draftId,
                data: formData
            });
            console.log('Draft updated successfully');
            setIsLoaded(false);
            window.history.back();
        } catch (error) {
            console.error('Error updating draft:', error);
        }
    }
    const fetchDraftData = async () => {
        if (!draftId) return;
        try {
            const draft = await getDraft({ draftId });
            if (draft) {
                setFormData((prev: any) => ({
                    ...prev,
                    ...draft
                }));
                setIsLoaded(true);
            }
        } catch (error) {
            console.error('Error fetching draft:', error);
        }
    };
    useEffect(() => {
        if (!isLoaded && draftId) {
            fetchDraftData();
        }
    }, [draftId, isLoaded]);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        })
    }
    const handleAdjuntos = () => { }
    return (
        <Container fluid className="p-0">
            <Row className="h-100 pt-4 pb-4">
                <Col className="col-10 card-frame">
                    <Typography variant="h5" className="headline-xl p-4">
                        Editar Requerimiento
                    </Typography>
                    <Row className="p-0 pt-4 pb-4 w-100 align-items-start">
                        <Col className="col" md={6} sm={12}>
                            <Typography
                                gutterBottom
                                variant="h6"
                                align="left"
                                className="p-description w-100"
                            >
                                Presupuesto
                            </Typography>
                            <TextField
                                className="w-100 mb-4 mt-4 bg-blanco"
                                style={{ borderRadius: '15px' }}
                                id="draftTotal"
                                name="draftTotal"
                                label="Total"
                                value={formData.draftTotal || 0}
                                onChange={handleChange}
                            />
                            <Typography
                                gutterBottom
                                variant="h6"
                                align="left"
                                className="p-description w-100"
                            >
                                Categoria servicio
                            </Typography>
                            <TextField
                                className="w-100 mb-4 mt-4 bg-blanco"
                                style={{ borderRadius: '15px' }}
                                id="draftName"
                                name="draftName"
                                label="Titulo"
                                value={formData.draftName || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                className="w-100 mb-4 bg-blanco"
                                style={{ borderRadius: '15px' }}
                                id="draftCategory"
                                name="draftCategory"
                                label="Categoria"
                                value={formData.draftCategory || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                className="w-100 mb-4 bg-blanco"
                                style={{ borderRadius: '15px' }}
                                id="draftProject"
                                name="draftProject"
                                label="Tipo Proyecto?"
                                value={formData.draftProject || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                className="w-100 mb-4 bg-blanco"
                                style={{ borderRadius: '15px' }}
                                id="draftDescription"
                                name="draftDescription"
                                label="Descripción"
                                value={formData.draftDescription || ''}
                                onChange={handleChange}
                            />
                            <Typography
                                gutterBottom
                                variant="h6"
                                align="left"
                                className="p-description w-100"
                            >
                                Ubicacion
                            </Typography>
                            <TextField
                                className="w-100 mb-4 mt-4  bg-blanco"
                                style={{ borderRadius: '15px' }}
                                id="draftCity"
                                name="draftCity"
                                label="Ciudad"
                                value={formData.draftCity || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                className="w-100 mb-4 bg-blanco"
                                style={{ borderRadius: '15px' }}
                                id="draftDirection"
                                name="draftDirection"
                                label="Dirección"
                                value={formData.draftDirection || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                className="w-100 mb-4 bg-blanco"
                                style={{ borderRadius: '15px' }}
                                id="draftPostalCode"
                                name="draftPostalCode"
                                label="Codigo Postal"
                                value={formData.draftPostalCode || ''}
                                onChange={handleChange}
                            />
                        </Col>
                        <Col className="col" md={6} sm={12}>
                            <Typography
                                gutterBottom
                                variant="h6"
                                align="left"
                                className="p-description w-100"
                            >
                                Programación
                            </Typography>
                            <TextField
                                className="w-100 mb-4 mt-4 bg-blanco"
                                style={{ borderRadius: '15px' }}
                                id="draftCreated"
                                name="draftCreated"
                                label="Fecha de publicación"
                                value={formData.draftCreated || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                className="w-100 mb-4 bg-blanco"
                                style={{ borderRadius: '15px' }}
                                id="draftPriority"
                                name="draftPriority"
                                label="Prioridad"
                                value={formData.draftPriority || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                className="w-100 mb-4 bg-blanco"
                                style={{ borderRadius: '15px' }}
                                id="draftBestScheduleDate"
                                name="draftBestScheduleDate"
                                label="Calendario asignado"
                                value={formData.draftBestScheduleDate || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                className="w-100 mb-4 bg-blanco"
                                style={{ borderRadius: '15px' }}
                                id="draftBestScheduleTime"
                                name="draftBestScheduleTime"
                                label="Disponibilidad de horario"
                                value={formData.draftBestScheduleTime || ''}
                                onChange={handleChange}
                            />
                            <Typography
                                gutterBottom
                                variant="h6"
                                align="left"
                                className="p-description w-100"
                            >
                                Descripción Propiedad
                            </Typography>
                            <TextField
                                className="w-100 mb-4 mt-4 bg-blanco"
                                style={{ borderRadius: '15px' }}
                                id="draftProperty"
                                name="draftProperty"
                                label="Tipo propiedad"
                                value={formData.draftProperty || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                className="w-100 mb-4 bg-blanco"
                                style={{ borderRadius: '15px' }}
                                id="draftRooms"
                                name="draftRooms"
                                label="Cantidad Obra"
                                value={formData.draftRooms || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                className="w-100 mb-4 bg-blanco"
                                style={{ borderRadius: '15px' }}
                                id="draftPlans"
                                name="draftPlans"
                                label="Planos"
                                value={formData.draftPlans || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                className="w-100 mb-4 bg-blanco"
                                style={{ borderRadius: '15px' }}
                                id="draftPermissions"
                                name="draftPermissions"
                                label="Permisos"
                                value={formData.draftPermissions || ''}
                                onChange={handleChange}
                            />
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
                            {userAuthID && (
                                <AdjuntarArchivos
                                    name={'draftAtachments'}
                                    multiple={true}
                                    idPerson={userAuthID}
                                    rol={rolAuth}
                                    route={`profiles/${userAuthID}/draft`}
                                    functionState={setFormData}
                                    state={formData}
                                ></AdjuntarArchivos>
                            )}
                        </Col>
                    </Row>
                    <TablaSubCategoriaPresupuesto
                        draftSubCategory={formData.draftSubCategory}
                        draftTotal={formData.draftTotal}
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
    )
}
