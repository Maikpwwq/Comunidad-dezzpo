// Pagina de Inicio
import React from 'react'
import '../../../public/assets/css/home.css'

// imagenes
import LocalCiudades from '../../../public/assets/img/LocalCiudades.png'
import CategoriasPopulares from '../../../public/assets/img/CategoriasPopulares.png'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Inicio = () => {
    return (
        <>
            <Container fluid className="p-0">
                <Row
                    style={{ width: '100%' }}
                    className="m-0"
                    id="bannerComunidad"
                >
                    {/* imagen fondo */}
                    <Col id="contenedorBanner" className="m-0 p-0">
                        {/* Mensaje del Banner izquierda */}
                        <div className="slogan">
                            <span className="opacidadNegro">
                                {' '}
                                <p>
                                    <strong>
                                        <em>
                                            {' '}
                                            Hemos facilitado el servicio, <br />
                                            haciendolo más rapido y <br />
                                            simple que nunca{' '}
                                        </em>
                                    </strong>
                                </p>{' '}
                                <h1> Unete a la Comunidad </h1>{' '}
                            </span>
                        </div>
                        {/* Formulario nuevo proyecto */}
                        <div className="contenerdorFormulario">
                            <form action="" id="formularioServicios">
                                <div className="formularioBusqueda1">
                                    <label htmlFor="">
                                        ¿Qué tipo de profesional necesitas?
                                    </label>
                                    <div className="casillaSeleccion">
                                        <select
                                            name="seleccionarProfesional"
                                            id="seleccionarProfesional"
                                        >
                                            {' '}
                                            {/* type="text" value="Selecciona un profesional listado #1" */}
                                            <option value="administradores PH">
                                                {' '}
                                                administradores PH{' '}
                                            </option>
                                            <option value="Afinadores de muros y acabados">
                                                {' '}
                                                Afinadores de muros y acabados{' '}
                                            </option>
                                            <option value=" Aisladores acústicos ">
                                                {' '}
                                                Aisladores acústicos{' '}
                                            </option>
                                            <option value="Integradores Control de acceso ">
                                                {' '}
                                                Integradores Control de acceso{' '}
                                            </option>
                                            <option value=" Albañiles ">
                                                {' '}
                                                Albañiles{' '}
                                            </option>
                                            <option value="Artesanos">
                                                {' '}
                                                Artesanos{' '}
                                            </option>
                                            <option value="Arquitectos">
                                                {' '}
                                                Arquitectos{' '}
                                            </option>
                                            <option value="Toderos">
                                                {' '}
                                                Toderos{' '}
                                            </option>
                                            <option value="Técnico en automatización">
                                                {' '}
                                                Técnico en automatización{' '}
                                            </option>
                                            <option value=" Técnico en domótica ">
                                                {' '}
                                                Técnico en domótica{' '}
                                            </option>
                                            <option value="Carpinteros">
                                                {' '}
                                                Carpinteros{' '}
                                            </option>
                                            <option value="Carpinteros del aluminio">
                                                {' '}
                                                Carpinteros del aluminio
                                            </option>
                                            <option value="Carpinteros de metales ">
                                                {' '}
                                                Carpinteros de metales{' '}
                                            </option>
                                            <option value="Cerrajeros ">
                                                {' '}
                                                Cerrajeros{' '}
                                            </option>
                                            <option value="Constructoras">
                                                {' '}
                                                Constructoras{' '}
                                            </option>
                                            <option value=" Instaladores Cocinas ">
                                                {' '}
                                                Instaladores Cocinas{' '}
                                            </option>
                                            <option value="Instaladores Baños ">
                                                {' '}
                                                Instaladores Baños{' '}
                                            </option>
                                            <option value="Controladores de plagas">
                                                {' '}
                                                Controladores de plagas{' '}
                                            </option>
                                            <option value="Centros de diseño grafico">
                                                {' '}
                                                Centros de diseño grafico{' '}
                                            </option>
                                            <option value="Técnico en drenajes e inundaciones">
                                                {' '}
                                                Técnico en drenajes e
                                                inundaciones{' '}
                                            </option>
                                            <option value="Electricistas">
                                                {' '}
                                                Electricistas{' '}
                                            </option>
                                            <option value=" Geólogos ">
                                                {' '}
                                                Geólogos{' '}
                                            </option>
                                            <option value="Ferreteros ">
                                                Ferreteros{' '}
                                            </option>
                                            <option value=" Técnico en gasodomésticos y refrigeración ">
                                                {' '}
                                                Técnico en gasodomésticos y
                                                refrigeración{' '}
                                            </option>
                                            <option value="Impermeabilizadores">
                                                {' '}
                                                Impermeabilizadores{' '}
                                            </option>
                                            <option value="Instaladores de Adoquín">
                                                Instaladores de Adoquín
                                            </option>
                                            <option value="Instaladores de cableado estructurado">
                                                {' '}
                                                Instaladores de cableado
                                                estructurado{' '}
                                            </option>
                                            <option value="Instaladores de cerámica ">
                                                {' '}
                                                Instaladores de cerámica{' '}
                                            </option>
                                            <option value="Instaladores de cubiertas">
                                                {' '}
                                                Instaladores de cubiertas{' '}
                                            </option>
                                            <option value="Instaladores de parques">
                                                {' '}
                                                Instaladores de parques{' '}
                                            </option>
                                            <option value="Instaladores de ventanas">
                                                {' '}
                                                Instaladores de ventanas{' '}
                                            </option>
                                            <option value=" Jardineros ">
                                                {' '}
                                                Jardineros{' '}
                                            </option>
                                            <option value=" Lavanderías ">
                                                {' '}
                                                Lavanderías{' '}
                                            </option>
                                            <option value=" Técnicos de Tanques de agua ">
                                                {' '}
                                                Técnicos de Tanques de agua{' '}
                                            </option>
                                            <option value=" Técnicos de Limpiezas técnicas ">
                                                {' '}
                                                Técnicos de Limpiezas técnicas{' '}
                                            </option>
                                            <option value=" Maestros de Obra ">
                                                {' '}
                                                Maestros de Obra{' '}
                                            </option>
                                            <option value=" Ayudantes de mudanzas ">
                                                {' '}
                                                Ayudantes de mudanzas{' '}
                                            </option>
                                            <option value=" Ayudantes de movilizaciones ">
                                                {' '}
                                                Ayudantes de movilizaciones{' '}
                                            </option>
                                            <option value="Mecanicos">
                                                {' '}
                                                Mecanicos{' '}
                                            </option>
                                            <option value=" Paisajistas ">
                                                {' '}
                                                Paisajistas{' '}
                                            </option>
                                            <option value="Pintores ">
                                                Pintores{' '}
                                            </option>
                                            <option value="Plomeros ">
                                                Plomeros{' '}
                                            </option>
                                            <option value="Tecnicos de redes">
                                                Tecnicos de redes
                                            </option>
                                            <option value=" Reparadores de piscinas ">
                                                {' '}
                                                Reparadores de piscinas{' '}
                                            </option>
                                            <option value=" Asistentes de servicio domestico ">
                                                {' '}
                                                Asistentes de servicio domestico{' '}
                                            </option>
                                            <option value=" Técnico en seguridad electrónica ">
                                                {' '}
                                                Técnico en seguridad electrónica{' '}
                                            </option>
                                            <option value=" Tapicería ">
                                                {' '}
                                                Tapiceros{' '}
                                            </option>
                                            <option value=" Trabajadores de piedras ">
                                                {' '}
                                                Trabajadores de piedras{' '}
                                            </option>
                                        </select>
                                        <span className="icon-LupaFomularioIcono">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                            <span className="path3"></span>
                                            <span className="path4"></span>
                                            <span className="path5"></span>
                                        </span>
                                    </div>
                                    <label htmlFor="">
                                        ¿Qué tipo de proyecto es?
                                    </label>
                                    <div className="casillaSeleccion">
                                        <select
                                            name="seleccionarServicio"
                                            id="seleccionarServicio"
                                        >
                                            {' '}
                                            {/* type="text" value="Selecciona el trabajo listado #2" */}
                                            <option value="Administraciones PH">
                                                {' '}
                                                Administraciones PH{' '}
                                            </option>
                                            <option value="Acabados en muros">
                                                {' '}
                                                Acabados en muros{' '}
                                            </option>
                                            <option value="Aislamiento acústico">
                                                {' '}
                                                Aislamiento acústico{' '}
                                            </option>
                                            <option value="Control de acceso">
                                                {' '}
                                                Control de acceso{' '}
                                            </option>
                                            <option value="Albañilería">
                                                {' '}
                                                Albañilería{' '}
                                            </option>
                                            <option value="Artesanías y manualidades ">
                                                {' '}
                                                Artesanías y manualidades{' '}
                                            </option>
                                            <option value="Arquitectura">
                                                {' '}
                                                Arquitectura{' '}
                                            </option>
                                            <option value="Asistencia toderos">
                                                {' '}
                                                Asistencia toderos{' '}
                                            </option>
                                            <option value="Automatización">
                                                {' '}
                                                Automatización{' '}
                                            </option>
                                            <option value="Domótica">
                                                {' '}
                                                Domótica{' '}
                                            </option>
                                            <option value="Carpintería">
                                                {' '}
                                                Carpintería{' '}
                                            </option>
                                            <option value="Carpintería en aluminio">
                                                Carpintería en aluminio
                                            </option>
                                            <option value="Carpintería metálica">
                                                Carpintería metálica
                                            </option>
                                            <option value="Cerrajería">
                                                {' '}
                                                Cerrajería{' '}
                                            </option>
                                            <option value="Construcción obra">
                                                {' '}
                                                Construcción obra{' '}
                                            </option>
                                            <option value="Reformas Cocinas">
                                                {' '}
                                                Reformas Cocinas{' '}
                                            </option>
                                            <option value="Reformas Baños">
                                                {' '}
                                                Reformas Baños{' '}
                                            </option>
                                            <option value="Control de plagas">
                                                {' '}
                                                Control de plagas{' '}
                                            </option>
                                            <option value="Diseño e impresión">
                                                {' '}
                                                Diseño e impresión{' '}
                                            </option>
                                            <option value="Drenajes e inundaciones">
                                                {' '}
                                                Drenajes e inundaciones{' '}
                                            </option>
                                            <option value="Electricidad">
                                                {' '}
                                                Electricidad{' '}
                                            </option>
                                            <option value="Estudios de suelos">
                                                {' '}
                                                Estudios de suelos{' '}
                                            </option>
                                            <option value="Ferreterías">
                                                Ferreterías
                                            </option>
                                            <option value="Gasodomésticos y refrigeración">
                                                {' '}
                                                Gasodomésticos y refrigeración{' '}
                                            </option>
                                            <option value="Impermeabilización">
                                                {' '}
                                                Impermeabilización{' '}
                                            </option>
                                            <option value="Instalación de adoquín">
                                                Instalación de adoquín
                                            </option>
                                            <option value="Instalación de cableado estructurado">
                                                {' '}
                                                Instalación de cableado
                                                estructurado{' '}
                                            </option>
                                            <option value="Instalación de cerámica">
                                                {' '}
                                                Instalación de cerámica{' '}
                                            </option>
                                            <option value="Instalación de cubiertas">
                                                {' '}
                                                Instalación de cubiertas{' '}
                                            </option>
                                            <option value="Instalación de parques">
                                                {' '}
                                                Instalación de parques{' '}
                                            </option>
                                            <option value="Instalación de ventanas">
                                                {' '}
                                                Instalación de ventanas{' '}
                                            </option>
                                            <option value=" Jardinería ">
                                                {' '}
                                                Jardinería{' '}
                                            </option>
                                            <option value=" Lavandería ">
                                                {' '}
                                                Lavandería{' '}
                                            </option>
                                            <option value=" Tanques de agua ">
                                                {' '}
                                                Tanques de agua{' '}
                                            </option>
                                            <option value=" Limpiezas técnicas ">
                                                {' '}
                                                Limpiezas técnicas{' '}
                                            </option>
                                            <option value=" Maestro Obra ">
                                                {' '}
                                                Maestro Obra{' '}
                                            </option>
                                            <option value=" Mudanzas ">
                                                {' '}
                                                Mudanzas{' '}
                                            </option>
                                            <option value=" Movilizar pesos ">
                                                {' '}
                                                Movilizar pesos{' '}
                                            </option>
                                            <option value="Mecanica">
                                                Mecanica
                                            </option>
                                            <option value=" Paisajismo ">
                                                {' '}
                                                Paisajismo{' '}
                                            </option>
                                            <option value="Pintura ">
                                                Pintura{' '}
                                            </option>
                                            <option value="Plomería ">
                                                Plomería{' '}
                                            </option>
                                            <option value="Redes cableado estructurado ">
                                                Redes cableado estructurado{' '}
                                            </option>
                                            <option value=" Reformas Piscinas ">
                                                {' '}
                                                Reformas Piscinas{' '}
                                            </option>
                                            <option value=" Servicio doméstico ">
                                                {' '}
                                                Servicio doméstico{' '}
                                            </option>
                                            <option value=" Sistemas de Seguridad y alarmas ">
                                                {' '}
                                                Sistemas de Seguridad y alarmas{' '}
                                            </option>
                                            <option value=" Tapicería ">
                                                {' '}
                                                Tapicería{' '}
                                            </option>
                                            <option value=" Trabajos en piedra ">
                                                {' '}
                                                Trabajos en piedra{' '}
                                            </option>
                                        </select>
                                        <span className="icon-LupaFomularioIcono">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                            <span className="path3"></span>
                                            <span className="path4"></span>
                                            <span className="path5"></span>
                                        </span>
                                    </div>
                                    <button
                                        className="animacionBoton"
                                        type="submit"
                                    >
                                        {' '}
                                        Siguiente{' '}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="m-0" style={{ width: '100%' }}>
                    {/* Mensaje del Banner inferior*/}
                    <Col className="mensajeBanner" md={12}>
                        <p>
                            {' '}
                            Encuentra aqui un profesional Seguro y<br />
                            Confiable para cada trabajo. Desde iluminación y
                            pequeños arreglos, hasta diseños de ingeniería y
                            remodelaciones remodelaciones completas.{' '}
                        </p>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                {/* Seccion de Registro */}
                <Row id="registrate" className="m-0">
                    <Col className="registrateImagen m-0"></Col>
                    <Col className="registrateformulario m-0">
                        <form id="formularioRegistro" action="">
                            <div>
                                <h1>REGISTRATE</h1>
                                <p>
                                    bienvenido a todos los beneficios de dezzpo
                                </p>
                                <label htmlFor="">Nombre</label>
                                <br />
                                <input type="text" value="" />
                                <br />
                                <label htmlFor="">Nombre de usuario</label>
                                <br />
                                <input type="text" value="" />
                                <br />
                                <label htmlFor="">Email</label>
                                <br />
                                <input type="email" value="" />
                                <br />
                                <label htmlFor="">Contraseña</label>
                                <br />
                                <input type="password" value="" />
                                <br />
                                <label htmlFor="">Confirme la Contraseña</label>
                                <br />
                                <input type="password" value="" />
                                <br />
                                <label htmlFor="">
                                    {' '}
                                    No soy un robot
                                    <input type="checkbox" checked="checkbox" />
                                </label>{' '}
                                <br />
                                <button type="submit">Crear Cuenta</button>
                                <p>Bienvenido</p>
                            </div>
                        </form>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                {/* Seccion de como funciona la comunidad */}
                <Row id="comoFunciona" className="m-0">
                    <Col className="">
                        <h1>¿Como funciona nuestra comunidad?</h1>
                        {/* Propietarios */}
                        <div className="comoPropietarios">
                            <div className="comunidadTitulo">
                                <h2>PROPIETARIOS</h2>
                            </div>
                            <div className="nuevoProyecto">
                                <p>
                                    1 <br />
                                    Crea una nueva oferta gratis <br />
                                    Describe tu proyecto <br />
                                </p>
                            </div>
                            <div className="seleccionaPerfiles">
                                <p>
                                    2 <br />
                                    Selecciona el perfil adecuado y <br />
                                    consigue algunas cotizaciones. <br />
                                    El servicio profesional se pondrá en <br />
                                    contacto con tigo. <br />
                                </p>
                            </div>
                            <div className="calificaServicio">
                                <p>
                                    3 <br />
                                    Califica y comenta. <br />
                                    Finalizo el proyecto, <br />
                                    Dejanos conocer tu experiencia. <br />
                                </p>
                            </div>
                        </div>
                        {/* Comerciantes Calificados */}
                        <div className="comoComerciantes">
                            <div className="comunidadTitulo">
                                <h2>COMERCIANTES CALIFICADOS</h2>
                            </div>
                            <div className="buscarOfertas">
                                <p>
                                    1 <br />
                                    Busca la oferta indicada para ti. <br />
                                    Filtra los proyectos de los <br />
                                    propietarios y postulate. <br />
                                </p>
                            </div>
                            <div className="cargaPresupuesto">
                                <p>
                                    2 <br />
                                    Diligencia el presupuesto <br />
                                    Haz una cotizacion detallada con los datos
                                    suministrados, <br />
                                    en caso de ser escogido por el propietario
                                    para desarrollar el <br />
                                    servicio, nos pagaras una comisión por el
                                    servicio prestado <br />
                                </p>
                            </div>
                            <div className="calificaPropietario">
                                <p>
                                    3 <br />
                                    Califica y comenta. <br />
                                    Finalizo el proyecto, <br />
                                    Dejanos conocer tu experiencia. <br />
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                {/* Afuturo importar como contenedor de categorias y servicios */}
                {/* seccion de categorias y servicios */}
                <Row id="popularCategorias" className="m-0">
                    <Col className="">
                        <h1> NUESTRA COMUNIDAD </h1>
                        <p>
                            Tenemos una gran cantidad de profesionales que
                            quieren trabajar en su proyecto.
                        </p>
                        <img
                            src={CategoriasPopulares}
                            alt="Categorias Populares entre la Comunidad"
                            height="170"
                            width="900"
                        />
                    </Col>
                    <Col className="categoriasPopulares">
                        <h2>
                            {' '}
                            o encuentralos dentro de las categorías populares:
                        </h2>
                        <ul>
                            <li>
                                Pintor y decorador, Pintura y decoracion de
                                interiores{' '}
                            </li>
                            <li>
                                Electricista, Instalación y validación de
                                acometidas electricas{' '}
                            </li>
                            <li>
                                Instaladores de techos y cubiertas,
                                mantenimiento de cubiertas{' '}
                            </li>
                            <li>Maestro, Construcciones y ampliaciones </li>
                            <li>Plomero, reparacion de fugas </li>
                            <li>Carpinteria, instalacion de closets, más </li>
                        </ul>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                {/* seccion de categorias y servicios */}
                <Row id="categoriasServicios" className="m-0">
                    <Col>
                        <div className="tituloServicios">
                            <h1>Nuestro comerciantes y servicios</h1>
                        </div>{' '}
                        <br />
                        <div className="contratistasReformas">
                            <div>
                                <ul>
                                    <li>
                                        {' '}
                                        Administraciones PH `{'>'}`
                                        administradores PH{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Acabados en muros`{'>'}` Afinadores de
                                        muros y acabados{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Aislamiento acústico`{'>'}` Aisladores
                                        acústicos{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Control de acceso `{'>'}` Integradores
                                        Control de acceso{' '}
                                    </li>
                                    <li> Albañilería `{'>'}` Albañiles </li>
                                    <li>
                                        {' '}
                                        Artesanías y manualidades `{'>'}`
                                        Artesanos{' '}
                                    </li>
                                    <li> Arquitectura `{'>'}` Arquitectos </li>
                                    <li>
                                        {' '}
                                        Asistencia toderos `{'>'}` Toderos{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Automatización `{'>'}` Técnico en
                                        automatización{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Domótica `{'>'}` Técnico en domótica{' '}
                                    </li>
                                    <li> Carpintería `{'>'}` Carpinteros </li>
                                    <li>
                                        {' '}
                                        Carpintería en aluminio `{'>'}`
                                        Carpinteros de aluminio{' '}
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul>
                                    <li>
                                        {' '}
                                        Carpintería metálica `{'>'}` Carpinteros
                                        de metales{' '}
                                    </li>
                                    <li> Cerrajería `{'>'}` Cerrajeros </li>
                                    <li>
                                        {' '}
                                        Construcción obra `{'>'}` Constructoras{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Reformas Cocinas `{'>'}` Instaladores
                                        Cocina{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Reformas Baños `{'>'}` Instaladores
                                        Baños{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Control de plagas `{'>'}` Controladores
                                        de plagas{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Diseño e impresión `{'>'}` Centros de
                                        diseño grafico{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Drenajes e inundaciones `{'>'}` Técnico
                                        en drenajes e inundaciones{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Electricidad `{'>'}` Electricistas{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Estudios de suelos `{'>'}` Geólogos{' '}
                                    </li>
                                    <li> Ferreterías `{'>'}` Ferreteros </li>
                                    <li>
                                        {' '}
                                        Gasodomésticos y refrigeración `{'>'}`
                                        Técnico en gasodomésticos y
                                        refrigeración{' '}
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul>
                                    <li>
                                        {' '}
                                        Impermeabilización `{'>'}`
                                        Impermeabilizadores{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Instalación de adoquín `{'>'}`
                                        Instaladores de Adoquín{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Instalación de cableado estructurado `
                                        {'>'}` Instaladores de cableado
                                        estructurado{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Instalación de cerámica `{'>'}`
                                        Instaladores de cerámica{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Instalación de cubiertas `{'>'}`
                                        Instaladores de cubiertas{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Instalación de parques `{'>'}`
                                        Instaladores de parques{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Instalación de ventanas `{'>'}`
                                        Instaladores de ventanas{' '}
                                    </li>
                                    <li> Jardinería `{'>'}` Jardineros </li>
                                    <li> Lavandería `{'>'}` Lavanderías </li>
                                    <li>
                                        {' '}
                                        Tanques de agua `{'>'}` Técnicos de
                                        tanques de aguas{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Limpiezas técnicas `{'>'}` Técnicos de
                                        limpiezas técnicas{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Maestro Obra `{'>'}` Maestros de obra{' '}
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul>
                                    <li>
                                        {' '}
                                        Mudanzas `{'>'}` Ayudantes de mudanzas{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Movilizar pesos `{'>'}` Ayudantes de
                                        movilizaciones{' '}
                                    </li>
                                    <li> Mecánica `{'>'}` Mecánicos </li>
                                    <li> Paisajismo `{'>'}` Paisajistas </li>
                                    <li> Pintura `{'>'}` Pintores </li>
                                    <li> Plomería `{'>'}` Plomeros </li>
                                    <li>
                                        {' '}
                                        Redes cableado estructurado `{'>'}`
                                        Tecnicos en redes{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Reformas Piscinas `{'>'}` Reparadores de
                                        piscinas{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Servicio doméstico `{'>'}` Asistentes de
                                        servicio domestico{' '}
                                    </li>
                                    <li>
                                        {' '}
                                        Sistemas de Seguridad y alarmas `{'>'}`
                                        Técnico en seguridad electrónica{' '}
                                    </li>
                                    <li> Tapicería `{'>'}` Tapiceros </li>
                                    <li>
                                        {' '}
                                        Trabajos en piedra `{'>'}` Trabajadores
                                        de piedras{' '}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                {/* seccion de comerciantes Locales*/}
                <Row id="comerciantesLocales" className="m-0">
                    <Col>
                        <div className="localCiudades">
                            <h1>Busca en tu ciudad comerciantes calificados</h1>
                            <div className="ciudades">
                                <ul>
                                    <li>Bogota</li>
                                    <li>Medellin</li>
                                    <li>Cali</li>
                                </ul>
                                <ul>
                                    <li>Villavicencio</li>
                                    <li>Chia</li>
                                    <li>Cota</li>
                                </ul>
                                <ul>
                                    <li>Funza</li>
                                    <li>Mosquera</li>
                                    <li>Zipaquira</li>
                                </ul>
                            </div>
                            <img
                                src={LocalCiudades}
                                alt="Busca Comerciantes Locales"
                                height="121px"
                                width="500px"
                            />
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Inicio
