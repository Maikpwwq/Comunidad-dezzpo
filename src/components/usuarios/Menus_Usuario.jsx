// Pagina de Usuario - MenusUsuario
import React from 'react'

const MenusUsuario = (props) => {
    render(
        <React.Fragment>
            <div>
                <section className="section">
                    <nav className="userNavigation">
                        <div className="container">
                            <div className="navigationGroup">
                                <div>
                                    <div className="">
                                        <a href="">
                                            <img src="" alt="" />
                                        </a>
                                    </div>
                                    <div>
                                        <div>
                                            <label htmlFor="">
                                                <div></div>
                                                <input
                                                    type="text"
                                                    type="search"
                                                    placeholder="Buscar"
                                                    autoComplete="off"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <ul>
                                        <li>
                                            <span>
                                                <div>
                                                    <a href="">Ver tu perfil</a>
                                                </div>
                                            </span>
                                        </li>
                                        <li>
                                            <span>
                                                <div>
                                                    <a href="">Mensajes</a>
                                                </div>
                                            </span>
                                        </li>
                                        <li>
                                            <span>
                                                <div>
                                                    <a href="">
                                                        Notificaciones
                                                    </a>
                                                </div>
                                            </span>
                                        </li>
                                        <li>
                                            <span>
                                                <div>
                                                    <a href="">
                                                        Portal de servicios
                                                    </a>
                                                </div>
                                            </span>
                                        </li>
                                        <li>
                                            <span>
                                                <div>
                                                    <a href="">
                                                        Historial de servicio
                                                    </a>
                                                </div>
                                            </span>
                                        </li>
                                        <li>
                                            <span>
                                                <div>
                                                    <a href="">Certificación</a>
                                                </div>
                                            </span>
                                        </li>
                                        <li>
                                            <span>
                                                <div>
                                                    <a href="">Suscripciones</a>
                                                </div>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </nav>
                </section>
                <main>
                    <section className="section">
                        <div className="container">
                            <div className="row">
                                <div className="menuContent col l2">
                                    <div className="menuGroup">
                                        <span>Menu</span>
                                        <ul>
                                            <li>
                                                <div>
                                                    <a href="../../../index.html">
                                                        Inicio
                                                    </a>
                                                </div>
                                            </li>
                                            <li>
                                                <div>
                                                    <a href="">
                                                        Calificaciones
                                                    </a>
                                                </div>
                                            </li>
                                            <li>
                                                <div>
                                                    <a href="">Biblioteca</a>
                                                </div>
                                            </li>
                                            <li>
                                                <div>
                                                    <a href="">
                                                        Invitar a un Amigo
                                                    </a>
                                                </div>
                                            </li>
                                            <li>
                                                <div>
                                                    <a href="">Ajustes</a>
                                                </div>
                                            </li>
                                            <li>
                                                <div>
                                                    <a href="">
                                                        Formas de Pago
                                                    </a>
                                                </div>
                                            </li>
                                            <li>
                                                <div>
                                                    <a href="">
                                                        Configuracion Privacidad
                                                    </a>
                                                </div>
                                            </li>
                                            <li>
                                                <div>
                                                    <a href="">Cambiar Clave</a>
                                                </div>
                                            </li>
                                            <li>
                                                <div>
                                                    <button>
                                                        Cerrar Sesión
                                                    </button>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="contentLoader col l8"></div>
                                <div className="sideLoader col l2"></div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </React.Fragment>
    )
}

export default MenusUsuario
