// Pagina de NuevoProyecto
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import {
    collection,
    doc,
    setDoc,
    getDocFromServer,
    getDocs,
} from 'firebase/firestore'
import { firestore } from '../../../firebase/firebaseClient'
import '../../../../public/assets/css/nuevo_proyecto.css'
import BuscadorNuevoProyecto from '../../components/buscador/BuscadorNuevoProyecto'
import Registro from '../../pages/registro/Registro'
import SubCategorias from '../../pages/categorias/Sub_Categorias'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepConnector, {
    stepConnectorClasses,
} from '@mui/material/StepConnector'
import SettingsIcon from '@mui/icons-material/Settings'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import VideoLabelIcon from '@mui/icons-material/VideoLabel'

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor:
            theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderRadius: 1,
    },
}))

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor:
        theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
        backgroundImage:
            'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
        backgroundImage:
            'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    }),
}))

const NuevoProyecto = (props) => {
    const draftID = uuidv4()
    const { state } = useLocation() || {}
    const { categoriaProfesional, tipoProyecto, auth } = state || {}
    const { paramCategoriaProfesional, paramTipoProyecto } = useParams()
    const draftCategory =
        categoriaProfesional || paramCategoriaProfesional || ''
    const draftProject = tipoProyecto || paramTipoProyecto || ''
    console.log(
        'A',
        draftCategory,
        categoriaProfesional,
        paramCategoriaProfesional
    )
    console.log('B', draftProject, tipoProyecto, paramTipoProyecto)
    const hideRegister = auth
    const _firestore = firestore
    // categoria
    const [categoriaInfo, setCategoriaInfo] = useState([])
    const categoriaRef = collection(_firestore, 'categoriasServicios')
    const draftRef = collection(_firestore, 'drafts')

    const [activeStep, setActiveStep] = useState(0)
    const [draftInfo, setDraftInfo] = useState({
        draftCategory: draftCategory,
        draftProject: draftProject,
        draftId: draftID,
        draftName: 'Categoria',
        draftDescription: '',
        draftPropietarioResidente: '',
        draftCreated: '',
        draftPriority: '',
        draftCity: '',
        draftDirection: '',
        draftSize: '',
        draftRooms: '',
        draftPlans: '',
        draftPermissions: '',
        draftAtachments: 'Archivos',
        draftBestScheduleDate: '',
        draftBestScheduleTime: '',
        draftProperty: '',
        draftPostalCode: '',
    })

    const draftToFirestore = async (updateInfo, projectID) => {
        await setDoc(doc(draftRef, projectID), updateInfo)
    }

    const categoriasFromFirestore = async () => {
        try {
            // const collectionConsult =
            //     draftInfo.draftCategory !== ''
            //         ? draftInfo.draftCategory
            //         : categoriaProfesional
            // console.log(
            //     collectionConsult,
            //     draftInfo.draftCategory,
            //     categoriaProfesional
            // )
            // 'aPTAljOeD48FbniBg6Lw' main document categories
            const subCategoriaRef = collection(
                doc(categoriaRef, 'aPTAljOeD48FbniBg6Lw'),
                draftCategory
            )
            const categoriaData = await getDocs(subCategoriaRef)
            return categoriaData
        } catch (err) {
            console.log(
                'Error al obtener los datos de la colleccion categorias: ',
                err
            )
        }
    }

    useEffect(() => {
        // draftInfo.draftCategory
        // if (categoriaProfesional ) {
        categoriasFromFirestore()
            .then((docSnap) => {
                if (docSnap) {
                    const data = docSnap.docs.map((element) => ({
                        ...element.data(),
                    }))
                    console.log(data, categoriaProfesional)
                    if (data.length > 0) {
                        setCategoriaInfo({
                            data,
                        })
                        console.log(categoriaInfo)
                    }
                } else {
                    console.log(
                        'No se encontro información en la colleccion proyectos!'
                    )
                }
            })
            .catch((error) => {
                console.log(error)
            })
        //} categoriaProfesional
    }, [])

    const handleSave = () => {
        console.log(draftInfo, activeStep)
        const snap = draftToFirestore(draftInfo, draftID)
        snap.then((docSnap) => {
            console.log(docSnap)
        })
        if (activeStep < steps.length) {
            let active = activeStep + 1
            setActiveStep(active)
        }
    }

    const handleChangeInfo = (event) => {
        event.preventDefault()
        console.log('Detecto:', event)
        // console.log(draftInfo)
        // setDraftInfo({
        //     ...draftInfo,
        //     [event.target.name]: event.target.value,
        // })
    }

    const handleChange = (event) => {
        event.preventDefault()
        console.log('Detecto:', event, draftInfo)
        setDraftInfo({
            ...draftInfo,
            [event.target.name]: event.target.value,
        })
    }

    const handleComeBack = () => {
        if (activeStep > 0) {
            let active = activeStep - 1
            setActiveStep(active)
        }
    }

    function ColorlibStepIcon(props) {
        const { active, completed, className } = props

        const icons = {
            1: <SettingsIcon />,
            2: <GroupAddIcon />,
            3: <VideoLabelIcon />,
        }

        return (
            <ColorlibStepIconRoot
                ownerState={{ completed, active }}
                className={className}
            >
                {icons[String(props.icon)]}
            </ColorlibStepIconRoot>
        )
    }

    ColorlibStepIcon.propTypes = {
        /**
         * Whether this step is active.
         * @default false
         */
        active: PropTypes.bool,
        className: PropTypes.string,
        /**
         * Mark the step as completed. Is passed to child components.
         * @default false
         */
        completed: PropTypes.bool,
        /**
         * The label displayed in the step icon.
         */
        icon: PropTypes.node,
    }

    const steps = [
        'Select campaign settings',
        'Create an ad group',
        'Create an ad',
    ]

    const CustomizedSteppers = (props) => {
        let { activeStep } = props // useParams()
        return (
            <Stack sx={{ width: '100%', mt: 4, mb: 4 }} spacing={4}>
                <Stepper
                    alternativeLabel
                    activeStep={activeStep}
                    connector={<ColorlibConnector />}
                >
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={ColorlibStepIcon}>
                                {label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Stack>
        )
    }

    return (
        <>
            <Container fluid className="p-0">
                <CustomizedSteppers activeStep={activeStep} />
                {activeStep == 0 && (
                    <Col>
                        <Row className="nuevoProyectoBuscador">
                            <Col
                                className="align-items-start p-4 m-4"
                                md={5}
                                sm={8}
                            >
                                <Col className="opacidadNegro p-0">
                                    <p className="headline-l textBlanco m-4 p-0">
                                        {' '}
                                        Con ayuda de la comunidad haz realidad
                                        la casa que deseas. Encuentra un
                                        profesional Seguro y Confiable, para
                                        cada trabajo. Desde iluminación y
                                        pequeños arreglos, hasta diseños de
                                        ingeniería y remodelaciones completas.
                                    </p>
                                </Col>
                            </Col>
                            {/* Se importa formulario nuevo proyecto */}
                            <Col
                                className="col m-4 p-0"
                                xl={4}
                                lg={6}
                                xm={6}
                                md={8}
                                sm={12}
                                xs={12}
                            >
                                <BuscadorNuevoProyecto
                                    data={state}
                                    onChange={handleChangeInfo}
                                ></BuscadorNuevoProyecto>
                            </Col>
                        </Row>
                        {/* setActiveStep */}
                        <Row className="categorias">
                            <Col className="col-10 categorias-contenedor">
                                {categoriaInfo.data ? (
                                    categoriaInfo.data.map((item, index) => (
                                        <SubCategorias
                                            key={index}
                                            props={item}
                                        />
                                    ))
                                ) : (
                                    <></>
                                )}
                            </Col>
                        </Row>
                        <Col className="col-10">
                            <Row className="pt-4 pb-4 w-100">
                                <Button
                                    onClick={handleSave}
                                    style={{ paddingRight: '10px' }}
                                    className="btn-round btn-high w-50"
                                    variant="primary"
                                    // type="submit"
                                >
                                    Guardar y continuar
                                </Button>
                                <Button
                                    onClick={handleComeBack}
                                    className="btn-round btn-high w-50"
                                    variant="secondary"
                                    // type="submit"
                                >
                                    Volver atras
                                </Button>
                            </Row>
                        </Col>
                    </Col>
                )}
                {activeStep == 1 && (
                    <Col className="nuevoProyectoBuscador2 align-items-baseline">
                        <Col
                            className="ms-4 pt-4 pb-4 ps-4 align-items-start"
                            xl={6}
                            lg={8}
                            md={10}
                            sm={12}
                        >
                            {' '}
                            <p className="p-description">
                                Compara precios de los mejores profesionales
                                calificados{' '}
                            </p>
                            <Form>
                                <p className="body-1">
                                    2. Crea una oferta. <br />
                                    <br />
                                    Dejanos conocer un poco más hacerca del
                                    proyecto que vas a postular.
                                    <br />
                                    <br />* Campos requeridos
                                </p>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formNewProjectDescription"
                                >
                                    <Form.Label className="body-2">
                                        Describe el tipo de servicio que
                                        necesitas *
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        style={{ height: '100px' }}
                                        placeholder="¿Que servicio requieres?"
                                        name="draftDescription"
                                        value={draftInfo.draftDescription}
                                        onChange={handleChange}
                                    />
                                    <Form.Text className="text-muted">
                                        Provee información adicional aquí, como
                                        especificaciones de tecnica y materiales
                                        requeridos que el comerciante calificado
                                        deba conocer.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formNewProjectSize"
                                >
                                    <Form.Label className="body-2">
                                        Escoge el tamaño
                                    </Form.Label>
                                    <Form.Select
                                        name="draftSize"
                                        value={draftInfo.draftSize}
                                        onChange={handleChange}
                                    >
                                        <option>
                                            Selecciona el tamaño del proyecto
                                        </option>
                                        <option value="sencillo">
                                            Sencillo
                                        </option>
                                        <option value="mediano">Mediano</option>
                                        <option value="doble">Doble</option>
                                        <option value="grande">Grande</option>
                                        <option value="Otra">Otro</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formNewProjectProperty"
                                >
                                    <Form.Label className="body-2">
                                        ¿Qué tipo de propiedad es?
                                    </Form.Label>
                                    <Form.Select
                                        name="draftProperty"
                                        value={draftInfo.draftProperty}
                                        onChange={handleChange}
                                    >
                                        <option>
                                            Selecciona el tipo de propiedad
                                        </option>
                                        <option value="Colonial">
                                            Propiedad Colonial (1800 - 1920){' '}
                                        </option>
                                        <option value="SubUrbana">
                                            Propiedad suburbana (1920-1960){' '}
                                        </option>
                                        <option value="Moderna">
                                            Propiedad moderna (1960-presente){' '}
                                        </option>
                                        <option value="Otra">Otra </option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formNewProjectRooms"
                                >
                                    <Form.Label className="body-2">
                                        ¿Cuantas habitaciones y/o espacios seran
                                        intervenidos?, ejemplo ¿Cantidad de m2?
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Por favor especifica"
                                        name="draftRooms"
                                        value={draftInfo.draftRooms}
                                        onChange={handleChange}
                                    />
                                    <Form.Text className="text-muted">
                                        Podremos estimar mejor la cantidad de
                                        obra.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formNewProjectPlans"
                                >
                                    <Form.Label className="body-2">
                                        ¿Han sido diseñados planos
                                        arquitectonicos para este proyecto?
                                    </Form.Label>
                                    <Form.Select
                                        name="draftPlans"
                                        value={draftInfo.draftPlans}
                                        onChange={handleChange}
                                    >
                                        <option>
                                            Selecciona el estado actual
                                        </option>
                                        <option value="Aproved">
                                            Aprobados
                                        </option>
                                        <option value="Aplied">Aplicado</option>
                                        <option value="NotAplied">
                                            Sin aplicar aun
                                        </option>
                                        <option value="NotSure">
                                            No estoy seguro
                                        </option>
                                        <option value="NotNeed">
                                            No son necesarios en esta
                                            oportunidad
                                        </option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formNewProjectPermissions"
                                >
                                    <Form.Label className="body-2">
                                        ¿Cúal es el estado de los permisos para
                                        este proyecto?
                                    </Form.Label>
                                    <Form.Select
                                        name="draftPermissions"
                                        value={draftInfo.draftPermissions}
                                        onChange={handleChange}
                                    >
                                        <option>
                                            Selecciona el estado actual
                                        </option>
                                        <option value="Aproved">
                                            Aprobados
                                        </option>
                                        <option value="Aplied">Aplicado</option>
                                        <option value="NotAplied">
                                            Sin aplicar aun
                                        </option>
                                        <option value="NotSure">
                                            No estoy seguro
                                        </option>
                                        <option value="NotNeed">
                                            No son necesarios en esta
                                            oportunidad
                                        </option>
                                    </Form.Select>
                                </Form.Group>
                                <Col className="col-10">
                                    <Row className="pt-4 pb-4 w-100">
                                        <Button
                                            onClick={handleSave}
                                            style={{ paddingRight: '10px' }}
                                            className="btn-round btn-high w-50"
                                            variant="primary"
                                            // type="submit"
                                        >
                                            Guardar y continuar
                                        </Button>
                                        <Button
                                            onClick={handleComeBack}
                                            className="btn-round btn-high w-50"
                                            variant="secondary"
                                            // type="submit"
                                        >
                                            Volver atras
                                        </Button>
                                    </Row>
                                </Col>
                            </Form>
                        </Col>
                    </Col>
                )}
                {activeStep == 2 && (
                    <Col className="nuevoProyectoBuscador3  align-items-baseline">
                        <Col
                            className="ms-4 pt-4 pb-4 ps-4 align-items-start"
                            xl={4}
                            lg={6}
                            md={8}
                            sm={10}
                            xs={10}
                        >
                            <p className="p-description">
                                Cómo, dónde y cuándo{' '}
                            </p>
                            <Form>
                                <p className="body-1">
                                    3. Información Adicional. <br />
                                    <br />
                                    Danos algunos detalles Adicionales.
                                </p>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formNewProjectBestSchedule"
                                >
                                    <Form.Label className="body-2">
                                        ¿Con cuál disponibilidad de horario y
                                        tiempo cuenta usted para atender la
                                        prestación del servicio? *
                                    </Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="Dispone de algun horario en particular"
                                        name="draftBestScheduleDate"
                                        value={draftInfo.draftBestScheduleDate}
                                        onChange={handleChange}
                                    />
                                    <Form.Control
                                        type="time"
                                        placeholder="Dispone de algun horario en particular"
                                        name="draftBestScheduleTime"
                                        value={draftInfo.draftBestScheduleTime}
                                        onChange={handleChange}
                                    />
                                    <Form.Text className="text-muted">
                                        Podremos validar la agenda disponible de
                                        comerciantes profesionales.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formNewProjectPostalCode"
                                >
                                    <Form.Label className="body-2">
                                        ¿Cual es el codigo postal de la
                                        propiedad?
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Registre Codigo Postal"
                                        name="draftPostalCode"
                                        value={draftInfo.draftPostalCode}
                                        onChange={handleChange}
                                    />
                                    <Form.Text className="text-muted">
                                        Nos permitira validar comerciantes
                                        profesionales activos en la zona o bien
                                        registra tu dirección{' '}
                                        <NavLink
                                            className="body-2"
                                            to="/ubicacion"
                                        >
                                            {', aquí'}
                                        </NavLink>
                                        .
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formNewProjectAtachments"
                                >
                                    <Form.Label className="body-2">
                                        Cargar fotos imagenes y documentos
                                        relacionados.{' '}
                                    </Form.Label>
                                    <Form.Control
                                        name="draftAtachments"
                                        // value={draftInfo.draftAtachments}
                                        // onChange={handleChange}
                                        type="file"
                                    />
                                </Form.Group>
                                <Col className="col-10">
                                    <Row className="pt-4 pb-4 w-100">
                                        <Button
                                            onClick={handleSave}
                                            style={{ paddingRight: '10px' }}
                                            className="btn-round btn-high w-50"
                                            variant="primary"
                                            // type="submit"
                                        >
                                            Guardar
                                        </Button>
                                        <Button
                                            onClick={handleComeBack}
                                            className="btn-round btn-high w-50"
                                            variant="secondary"
                                            // type="submit"
                                        >
                                            Volver atras
                                        </Button>
                                    </Row>
                                </Col>
                            </Form>
                        </Col>
                    </Col>
                )}
                {/* Detalles de contacto */}
                {activeStep == 2 && !hideRegister ? (
                    <Row className="nuevoProyectoMensaje w-100">
                        <Col className="p-4 col-10">
                            <h3 className="headline-xl textBlanco">
                                Por ultimo ingresa tus datos de contacto
                            </h3>
                            <p className="body-1 textBlanco">
                                Hasta cuatro Comerciantes calificados te
                                contactaran para aplicar con una cotización a tu
                                proyecto. <br />
                                Para garantizar la mejor respuesta asegúrate que
                                tus datos son exactos, solo compartiremos tu
                                numero con los comerciantes calificados
                                interesados, por favor responde a su llamada.
                            </p>
                        </Col>

                        <Registro showLogo={false} className="pb-4"></Registro>
                    </Row>
                ) : (
                    <></>
                )}
            </Container>
        </>
    )
}

export default NuevoProyecto
