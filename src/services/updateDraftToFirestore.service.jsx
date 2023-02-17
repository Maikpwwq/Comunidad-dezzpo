import { collection, doc, setDoc } from 'firebase/firestore'
import { firestore } from '@/firebase/firebaseClient'
import PropTypes from 'prop-types'

import { sharingInformationService } from '@/services/sharing-information'

const updateDraftToFirestore = (props) => {
    const _firestore = firestore
    const { updateInfo, docId } = props
    console.log('updateDraftToFirestore', updateInfo, docId)

    const draftRef = collection(_firestore, 'drafts')

    // TODO: draftToFirestore implementation
    const draftToFirestore = async (updateInfo, docId) => {
        try {
            const draftData = await setDoc(doc(draftRef, docId), updateInfo)
            return draftData
        } catch (err) {
            console.log('Error getting draft: ', err)
        }
    }

    draftToFirestore(updateInfo, docId).then((data) => {
        if (!!data) {
            const res = data.data()
            sharingInformationService.setSubject(res)
        }
    })
}

updateDraftToFirestore.propTypes = {
    docId: PropTypes.string.isRequired,
    updateInfo: PropTypes.object.isRequired,
}

export default updateDraftToFirestore
