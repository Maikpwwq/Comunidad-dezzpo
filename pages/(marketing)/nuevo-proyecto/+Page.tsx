import { useState, useEffect, type ChangeEvent } from 'react' // Fix type import
// ... other imports
// @ts-ignore
import { AdjuntarArchivos } from '@components/common'
import { v4 as uuidv4 } from 'uuid'
import { navigate } from 'vike/client/router'
import { usePageContext } from '@hooks/usePageContext'
import { getUser } from '@services/users'
import { useAuth } from '@hooks/useAuth'
// Firebase
import {
    collection,
    doc,
    setDoc,
} from 'firebase/firestore'
import { firestore, isFirebaseAvailable } from '@services/firebase'
// Components
import {
    CategorySelector,
    PROJECT_TYPES
} from '@features/projects'
// Features
import { PasoAPaso, Ubicacion } from '@features/marketing'
import PageRegistro from '../../(auth)/registro/+Page'
import PageIngreso from '../../(auth)/ingreso/+Page'
// Styles
// Bootstrap
// Bootstrap
import { Row, Col, Container, Button, Form } from 'react-bootstrap'
// MUI
// MUI
import { Box, Modal, Typography } from '@mui/material'
import AddLocationIcon from '@mui/icons-material/AddLocation'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import type { ProjectDraftInfo } from '@features/projects'

interface DraftInfo extends ProjectDraftInfo {
    draftCategory: string | number | undefined
    draftSubCategory: any
    draftProject: string | undefined
    draftId: string
    draftTotal: number
    draftName: string
    draftDescription: string
    draftPropietarioResidente: string
    draftCreated: string
    draftPriority: string
    draftCity: string
    draftDirection: string
    draftSize: string
    draftRooms: string
    draftPlans: string
    draftPermissions: string
    draftAtachments: any
    draftBestScheduleDate: string
    draftBestScheduleTime: string
    draftProperty: string
    draftPostalCode: string
    draftApply: any[]
    [key: string]: any
}
export default function Page() {
    const draftID = uuidv4()
    const { currentUser } = useAuth()
    const userId = currentUser?.userId || ''
    const pageContext = usePageContext()
    const paramCategoriaProfesional = pageContext.routeParams?.CategoriaProfesional
    const paramTipoProyecto = pageContext.routeParams?.TipoProyecto
    const [hideRegister] = useState(!!currentUser?.isAuth)
    const [showMore, setShowMore] = useState(false)
    const [userAddress, setUserAddress] = useState('')
    // Firestore refs removed from top level to avoid SSR crash
    const [activeStep, setActiveStep] = useState(0)
    const [draftInfo, setDraftInfo] = useState<DraftInfo>({
        draftCategory: paramCategoriaProfesional || 0,
        draftSubCategory: '',
        draftProject: paramTipoProyecto || undefined,
        draftId: draftID,
        draftTotal: 0,
        draftName: '',
        draftDescription: '',
        draftPropietarioResidente: userId,
        draftCreated: '',
        draftPriority: '',
        draftCity: '',
        draftDirection: '',
        draftSize: '',
        draftRooms: '',
        draftPlans: '',
        draftPermissions: '',
        draftAtachments: '',
        draftBestScheduleDate: '',
        draftBestScheduleTime: '',
        draftProperty: '',
        draftPostalCode: '',
        draftApply: [],
    })
    const [openModal, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleCloseModal = () => setOpen(false)
    // navigation handlers removed
    const draftToFirestore = async (updateInfo: DraftInfo, projectID: string) => {
        if (!isFirebaseAvailable() || !firestore) {
            console.warn('[SSR] draftToFirestore skipped - Firebase not available')
            return
        }
        const draftRef = collection(firestore, 'drafts')
        await setDoc(doc(draftRef, projectID), updateInfo, { merge: true })
    }
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search)
        const type = searchParams.get('type')
        const category = searchParams.get('category')
        const queryQ = searchParams.get('q')

        setDraftInfo(prev => {
            const nextDraft = { ...prev }
            if (type) nextDraft.draftProject = type
            if (category) nextDraft.draftCategory = category
            if (queryQ && !nextDraft.draftDescription) {
                nextDraft.draftDescription = queryQ
            }
            return nextDraft
        })
    }, [])

    // Fetch logged in user's address
    useEffect(() => {
        const fetchAddress = async () => {
            if (currentUser?.isAuth && userId) {
                try {
                    const userRole = (currentUser as any)?.role === 2 ? 2 : 1;
                    const userData = await getUser({ userId, role: userRole })
                    if (userData?.userDirection) {
                        const addr = userData.userCiudad 
                            ? `${userData.userDirection}, ${userData.userCiudad}` 
                            : userData.userDirection
                        setUserAddress(addr)
                    }
                } catch (e) {
                    console.error('Error fetching user address:', e)
                }
            }
        }
        fetchAddress()
    }, [currentUser, userId])

    const handleShowMore = () => {
        setShowMore(!showMore)
    }
    const handleAuthSuccess = () => {
        goForward()
    }
    const handleSave = () => {
        const currentDate = new Date().toISOString().split('T')[0] || ''
        const finalDraftInfo = {
            ...draftInfo,
            draftCreated: currentDate,
            draftCreatedAt: currentDate,
        }
        const snap = draftToFirestore(finalDraftInfo, draftInfo.draftId)
        snap.then(() => {
            navigate('/app/directorio-requerimientos')
        })
    }
    const goForward = () => {
        if (activeStep < steps.length) {
            let active = activeStep + 1
            setActiveStep(active)
        }
        // Save to local storage
        if (typeof window !== 'undefined') {
            localStorage.setItem('requerimiento', JSON.stringify(draftInfo))
        }
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setDraftInfo((prev: DraftInfo) => ({
            ...prev,
            [name]: value,
        }))
    }
    const handleComeBack = () => {
        if (activeStep > 0) {
            let active = activeStep - 1
            setActiveStep(active)
        } else {
            // If on step 0, 'volver atras' should return to the previous page
            if (typeof window !== 'undefined') {
                window.history.back()
            }
        }
    }
    const handleUpdateDraftInfo = (info: ProjectDraftInfo) => {
        setDraftInfo((prev) => ({
            ...prev,
            ...info,
        }))
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href)
            let changed = false
            if (info.draftProject) { url.searchParams.set('type', String(info.draftProject)); changed = true }
            if (info.draftCategory) { url.searchParams.set('category', String(info.draftCategory)); changed = true }
            if (changed) window.history.replaceState({}, '', url.toString())
        }
    }

    const steps = !hideRegister
        ? ['¿Qué necesitas?', 'Regístrate', 'Detalles opcionales']
        : ['¿Qué necesitas?', 'Detalles opcionales']
    return (
        <Container fluid className="p-0 new-project-page" style={{ position: 'relative' }}>
            <PasoAPaso activeStep={activeStep} steps={steps} />
            {activeStep === 0 && (
                <Row className="justify-content-center w-100 m-0 p-4">
                    <Col xl={6} lg={8} md={10} sm={12} className="card-frame p-4">
                            <Typography className="type-section-title w-100 center mb-4">
                                ¿Qué necesitas?
                            </Typography>
                            <Form>
                                <Form.Group className="mb-3" controlId="formQuickDescription">
                                    <Form.Label className="type-body-sm fw-bold">
                                        Describe brevemente lo que necesitas *
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        style={{ height: '100px' }}
                                        placeholder="Ej: Se me rompió un tubo en el baño y necesito un plomero urgente"
                                        name="draftDescription"
                                        value={draftInfo.draftDescription}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formQuickZone">
                                    <Form.Label className="type-body-sm fw-bold">
                                        ¿En qué zona de Bogotá? *
                                    </Form.Label>
                                    <Form.Select
                                        name="draftCity"
                                        value={draftInfo.draftCity}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecciona tu zona</option>
                                        <option value="Bogotá">Bogotá (toda la ciudad)</option>
                                        <option value="Bogotá Norte">Bogotá Norte</option>
                                        <option value="Bogotá Sur">Bogotá Sur</option>
                                        <option value="Bogotá Centro">Bogotá Centro</option>
                                        <option value="Bogotá Occidente">Bogotá Occidente</option>
                                        <option value="Suba">Suba</option>
                                        <option value="Usaquén">Usaquén</option>
                                        <option value="Chapinero">Chapinero</option>
                                        <option value="Kennedy">Kennedy</option>
                                        <option value="Engativá">Engativá</option>
                                        <option value="Fontibón">Fontibón</option>
                                        <option value="Teusaquillo">Teusaquillo</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formQuickProjectType">
                                    <Form.Label className="type-body-sm fw-bold">
                                        ¿Qué tipo de proyecto es? *
                                    </Form.Label>
                                    <Form.Select
                                        name="draftProject"
                                        value={draftInfo.draftProject || ''}
                                        onChange={handleChange}
                                    >
                                        {PROJECT_TYPES.map(({ value, label }) => (
                                            <option key={value || 'empty'} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formQuickCategory">
                                    <Form.Label className="type-body-sm fw-bold">
                                        ¿Qué tipo de profesional necesitas? *
                                    </Form.Label>
                                    <CategorySelector
                                        setDraftInfo={handleUpdateDraftInfo}
                                        draftInfo={draftInfo}
                                        className="mt-1"
                                    />
                                </Form.Group>

                                <Row className="pt-4 pb-4 w-100 justify-content-center">
                                    <Button
                                        onClick={goForward}
                                        className="btn-primary-gradient p-2 ps-4 pe-4 w-auto"
                                        variant="primary"
                                        disabled={
                                            !draftInfo.draftDescription.trim() ||
                                            !draftInfo.draftCity ||
                                            !draftInfo.draftProject ||
                                            !draftInfo.draftCategory ||
                                            draftInfo.draftCategory === 0
                                        }
                                    >
                                        Continuar
                                    </Button>
                                </Row>
                            </Form>
                        </Col>
                </Row>
            )}
            {/* Step 1 (unauthenticated): Registration / Login */}
            {!hideRegister && activeStep === 1 && (
                <Row className="nuevo-proyecto-mensaje w-100 m-0">
                    <Col className="p-4 col-12 text-center">
                        <h3 className="type-hero-title text-dark">
                            Ingresa tus datos de contacto para continuar
                        </h3>
                        <p className="type-body text-muted">
                            Regístrate o inicia sesión para guardar tu requerimiento y recibir cotizaciones de comerciantes calificados.
                        </p>
                    </Col>
                    <PageRegistro
                        setDraftInfo={(info: any) => setDraftInfo(info)}
                        draftInfo={draftInfo}
                        handleSave={handleAuthSuccess}
                        showLogo={false}
                    />
                    <PageIngreso
                        setDraftInfo={(info: any) => setDraftInfo(info)}
                        draftInfo={draftInfo}
                        handleSave={handleAuthSuccess}
                        showLogo={false}
                    />
                    <Col className="col-12 text-center pb-4">
                        <Button
                            onClick={handleComeBack}
                            className="btn-round btn-middle w-auto"
                            variant="secondary"
                        >
                            <KeyboardBackspaceIcon /> Volver atrás
                        </Button>
                    </Col>
                </Row>
            )}

            {/* Step 1 (authenticated) or Step 2 (unauthenticated): Detalles opcionales (Enrichment) */}
            {((hideRegister && activeStep === 1) || (!hideRegister && activeStep === 2)) && (
                <Row className="justify-content-center w-100 m-0 p-4">
                    <Col xl={8} lg={10} md={12} className="card-frame p-4">
                            <Typography className="type-section-title w-100 center mb-4">
                                Detalles opcionales de tu proyecto
                            </Typography>
                            <Form>
                                {/* Title / Name */}
                                <Form.Group className="mb-3" controlId="formNewProjectName">
                                    <Form.Label className="type-body-sm fw-bold">Dale un título descriptivo a tu requerimiento</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ej: Pintar fachada de dos pisos"
                                        name="draftName"
                                        value={draftInfo.draftName}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                {/* Toggle optional details */}
                                <Typography color="text.secondary" className="type-body-sm fw-bold pb-2" onClick={handleShowMore} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {showMore ? 'Ocultar especificaciones detalladas' : 'Especificar tamaño, tipo de propiedad, habitaciones, planos...'}
                                    {showMore ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </Typography>

                                {showMore && (
                                    <Box className="ps-3 border-start border-2 border-success mb-3">
                                        <Form.Group className="mb-3" controlId="formNewProjectSize">
                                            <Form.Label className="type-body-sm fw-bold">Escoge el tamaño</Form.Label>
                                            <Form.Select name="draftSize" value={draftInfo.draftSize} onChange={handleChange}>
                                                <option value="">Selecciona el tamaño del proyecto</option>
                                                <option value="sencillo">Sencillo</option>
                                                <option value="mediano">Mediano</option>
                                                <option value="doble">Doble</option>
                                                <option value="grande">Grande</option>
                                                <option value="Otra">Otro</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formNewProjectProperty">
                                            <Form.Label className="type-body-sm fw-bold">¿Qué tipo de propiedad es?</Form.Label>
                                            <Form.Select name="draftProperty" value={draftInfo.draftProperty} onChange={handleChange}>
                                                <option value="">Selecciona el tipo de propiedad</option>
                                                <option value="Colonial">Propiedad Colonial (1800 - 1920)</option>
                                                <option value="SubUrbana">Propiedad suburbana (1920-1960)</option>
                                                <option value="Moderna">Propiedad moderna (1960-presente)</option>
                                                <option value="Otra">Otra</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formNewProjectRooms">
                                            <Form.Label className="type-body-sm fw-bold">¿Cuántas habitaciones y/o espacios serán intervenidos?</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Ej: Sala y comedor"
                                                name="draftRooms"
                                                value={draftInfo.draftRooms}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formNewProjectPlans">
                                            <Form.Label className="type-body-sm fw-bold">¿Han sido diseñados planos arquitectónicos?</Form.Label>
                                            <Form.Select name="draftPlans" value={draftInfo.draftPlans} onChange={handleChange}>
                                                <option value="">Selecciona el estado actual</option>
                                                <option value="Aproved">Aprobados</option>
                                                <option value="Aplied">Aplicado</option>
                                                <option value="NotAplied">Sin aplicar aún</option>
                                                <option value="NotSure">No estoy seguro</option>
                                                <option value="NotNeed">No son necesarios</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formNewProjectPermissions">
                                            <Form.Label className="type-body-sm fw-bold">¿Cuál es el estado de los permisos?</Form.Label>
                                            <Form.Select name="draftPermissions" value={draftInfo.draftPermissions} onChange={handleChange}>
                                                <option value="">Selecciona el estado actual</option>
                                                <option value="Aproved">Aprobados</option>
                                                <option value="Aplied">Aplicado</option>
                                                <option value="NotAplied">Sin aplicar aún</option>
                                                <option value="NotSure">No estoy seguro</option>
                                                <option value="NotNeed">No son necesarios</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Box>
                                )}

                                {/* Date and Time schedule */}
                                <Form.Group className="mb-3" controlId="formNewProjectBestSchedule">
                                    <Form.Label className="type-body-sm fw-bold">
                                        ¿Cuándo deseas programar la visita del comerciante?
                                    </Form.Label>
                                    <div className="d-flex gap-2">
                                        <Form.Control
                                            type="date"
                                            name="draftBestScheduleDate"
                                            value={draftInfo.draftBestScheduleDate}
                                            onChange={handleChange}
                                        />
                                        <Form.Control
                                            type="time"
                                            name="draftBestScheduleTime"
                                            value={draftInfo.draftBestScheduleTime}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Form.Group>

                                {/* Direction and Map */}
                                <Form.Group className="mb-3" controlId="formNewProjectPostalCode">
                                    <Form.Label className="type-body-sm fw-bold w-100">
                                        ¿Dónde se requiere el servicio?
                                        {userAddress && (
                                            <div className="mt-2 mb-2">
                                                <Form.Check 
                                                    type="checkbox"
                                                    id="use-registered-address"
                                                    label={`Usar mi dirección guardada: ${userAddress}`}
                                                    checked={draftInfo.draftDirection === userAddress}
                                                    onChange={(e) => {
                                                        setDraftInfo(prev => ({
                                                            ...prev,
                                                            draftDirection: e.target.checked ? userAddress : '',
                                                        }))
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <Row className="w-100 m-0 flex justify-content-start align-items-center" style={{ flexWrap: 'wrap', gap: '8px' }}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Registra la dirección exacta"
                                                name="draftDirection"
                                                value={draftInfo.draftDirection}
                                                onChange={handleChange}
                                                style={{ flex: 1, minWidth: '200px' }}
                                            />
                                            <Button className="type-body-sm fw-bold text-verde w-auto d-flex align-items-center gap-1" onClick={handleOpen} variant="link" style={{ textDecoration: 'none' }}>
                                                <AddLocationIcon /> Seleccionar en el mapa
                                            </Button>
                                        </Row>
                                    </Form.Label>
                                </Form.Group>

                                {/* Attachments */}
                                <Form.Group className="mb-3" controlId="formNewProjectAtachments">
                                    <Form.Label className="type-body-sm fw-bold">
                                        Cargar fotos, imágenes y documentos relacionados (opcional)
                                    </Form.Label>
                                    <Row className="m-0 align-items-center gap-2">
                                        <Box className="cargarArchivos w-auto">
                                            <AdjuntarArchivos
                                                name={'draftAtachments'}
                                                multiple={true}
                                                idPerson={userId}
                                                rol={1}
                                                route={`profiles/${userId}/draft`}
                                                functionState={(info: any) => setDraftInfo(info)}
                                                state={draftInfo}
                                            />
                                        </Box>
                                        <Form.Control
                                            type="text"
                                            name="draftAtachments"
                                            value={draftInfo.draftAtachments}
                                            style={{ flex: 1, minWidth: '200px' }}
                                            readOnly
                                            placeholder="Ningún archivo cargado"
                                        />
                                    </Row>
                                </Form.Group>

                                <Modal
                                    open={openModal}
                                    onClose={handleCloseModal}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '90%',
                                        maxWidth: 600,
                                        bgcolor: 'background.paper',
                                        boxShadow: 24,
                                        p: 4,
                                        borderRadius: 2
                                    }}>
                                        <Ubicacion
                                            setLocInfo={(info: any) => setDraftInfo(info)}
                                            locInfo={draftInfo}
                                            setOpen={setOpen}
                                        />
                                    </Box>
                                </Modal>

                                {/* Actions */}
                                <Row className="pt-4 pb-4 w-100 justify-content-center m-0 gap-3">
                                    <Button
                                        onClick={handleSave}
                                        className="btn-primary-gradient p-2 ps-4 pe-4 w-auto"
                                        variant="primary"
                                    >
                                        Guardar y finalizar
                                    </Button>
                                    <Button
                                        onClick={handleComeBack}
                                        className="btn-round btn-middle w-auto"
                                        variant="secondary"
                                    >
                                        <KeyboardBackspaceIcon /> Volver atrás
                                    </Button>
                                </Row>
                            </Form>
                        </Col>
                </Row>
            )}
        </Container>
    )
}

