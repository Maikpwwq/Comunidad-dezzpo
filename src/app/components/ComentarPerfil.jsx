import React, { useState } from 'react' // , useEffect, useCallback
import PropTypes from 'prop-types'
import './comentarPerfil.css'
import {
    // App as SendBirdApp,
    // Channel,
    OpenChannel,
    // withSendBird,
} from '@sendbird/uikit-react'

// import sendbirdSelectors from '@sendbird/uikit-react/SendbirdSelectors'
// import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext'

// import TextareaAutosize from '@mui/material/TextareaAutosize'

// import Avatar from '@mui/material/Avatar'
// import Box from '@mui/material/Box'
// import Button from '@mui/material/Button'
// import Container from '@mui/material/Container'
// import IconButton from '@mui/material/IconButton'
// import ListItem from '@mui/material/ListItem'
// import ListItemButton from '@mui/material/ListItemButton'
// import ListItemIcon from '@mui/material/ListItemIcon'
// import ListItemText from '@mui/material/ListItemText'
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
// import AddCommentIcon from '@mui/icons-material/AddComment'

// export { ComentProfile }
export { ComentarPerfil }

function ComentarPerfil(props) {
    // const commentUserPhotoUrl = ''
    // const commentUserName = 'Nombre Usuario'
    // const commentDate = 'Hace x cantidad de tiempo'
    // const commentBody = 'Aqui va el cuerpo del comentario'
    // const commentsNumber = '4'
    // const iconUp = <ArrowUpwardIcon />
    // const iconDown = <ArrowDownwardIcon />
    // const iconComments = <AddCommentIcon />

    // const globalStore = useSendbirdStateContext()
    // const sbSdk = sendbirdSelectors.getSdk(globalStore)
    // const connect = sendbirdSelectors.getConnect(globalStore)
    // const createChannel = sendbirdSelectors.getCreateOpenChannel(globalStore)

    const { channelUrl } = props
    const [currentChannelUrl] = useState(channelUrl) //, setCurrentChannelUrl
    console.log('currentChannelUrl', currentChannelUrl)
    // const [showSettings, setShowSettings] = useState(false)
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
                    {/* Todo activate OpenChannel */}
                    {/* <OpenChannel channelUrl={currentChannelUrl} /> */}
                    {/* <Channel
                        channelUrl={currentChannelUrl}
                        replyType="QUOTE_REPLY"
                        onChatHeaderActionClick={() => {
                            setShowSettings(true)
                        }}
                    /> */}
                </div>
                {/* Modelo deseado de hilo de comentarios */}
                {/* <Container fixed>
                    <Box sx={{}}>
                        <Box sx={{}}>
                            <ListItem sx={{}}>
                                <ListItemIcon>
                                    <IconButton color="inherit" sx={{ p: 0.5 }}>
                                        <Avatar
                                            src={commentUserPhotoUrl}
                                            alt="My Avatar"
                                        />
                                    </IconButton>
                                </ListItemIcon>
                                <ListItemText>{commentUserName}</ListItemText>
                                <ListItemText>{commentDate}</ListItemText>
                            </ListItem>
                            <p>{commentBody}</p>
                            <ListItem>
                                <ListItemButton>
                                    <ListItemIcon>{iconUp}</ListItemIcon>
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemText>
                                        {commentsNumber}
                                    </ListItemText>
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemIcon>{iconDown}</ListItemIcon>
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemIcon>{iconComments}</ListItemIcon>
                                    <ListItemText>Responder</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        </Box>
                    </Box>
                    <Button>Crear</Button>
                    <Button>Editar</Button>
                </Container> */}
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

// const Component = withSendBird(ComentarPerfil, (state) => ({
// Mapping context state to props
// connect: SendbirdSelectors.getConnect(state),
// createChannel: SendbirdSelectors.getCreateGroupChannel(state),
// sdk: SendbirdSelectors.getSdk(state),
// }))

// export { Component }
