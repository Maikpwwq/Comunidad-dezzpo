import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import './comentarPerfil.css'
import {
    App as SendBirdApp,
    Channel,
    withSendBird,
} from '@sendbird/uikit-react'

// import SendbirdSelectors from '@sendbird/uikit-react/SendbirdSelectors'

function ComentarPerfil(props) {
    const { channelUrl } = props
    const [currentChannelUrl, setCurrentChannelUrl] = useState(channelUrl)
    const [showSettings, setShowSettings] = useState(false)
    // const { userId, accessToken, connect, createChannel, sdk } = props
    // var sb = new SendBirdApp({
    //     appId: process.env.VITE_APP_SENDBIRD_APPID,
    //     userId: userId,
    // })
    // console.log('sb', sb)

    // const conectarSB = (userId, accessToken) => {
    //     connect(userId, accessToken)
    //         .then((user) => {
    //             console.log('user', user)
    //         })
    //         .catch((error) => {
    //             console.log('error', error)
    //         })
    // }
    // const crearCanal = (userId) => {
    //     // console.log(sdk)
    //     if (typeof sdk.GroupChannelParams == 'function') {
    //         const param = new sdk.GroupChannelParams()
    //         param.addUserIds([userId])
    //         param.setName('Comentarios')
    //         // console.log('param', param)
    //         createChannel(param)
    //             .then((channel) => {
    //                 const { url, name, coverUrl, members } = channel
    //                 console.log('channel', url, name, coverUrl, members)
    //             })
    //             .catch((error) => {
    //                 console.log('error', error)
    //             })
    //     }
    // }
    // useEffect(() => {
    //     if (typeof connect == 'function') {
    //         // console.log(typeof connect, connect)
    //         conectarSB(userId, accessToken)
    //     }
    // }, [typeof connect == 'function'])
    // useEffect(() => {
    //     if (typeof createChannel == 'function' && typeof sdk === 'object') {
    //         // console.log(typeof createChannel, connect)
    //         crearCanal(userId)
    //     }
    // }, [typeof createChannel == 'function' && sdk])

    // var sb = new SendBirdApp({ appId: import.meta.env.VITE_APP_SENDBIRD_APPID })
    //Mark the Message as Delivered
    // SendBird.markAsDelivered(channelUrl);
    // sb.groupChannel.markAsDelivered(CHANNEL_URL); markAsRead(CHANNEL_URL);

    // useEffect(() => {
    //     if (channel?.unreadMessageCount) {
    //       markAsRead();
    //     }
    // }, [markAsRead, messages, channel]);
    // SendbirdSelectors.getSdk
    // const param = sb.GroupChannelParams()
    // param.addUsers([userId])
    // SendbirdSelectors.getCreateChannel(param, (channel, error) => {
    //     if (error) {
    //         console.error('Error:', error)
    //     }
    //     console.log(channel)
    // })

    return (
        <div className="comentar-perfil">
            <div className="comentar-perfil_container">
                <div className="comentar-perfil_conversation-container">
                    <Channel
                        channelUrl={currentChannelUrl}
                        replyType="QUOTE_REPLY"
                        onChatHeaderActionClick={() => {
                            setShowSettings(true)
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

ComentarPerfil.propTypes = {
    channelUrl: PropTypes.string.isRequired,
    // userId: PropTypes.string.isRequired,
    // accessToken: PropTypes.string.isRequired,
    // connect: PropTypes.func.isRequired,
    // createChannel: PropTypes.func.isRequired,
    // sdk: PropTypes.object.isRequired,
}

export default withSendBird(ComentarPerfil, (state) => ({
    // Mapping context state to props
    // connect: SendbirdSelectors.getConnect(state),
    // createChannel: SendbirdSelectors.getCreateGroupChannel(state),
    // sdk: SendbirdSelectors.getSdk(state),
}))
