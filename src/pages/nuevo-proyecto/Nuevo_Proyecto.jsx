// Pagina de NuevoProyecto
import React from 'react';

const NuevoProyecto = props => {
    render ( 
        <React.Fragment>
            <main class="section">
                <div class="container">
                    <div class="nuevoProyectoBuscador row">
                        <div class="col">
                            <span> Con ayuda de la comunidad haz realidad la casa que deseas. <br/>

                                Encuentra un profesional Seguro y Confiable, para cada trabajo. <br/>
                                Desde iluminación y pequeños arreglos, hasta diseños de <br/>
                                ingeniería y remodelaciones completas.</span>
                        </div>
                        <div class="col">
                            {/*se importa buscador del home */}
                        </div>                
                    </div>
                    <div class="nuevoProyectoBuscador2">
                        <p>compara precios de los mejores profesionales calificados </p>                
                        <form action="">
                            2. Crea una oferta <br/>
                            Dejanos conocer un poco más hacerca del proyecto que vas a postular
                            <label for="">¿Que servicio requieres? *</label>
                            <input type="text" name="" id=""/>Categorias
                            <label for="">¿Cuantas habitaciones y/o espacios seran intervenidos?</label>
                            <input type="text" name="" id=""/>Por favor especifica
                            <label for="">¿Han sido diseñados planos arquitectonicos para este proyecto?</label>
                            <select name="" id="">
                                <option value="">Aprobados,</option>
                                <option value="">Aplicado,</option>
                                <option value="">Sin aplicar aun,</option>
                                <option value="">no estoy seguro,</option>
                                <option value="">no son necesarios en esta oportunidad</option>
                            </select>
                            <label for="">¿Cúal es el estado de los permisos para este proyecto?</label>
                            <select name="" id="">
                                <option value="">Aprobados,</option>
                                <option value="">Aplicado,</option>
                                <option value="">Sin aplicar aun,</option>
                                <option value="">no estoy seguro,</option>
                                <option value="">no son necesarios en esta oportunidad</option>
                            </select>
                            Cargar fotos imagenes y documentos relacionados <br/>
                            * Campos requeridos
                        </form>
                    </div>
                    <div class="nuevoProyectoBuscador3">
                        <form action="">
                            3. Información Adicional <br/>
                            Detalles Adicionales                     
                            <label for="">¿Con cuál disponibilidad de horario y tiempo cuenta para prestar el servicio a usted? *</label>
                            <input type="text" name="" id=""/>
                            <label for="">¿Qué tipo de propiedad es?</label>                    
                            <select name="" id=""> Selecciona el tipo de propiedad, 
                                <option value="">Propiedad Colonial (1800 - 1920), </option>
                                <option value="">Propiedad suburbana (1920-1960), </option>
                                <option value="">Propiedad moderna (1960-presente), </option>
                                <option value="">otra, </option>
                                <option value="">lo desconozco</option>
                            </select>
                            <label for="">¿Cual es el codigo postal de la propiedad?</label>
                            <input type="text" name="" id=""/>
                            <label for="">DESCRIBE EL TIPO DE SERVICIO QUE NECESITAS *</label>
                            <textarea>
                                provee información adicional aquí, como especificaciones de tecnica y materiales <br/>
                                requeridos que el comerciante calificado deba conocer.
                            </textarea>
                            <input type="text" name="" id="" 
                                placeholder=""/>
                            <span>* Campos requeridos</span>
                        </form>
                    </div>
                    <div class="nuevoProyectoMensaje">
                        <span>INGRESAR DATOS DE CONTACTO</span>
                        <p>Hasta cuatro Comerciantes calificados te contactaran para aplicar con una cotización a tu proyecto. <br/>
                            Para garantizar la mejor respuesta asegúrate que tus datos son exactos, solo compartiremos tu numero <br/>
                            con los comerciantes calificados interesados, por favor responde a su llamada. Detalles de contacto</p>
                    </div>
                </div>
            </main>
        </React.Fragment>
    )
};

export default NuevoProyecto;