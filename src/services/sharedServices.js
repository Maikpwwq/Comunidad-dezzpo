import { Observable } from 'rxjs'
import { readUserFromFirestore } from './readUserFromFirestore.service'

const getUser = new Observable((subscriber) => {
    const response = readUserFromFirestore()
    console.log('firebaseResponse', response)
    try {
        subscriber.next(response)
        // subscriber.complete();
    } catch (err) {
        subscriber.error(err)
    }
})

export default getUser
