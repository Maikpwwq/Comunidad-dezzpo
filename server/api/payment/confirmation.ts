/**
 * Payment Confirmation Webhook API Route — ePayco
 *
 * POST /api/v1/payment/confirmation
 *
 * Receives the payment status callback from ePayco and transitions
 * the corresponding contract to 'active' on success.
 */

import type { Context } from 'hono'
import { createHash } from 'crypto'
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app'
import { getFirestore, doc, updateDoc } from 'firebase/firestore'

// Credentials from env
const EPAYCO_PRIVATE_KEY = process.env.VITE_APP_EPAYCO_PRIVATE_KEY || ''
const EPAYCO_TEST_MODE = process.env.VITE_APP_PAYCO_TEST === 'true'

const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.VITE_APP_FIREBASE_APIKEY ?? '',
    authDomain: process.env.VITE_APP_FIREBASE_AUTHDOMAIN ?? '',
    databaseURL: process.env.VITE_APP_FIREBASE_DBURL ?? '',
    projectId: process.env.VITE_APP_FIREBASE_PROJECTID ?? '',
    storageBucket: process.env.VITE_APP_FIREBASE_STORAGE ?? '',
    messagingSenderId: process.env.VITE_APP_FIREBASE_MESSAGEID ?? '',
    appId: process.env.VITE_APP_FIREBASE_APPID ?? '',
}

function getFirestoreDb() {
    let app
    if (getApps().length === 0) {
        app = initializeApp(firebaseConfig)
    } else {
        app = getApp()
    }
    return getFirestore(app)
}

export async function paymentConfirmationHandler(c: Context): Promise<Response> {
    if (c.req.method !== 'POST') {
        return c.json({ error: 'Method not allowed' }, 405)
    }

    try {
        // ePayco webhook POSTs application/x-www-form-urlencoded or JSON
        const body = await c.req.parseBody() as any
        
        // Read raw JSON fallback if parseBody is empty
        let payload = { ...body }
        if (Object.keys(payload).length === 0) {
            try {
                payload = await c.req.json()
            } catch {
                // Ignore json parsing failures
            }
        }

        const invoice = payload.x_id_invoice || ''
        if (!invoice || !invoice.startsWith('DEZZPO-')) {
            console.warn('[Payment Webhook] Invalid or missing invoice identifier:', invoice)
            return c.json({ error: 'Invalid invoice identifier' }, 400)
        }

        // Parse invoice: DEZZPO-{contractId}-{paymentStage}
        const parts = invoice.split('-')
        const contractId = parts[1]
        const paymentStage = parts[2] || 'full_payment'

        if (!contractId) {
            return c.json({ error: 'Contract ID not found in invoice' }, 400)
        }

        // Validate ePayco signature
        const x_cust_id = payload.x_cust_id_cliente || ''
        const x_key = EPAYCO_PRIVATE_KEY
        const x_ref_payco = payload.x_ref_payco || ''
        const x_transaction_id = payload.x_transaction_id || ''
        const x_amount = payload.x_amount || ''
        const x_currency = payload.x_currency || ''
        const x_signature = payload.x_signature || ''

        const calculatedSignatureSource = `${x_cust_id}^${x_key}^${x_ref_payco}^${x_transaction_id}^${x_amount}^${x_currency}`
        const calculatedSignature = createHash('sha256').update(calculatedSignatureSource).digest('hex')

        const isSignatureValid = calculatedSignature === x_signature
        const isTestMode = EPAYCO_TEST_MODE || payload.x_test_request === 'TRUE' || payload.x_test_request === 'true'

        if (!isSignatureValid && !isTestMode) {
            console.error('[Payment Webhook] Invalid signature verification. Source string:', calculatedSignatureSource)
            return c.json({ error: 'Signature verification failed' }, 400)
        }

        const responseCode = Number(payload.x_cod_response)
        
        // Update contract status to active on response code 1 (Accepted)
        if (responseCode === 1) {
            const db = getFirestoreDb()
            const contractRef = doc(db, 'contracts', contractId)
            
            await updateDoc(contractRef, {
                status: 'active',
                paymentStage,
                updatedAt: new Date().toISOString()
            })
            console.log(`[Payment Webhook] Contract ${contractId} successfully updated to status 'active' for stage: ${paymentStage}`)
        } else {
            console.log(`[Payment Webhook] Payment transaction state not accepted (code ${responseCode}). Contract ${contractId} remains unchanged.`)
        }

        return c.json({ success: true, message: 'Webhook processed successfully' })
    } catch (error: any) {
        console.error('[Payment Webhook] Error processing confirmation:', error)
        return c.json({ error: 'Internal server error', message: error.message }, 500)
    }
}
