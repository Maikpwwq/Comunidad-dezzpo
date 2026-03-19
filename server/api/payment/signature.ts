/**
 * Payment Signature API Route — ePayco
 *
 * POST /api/v1/payment/signature
 * Body: { contractId, amount, description, buyerEmail }
 *
 * Generates a cryptographic signature server-side for ePayco checkout.
 * NEVER exposes the private key to the client.
 *
 * Signature formula (ePayco standard):
 *   md5(p_cust_id_cliente + p_key + p_id_invoice + p_amount_base + p_currency_code)
 */

import type { Context } from 'hono'
import { createHash } from 'crypto'

// ePayco credentials from env
const EPAYCO_PUBLIC_KEY = process.env.VITE_APP_EPAYCO_PUBLIC_KEY || ''
const EPAYCO_PRIVATE_KEY = process.env.VITE_APP_EPAYCO_PRIVATE_KEY || ''
const EPAYCO_TEST_MODE = process.env.VITE_APP_PAYCO_TEST === 'true'

// ePayco customer ID (P_CUST_ID_CLIENTE) — typically same as public key for Standard Checkout
const EPAYCO_CUST_ID = EPAYCO_PUBLIC_KEY

interface SignatureRequestBody {
    contractId: string
    amount: number
    description: string
    buyerEmail: string
    buyerName?: string
}

interface EpaycoCheckoutPayload {
    key: string
    test: boolean
    name: string
    description: string
    invoice: string
    currency: string
    amount: string
    tax_base: string
    tax: string
    country: string
    lang: string
    external: string
    response: string
    confirmation: string
    email_billing: string
    name_billing: string
    signature: string
}

export async function paymentSignatureHandler(c: Context): Promise<Response> {
    if (c.req.method !== 'POST') {
        return c.json({ error: 'Method not allowed' }, 405)
    }

    if (!EPAYCO_PUBLIC_KEY || !EPAYCO_PRIVATE_KEY) {
        return c.json({ error: 'ePayco not configured on server' }, 500)
    }

    try {
        const body = await c.req.json<SignatureRequestBody>()

        if (!body.contractId || !body.amount || !body.description) {
            return c.json({ error: 'Missing required fields: contractId, amount, description' }, 400)
        }

        const invoice = `DEZZPO-${body.contractId}`
        const amountStr = body.amount.toFixed(2)
        const currency = 'COP'

        // ePayco signature: md5(p_cust_id_cliente + p_key + p_id_invoice + p_amount_base + p_currency_code)
        const signatureString = `${EPAYCO_CUST_ID}^${EPAYCO_PRIVATE_KEY}^${invoice}^${amountStr}^${currency}`
        const signature = createHash('md5').update(signatureString).digest('hex')

        const baseUrl = process.env.VITE_APP_BASE_URL || 'https://comunidad-dezzpo.vercel.app'

        const payload: EpaycoCheckoutPayload = {
            key: EPAYCO_PUBLIC_KEY,
            test: EPAYCO_TEST_MODE,
            name: 'Servicio Comunidad Dezzpo',
            description: body.description,
            invoice,
            currency,
            amount: amountStr,
            tax_base: amountStr,
            tax: '0',
            country: 'CO',
            lang: 'es',
            external: 'false',
            response: `${baseUrl}/app/contratacion/respuesta`,
            confirmation: `${baseUrl}/api/v1/payment/confirmation`,
            email_billing: body.buyerEmail,
            name_billing: body.buyerName || '',
            signature,
        }

        return c.json({ success: true, payload })
    } catch (error) {
        console.error('Error generating payment signature:', error)
        return c.json({ error: 'Internal server error' }, 500)
    }
}
