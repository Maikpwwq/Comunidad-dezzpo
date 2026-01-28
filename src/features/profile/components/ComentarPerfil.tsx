/**
 * ComentarPerfil Component
 *
 * Profile comment/chat section using Sendbird OpenChannel.
 * Migrated from src/app/components/ComentarPerfil.jsx
 *
 * Note: Most Sendbird functionality is currently commented out
 * pending full integration setup.
 */

import React, { useState } from 'react'
// Sendbird UIKit (uncomment when ready)
// import { OpenChannel } from '@sendbird/uikit-react'


export interface ComentarPerfilProps {
    /** Sendbird channel URL for the profile */
    channelUrl: string
}

export function ComentarPerfil({ channelUrl }: ComentarPerfilProps): React.ReactElement {
    const [currentChannelUrl] = useState(channelUrl)

    // Debug log (remove in production)
    if (import.meta.env.DEV) {
        console.log('ComentarPerfil channelUrl:', currentChannelUrl)
    }

    return (
        <div className="comentar-perfil">
            <div className="comentar-perfil_container">
                <div className="comentar-perfil_conversation-container">
                    {/* TODO: Activate Sendbird OpenChannel when ready */}
                    {/* <OpenChannel channelUrl={currentChannelUrl} /> */}

                    {/* Placeholder content */}
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                        <p>Comentarios del perfil</p>
                        <small>Integración de chat próximamente</small>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ComentarPerfil
