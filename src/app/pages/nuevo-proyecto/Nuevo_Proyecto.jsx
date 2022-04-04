// Pagina de NuevoProyecto
import React, { useState } from 'react'
import { collection, doc, setDoc, getDocFromServer } from 'firebase/firestore'
import { firestore } from '../../../firebase/firebaseClient'
import '../../../../public/assets/css/nuevo_proyecto.css'
import BuscadorNuevoProyecto from '../../components/buscador/BuscadorNuevoProyecto'
import Registro from '../../pages/registro/Registro'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

const NuevoProyecto = (props) => {
    // TODO: SetProjectID
    const draftID = '0nBRalFhC3THfbGsbKHHfzpL81j2'
    const _firestore = firestore
    const draftRef = collection(_firestore, 'drafts')
    const [draftInfo, setDraftInfo] = useState({
        draftName: 'Categoria',
        draftDescription: '',
        draftRooms: ' ',
        draftPlans: ' ',
        draftPermissions: ' ',
        draftAtachments: 'Archivos',
        draftBestSchedule: ' ',
        draftProperty: ' ',
        draftPostalCode: ' ',
    })

    const draftToFirestore = async (updateInfo, projectID) => {
        await setDoc(doc(draftRef, projectID), updateInfo)
    }

    const handleSave = () => {
        console.log(draftInfo)
        const snap = draftToFirestore(draftInfo, draftID)
        snap.then((docSnap) => {
            console.log(docSnap)
        })
    }

    const handleChange = (event) => {
        event.preventDefault()
        console.log(draftInfo)
        setDraftInfo({
            ...draftInfo,
            [event.target.name]: event.target.value,
        })
    }

    return (
        <>
            <Container fluid className="p-0">
                <Row className="nuevoProyectoBuscador">
                    <Col className="align-items-start p-4 m-4" md={5} sm={8}>
                        <Col className="opacidadNegro p-0">
                            <p className="headline-l textBlanco m-4 p-0">
                                {' '}
                                Con ayuda de la comunidad haz realidad la casa
                                que deseas. Encuentra un profesional Seguro y
                                Confiable, para cada trabajo. Desde iluminación
                                y pequeños arreglos, hasta diseños de ingeniería
                                y remodelaciones completas.
                            </p>
                        </Col>
                    </Col>
                    {/* Formulario nuevo proyecto */}
                    <Col
                        className="col m-4 p-0"
                        xl={4}
                        lg={6}
                        xm={6}
                        md={8}
                        sm={12}
                        xs={12}
                    >
                        <BuscadorNuevoProyecto></BuscadorNuevoProyecto>
                    </Col>
                </Row>
                <Col className="nuevoProyectoBuscador2 align-items-baseline">
                    <Col
                        className="ms-4 pt-4 pb-4 ps-4 align-items-start"
                        xl={4}
                        lg={6}
                        md={8}
                        sm={10}
                        xs={10}
                    >
                        {' '}
                        <p className="p-description">
                            Compara precios de los mejores profesionales
                            calificados{' '}
                        </p>
                        <Form>
                            <p className="body-1">
                                2. Crea una oferta <br />
                                Dejanos conocer un poco más hacerca del proyecto
                                que vas a postular
                                <br />* Campos requeridos
                            </p>
                            <Form.Group
                                className="mb-3"
                                controlId="formNewProjectDescription"
                            >
                                <Form.Label className="body-2">
                                    Describe el tipo de servicio que necesitas *
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
                                    provee información adicional aquí, como
                                    especificaciones de tecnica y materiales
                                    requeridos que el comerciante calificado
                                    deba conocer.
                                </Form.Text>
                            </Form.Group>
                            <Form.Group
                                className="mb-3"
                                controlId="formNewProjectRooms"
                            >
                                <Form.Label className="body-2">
                                    ¿Cuantas habitaciones y/o espacios seran
                                    intervenidos?, ¿Cuantos m2?
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Por favor especifica"
                                    name="draftRooms"
                                    value={draftInfo.draftRooms}
                                    onChange={handleChange}
                                />
                                <Form.Text className="text-muted">
                                    Podremos estimar mejor la cantidad de obra.
                                </Form.Text>
                            </Form.Group>
                            <Form.Group
                                className="mb-3"
                                controlId="formNewProjectPlans"
                            >
                                <Form.Label className="body-2">
                                    ¿Han sido diseñados planos arquitectonicos
                                    para este proyecto?
                                </Form.Label>
                                <Form.Select
                                    name="draftPlans"
                                    value={draftInfo.draftPlans}
                                    onChange={handleChange}
                                >
                                    <option>Selecciona el estado actual</option>
                                    <option value="Aproved">Aprobados</option>
                                    <option value="Aplied">Aplicado</option>
                                    <option value="NotAplied">
                                        Sin aplicar aun
                                    </option>
                                    <option value="NotSure">
                                        No estoy seguro
                                    </option>
                                    <option value="NotNeed">
                                        No son necesarios en esta oportunidad
                                    </option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group
                                className="mb-3"
                                controlId="formNewProjectPermissions"
                            >
                                <Form.Label className="body-2">
                                    ¿Cúal es el estado de los permisos para este
                                    proyecto?
                                </Form.Label>
                                <Form.Select
                                    name="draftPermissions"
                                    value={draftInfo.draftPermissions}
                                    onChange={handleChange}
                                >
                                    <option>Selecciona el estado actual</option>
                                    <option value="Aproved">Aprobados</option>
                                    <option value="Aplied">Aplicado</option>
                                    <option value="NotAplied">
                                        Sin aplicar aun
                                    </option>
                                    <option value="NotSure">
                                        No estoy seguro
                                    </option>
                                    <option value="NotNeed">
                                        No son necesarios en esta oportunidad
                                    </option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group
                                className="mb-3"
                                controlId="formNewProjectAtachments"
                            >
                                <Form.Label className="body-2">
                                    Cargar fotos imagenes y documentos
                                    relacionados{' '}
                                </Form.Label>
                                <Form.Control
                                    name="draftAtachments"
                                    // value={draftInfo.draftAtachments}
                                    // onChange={handleChange}
                                    type="file"
                                />
                            </Form.Group>
                            <Button
                                onClick={handleSave}
                                className="btn-round btn-high"
                                variant="primary"
                                // type="submit"
                            >
                                Guardar y continuar
                            </Button>
                        </Form>
                    </Col>
                </Col>
                <Col className="nuevoProyectoBuscador3  align-items-baseline">
                    <Col
                        className="ms-4 pt-4 pb-4 ps-4 align-items-start"
                        xl={4}
                        lg={6}
                        md={8}
                        sm={10}
                        xs={10}
                    >
                        <Form>
                            <p className="body-1">
                                3. Información Adicional <br />
                                Detalles Adicionales
                            </p>
                            <Form.Group
                                className="mb-3"
                                controlId="formNewProjectBestSchedule"
                            >
                                <Form.Label className="body-2">
                                    ¿Con cuál disponibilidad de horario y tiempo
                                    cuenta usted para atender la prestación del
                                    servicio? *
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Dispone de algun horario en particular"
                                    name="draftBestSchedule"
                                    value={draftInfo.draftBestSchedule}
                                    onChange={handleChange}
                                />
                                <Form.Text className="text-muted">
                                    Podremos validar la agenda disponible de
                                    comerciantes profesionales.
                                </Form.Text>
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
                                    <option value="NotKnow">
                                        Lo desconozco
                                    </option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group
                                className="mb-3"
                                controlId="formNewProjectPostalCode"
                            >
                                <Form.Label className="body-2">
                                    ¿Cual es el codigo postal de la propiedad?
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
                                    profesionales activos en la zona.
                                </Form.Text>
                            </Form.Group>
                            <Button
                                onClick={handleSave}
                                className="btn-round btn-high"
                                variant="primary"
                                // type="submit"
                            >
                                Guardar y continuar
                            </Button>
                        </Form>
                    </Col>
                </Col>
                <Row className="nuevoProyectoMensaje w-100">
                    <Col className="p-4 col-10">
                        <span className="headline-xl textBlanco">
                            INGRESAR DATOS DE CONTACTO
                        </span>
                        <p className="body-1 textBlanco">
                            Hasta cuatro Comerciantes calificados te contactaran
                            para aplicar con una cotización a tu proyecto.{' '}
                            <br />
                            Para garantizar la mejor respuesta asegúrate que tus
                            datos son exactos, solo compartiremos tu numero con
                            los comerciantes calificados interesados, por favor
                            responde a su llamada.
                        </p>
                    </Col>
                    {/* Detalles de contacto */}
                    <Registro showLogo={false} className="pb-4"></Registro>
                </Row>
            </Container>
        </>
    )
}

export default NuevoProyecto
