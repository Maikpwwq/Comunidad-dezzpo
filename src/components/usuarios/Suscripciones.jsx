// Pagina de Usuario - Suscripciones
import React from 'react'

const Suscripciones = (props) => {
    render(
        <React.Fragment>
            <main>
                <div className="section">
                    <div className="container">
                        <p>El plan de beneficios con la membresía incluye </p>
                        <span>
                            <h2>Como Comerciante Calificado </h2> Adquiere Un
                            Membresia Pagada
                        </span>
                    </div>
                </div>
                <div className="section">
                    <div className="container">
                        <p> El plan de beneficios con la membresía incluye </p>
                        <span>
                            <h2>Como Propietario</h2> Adquiere nuestro servicio
                            de afiliacion + Plus{' '}
                        </span>
                        <ul>
                            <li>Servicio 24 horas para urgencias</li>
                            <li>Todos los servicios disponibles</li>
                            <li>Prioridad al solicitar presupuestos</li>
                            <li>Garantia anti fraude</li>
                        </ul>
                    </div>
                </div>
            </main>
        </React.Fragment>
    )
}

export default Suscripciones
