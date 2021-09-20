// Pagina de Usuario - FormasPago
import React from 'react'

const FormasPago = (props) => {
    return (
        <React.Fragment>
            <main>
                <section className="section">
                    <div className="container">
                        <div>
                            <span>
                                <h2>Formas de Pago</h2>{' '}
                            </span>
                            <label for="">Adicionar Forma de Pago</label>
                            <select name="" id="">
                                <option value="Tarjetas">
                                    Tarjeta Debito o Credito
                                </option>
                                <option value="Efectivo">Efectivo</option>
                                <option value="Baloto">Vía Baloto</option>
                                <option value="Efecty">Efecty</option>
                            </select>
                        </div>
                        <div>
                            <span>
                                <h2>Tickets de pago</h2>{' '}
                            </span>
                            <ul>
                                <li>Fecha</li>
                                <li>Orden de Servicios</li>
                                <li>Vigencia</li>
                                <li>Estado</li>
                                <li>Pagar en linea</li>
                                <li>Descargar</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </main>
        </React.Fragment>
    )
}

export default FormasPago
