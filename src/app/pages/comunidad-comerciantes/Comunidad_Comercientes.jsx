// Pagina de Comunidad Comerciantes
import React from 'react'
import '../../../../public/assets/css/comunidad_comerciantes.css'

import Registro from '../../pages/registro/Registro'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const ComunidadComerciantes = (props) => {
    let checkStyle = {
        width: '30px',
    }

    return (
        <>
            <Container fluid className="p-0">
                <Row className="comunidadComerciantesTitulo m-0 d-flex flex-row justify-content-start">
                    <Col className="col-md-8 col-lg-6 align-items-start">
                        <Col className="opacidadNegro">
                            <span className="pitchComerciantes">
                                {' '}
                                <h2 className="headline-xl textBlanco">
                                    ¿TE FALTA GESTIÓN?, DÉJANOS REPRESENTAR TU
                                    TRABAJO GARANTIZAMOS UNA NOTABLE MEJORA EN
                                    INGRESOS Y OPORTUNIDADES DE CRECIMIENTO{' '}
                                </h2>
                            </span>
                            <p className="body-2">
                                {' '}
                                Propietarios y proyectos listos para contactar,
                                trabajo cuando lo necesitas, con cada plan de
                                afiliacion, obtendras al menos la misma cantidad
                                de beneficios. Haz que tus clientes potenciales
                                conozcan lo que tienes para ofrecer.
                            </p>
                            <h3 className=".headline-l textVerde">
                                {' '}
                                Solicita Tu Membresia Ahora{' '}
                            </h3>
                        </Col>
                    </Col>
                </Row>
            </Container>

            <Container fluid className="p-0">
                <Row className="comunidadComerciantesRegistro  m-0">
                    <Col className="" md={6} lg={6}>
                        <h2 className="headline-xl"> COMUNIDAD COMERCIANTES</h2>
                    </Col>
                    <Registro showLogo={false}></Registro>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="comunidadComerciantesBeneficios m-0 justify-content-start">
                    <Col
                        className="colLeft"
                        md={6}
                        style={{
                            'padding-left': '30px',
                            'padding-top': '0px',
                        }}
                    >
                        <div className="containerGreen">
                            <span className="pitchComerciantes subrayar">
                                <h3 className="headline-l textBlanco">
                                    Para tu negocio
                                </h3>
                            </span>
                            <p>
                                Encuentra nuevos clientes facilmente y mantente
                                ocupado, con nuestros planes de publicidad
                                perfil aparecera arriba en las busquedas de
                                Google, accede a un Micro sitio personalizado,
                                diseñado y construido segun tus requerimientos.
                            </p>
                            <span className="pitchComerciantes subrayar">
                                <h3 className="headline-l textBlanco">
                                    Para ti
                                </h3>
                            </span>
                            <p>
                                Aumenta tu influencia con el respaldo de la
                                comunidad, Gestiona tus estadisticas, la
                                Calificaciones es valorada segun tres aspectos:{' '}
                                <br />
                                <br />
                                <strong>
                                    `{'>'}` Gestion `{'>'}` Calidad `{'>'}`
                                    Oportunidad del servicio.
                                </strong>{' '}
                                <br />
                                <br />
                                Avisos instantaneos por email de nuevos
                                requerimientos de servicio en el area donde
                                quieres trabajar.
                                <br />
                            </p>
                            <span className="pitchComerciantes subrayar">
                                <h3 className="headline-l textBlanco">
                                    Invita A Un Amigo
                                </h3>
                            </span>
                            <p>
                                Con el programa de referidos te premiamos por
                                recomendar a la comunidad y, ayuda así la
                                Transformación digital inmobiliaria.
                                <br />
                                Invita tus amigos a que se registren al programa{' '}
                                compartiendo tu código único, envía el{' '}
                                <strong>Link</strong> a tus contactos, acumula
                                puntos, obtén descuentos y llévate premios.
                                <br />
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="comunidadComerciantesBeneficios2  m-0">
                    <Col className="p-4" md={8}>
                        <span className="pitchComerciantes">
                            <h2 className="headline-xl">
                                El plan de beneficios con la membresía incluye
                            </h2>
                        </span>
                        <p className="body-2">
                            Nosotros creamos los anuncios de contenido así que
                            no tendras que preocuparte de hacerlo.
                            <br />
                            <br />
                            según tus necesidades, así el costo varia con la
                            cantidad de contenidos (posts digitales), el lugar
                            de aparicion dentro de nuestros productos, <br />
                            <br />
                            la etapa en que se encuentra su negocio, la duración
                            de publicación del anuncio y el análisis de datos
                            requerido.
                            <br />
                        </p>
                        <span className="pitchComerciantes">
                            <h3 className="headline-l">
                                ¿Cuáles son las grandes ventajas de hacer
                                publicidad en Internet?
                            </h3>
                        </span>
                        <ul>
                            <span className="pitchComerciantes">
                                <p className="body-2">
                                    Alcance y visibilidad. <br />
                                </p>
                            </span>
                            <li className="body-1">
                                Hay personas que te estan buscando y aún no
                                saben que existes. <br />
                                Promociona las 24 horas del día y los 365 días
                                del año, con el <br />
                                mejor servicio al cliente para mostrar toda tu
                                experiencia de servicio.
                            </li>
                            <br />
                            <span className="pitchComerciantes">
                                <p className="body-2">
                                    Audiencia calificada y segmentada.
                                    <br />
                                </p>
                            </span>
                            <li className="body-1">
                                Alcance sus objetivos de crecimiento, nuestro
                                público cautivo
                                <br />
                                comprende usuarios visitantes únicos del sitio
                                web, seguidores en redes
                                <br />
                                sociales, y relaciones construidas la industria.
                            </li>
                            <br />
                            <span className="pitchComerciantes">
                                <p className="body-2">
                                    Mejora la penetración de tu marca. <br />
                                </p>
                            </span>
                            <li className="body-1">
                                Posiciónese en el mercado digital, fideliza
                                clientes y captura ventas, <br />
                                Publica generando reconociendo de marca por
                                buenas prácticas y buen desempeño.
                            </li>
                            <br />
                            <span className="pitchComerciantes">
                                <p className="body-2">
                                    Mide el rendimiento de tus anuncios.
                                    <br />
                                </p>
                            </span>
                            <li className="body-1">
                                Adopta herramientas de gestión estratégica CEO,
                                tendrás un Informe de <br />
                                resultados en tiempo real, con el cual
                                monitorear aquello que están <br />
                                comunicando tus posibles clientes.
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default ComunidadComerciantes
