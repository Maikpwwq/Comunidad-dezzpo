import { auth, firestore, storage } from '../../../firebase/firebaseClient'
import { collection, doc, setDoc, getDoc, getDocs, addDoc, query } from 'firebase/firestore'
import { ref, getDownloadURL } from 'firebase/storage'
import { updateProfile } from 'firebase/auth'

const FirebaseMethods = () => {
    const user = auth.currentUser
    const _firestore = firestore
    const _Storage = storage
    const usersRef = collection(_firestore, 'users')
    const profilesRef = ref(_Storage, 'profiles')

    const addFirestore = async (updateInfo, userID) => {
        await addDoc(doc(usersRef, userID), updateInfo)
    }
    const toFirestore = async (updateInfo, userID) => {
        await setDoc(doc(usersRef, userID), updateInfo)
    }
    const fromFirestore = async (userID) => {
        await getDoc(doc(usersRef, userID))
    }

    const saveChanges = (profile) => {
        updateProfile(user, profile)
            .then((result) => {
                console.log(`Se actualizo el perfil de usuario ${result}`)
            })
            .catch((error) => {
                console.log(
                    `Se produjo un error al actualizar el perfil de usuario ${error}`
                )
            })
    }
}

export default FirebaseMethods
