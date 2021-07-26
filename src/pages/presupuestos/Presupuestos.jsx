// Pagina de Presupuestos
import React from 'react'
import '../../../public/assets/css/presupuestos.css'

const Presupuestos = (props) => {
    return (
        <>
            <main className="section">
                <div className="pageContainer">
                    <div className="presupuestosMensaje">
                        <span>
                            {' '}
                            Solicitalo online, en menos tiempo, totalmente{' '}
                            <br />
                            gratuito y sin compromiso.{' '}
                        </span>
                        <span>
                            Contamos con los mejores precios del mercado de
                            reformas, conocer el costo <br />
                            que tiene desarrollar tu proyecto ahora, y procede a
                            elegir el que te brinde <br />
                            más confianza, mayor calidad, y el mejor costo{' '}
                            <br />
                        </span>
                    </div>
                    <div className="presupuestosMensajeBuscador row">
                        <div className="col">
                            <span>
                                Publica tu proyecto gratis, los profesionales
                                disponibles te <br />
                                contactaran para ofrecer su presupuesto
                            </span>
                            <p>
                                Anuncia gratuitamente un trabajo. <br />
                                Lee comentarios, recibe cotizaciones y sigue las
                                recomendaciones para contratar.
                            </p>
                        </div>
                        <div className="col">se importa buscador del home</div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Presupuestos
