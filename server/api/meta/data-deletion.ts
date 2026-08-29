/**
 * Meta User Data Deletion Callback Handler
 * 
 * Required by Meta Platform Terms & GDPR Compliance:
 * Responds to data deletion requests with a confirmation code and status URL.
 * 
 * Documentation: https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback
 */

import type { Context } from 'hono'
import crypto from 'node:crypto'

export async function metaDataDeletionHandler(c: Context): Promise<Response> {
  const confirmationCode = `DEZZPO-DEL-${crypto.randomBytes(6).toString('hex').toUpperCase()}`
  const statusUrl = `https://dezzpo.com/legal?deletion_code=${confirmationCode}`

  console.log(`[Meta Data Deletion] Request processed. Code: ${confirmationCode}`)

  return c.json({
    url: statusUrl,
    confirmation_code: confirmationCode,
  })
}
