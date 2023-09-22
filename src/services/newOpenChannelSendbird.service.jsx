import React from 'react'
import PropTypes from 'prop-types'
// import { sendbirdSelectors } from '@sendbird/uikit-react'
import sendbirdSelectors from '@sendbird/uikit-react/sendbirdSelectors'
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext'
// import withSendBird from '@sendbird/uikit-react/withSendbird'

// import { sharingInformationService } from '#@/services/sharing-information'
// let accessToken = import.meta.env.VITE_APP_SENDBIRD_APPTOKEN

export { newOpenChannelSendbird }

const newOpenChannelSendbird = async({uid, displayName}) => {
    console.log('crearCanal props', uid, displayName)
    const globalStore = useSendbirdStateContext()
    const sbSdk = sendbirdSelectors.getSdk(globalStore)
    const connect = sendbirdSelectors.getConnect(globalStore)
    const createChannel = sendbirdSelectors.getCreateOpenChannel(globalStore)

    // const {
    //     uid,
    //     displayName,
        // userEditInfo,
        // setUserEditInfo,
        // connect,
        // createChannel,
        // sbSdk,
    // } = props //

    // Transform display name
    const TransformName = displayName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .split(' ')
        .join('_')

    console.log(
        'crearCanal props',
        uid,
        displayName,
        TransformName,
        // setUserEditInfo,
        typeof createChannel,
        typeof sbSdk,
        typeof connect
    )

    // const conectarSB = (userId) => {
    if (typeof connect == 'function') {
        await connect(uid)
            .then((user) => {
                console.log('user', user)
            })
            .catch((error) => {
                console.log('error', error)
            })
    } else console.log('no hay connect', typeof connect)
    // }

    // useEffect(() => {
    //     conectarSB()
    // }, [connect])
    // console.log(sdk)
    // conectarSB(uid)
    if (typeof createChannel == 'function' && typeof sbSdk === 'object') {
        // if (typeof sbSdk.GroupChannelParams == 'function') {
        if (typeof sbSdk.OpenChannelParams == 'function') {
            // https://sendbird.com/docs/chat/uikit/v3/react/core-components/sendbirdselectors
            const param = new sbSdk.OpenChannelParams()
            param.name(displayName)
            param.channelUrl(`sendbird_open_channel_${TransformName}`)
            param.customType('profesional calificado')
            param.data(`Canal perfil profesional calificado ${displayName}`)
            // param.operatorUserIds([uid])
            console.log('channel param', param)
            await createChannel(param)
                .then((channel) => {
                    const { url, name, coverUrl, members } = channel
                    // setUserEditInfo({
                    //     ...userEditInfo,
                    //     userChannelUrl: url,
                    // })
                    // setChannelUrl(url)
                    console.log('channel', url, name, coverUrl, members)
                    sharingInformationService.setSubject({ channelURL: url })
                })
                .catch((error) => {
                    console.log('error', error)
                })
        }
    } else console.log('no hay channel', typeof createChannel, typeof sbSdk)
}

newOpenChannelSendbird.propTypes = {
    uid: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    // setChannelUrl: PropTypes.func,
    // setUserEditInfo: PropTypes.func.isRequired,
    // userEditInfo: PropTypes.object.isRequired,
    // connect: PropTypes.func.isRequired,
    // createChannel: PropTypes.func.isRequired,
    // sbSdk: PropTypes.object.isRequired,
}

// Replace withSendbird by useSendbirdStateContext component useState hook pattern
// https://sendbird.com/docs/uikit/v3/react/core-components/usesendbirdstatecontext

// const Service = withSendBird(newOpenChannelSendbird, (state) => ({
//     // Mapping context state to props
//     connect: sendbirdSelectors.getConnect(state),
//     createChannel: sendbirdSelectors.getCreateOpenChannel(state),
//     sbSdk: sendbirdSelectors.getSdk(state),
// }))

// export { Service }

// export default newOpenChannelSendbird
