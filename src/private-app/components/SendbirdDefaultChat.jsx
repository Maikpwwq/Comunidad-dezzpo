import es from 'date-fns/locale/es'
import {
    withSendBird,
    App as SendBirdApp,
} from '@sendbird/uikit-react'
import "@sendbird/uikit-react/dist/index.css"

let accessToken = import.meta.env.VITE_APP_SENDBIRD_APPTOKEN
let appId = import.meta.env.VITE_APP_SENDBIRD_APPID

const SendbirdDefaultChat = () => {

    const userInfo = {
        userId: "pbEr6iR3tJOOsYISv8EkZfwdXlx2",
        userChannelUrl: "sendbird_group_channel_191910970_83f311b0270198386496e56ab1a1c5ba3b61b9e9",
        userName: "Dezzpo Profesionales Calificado",
    }

    return(
        <>
            <SendBirdApp
                appId={appId} // Sendbird application ID.
                userId={userInfo.userId} // user ID.
                nickname={userInfo.userName}
                accessToken={accessToken}
                dateLocale={es}
                >
                User will be created if it is not present in the server
            </SendBirdApp>
        </>
    )
}


export default withSendBird(SendbirdDefaultChat)