/**
 * GA4 & Firestore Funnel Analytics Utility
 */

export function trackEvent(eventName: string, params?: Record<string, any>) {
    // 1. Google Analytics standard tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
        try {
            (window as any).gtag('event', eventName, params)
        } catch (err) {
            console.error('[Analytics] Google Analytics error:', err)
        }
    }

    // 2. Local Firestore logging for real-time admin funnel metrics
    if (typeof window !== 'undefined') {
        saveEventToFirestore(eventName, params)
    }
}

async function saveEventToFirestore(eventName: string, params?: Record<string, any>) {
    try {
        const { firestore, isFirebaseAvailable } = await import('@services/firebase')
        const { collection, addDoc } = await import('firebase/firestore')
        
        if (isFirebaseAvailable() && firestore) {
            await addDoc(collection(firestore, 'funnel_events'), {
                eventName,
                params: params || {},
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            })
        }
    } catch (err) {
        console.error('[Analytics] Error saving event to Firestore:', err)
    }
}

export function trackSearch(service: string, zone: string, resultsCount: number) {
    trackEvent('search_services', {
        service,
        zone,
        results_count: resultsCount
    })
}

export function trackViewProfile(comercianteId: string, name: string, tier: string) {
    trackEvent('view_profile', {
        comerciante_id: comercianteId,
        comerciante_name: name,
        comerciante_tier: tier || 'free'
    })
}

export function trackContact(comercianteId: string, type: 'whatsapp' | 'phone' | 'email' | string) {
    trackEvent('initiate_contact', {
        comerciante_id: comercianteId,
        contact_type: type
    })
}

export function trackCreateContract(contractId: string, amount: number, providerId: string) {
    trackEvent('create_contract', {
        contract_id: contractId,
        amount,
        provider_id: providerId
    })
}

export function trackCompletePayment(contractId: string, amount: number) {
    trackEvent('complete_payment', {
        contract_id: contractId,
        amount
    })
}
