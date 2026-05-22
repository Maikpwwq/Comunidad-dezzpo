import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { chatHandler } from '../../server/api/chat.ts'
import { cors } from 'hono/cors'

// Create an isolated Hono instance for this route
const app = new Hono().basePath('/api/v1')

app.use('*', cors())
app.post('/chat', (c) => chatHandler(c))

export default handle(app)
