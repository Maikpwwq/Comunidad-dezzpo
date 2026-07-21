// Vercel Serverless Function Entry Point
// Uses dynamic import with error catching to diagnose crashes
// Uses .mjs to bypass @vercel/node TypeScript compilation
// (avoids TS 7.x incompatibility with @vercel/node's compiler host)

let _handler = null;
let _importError = null;

try {
  const mod = await import('../dist/server/entry.mjs');
  _handler = mod.default;
} catch (err) {
  _importError = err;
  console.error('[api/index.mjs] Failed to import server entry:', err);
}

export default async function handler(req, res) {
  if (_importError) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'Server entry import failed',
      message: _importError.message,
      stack: _importError.stack,
    }));
    return;
  }

  if (!_handler) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Handler is null — entry.mjs did not export a default function' }));
    return;
  }

  try {
    return await _handler(req, res);
  } catch (err) {
    console.error('[api/index.mjs] Handler error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'Handler execution failed',
      message: err.message,
      stack: err.stack,
    }));
  }
}
