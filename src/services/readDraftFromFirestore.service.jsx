import { collection, doc, getDocFromServer } from 'firebase/firestore'
import { firestore } from '#@/firebase/firebaseClient'
import PropTypes from 'prop-types'

import { sharingInformationService } from '#@/services/sharing-information'

export { readDraftFromFirestore }

const readDraftFromFirestore = (props) => {
    const _firestore = firestore
    const { draftId } = props
    // console.log('readDraftFromFirestore**', draftId)

    const draftRef = collection(_firestore, 'drafts')

    const draftFromFirestore = async (projectID) => {
        try {
            const draftData = await getDocFromServer(doc(draftRef, projectID))
            return draftData
        } catch (err) {
            console.log('Error getting draft: ', err)
        }
    }

    draftFromFirestore(draftId).then((data) => {
        if (data) {
            const res = data.data()
            // console.log('draftFromFirestore', data, res)
            if ( res ) {
                sharingInformationService.setSubject({ draft: res })
            }            
        }
    })
}

readDraftFromFirestore.propTypes = {
    draftId: PropTypes.string.isRequired,
}
