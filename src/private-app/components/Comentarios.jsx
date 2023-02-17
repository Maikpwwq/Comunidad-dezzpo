import React from 'react'
import es from 'date-fns/locale/es'
import PropTypes from 'prop-types'
import {
    withSendBird,
    // App as SendBirdApp,
    // sendbirdSelectors,
} from '@sendbird/uikit-react'
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
// import { v4 as uuidv4 } from 'uuid'
// import '@sendbird/uikit-react/dist/index.css?inline'
// Custom
import ComentarPerfil from './ComentarPerfil'

// import PlaceHolder, {
//     PlaceHolderTypes,
// } from '@sendbird/uikit-react/ui/PlaceHolder'

// import {
//     useChannelList,
//     ChannelListProvider,
// } from '@sendbird/uikit-react/ChannelList/context'
// import ChannelList from '@sendbird/uikit-react/ChannelList'
// import { default as ChannelListUI } from '@sendbird/uikit-react/ChannelList/components/ChannelListUI'
// import {
//     ChannelListUI,
//     ChannelListHeader,
//     ChannelPreview,
//     AddChannel,
// } from '@sendbird/uikit-react/ChannelList/components'

// import {
//     useCreateChannel,
//     CreateChannelProvider,
// } from '@sendbird/uikit-react/CreateChannel/context'
// import CreateChannel from '@sendbird/uikit-react/CreateChannel'
// import {
//     CreateChannelUI,
//     SelectChannelType,
//     InviteMembers,
// } from '@sendbird/uikit-react/CreateChannel/components'

// import {
//     useChannelSettings,
//     ChannelSettingsProvider,
// } from '@sendbird/uikit-react/ChannelSettings/context'
// import ChannelSettings from '@sendbird/uikit-react/ChannelSettings'
// import {
//     ChannelSettingsUI,
//     AdminPanel,
//     UserPanel,
//     ChannelProfile,
//     UserListItem,
//     LeaveChannel,
//     EditDetailsModal,
// } from '@sendbird/uikit-react/ChannelSettings'

// import {
//     ChannelProvider,
//     useChannel,
// } from '@sendbird/uikit-react/Channel/context'
// import Channel from '@sendbird/uikit-react/Channel'
// import {
//     ChannelUI,
//     ChannelHeader,
//     MessageList,
//     Message,
//     MessageInput,
//     FrozenNotification,
//     FileViewer,
//     UnreadCount,
//     RemoveMessageModal,
// } from '@sendbird/uikit-react/Channel/components'

// 437537 user-id
// sendbird_group_channel_179991212_627f98622487de769dc04cdfbca472d60b475841 URL Requerimientos
// sendbird_open_channel_105119_a8418ea54e6e9db091b80a5e5cfd8aafbcf7af44 Comentarios

// export { Chat }

// .Chat {
//     Font-family: sans-serif;
//     Text-align: center;
//     height: 58vh;   // Add this line.
//     width: 85vw;   // Add this line.
// }

// import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
// import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
// import IconButton from '@mui/material/IconButton'
// import ListItem from '@mui/material/ListItem'
// import ListItemButton from '@mui/material/ListItemButton'
// import ListItemIcon from '@mui/material/ListItemIcon'
// import ListItemText from '@mui/material/ListItemText'
// import TextareaAutosize from '@mui/material/TextareaAutosize'

// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
// import AddCommentIcon from '@mui/icons-material/AddComment'

const Comentarios = (props) => {
    // const commentUserPhotoUrl = ''
    // const commentUserName = 'Nombre Usuario'
    // const commentDate = 'Hace x cantidad de tiempo'
    // const commentBody = 'Aqui va el cuerpo del comentario'
    // const commentsNumber = '4'
    // const iconUp = <ArrowUpwardIcon />
    // const iconDown = <ArrowDownwardIcon />
    // const iconComments = <AddCommentIcon />

    // Usuario principal de la aplicación
    let userId = import.meta.env.VITE_APP_SENDBIRD_USERID
    // process.env.VITE_APP_SENDBIRD_APPTOKEN
    let appId = import.meta.env.VITE_APP_SENDBIRD_APPID
    const { userID, channelUrl, nickname } = props
    console.log(userID, channelUrl, nickname, userId)
    // user.updateMetaData or user.createMetaData

    {
        /* <SendBirdApp
            appId={appId} // Sendbird application ID.
            userId={userId} // user ID.
            nickname={nickname}
            accessToken={accessToken}
            dateLocale={es}
            >
            User will be created if it is not present in the server
        </SendBirdApp> */
    }

    return (
        <>
            <Container fixed className="p-2">
                <Box sx={{ bgcolor: '#cfe8fc' }}>
                    <SendbirdProvider
                        appId={appId} // Sendbird application ID.
                        userId={userID} // user ID.
                        nickname={nickname}
                        // accessToken={accessToken}
                        dateLocale={es}
                    >
                        <ComentarPerfil
                            userId={userID}
                            channelUrl={channelUrl}
                            // accessToken={accessToken}
                        />
                        {/* <CreateChannel />
                        <ChannelList />
                        <Channel />
                        <ChannelSettings /> */}
                    </SendbirdProvider>
                </Box>
            </Container>
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
                                <ListItemText>{commentsNumber}</ListItemText>
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
        </>
    )
}

Comentarios.propTypes = {
    userID: PropTypes.string,
    channelUrl: PropTypes.string,
    nickname: PropTypes.string,
}

export default withSendBird(Comentarios)
