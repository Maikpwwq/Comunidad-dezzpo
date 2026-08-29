/**
 * GA4 & Firestore Funnel Analytics Utility
 */

interface WindowWithGtag extends Window {
  gtag?: (command: string, action: string, params?: Record<string, unknown>) => void
}

export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  // 1. Google Analytics standard tracking
  if (typeof window !== 'undefined') {
    const customWindow = window as WindowWithGtag
    if (typeof customWindow.gtag === 'function') {
      try {
        customWindow.gtag('event', eventName, params)
      } catch (err) {
        console.error('[Analytics] Google Analytics error:', err)
      }
    }
  }

  // 2. Local Firestore logging for real-time admin funnel metrics
  if (typeof window !== 'undefined') {
    void saveEventToFirestore(eventName, params)
  }
}

async function saveEventToFirestore(eventName: string, params?: Record<string, unknown>): Promise<void> {
  try {
    const { firestore, isFirebaseAvailable } = await import('@services/firebase')
    const { collection, addDoc } = await import('firebase/firestore')

    if (isFirebaseAvailable() && firestore) {
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'server'
      await addDoc(collection(firestore, 'funnel_events'), {
        eventName,
        params: params ?? {},
        timestamp: new Date().toISOString(),
        userAgent,
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
