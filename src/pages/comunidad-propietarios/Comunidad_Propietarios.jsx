// Pagina de Comunidad Propietarios
import React from 'react'
import '../../../public/assets/css/comunidad_propietarios.css'

const ComunidadPropietarios = (props) => {
    let checkStyle = {
        width: '30px',
    }

    return (
        <>
            <main className="section">
                <div className="pageContainer">
                    <div className="comunidadPropietariosTitulo">
                        <div className="opacidadNegro">
                            <span className="pitchPropietarios">
                                {' '}
                                <h2>
                                    SOMOS UNA COMUNIDAD DE COMERCIANTES
                                    PROFESIONALES, <br />
                                    CONTRATA PERSONAL CALIFICADO MANTENIMIENTO
                                    GENERAL <br />
                                    RESIDENCIAL Y DE PROPIEDAD HORIZONTAL,
                                    CONSULTA <br />
                                    PÚBLICAMENTE LOS PERFILES Y LA REPUTACIÓN DE
                                    LOS <br />
                                    PRESTADORES DE SERVICIOS. AHORA TUS
                                    PROYECTOS Y <br />
                                    REMODELACIONES MÁS RÁPIDO Y SIMPLE QUE NUNCA{' '}
                                    <br />
                                </h2>
                            </span>
                            <span className="blueAlert">
                                Contrata seguro con <br />
                                nuestra comunidad
                            </span>
                        </div>
                    </div>
                    <div className="comunidadPropietariosRegistro">
                        <div className="row">
                            <div className="colLeft" style={{"padding-left":"0px"}}>
                                <div className="registrateformulario">
                                    <form id="formularioRegistro" action="">
                                        <span className="pitchPropietarios">
                                            <h2>
                                                {' '}
                                                COMUNIDAD <br />
                                                PROPIETARIOS
                                            </h2>
                                        </span>
                                        <label htmlFor=""> NOMBRE </label>
                                        <br />
                                        <input
                                            type="text"
                                            id=""
                                            name=""
                                            required
                                        />
                                        <br />
                                        <label htmlFor=""> CONTRASEÑA </label>
                                        <br />
                                        <input
                                            type="password"
                                            id=""
                                            name=""
                                            required
                                        />
                                        <br />
                                        <label htmlFor="">
                                            {' '}
                                            CONFIRME LA CONTRASEÑA{' '}
                                        </label>
                                        <br />
                                        <input
                                            type="password"
                                            id=""
                                            name=""
                                            required
                                        />
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
                            </div>
                            <div className="imagenRegistro"></div>
                        </div>
                    </div>
                    <div className="comunidadPropietariosBuscador row">
                        <div className="colLeft">
                            <p>
                                Con ayuda de la comunidad haz realidad la casa
                                que deseas. <br />
                                Encuentra un profesional Seguro y Confiable,
                                para cada trabajo. <br />
                                Desde iluminación y pequeños arreglos, hasta
                                diseños de <br />
                                ingeniería y remodelaciones completas.
                                <br />
                            </p>
                        </div>
                        <div className="col">
                            <form action="">
                                {/*se importa buscador del home */}
                            </form>
                        </div>
                    </div>
                    <div className="comunidadPropietariosConsultar row">
                        <div className="col">
                            <p>
                                Nuestra recomendación esencial al contratar un{' '}
                                <br />
                                comerciante calificado, nunca cancelar la <br />
                                totalidad por adelantado, revisar siempre las{' '}
                                <br />
                                referencias, calificaciones y afiliaciones del
                                perfil.
                                <br />
                            </p>
                            <span className="pitchPropietarios">
                                <h2>Propietario revisa la</h2>
                            </span>
                            <button className="btn" onClick="listaChequeo">
                                lista de chequeo
                            </button>
                            <span>
                                3196138057
                                <br />
                                Lunes a viernes, 8am - 5pm
                                <br />
                                Sabados 9am - 2pm
                                <br />
                            </span>
                        </div>
                        <div className="col">
                            <span className="pitchPropietarios">
                                <h2>Planea con nosotros el proyecto</h2>
                            </span>
                            <p>
                                El espacio de tus sueños comienza con una <br />
                                gran idea y tenemos miles de ellas.
                            </p>
                            <span className="pitchPropietarios">
                                <h2>Observa cambios</h2>
                            </span>
                            <p>
                                Inspirate, tenemos muchos trabajos realizados.
                            </p>
                            <span className="pitchPropietarios">
                                <h2>¿Requieres de asesoria?</h2>
                            </span>
                            <p>
                                Nuestra comunidad de comerciantes <br />
                                calificados te ayudaran con tus inquietudes.
                            </p>
                            <span className="pitchPropietarios">
                                <h2>Presupuestos</h2>
                            </span>
                            <p>
                                Saber cuanto te puede costar es <br />
                                importante para iniciar el proyecto.
                            </p>
                        </div>
                        <div className="col">
                            <button>Nuestro Blog</button>
                            <button>
                                Proyectos <br />
                                Destacados
                            </button>
                            <button>
                                Pregunta a un <br />
                                Profesional
                            </button>
                            <button>
                                Comenzar <br />
                                Cotización
                            </button>
                        </div>
                    </div>
                    <div className="comunidadPropietariosListaVerificacion">
                        <div className="verificarLista" id="listaChequeo">
                            <span className="pitchPropietarios">
                                <h1>LISTA DE VERIFICACION</h1>
                            </span>
                            <ul>
                                <li> Verifica Adecuadamente La Identidad. </li>
                                <li>
                                    {' '}
                                    Que el personal cuente con los elementos de
                                    protección personal requeridos.{' '}
                                </li>
                                <li>
                                    {' '}
                                    Recuerda verificar los certificados tecnicos
                                    y de afiliación propios de cada labor.{' '}
                                    <br />
                                    <strong>
                                        - Trabajo seguro en alturas, arl, eps,
                                        instalaciones gasodomesticas, polizas -
                                    </strong>
                                </li>
                                <li>
                                    {' '}
                                    Diligenciar y firmar debidamente el contrato
                                    de prestación de servicios.{' '}
                                </li>
                                <li>
                                    Las obras que afectan a terceros de la
                                    comunidad, como muros de carga o de fachada,
                                    han de <br />
                                    hacerse saber para conseguir su aprobación.
                                    Sin embargo ten en cuenta que además es
                                    necesario un <br />
                                    permiso de obra que concede la curaduria
                                    urbana, al presentar el proyecto firmado por
                                    un arquitecto.{' '}
                                </li>
                                <li>
                                    {' '}
                                    Cuando hallas elegido el profesional
                                    comerciante calificado para tu proyecto,
                                    descarga y utiliza el <br />
                                    contrato de adquicisión, esto para resolver
                                    discrepancias concretas durante el
                                    desarrollo del servicio.{' '}
                                </li>
                                <li>
                                    Comun mente en el desarrolllo del servicio
                                    surgen imprevistos, estos no son posibles de{' '}
                                    <br />
                                    planear al diseñar, reserva un 5% del
                                    presupuesto en caso de que alguna
                                    eventualidad se presente.{' '}
                                </li>
                                <li>
                                    Expon claramente cualquier aspecto de la
                                    ejecucción que pueda influir con el
                                    resultado final <br />
                                    <strong>
                                        - tiempos de permanencia, color, marca,
                                        tiempos de secado, etc -
                                    </strong>{' '}
                                </li>
                                <li>
                                    Si el proyecto tiene un inpacto energetico
                                    y/o ecologico, Concretamente el <br />
                                    instituto para la, ofrece ayudas y
                                    subvenciones institucionales
                                </li>
                                <span className="blueAlert">
                                    {' '}
                                    Se resuelve la encuesta de satisfacción del
                                    servicio
                                </span>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default ComunidadPropietarios
