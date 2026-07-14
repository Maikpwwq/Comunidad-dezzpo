// Vercel Serverless Function Entry Point
// Re-exports the fully bundled and patched production handler
// Uses .mjs to bypass @vercel/node TypeScript compilation
// (avoids TS 7.x incompatibility with @vercel/node's compiler host)
export { default } from '../dist/server/entry.mjs'
