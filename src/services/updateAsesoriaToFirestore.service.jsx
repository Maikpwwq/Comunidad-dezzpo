import { collection, doc, setDoc } from 'firebase/firestore'
import { firestore } from '#@/firebase/firebaseClient'
import PropTypes from 'prop-types'

// import { sharingInformationService } from '#@/services/sharing-information'

export { updateAsesoriaToFirestore }

const updateAsesoriaToFirestore = async (props) => {
    const _firestore = firestore
    const { updateInfo, docId } = props
    console.log('updateAsesoriaToFirestore', updateInfo, docId)

    const asesoriaRef = collection(_firestore, 'asesorias')

    // TODO: asesoriaToFirestore implementation
    const asesoriaToFirestore = async (updateInfo, docId) => {
        try {
            const asesoriaData = await setDoc(
                doc(asesoriaRef, docId),
                updateInfo
            )
            return asesoriaData
        } catch (err) {
            console.log('Error getting asesoria: ', err)
        }
    }

    asesoriaToFirestore(updateInfo, docId)
    //    .then((data) => {
    //     if (data) {
    //         const res = data.data()
    //         sharingInformationService.setSubject({ sendAsesoria: res })
    //     }
    // })
}

updateAsesoriaToFirestore.propTypes = {
    docId: PropTypes.string.isRequired,
    updateInfo: PropTypes.object.isRequired,
}
