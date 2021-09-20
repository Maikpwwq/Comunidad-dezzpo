// Pagina de Usuario - Certificaciones
import React from 'react'

const Certificaciones = (props) => {
    return (
        <React.Fragment>
            <main>
                <div className="section">
                    <div className="container">
                        <p>
                            Bienvenido al modulo de evaluación y Certificación
                            por Competencias Laborales
                        </p>
                        <p>
                            El desempeño real de las personas se compara con un
                            referente que es la Norma de Competencia <br />
                            Laboral y/o el esquema de certificación, así tu
                            experiencia es promovida y reconocida. Con el apoyo
                            <br />
                            de la Dirección del Sistema Nacional de Formación
                            para el Trabajo DSNFT
                        </p>
                        <p>
                            La insignia de validación de habilidades, aumentan
                            las posibilidades laborales, al permitir brindar{' '}
                            <br />
                            mayor confianza a los propietarios, y acceder
                            facilmente a proyectos de mayor complejidad{' '}
                        </p>
                        <span>
                            {' '}
                            <h2>
                                ¿Listo para solicitar una? Programa una visita
                            </h2>
                        </span>
                        <form action="">
                            <span>Certificación</span>
                            <br />
                            <label for="">Fecha</label>
                            <input type="text" placeholder="Selecciona" />
                            <br />
                            <label for="">Hora</label>
                            <input type="text" placeholder="Selecciona" />
                            <br />
                            <label for="">Servicio</label>
                            <input type="text" placeholder="Selecciona" />
                            <br />
                            <button>Valor de la Gestión</button>
                        </form>
                    </div>
                </div>
            </main>
        </React.Fragment>
    )
}

export default Certificaciones
