import handler from './dist/server/entry.mjs';
const req = { 
  method: 'GET', 
  url: '/app/portal-servicios', 
  headers: { host: 'localhost', 'x-forwarded-proto': 'http' } 
};
const res = { 
  setHeader: (k,v) => {}, 
  write: (c) => process.stdout.write(Buffer.isBuffer(c) ? c.toString() : c), 
  end: (c) => { if(c) process.stdout.write(Buffer.isBuffer(c) ? c.toString() : c); console.log('\n[ENDED] Status:', res.statusCode); }, 
  statusCode: 200 
};
handler(req, res).catch(console.error);
