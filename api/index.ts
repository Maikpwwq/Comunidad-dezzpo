import { handle } from 'hono/vercel'
import { app } from '../pages/+server'

// Vercel Serverless Function entry point
// Using Hono's Vercel adapter to properly bridge Node's req/res to Web Standards
export default handle(app)
