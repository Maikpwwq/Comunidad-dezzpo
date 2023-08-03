import { sharingInformationService } from '#@/services/sharing-information'
import { auth } from '#@/firebase/firebaseClient'

export { onBeforeRender }

async function onBeforeRender(pageContext) {
    const sharedUserAuth = await getUserAuth()
    const defaultUserAuth = auth?.currentUser

    const userAuth = defaultUserAuth ? defaultUserAuth : sharedUserAuth
    console.log('userAuth', defaultUserAuth, sharedUserAuth)

    // We make `userAuth` available as `pageContext.pageProps.userAuth`
    const pageProps = { userAuth }

    return {   
       // E.g. redirect `/app/perfil/wrong/url` to `/app/perfil/`
        pageContext: {
            pageProps,
            // redirectTo: '/app/perfil/',
            // precedence: 2,
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
