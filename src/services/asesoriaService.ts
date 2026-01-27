import { doc, setDoc } from 'firebase/firestore'
import { firestore } from '@services/firebase'

interface AsesoriaInfo {
    asesoriaTitulo: string
    asesoriaDescription: string
    asesoriaSelect: string
}

interface UpdateAsesoriaParams {
    updateInfo: AsesoriaInfo
    docId: string
}

export const updateAsesoriaToFirestore = async ({ updateInfo, docId }: UpdateAsesoriaParams) => {
    try {
        const asesoriaRef = doc(firestore, 'asesorias', docId)
        await setDoc(asesoriaRef, updateInfo, { merge: true })
        return true
    } catch (error) {
        console.error('Error updating asesoria:', error)
        throw error
    }
}

export default updateAsesoriaToFirestore
