import { auth, firestore, storage } from '../../../firebase/firebaseClient'
import { collection, doc, setDoc, getDoc, getDocs, addDoc, query } from 'firebase/firestore'
import { ref, getDownloadURL } from 'firebase/storage'
import { updateProfile } from 'firebase/auth'

const FirebaseMethods = () => {
    const user = auth.currentUser
    const _firestore = firestore
    const _storage = storage
    const usersRef = collection(_firestore, 'users')
    const usersProResRef = collection(_firestore, 'usersPropietariosResidentes')
    const usersComCalRef = collection(
        _firestore,
        'usersComerciantesCalificados'
    )
    const draftRef = collection(_firestore, 'drafts')
    const profilesRef = ref(_storage, 'profiles')
    const pathReference = ref(_storage, 'gs://app-comunidad-dezzpo.appspot.com/')

    const addFirestore = async (updateInfo, userID) => {
        await addDoc(doc(usersRef, userID), updateInfo)
    }
    const userProResToFirestore = async (updateInfo, userID) => {
        await setDoc(doc(usersProResRef, userID), updateInfo)
    }
    const userComCalToFirestore = async (updateInfo, userID) => {
        await setDoc(doc(usersComCalRef, userID), updateInfo)
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
