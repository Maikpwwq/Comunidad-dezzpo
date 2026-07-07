import { adminFirestore } from '@services/firebase/admin'

export async function onBeforePrerenderStart() {
    try {
        const querySnapshot = await adminFirestore.collection('usersComerciantesCalificados').get()
        const urls: string[] = []

        querySnapshot.forEach((doc: any) => {
            const data = doc.data()
            if (data.userSlug) {
                urls.push(`/comerciante/${data.userSlug}`)
            }
        })

        return urls
    } catch (error) {
        console.error('Error in onBeforePrerenderStart for comerciante:', error)
        return []
    }
}
