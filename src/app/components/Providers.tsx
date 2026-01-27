import React, { useContext } from 'react'
// import PropTypes from 'prop-types'
// import { auth } from '@firebase/firebaseClient'
// TODO: activate @tanstack/react-query
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // Hydrate,
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { SendbirdProvider } from '@sendbird/uikit-react' // withSendBird,
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
import '@sendbird/uikit-react/dist/index.css'
import { UserAuthContext } from '@providers/UserAuthProvider'

// import es from 'date-fns/locale/es'

const appId = import.meta.env.VITE_APP_SENDBIRD_APPID
const accessToken = import.meta.env.VITE_APP_SENDBIRD_APPTOKEN

//
const Providers = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useContext(UserAuthContext)
    // const { children } = props
    const userAuthID = currentUser?.userId  // Este es el id de la cuenta de Auth
    const userAuthName = currentUser?.displayName // Este es el id de la cuenta de Auth
    // const queryClient = new QueryClient()
    // const [queryClient] = useState(() => new QueryClient())
    // console.log(
    //     'SendbirdProvider',
    //     userAuthID,
    //     userAuthName,
    //     appId,
    //     accessToken
    // )

    return (
        <>
            {/* <QueryClientProvider client={queryClient}> */}
            <SendbirdProvider
                appId={appId} // Sendbird application ID.
                userId={userAuthID || ''} // user Auth ID.
                nickname={userAuthName || ''} // user Auth Name.
                accessToken={accessToken}
            // dateLocale={es}
            // {...props}
            >
                {/* <Hydrate state={pageProps.dehydratedState}></Hydrate> */}
                {children}
                {/* <ReactQueryDevtools initialIsOpen /> */}
            </SendbirdProvider>
            {/* </QueryClientProvider> */}
        </>
    )
}

// Providers.propTypes = {
//     children: PropTypes.any,
// }

export default Providers