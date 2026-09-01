import { useEffect } from 'react'
import { isFirebaseAvailable, firestore } from '@services/firebase'
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc } from 'firebase/firestore'

export const UTM_STORAGE_KEY = 'dezzpo_utm_attribution'

export interface UtmAttribution {
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_content: string // Copy ID (e.g., 'CLI-CONF-CON-CON-15' or 'MAES-EXP-INT-URL-01')
  utm_term?: string // Trade, niche or group slug
  landingPath: string
  capturedAt: string
}

/**
 * Persists UTM attribution data in sessionStorage.
 */
export function storeUtmAttribution(attribution: UtmAttribution): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(attribution))
  } catch {
    // Graceful fallback if storage unavailable
  }
}

/**
 * Retrieves the stored UTM attribution from sessionStorage.
 */
export function getStoredUtmAttribution(): UtmAttribution | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as UtmAttribution
  } catch {
    return null
  }
}

/**
 * Clears stored UTM attribution.
 */
export function clearStoredUtmAttribution(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(UTM_STORAGE_KEY)
  } catch {
    // No-op
  }
}

/**
 * Records an interception visit in Firestore / socialInterceptionLogs.
 * If a matching dispatched log with the same copyId or permalink exists, updates it to visited.
 */
export async function recordInterceptionVisit(attribution: UtmAttribution): Promise<void> {
  if (!isFirebaseAvailable() || !firestore) return

  try {
    const logsCol = collection(firestore, 'socialInterceptionLogs')
    
    // Check if a recently dispatched log exists with this copyId
    if (attribution.utm_content) {
      const q = query(
        logsCol,
        where('copyId', '==', attribution.utm_content),
        where('status', '==', 'dispatched')
      )
      const snap = await getDocs(q)
      if (!snap.empty) {
        const targetDoc = snap.docs[0]
        if (targetDoc) {
          await updateDoc(targetDoc.ref, {
            status: 'visited',
            visited: true,
            visitedAt: serverTimestamp(),
            lastLandingPath: attribution.landingPath,
          })
          return
        }
      }
    }

    // Otherwise, create a visit telemetry entry
    await addDoc(logsCol, {
      copyId: attribution.utm_content || 'DIRECT',
      utmSource: attribution.utm_source,
      utmMedium: attribution.utm_medium,
      utmCampaign: attribution.utm_campaign,
      utmTerm: attribution.utm_term || 'general',
      groupName: attribution.utm_term ? `Grupo: ${attribution.utm_term}` : 'Facebook Grupos',
      landingPath: attribution.landingPath,
      intent: attribution.utm_campaign.includes('demand') ? 'DEMAND' : 'SUPPLY',
      detectedTrade: attribution.utm_term || 'general',
      authorName: 'Visitante Facebook',
      status: 'visited',
      visited: true,
      timestamp: new Date().toISOString(),
      visitedAt: serverTimestamp(),
    })
  } catch (err) {
    // Non-blocking telemetry error
    console.debug('[UTM Tracker] Error recording interception visit:', err)
  }
}

/**
 * Marks an interception log as converted when the user completes registration or submits a project.
 */
export async function recordInterceptionConversion(userId?: string): Promise<void> {
  const attribution = getStoredUtmAttribution()
  if (!attribution || !isFirebaseAvailable() || !firestore) return

  try {
    const logsCol = collection(firestore, 'socialInterceptionLogs')
    if (attribution.utm_content) {
      const q = query(logsCol, where('copyId', '==', attribution.utm_content))
      const snap = await getDocs(q)
      if (!snap.empty) {
        const targetDoc = snap.docs[0]
        if (targetDoc) {
          await updateDoc(targetDoc.ref, {
            status: 'converted',
            converted: true,
            convertedAt: serverTimestamp(),
            convertedUserId: userId || null,
          })
          return
        }
      }
    }
  } catch (err) {
    console.debug('[UTM Tracker] Error recording interception conversion:', err)
  }
}

/**
 * Hook to capture UTM parameters from the landing URL and trigger attribution tracking.
 */
export function useUtmTracker(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const utmSource = params.get('utm_source')
    const utmMedium = params.get('utm_medium')
    const utmCampaign = params.get('utm_campaign')
    const utmContent = params.get('utm_content') || params.get('copy_id')
    const utmTerm = params.get('utm_term')

    // If UTM parameters exist, capture attribution
    if (utmSource || utmCampaign || utmContent) {
      const attribution: UtmAttribution = {
        utm_source: utmSource || 'facebook',
        utm_medium: utmMedium || 'social',
        utm_campaign: utmCampaign || 'growth_general',
        utm_content: utmContent || 'DEFAULT',
        ...(utmTerm ? { utm_term: utmTerm } : {}),
        landingPath: window.location.pathname,
        capturedAt: new Date().toISOString(),
      }

      storeUtmAttribution(attribution)
      void recordInterceptionVisit(attribution)
    }
  }, [])
}
