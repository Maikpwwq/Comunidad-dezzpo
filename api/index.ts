// Vercel Serverless Function Entry Point
// Re-exports the fully bundled and patched production handler
// @ts-expect-error - entry.mjs is generated during production build
export { default } from '../dist/server/entry.mjs'
