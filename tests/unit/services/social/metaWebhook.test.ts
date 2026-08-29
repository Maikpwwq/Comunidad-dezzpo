import { describe, it, expect, vi } from 'vitest'
import { metaWebhookGetHandler, metaWebhookPostHandler } from '@/../server/api/meta/webhook'
import { metaDataDeletionHandler } from '@/../server/api/meta/data-deletion'
import type { Context } from 'hono'
import crypto from 'node:crypto'

describe('Meta Webhook & Data Deletion Endpoints', () => {
  it('should pass GET challenge verification when verify_token matches', async () => {
    process.env.META_WEBHOOK_VERIFY_TOKEN = 'test_verify_token'

    const mockContext = {
      req: {
        query: (key: string) => {
          if (key === 'hub.mode') return 'subscribe'
          if (key === 'hub.verify_token') return 'test_verify_token'
          if (key === 'hub.challenge') return 'challenge_code_12345'
          return undefined
        },
      },
      text: (body: string, status: number) => new Response(body, { status }),
    } as unknown as Context

    const res = await metaWebhookGetHandler(mockContext)
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(text).toBe('challenge_code_12345')
  })

  it('should fail GET challenge verification when verify_token is wrong', async () => {
    process.env.META_WEBHOOK_VERIFY_TOKEN = 'test_verify_token'

    const mockContext = {
      req: {
        query: (key: string) => {
          if (key === 'hub.mode') return 'subscribe'
          if (key === 'hub.verify_token') return 'wrong_token'
          if (key === 'hub.challenge') return 'challenge_code_12345'
          return undefined
        },
      },
      text: (body: string, status: number) => new Response(body, { status }),
    } as unknown as Context

    const res = await metaWebhookGetHandler(mockContext)
    expect(res.status).toBe(403)
  })

  it('should process valid POST webhook events and return 200 EVENT_RECEIVED', async () => {
    const appSecret = 'test_app_secret'
    process.env.META_APP_SECRET = appSecret

    const rawEvent = JSON.stringify({
      object: 'page',
      entry: [
        {
          id: '375828669832688',
          time: 1724900000,
          changes: [
            {
              field: 'feed',
              value: {
                item: 'post',
                post_id: '375828669832688_123',
                message: 'Busco plomero urgente para reparación de tubería en Suba',
                from: { id: 'user_1', name: 'Laura Gomez' },
              },
            },
          ],
        },
      ],
    })

    const signature = 'sha256=' + crypto.createHmac('sha256', appSecret).update(rawEvent).digest('hex')

    const mockContext = {
      req: {
        text: async () => rawEvent,
        header: (name: string) => (name.toLowerCase() === 'x-hub-signature-256' ? signature : null),
      },
      text: (body: string, status: number) => new Response(body, { status }),
      json: (body: unknown, status: number) => new Response(JSON.stringify(body), { status }),
    } as unknown as Context

    const res = await metaWebhookPostHandler(mockContext)
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(text).toBe('EVENT_RECEIVED')
  })

  it('should respond to user data deletion callback with confirmation code', async () => {
    const mockContext = {
      json: (body: unknown) => new Response(JSON.stringify(body), { status: 200 }),
    } as unknown as Context

    const res = await metaDataDeletionHandler(mockContext)
    expect(res.status).toBe(200)
    const body = (await res.json()) as { url: string; confirmation_code: string }
    expect(body.confirmation_code).toContain('DEZZPO-DEL-')
    expect(body.url).toContain('https://dezzpo.com/legal?deletion_code=')
  })
})
