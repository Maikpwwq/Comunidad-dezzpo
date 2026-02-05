import { db } from '@services/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

export const registerSubscription = async (email: string) => {
    // 1. Validation: Prevent duplicates
    const subsRef = collection(db, 'subscriptions');
    const q = query(subsRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
        throw new Error('This email is already subscribed.');
    }

    // 2. Write to Firestore
    return await addDoc(subsRef, {
        email,
        subscribedAt: serverTimestamp(),
        status: 'active',
        source: 'app/suscripciones'
    });
};
