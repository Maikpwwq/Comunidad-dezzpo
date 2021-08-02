// Pagina de Comunidad Comerciantes
import React from 'react'
import '../../../public/assets/css/comunidad_comerciantes.css'

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
                <Row className="comunidadComerciantesTitulo  m-0 d-flex flex-row justify-content-start">
                    <Col className="opacidadNegro" md={6}>
                        <span className="pitchComerciantes">
                            {' '}
                            <h2>
                                ¿TE FALTA GESTIÓN?, DÉJANOS REPRESENTAR <br />
                                TU TRABAJO GARANTIZAMOS UNA NOTABLE <br />
                                MEJORA EN INGRESOS Y OPORTUNIDADES DE
                                CRECIMIENTO{' '}
                            </h2>
                        </span>
                        <p>
                            {' '}
                            Propietarios y proyectos listos para contactar,
                            trabajo cuando lo <br />
                            necesitas, con cada plan de afiliacion, obtendras al
                            menos la <br />
                            misma cantidad de beneficios. Haz que tus clientes{' '}
                            <br />
                            potenciales conozcan lo que tienes para ofrecer.
                        </p>
                        <span className="blueAlert">
                            {' '}
                            Solicita Tu Membresia Ahora{' '}
                        </span>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="comunidadComerciantesRegistro  m-0">
                    <Col
                        className="colLeft"
                        md={4}
                        style={{ 'padding-left': '0px' }}
                    >
                        <div className="registrateformulario">
                            <form id="formularioRegistro" action="">
                                <span className="pitchComerciantes">
                                    <h2>
                                        {' '}
                                        COMUNIDAD <br />
                                        COMERCIANTES
                                    </h2>
                                </span>
                                <label htmlFor=""> NOMBRE </label>
                                <br />
                                <input type="text" id="" name="" required />
                                <br />
                                <label htmlFor=""> CONTRASEÑA </label>
                                <br />
                                <input type="password" id="" name="" required />
                                <br />
                                <label htmlFor="">
                                    {' '}
                                    CONFIRME LA CONTRASEÑA{' '}
                                </label>
                                <br />
                                <input type="password" id="" name="" required />
                                <br />
                                <input
                                    type="checkbox"
                                    name=""
                                    id=""
                                    style={checkStyle}
                                    required
                                />{' '}
                                NO SOY UN ROBOT <br />
                                <button> CREAR CUENTA</button>
                                <hr />
                                <span>BIENVENIDO</span>
                                <br />
                            </form>
                        </div>
                    </Col>
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
                                <h2>Para tu negocio</h2>
                            </span>
                            <p>
                                Encuentra nuevos clientes facilmente y mantente
                                ocupado, con nuestros planes de publicidad
                                perfil aparecera arriba en las busquedas de
                                Google, accede a un Micro sitio personalizado,
                                diseñado y construido segun tus requerimientos.
                            </p>
                            <span className="pitchComerciantes subrayar">
                                <h2>Para ti</h2>
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
                                <h2>Invita A Un Amigo</h2>
                            </span>
                            <p>
                                Con el programa de referidos te premiamos por
                                recomendar a la comunidad y, ayuda así la
                                Transformación digital inmobiliaria.
                                <br />
                                Invita tus amigos a que se registren al programa{' '}
                                <br />
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
                    <Col md={8}>
                        <span className="pitchComerciantes">
                            <h1>
                                El plan de beneficios con la membresía incluye
                            </h1>
                        </span>
                        <p>
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
                            <h1>
                                ¿Cuáles son las grandes ventajas de hacer
                                publicidad en Internet?
                            </h1>
                        </span>
                        <ul>
                            <span className="pitchComerciantes">
                                <h2>
                                    Alcance y visibilidad. <br />
                                </h2>
                            </span>
                            <li>
                                Hay personas que te estan buscando y aún no
                                saben que existes. <br />
                                Promociona las 24 horas del día y los 365 días
                                del año, con el <br />
                                mejor servicio al cliente para mostrar toda tu
                                experiencia de servicio.
                            </li>
                            <br />
                            <span className="pitchComerciantes">
                                <h2>
                                    Audiencia calificada y segmentada.
                                    <br />
                                </h2>
                            </span>
                            <li>
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
                                <h2>
                                    Mejora la penetración de tu marca. <br />
                                </h2>
                            </span>
                            <li>
                                Posiciónese en el mercado digital, fideliza
                                clientes y captura ventas, <br />
                                Publica generando reconociendo de marca por
                                buenas prácticas y buen desempeño.
                            </li>
                            <br />
                            <span className="pitchComerciantes">
                                <h2>
                                    Mide el rendimiento de tus anuncios.
                                    <br />
                                </h2>
                            </span>
                            <li>
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
