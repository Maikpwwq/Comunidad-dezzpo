// Pagina de Usuario - Perfil
import React from 'react'

const Perfil = (props) => {
    return (
        <React.Fragment>
            <main>
                <section className="section">
                    <div className="col">
                        <div className="container row">
                            <div className="col l3">
                                <div>
                                    <img src="" alt="imagen de perfil" />
                                    <button>+ Agregar foto de perfil</button>
                                </div>
                            </div>
                            <div className="col l2">
                                <form action="">
                                    <input
                                        type="text"
                                        placeholder="@NOMBRE USUARIO"
                                    />
                                    <input
                                        type="text"
                                        placeholder="@CORREO USUARIO"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Profesión"
                                    />
                                    <input
                                        type="text"
                                        placeholder="se unio en 2020"
                                    />
                                    <input
                                        type="text"
                                        placeholder="experiencia 3"
                                    />
                                    <br />
                                    certificaciones
                                </form>
                            </div>
                            <div className="col l3">
                                <span>2 ratings</span>
                            </div>
                        </div>
                        <div className="container">
                            <div>
                                <span>
                                    <p>
                                        Mauricio Morales <br />
                                        +57 312855 55 65 <br />
                                        carpinteriamorales@gmail.com <br />
                                    </p>
                                </span>
                                <img src="" alt="Mapa Ubicacion" />
                            </div>
                        </div>
                        <div className="container row">
                            <div className="col l5">
                                <h3>Servicios ofrecidos</h3>
                                <div>
                                    <p>
                                        Proyectos de carpintería y acabados en
                                        madera para su casa o negocio <br />
                                        nos dedicamos a la realización de
                                        muebles y decoración{' '}
                                    </p>
                                </div>
                                <h3>Gallería</h3>
                                <div>
                                    <img src="" alt="" />
                                </div>
                                <div>
                                    <span>comentarios y calificaciones</span>
                                    <span>crear editar</span>
                                    <span>educacion</span>
                                    <span>crear editar</span>
                                </div>
                            </div>
                            <div className="col l3">
                                <div>
                                    <form action="">
                                        <div>
                                            <span>Datos de contacto</span>
                                        </div>
                                        <input
                                            type="text"
                                            name=""
                                            id=""
                                            placeholder="ubicación"
                                        />
                                        <input
                                            type="text"
                                            name=""
                                            id=""
                                            placeholder="Razon social"
                                        />
                                        <input
                                            type="text"
                                            name=""
                                            id=""
                                            placeholder="Identificación"
                                        />
                                        <input
                                            type="text"
                                            name=""
                                            id=""
                                            placeholder="Correo"
                                        />
                                        <input
                                            type="text"
                                            name=""
                                            id=""
                                            placeholder="Celular"
                                        />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </React.Fragment>
    )
}

export default Perfil
