import server from '../pages/+server'

// Vercel Serverless Function entry point
// This exposes the Hono app's fetch method to Vercel's Edge/Node runtime
export default server.fetch
