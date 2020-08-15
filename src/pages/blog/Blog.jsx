// Pagina de Blog
import React from 'react';
import {Link} from 'react-router-dom';

const Blog = props => {
    render ( 
        <React.Fragment>
            <main class="section">
                <div class="mainContainer">
                    <div class="blogTitulo">
                        <span class="mainTitulo"> <h1>BLOG</h1> </span>
                    </div>
                    <div class="testimonioPropietarios">
                        <span class="testimoniosTitulo"><p>Testimonios de Propietarios</p></span>                
                        <div class="mainCol">
                            <div class="container">
                                <div class="row">
                                    <div class="col">
                                        <span> usuario: </span>
                                        <div>
                                            <img src="assets/img/iconos/User1.svg" alt="ImagenPerfil" height="130px" width="130px"/>
                                        </div>
                                        <span> ACREDITADO </span>
                                    </div>
                                    <div><p>No encontraba en quien depositar mi confianza, la restauracion <br/>
                                        de mis muebles es una realidad y estoy feliz</p>
                                    </div>
                                    <div>
                                        <img src="assets/img/BlogEntrada1.png" alt="ImagenServicio" height="170px" width="330px"/>
                                    </div>
                                </div>                        
                            </div>                
                            <div class="container">
                                <div class="row">
                                    <div class="col">
                                        <span> usuario: </span>
                                        <div>
                                            <img src="assets/img/iconos/User2.svg" alt="ImagenPerfil" height="130px" width="130px"/>
                                        </div>
                                        <span> ACREDITADO </span>
                                    </div>
                                    <div><p>La familia se crecio y la casa esta nuevamente llena de vida, <br/>
                                        contratar la ampliación de los espacios fue  algo muy sencillo</p>
                                    </div>
                                    <div>
                                        <img src="assets/img/BlogEntrada2.png" alt="ImagenServicio" height="170px" width="330px"/>
                                    </div>
                                </div>                                                
                            </div>
                            <div class="container">
                                <div class="row">
                                    <div class="col">
                                        <span> usuario: </span>
                                        <div>
                                            <img src="assets/img/iconos/User3.svg" alt="ImagenPerfil" height="130px" width="130px"/>
                                        </div>
                                        <span> ACREDITADO </span>
                                    </div>
                                    <div> <p>Pasaron años antes de que me decidiera, ahora los problemas <br/>
                                        de humedad ya son cosas del pasado </p>
                                    </div>
                                    <div>
                                        <img src="assets/img/BlogEntrada3.png" alt="ImagenServicio" height="170px" width="330px"/>
                                    </div>
                                </div>                         
                            </div>
                        </div>
                    </div>
                </div>
            </main> 
        </React.Fragment>
    )
};

export default Blog;