import { useState, useEffect, type ChangeEvent } from 'react' // Fix type import
// ... other imports
// @ts-ignore
import { AdjuntarArchivos } from '@components/common'
import { v4 as uuidv4 } from 'uuid'
import { navigate } from 'vike/client/router'
import { usePageContext } from '@hooks/usePageContext'
import { CategoriasService } from '@/services'
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
import { DirectionalButton } from '@components/common'
import {
    ProjectSearchForm,
    SubCategoryCard,
    CategorySelector
} from '@features/projects'
// Features
import { PasoAPaso, Ubicacion } from '@features/marketing'
import PageRegistro from '../../(auth)/registro/+Page'
import PageIngreso from '../../(auth)/ingreso/+Page'
// Local
import TablaSubCategoriaCantidades from './TablaSubCategoriaCantidades'
// Styles
// Bootstrap
// Bootstrap
import { Row, Col, Container, Button, Form } from 'react-bootstrap'
// MUI
// MUI
import { Box, Modal, Typography, Chip } from '@mui/material'
import AddLocationIcon from '@mui/icons-material/AddLocation'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
// Types
interface CategoryItem {
    subCategoria?: string
    [key: string]: any
}
import type { ProjectDraftInfo, CategorySelectionState, SubCategoryItem } from '@features/projects'

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
    const [isLoaded, setIsLoaded] = useState(false)
    const [userAddress, setUserAddress] = useState('')
    // Firestore refs removed from top level to avoid SSR crash

    // Categoria State
    const [categoriaInfo, setCategoriaInfo] = useState<{
        selected: any[]
        quatities: any[]
        data: any[][]
        subCatLength: number
    }>({
        selected: [],
        quatities: [],
        data: [],
        subCatLength: 0,
    })
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
    const [categoriesIndex, setCategoriesIndex] = useState(0)
    const handleOpen = () => setOpen(true)
    const handleCloseModal = () => setOpen(false)
    const handleNext = () => {
        if (categoriesIndex < categoriaInfo.subCatLength - 1) {
            setCategoriesIndex(categoriesIndex + 1)
        }
    }
    const handleBack = () => {
        if (categoriesIndex > 0) {
            setCategoriesIndex(categoriesIndex - 1)
        }
    }
    const draftToFirestore = async (updateInfo: DraftInfo, projectID: string) => {
        if (!isFirebaseAvailable() || !firestore) {
            console.warn('[SSR] draftToFirestore skipped - Firebase not available')
            return
        }
        const draftRef = collection(firestore, 'drafts')
        await setDoc(doc(draftRef, projectID), updateInfo, { merge: true })
    }
    useEffect(() => {
        if (!isLoaded) {
            const searchParams = new URLSearchParams(window.location.search)
            const type = searchParams.get('type')
            const category = searchParams.get('category')

            if (type && category && (draftInfo.draftProject !== type || String(draftInfo.draftCategory) !== category)) {
                setDraftInfo(prev => ({
                    ...prev,
                    draftProject: type,
                    draftCategory: category
                }))
            }

            if (!!draftInfo.draftProject && draftInfo.draftCategory !== 0) {
                const fetchCategories = async () => {
                    try {
                        const items = await CategoriasService.getCategoryItems(String(draftInfo.draftCategory))

                        if (items && items.length > 0) {
                            // Chunk items into groups of 6 for pagination/grid
                            const chunkSize = 6
                            const pages: any[] = []
                            for (let i = 0; i < items.length; i += chunkSize) {
                                pages.push(items.slice(i, i + chunkSize))
                            }

                            setCategoriaInfo((prev: any) => ({
                                ...prev,
                                data: pages,
                                subCatLength: pages.length,
                            }))
                            setIsLoaded(true)
                        } else {
                            console.log('No info found for category:', draftInfo.draftCategory)
                            // Initialize with empty state to avoid loading indefinitely
                            setCategoriaInfo((prev: any) => ({
                                ...prev,
                                data: [],
                                subCatLength: 0,
                            }))
                            setIsLoaded(true)
                        }
                    } catch (error) {
                        console.error('Error fetching categories:', error)
                        setIsLoaded(true)
                    }
                }

                fetchCategories()
            }
        }
    }, [
        isLoaded,
        draftInfo.draftCategory,
        draftInfo.draftProject
    ])

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
        if (name === 'draftCategory') {
            setIsLoaded(false)
        }
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
    const handleUpdateCategoriaInfo = (info: CategorySelectionState) => {
        setCategoriaInfo((prev) => ({
            ...prev,
            ...info,
        }))
    }
    const steps = [
        'Categoria/Subcategoria',
        'Elige tus ajustes',
        'Programa la visita',
        'Registrarse',
    ]
    return (
        <Container fluid className="p-0 new-project-page" style={{ position: 'relative' }}>
            <PasoAPaso activeStep={activeStep} steps={steps} />
            {activeStep === 0 && (
                <Col>
                    {(draftInfo.draftProject === undefined ||
                        Number(draftInfo.draftCategory) === 0) && (
                            <Row className="nuevo-proyecto-buscador">
                                <Col className="align-items-start p-4 m-4" md={5} sm={8}>
                                    <Col className="opacidad-negro p-4 rounded-3 text-blanco">
                                        <p className="type-body-lg m-0">
                                            Con ayuda de la comunidad haz realidad la casa que deseas.
                                            Encuentra un profesional Seguro y Confiable, para cada trabajo. Desde
                                            iluminación y pequeños arreglos, hasta diseños de ingeniería y
                                            remodelaciones completas.
                                        </p>
                                    </Col>
                                </Col>
                                <Col className="col m-4 p-0" xl={4} lg={6} md={8} sm={12} xs={12}>
                                    <ProjectSearchForm
                                        setDraftInfo={handleUpdateDraftInfo}
                                        draftInfo={draftInfo}
                                    />
                                </Col>
                            </Row>
                        )}
                    {!!draftInfo.draftProject && Number(draftInfo.draftCategory) !== 0 && (
                        <>
                            <Row className="w-100 m-0">
                                <Col className="p-4" lg={10} md={12}>
                                    <p className="type-body text-dark">
                                        Al seleccionar categorías podrás ir agregando uno a uno todos los
                                        servicios que vas a solicitar. Luego en el siguiente paso podrás modificar la cantidad de
                                        obra que requieres.
                                    </p>
                                    {/* Compact inline category selector */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            flexWrap: 'wrap',
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: 'var(--background-light-gray-color)',
                                            border: '1px solid #e0e0e0',
                                        }}
                                    >
                                        <Chip
                                            label={draftInfo.draftProject}
                                            color="primary"
                                            size="small"
                                            sx={{ fontWeight: 600 }}
                                        />
                                        <Box sx={{ flex: 1, minWidth: 200 }}>
                                            <CategorySelector
                                                setDraftInfo={handleUpdateDraftInfo}
                                                draftInfo={draftInfo}
                                                setIsLoaded={setIsLoaded}
                                                className=""
                                            />
                                        </Box>
                                        <Button
                                            size="sm"
                                            variant="outline-secondary"
                                            onClick={() => {
                                                setDraftInfo(prev => ({
                                                    ...prev,
                                                    draftProject: undefined,
                                                    draftCategory: 0,
                                                }))
                                                if (typeof window !== 'undefined') {
                                                    window.history.replaceState({}, '', window.location.pathname)
                                                }
                                                setIsLoaded(false)
                                            }}
                                        >
                                            Cambiar tipo
                                        </Button>
                                    </Box>
                                </Col>
                            </Row>
                            <Row className="categorias w-100 m-0 p-4">
                                <Col className="p-0 pt-4 col-10 categorias-contenedor">
                                    <Row className="w-100 m-0">
                                        {categoriaInfo.data[categoriesIndex] &&
                                            categoriaInfo.data[categoriesIndex]!.map((item: CategoryItem, index: number) => {
                                                return (
                                                    item.subCategoria ? (
                                                        <SubCategoryCard
                                                            key={index}
                                                            item={item as unknown as SubCategoryItem}
                                                            setCategoriaInfo={handleUpdateCategoriaInfo}
                                                            categoriaInfo={categoriaInfo}
                                                        />
                                                    ) : null
                                                )
                                            })}
                                    </Row>
                                    <DirectionalButton
                                        handleNext={handleNext}
                                        handleBack={handleBack}
                                    />
                                </Col>
                            </Row>
                            <Col className="col-10">
                                <Row className="pt-4 pb-4 w-100 justify-content-center">
                                    <Button
                                        onClick={goForward}
                                        style={{ paddingRight: '10px' }}
                                        className="btn-primary-gradient p-2 ps-4 pe-4 w-auto"
                                        variant="primary"
                                    >
                                        Guardar y continuar
                                    </Button>
                                    <span className="p-4 w-auto"> </span>
                                    <Button
                                        onClick={handleComeBack}
                                        className="btn-round btn-middle w-auto"
                                        variant="secondary"
                                    >
                                        <KeyboardBackspaceIcon /> Volver atrás
                                    </Button>
                                </Row>
                            </Col>
                        </>
                    )}
                </Col>
            )}
            {activeStep === 1 && (
                <Col className="nuevo-proyecto-buscador-2 align-items-baseline p-2 ps-4">
                    <TablaSubCategoriaCantidades
                        categoriaInfo={categoriaInfo}
                        setDraftInfo={setDraftInfo}
                        draftInfo={draftInfo}
                    />
                    <Typography className="type-section-title w-100 center mt-4 mb-4">
                        Elige tus ajustes
                    </Typography>
                    <Col className="p-4 align-items-start card-frame" xl={6} lg={8} md={10} sm={12}>
                        <Form className="m-4">
                            <p className="type-body text-dark">
                                Crea una oferta. <br />
                                Dejanos conocer un poco más hacerca del proyecto que vas a postular. * Campos requeridos
                            </p>
                            <Form.Group className="mb-3" controlId="formNewProjectName">
                                <Form.Label className="type-body-sm fw-bold">Dale un titulo a tu requerimiento *</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    style={{ height: '100px' }}
                                    placeholder="¿Cual es el titulo de tu requerimiento?"
                                    name="draftName"
                                    value={draftInfo.draftName}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formNewProjectDescription">
                                <Form.Label className="type-body-sm fw-bold">Describe el tipo de servicio que necesitas *</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    style={{ height: '100px' }}
                                    placeholder="¿Que servicio requieres?"
                                    name="draftDescription"
                                    value={draftInfo.draftDescription}
                                    onChange={handleChange}
                                />
                                <Form.Text className="text-muted">
                                    Provee información adicional aquí, como especificaciones de tecnica y materiales requeridos.
                                </Form.Text>
                            </Form.Group>
                            <Typography color="text.secondary" className="type-body-sm fw-bold pb-2" onClick={handleShowMore} style={{ cursor: 'pointer' }}>
                                Ofrece mayores detalles
                                {showMore ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </Typography>
                            {showMore && (
                                <Box>
                                    <Form.Group className="mb-3" controlId="formNewProjectSize">
                                        <Form.Label className="type-body-sm fw-bold">Escoge el tamaño</Form.Label>
                                        <Form.Select name="draftSize" value={draftInfo.draftSize} onChange={handleChange}>
                                            <option>Selecciona el tamaño del proyecto</option>
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
                                            <option>Selecciona el tipo de propiedad</option>
                                            <option value="Colonial">Propiedad Colonial (1800 - 1920)</option>
                                            <option value="SubUrbana">Propiedad suburbana (1920-1960)</option>
                                            <option value="Moderna">Propiedad moderna (1960-presente)</option>
                                            <option value="Otra">Otra</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formNewProjectRooms">
                                        <Form.Label className="type-body-sm fw-bold">¿Cuantas habitaciones y/o espacios seran intervenidos?</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Por favor especifica"
                                            name="draftRooms"
                                            value={draftInfo.draftRooms}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formNewProjectPlans">
                                        <Form.Label className="type-body-sm fw-bold">¿Han sido diseñados planos arquitectonicos?</Form.Label>
                                        <Form.Select name="draftPlans" value={draftInfo.draftPlans} onChange={handleChange}>
                                            <option>Selecciona el estado actual</option>
                                            <option value="Aproved">Aprobados</option>
                                            <option value="Aplied">Aplicado</option>
                                            <option value="NotAplied">Sin aplicar aun</option>
                                            <option value="NotSure">No estoy seguro</option>
                                            <option value="NotNeed">No son necesarios</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formNewProjectPermissions">
                                        <Form.Label className="type-body-sm fw-bold">¿Cúal es el estado de los permisos?</Form.Label>
                                        <Form.Select name="draftPermissions" value={draftInfo.draftPermissions} onChange={handleChange}>
                                            <option>Selecciona el estado actual</option>
                                            <option value="Aproved">Aprobados</option>
                                            <option value="Aplied">Aplicado</option>
                                            <option value="NotAplied">Sin aplicar aun</option>
                                            <option value="NotSure">No estoy seguro</option>
                                            <option value="NotNeed">No son necesarios</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Box>
                            )}
                            <Col className="col-10">
                                <Row className="pt-4 pb-4 w-100 justify-content-center">
                                    <Button
                                        onClick={goForward}
                                        style={{ paddingRight: '10px' }}
                                        className="p-2 ps-4 pe-4 btn-round btn-high body-1 w-auto"
                                        variant="primary"
                                    >
                                        Guardar y continuar
                                    </Button>
                                    <span className="p-4 w-auto"> </span>
                                    <Button
                                        onClick={handleComeBack}
                                        className="btn-round btn-middle w-auto"
                                        variant="secondary"
                                    >
                                        <KeyboardBackspaceIcon /> Volver atras
                                    </Button>
                                </Row>
                            </Col>
                        </Form>
                    </Col>
                </Col>
            )}
            {activeStep === 2 && (
                <Col className="nuevo-proyecto-buscador-3 align-items-baseline p-2 ps-4">
                    <Typography className="type-section-title w-100 center">
                        Programa la visita
                    </Typography>
                    <Col className="p-4 align-items-start card-frame" xl={6} lg={8} md={10} sm={12}>
                        <Form>
                            <Form.Group className="m-4" controlId="formNewProjectBestSchedule">
                                <Form.Label className="type-body-sm fw-bold">
                                    ¿Con cuál disponibilidad de horario y tiempo cuenta usted? *
                                </Form.Label>
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
                            </Form.Group>
                            <Form.Group className="m-4" controlId="formNewProjectPostalCode">
                                <Form.Label className="type-body-sm fw-bold w-100">
                                    Registra la dirección donde se requiere el servicio.
                                    {userAddress && (
                                        <div className="mt-2 mb-2">
                                            <Form.Check 
                                                type="checkbox"
                                                id="use-registered-address"
                                                label={`Usar mi dirección: ${userAddress}`}
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
                                    <Row className="w-100 flex justify-content-start" style={{ flexWrap: 'wrap' }}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Registra la dirección"
                                            name="draftDirection"
                                            value={draftInfo.draftDirection}
                                            onChange={handleChange}
                                        />
                                        <Button className="type-body-sm fw-bold ms-2 pb-2 text-verde w-auto" onClick={handleOpen}>
                                            <AddLocationIcon /> {'Seleccionar en el mapa'}
                                        </Button>
                                    </Row>
                                </Form.Label>
                            </Form.Group>
                            <Form.Group className="m-4" controlId="formNewProjectAtachments">
                                <Form.Label className="type-body-sm fw-bold">
                                    Cargar fotos, imagenes y documentos relacionados.
                                </Form.Label>
                                <Row>
                                    <Box className="cargarArchivos">
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
                                        className="w-50"
                                        readOnly
                                    />
                                </Row>
                            </Form.Group>
                            <Modal
                                open={openModal}
                                onClose={handleCloseModal}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box>
                                    <Ubicacion
                                        setLocInfo={(info: any) => setDraftInfo(info)}
                                        locInfo={draftInfo}
                                        setOpen={setOpen}
                                    />
                                </Box>
                            </Modal>
                            <Col className="col-10">
                                <Row className="pt-4 pb-4 w-100 justify-content-center">
                                    <Button
                                        onClick={!hideRegister ? goForward : handleSave}
                                        style={{ paddingRight: '10px' }}
                                        className="btn-primary-gradient p-2 ps-4 pe-4 w-auto"
                                        variant="primary"
                                    >
                                        Guardar y finalizar
                                    </Button>
                                    <span className="p-4 w-auto"> </span>
                                    <Button
                                        onClick={handleComeBack}
                                        className="btn-round btn-middle w-auto"
                                        variant="secondary"
                                    >
                                        <KeyboardBackspaceIcon /> Volver atras
                                    </Button>
                                </Row>
                            </Col>
                        </Form>
                    </Col>
                </Col>
            )}
            {activeStep === 3 && !hideRegister ? (
                <Row className="nuevo-proyecto-mensaje w-100">
                    <Col className="p-4 col-10">
                        <h3 className="type-hero-title text-blanco">
                            Por ultimo ingresa tus datos de contacto
                        </h3>
                        <p className="type-body text-blanco">
                            Hasta cuatro Comerciantes calificados te contactaran para aplicar con una cotización.
                            Asegúrate que tus datos son exactos.
                        </p>
                    </Col>
                    <PageRegistro
                        setDraftInfo={(info: any) => setDraftInfo(info)}
                        draftInfo={draftInfo}
                        handleSave={handleSave}
                        showLogo={false}
                    />
                    <PageIngreso
                        setDraftInfo={(info: any) => setDraftInfo(info)}
                        draftInfo={draftInfo}
                        handleSave={handleSave}
                        showLogo={false}
                    />
                </Row>
            ) : null}
        </Container>
    )
}
