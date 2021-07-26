// Pagina de Blog
import React from 'react'
import '../../../public/assets/css/blog.css'
import { Link } from 'react-router-dom'

const Blog = (props) => {
    return (
        <>
            <main className="section">
                <div className="mainContainer">
                    <div className="blogTitulo">
                        <span className="mainTitulo">
                            {' '}
                            <h1>BLOG</h1>{' '}
                        </span>
                    </div>
                    <div className="testimonioPropietarios">
                        <span className="testimoniosTitulo">
                            <p>Testimonios de Propietarios</p>
                        </span>
                        <div className="mainCol">
                            <div className="experienciasContainer">
                                <div className="row">
                                    <div className="col">
                                        <span> usuario: </span>
                                        <div>
                                            <img
                                                src="assets/img/iconos/User1.svg"
                                                alt="ImagenPerfil"
                                                height="130px"
                                                width="130px"
                                            />
                                        </div>
                                        <span> ACREDITADO </span>
                                    </div>
                                    <div>
                                        <p>
                                            No encontraba en quien depositar mi
                                            confianza, la restauracion <br />
                                            de mis muebles es una realidad y
                                            estoy feliz
                                        </p>
                                    </div>
                                    <div>
                                        <img
                                            src="assets/img/BlogEntrada1.png"
                                            alt="ImagenServicio"
                                            height="170px"
                                            width="330px"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        <span> usuario: </span>
                                        <div>
                                            <img
                                                src="assets/img/iconos/User2.svg"
                                                alt="ImagenPerfil"
                                                height="130px"
                                                width="130px"
                                            />
                                        </div>
                                        <span> ACREDITADO </span>
                                    </div>
                                    <div>
                                        <p>
                                            La familia se crecio y la casa esta
                                            nuevamente llena de vida, <br />
                                            contratar la ampliación de los
                                            espacios fue algo muy sencillo
                                        </p>
                                    </div>
                                    <div>
                                        <img
                                            src="assets/img/BlogEntrada2.png"
                                            alt="ImagenServicio"
                                            height="170px"
                                            width="330px"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        <span> usuario: </span>
                                        <div>
                                            <img
                                                src="assets/img/iconos/User3.svg"
                                                alt="ImagenPerfil"
                                                height="130px"
                                                width="130px"
                                            />
                                        </div>
                                        <span> ACREDITADO </span>
                                    </div>
                                    <div>
                                        {' '}
                                        <p>
                                            Pasaron años antes de que me
                                            decidiera, ahora los problemas{' '}
                                            <br />
                                            de humedad ya son cosas del pasado{' '}
                                        </p>
                                    </div>
                                    <div>
                                        <img
                                            src="assets/img/BlogEntrada3.png"
                                            alt="ImagenServicio"
                                            height="170px"
                                            width="330px"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Blog
