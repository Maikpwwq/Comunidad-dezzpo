import { sharingInformationService } from '#@/services/sharing-information'
import { auth } from '#@/firebase/firebaseClient'

export { onBeforeRender }

async function onBeforeRender(pageContext) {
    const sharedUserAuth = await getUserAuth()
    const defaultUserAuth = auth?.currentUser

    const userAuth = defaultUserAuth ? defaultUserAuth : sharedUserAuth
    console.log('userAuth', userAuth)

    // We make `userAuth` available as `pageContext.pageProps.userAuth`
    const pageProps = { userAuth }

    return {
        pageContext: {
            pageProps,
        },
    }
}

async function getUserAuth() {
    const myData = sharingInformationService.getSubject()
    let userAuth
    myData.subscribe((data) => {
        if (data) {
            const { authUser } = data
            userAuth = authUser
            // setAuthUser(authUser)
            console.log('perfilPage', authUser)
        }
    })
    return userAuth
}
