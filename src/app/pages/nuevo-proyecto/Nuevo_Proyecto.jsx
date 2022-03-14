// Pagina de NuevoProyecto
import * as React from 'react'
import '../../../../public/assets/css/nuevo_proyecto.css'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const NuevoProyecto = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="pageContainer">
                    <div className="nuevoProyectoBuscador row">
                        <Col className="col-md-4 align-items-start">
                            <Col className="opacidadNegro">
                                <span className="headline-l">
                                    {' '}
                                    Con ayuda de la comunidad haz realidad la
                                    casa que deseas. Encuentra un profesional
                                    Seguro y Confiable, para cada trabajo. Desde
                                    iluminación y pequeños arreglos, hasta
                                    diseños de ingeniería y remodelaciones
                                    completas.
                                </span>
                            </Col>
                        </Col>
                        <div className="col">
                            {/*se importa buscador del home */}
                        </div>
                    </div>
                </Row>{' '}
                <Col className="nuevoProyectoBuscador2">
                    <Col className="col-md-6 align-items-start">
                        {' '}
                        <p className="p-description">
                            compara precios de los mejores profesionales
                            calificados{' '}
                        </p>
                        <form action="" className="body-1">
                            2. Crea una oferta <br />
                            Dejanos conocer un poco más hacerca del proyecto que
                            vas a postular
                            <label htmlFor="">¿Que servicio requieres? *</label>
                            <input type="text" name="" id="" />
                            Categorias
                            <label htmlFor="">
                                ¿Cuantas habitaciones y/o espacios seran
                                intervenidos?
                            </label>
                            <input type="text" name="" id="" />
                            Por favor especifica
                            <label htmlFor="">
                                ¿Han sido diseñados planos arquitectonicos para
                                este proyecto?
                            </label>
                            <select name="" id="">
                                <option value="">Aprobados,</option>
                                <option value="">Aplicado,</option>
                                <option value="">Sin aplicar aun,</option>
                                <option value="">no estoy seguro,</option>
                                <option value="">
                                    no son necesarios en esta oportunidad
                                </option>
                            </select>
                            <label htmlFor="">
                                ¿Cúal es el estado de los permisos para este
                                proyecto?
                            </label>
                            <select name="" id="">
                                <option value="">Aprobados,</option>
                                <option value="">Aplicado,</option>
                                <option value="">Sin aplicar aun,</option>
                                <option value="">no estoy seguro,</option>
                                <option value="">
                                    no son necesarios en esta oportunidad
                                </option>
                            </select>
                            Cargar fotos imagenes y documentos relacionados{' '}
                            <br />* Campos requeridos
                        </form>
                    </Col>
                </Col>
                <Col className="nuevoProyectoBuscador3">
                    <Col className="col-md-6 align-items-start">
                        <form action="">
                            3. Información Adicional <br />
                            Detalles Adicionales
                            <label htmlFor="">
                                ¿Con cuál disponibilidad de horario y tiempo
                                cuenta para prestar el servicio a usted? *
                            </label>
                            <input
                                type="text"
                                name="disponibilidad"
                                id="disponibilidad"
                            />
                            <label htmlFor="">¿Qué tipo de propiedad es?</label>
                            <select name="tipoPropiedad" id="tipoPropiedad">
                                {' '}
                                Selecciona el tipo de propiedad,
                                <option value="">
                                    Propiedad Colonial (1800 - 1920),{' '}
                                </option>
                                <option value="">
                                    Propiedad suburbana (1920-1960),{' '}
                                </option>
                                <option value="">
                                    Propiedad moderna (1960-presente),{' '}
                                </option>
                                <option value="">otra, </option>
                                <option value="">lo desconozco</option>
                            </select>
                            <label htmlFor="">
                                ¿Cual es el codigo postal de la propiedad?
                            </label>
                            <input
                                type="text"
                                name="codigoPostal"
                                id="codigoPostal"
                            />
                            <label htmlFor="">
                                DESCRIBE EL TIPO DE SERVICIO QUE NECESITAS *
                            </label>
                            <textarea
                                defaultValue="provee información adicional aquí, como
                                especificaciones de tecnica y materiales
                                requeridos que el comerciante calificado deba
                                conocer."
                                id="tipoServicio"
                                cols="30"
                                rows="10"
                            ></textarea>
                            <input type="text" name="" id="" placeholder="" />
                            <span>* Campos requeridos</span>
                        </form>
                    </Col>
                </Col>
                <Col className="nuevoProyectoMensaje">
                    <span className="headline-xl">
                        INGRESAR DATOS DE CONTACTO
                    </span>
                    <p className="body-1">
                        Hasta cuatro Comerciantes calificados te contactaran
                        para aplicar con una cotización a tu proyecto. <br />
                        Para garantizar la mejor respuesta asegúrate que tus
                        datos son exactos, solo compartiremos tu numero <br />
                        con los comerciantes calificados interesados, por favor
                        responde a su llamada. Detalles de contacto
                    </p>
                </Col>
            </Container>
        </>
    )
}

export default NuevoProyecto
