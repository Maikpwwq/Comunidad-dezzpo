import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { paymentSignatureHandler } from '../../../server/api/payment/signature.ts'
import { cors } from 'hono/cors'

// Create an isolated Hono instance for this route
const app = new Hono().basePath('/api/v1')

app.use('*', cors())
app.post('/payment/signature', (c) => paymentSignatureHandler(c))

export default handle(app)
