// Pagina de Usuario - ConfiguracionPrivacidad
import React from 'react'

const ConfiguracionPrivacidad = (props) => {
    return (
        <React.Fragment>
            <main>
                <div className="section">
                    <div className="container">
                        <ul>
                            <li>
                                Quien puede ver las publicaciones de tu perfil{' '}
                            </li>
                            <li>Quien puede responder a tus solicitudes </li>
                            <li>Quien puede ver tu lista de amigos </li>
                            <li>
                                Quien puede buscarte con el numero de telefono
                                que proporcionaste{' '}
                            </li>
                            <li>
                                Quien puede buscarte con el correo electronico
                                que proporcionaste{' '}
                            </li>
                        </ul>
                        <span>Publico</span>
                        <span>Editar</span>
                    </div>
                </div>
            </main>
        </React.Fragment>
    )
}

export default ConfiguracionPrivacidad
