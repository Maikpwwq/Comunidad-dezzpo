import React from 'react'
// import es from 'date-fns/locale/es'
import PropTypes from 'prop-types'
// import {
//     withSendBird,
//     sendbirdSelectors,
// } from '@sendbird/uikit-react'
// import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
// import { v4 as uuidv4 } from 'uuid'
import '@sendbird/uikit-react/dist/index.css'

// Custom
import { ComentarPerfil } from '#@/pages/app/components/ComentarPerfil'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

export { Comentarios }

/* Place Holder */

// import PlaceHolder, {
//     PlaceHolderTypes,
// } from '@sendbird/uikit-react/ui/PlaceHolder'

/* Channel */

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

/* Channel List */

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

/* Create Channel */

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

/* Channel Settings */

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

/* DATA */

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

// Usuario principal de la aplicación
// let userId = import.meta.env.VITE_APP_SENDBIRD_USERID
// let accessToken = import.meta.env.VITE_APP_SENDBIRD_APPTOKEN
let appId = import.meta.env.VITE_APP_SENDBIRD_APPID

const Comentarios = (props) => {
    const { channelUrl, userID, nickname } = props //
    console.log(channelUrl)
    // console.log(appId, userId)
    // user.updateMetaData or user.createMetaData

    return (
        <>
            <Container fixed className="p-2">
                <Box sx={{ bgcolor: '#cfe8fc' }}>
                    {/* <SendbirdProvider
                        appId={appId} // Sendbird application ID.
                        userId={userID} // user Auth ID.
                        nickname={nickname} // user Auth Name.
                        // accessToken={accessToken}
                        // dateLocale={es}
                    > */}
                        <ComentarPerfil channelUrl={channelUrl} />
                        {/* <CreateChannel />
                        <ChannelList />
                        <Channel />
                        <ChannelSettings /> */}
                    {/* </SendbirdProvider> */}
                    {/* <SendbirdDefaultChat /> */}
                </Box>
            </Container>
        </>
    )
}

Comentarios.propTypes = {
    userID: PropTypes.string,
    channelUrl: PropTypes.string,
    nickname: PropTypes.string,
}

// const Component = withSendBird(Comentarios)

// export { Component }
