// Pagina de Asesorias
import React from 'react';
import {Link} from 'react-router-dom';

const Asesorias = props => {
    render ( 
        <React.Fragment>
            <main class="section">
                <div class="container">
                    {/* Mensaje del Banner izquierda */}
                    <div class="asesoriasTitulo">
                        <span class="opacidadNegro"> ASESORÍAS EN VIVO <br/>
                            <p class="asesoriaMessage">
                                Consulta a un profesional de la comunidad, y resulve ya las <br/>
                                dudas que tengas en cuanto a tecnicas, especificaciones de <br/>
                                materiales, alcance, tiempo y costo, de tu nuevo proyecto.
                            </p>
                        </span>                
                    </div>            
                    <div class="asesoriasPreguntas">
                        <div class="row">
                            <div class="col1">
                                <h1>¿Requieres de una asesoria?</h1>
                                <p>Nuestra comunidad de comerciantes calificados te ayudaran con tus inquietudes.</p>
                                <h2>Realiza una pregunta a un profesional</h2>
                                <span>obten ayuda gratuita de la comunidad</span> <br/>
                                <form action="">
                                    <input type="text" name="" id="" placeholder="dale un titulo a tu pregunta"/><br/>
                                    <label for="">¿Qué quisieras conocer?</label><br/>
                                    <textarea name="" id="" rows="5" cols="30">
                                        Recuerda entre mas detallado puedas
                                        describirlo mejores respuestas obtendras
                                    </textarea> <br/>
                                    <select name="" id="">
                                        <optgroup> categorias
                                            <option value="">Nuevo</option>
                                            <option value="">Controversial</option>
                                            <option value="">Destacado</option>
                                        </optgroup>                                
                                    </select>
                                    <button class="btn">
                                        PUBLICAR
                                    </button> 
                                </form>
                            </div>
                            <div class="col2">
                                <span class="chatAsesor"> Contacta Con Un Asesor <br/> en Tiempo Real En Nuestro Chat
                                </span> <br/>
                                <button class="btn" onclick="">
                                    CHAT EN VIVO
                                </button>
                            </div>
                        </div>                                
                    </div>
                    <div class="asesoriasBlog">
                        <div class="row">
                            <div class="col3">
                                <p>
                                    Postulando una pregunta, estas creando una cuenta gratuita y accediento <br/>
                                    a aceptar nuestra <Link to="/legal">politica de privacidad</Link> y los <Link to="/legal">terminos de uso</Link>
                                </p>
                                <h2>Historial de preguntas de la comunidad</h2>
                                <p>
                                    Revisa las ultimas preguntas y respuestas de la comunidad, y participa.
                                </p>
                            </div>
                            <div class="col2">
                                <button class="btn">
                                    BLOG DE LA COMUNIDAD
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main> 
        </React.Fragment>
    )
};

export default Asesorias;