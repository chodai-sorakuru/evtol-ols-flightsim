'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname;
const host = '127.0.0.1';
const port = 8080;
const tokenFile = path.join(root, '.mapbox-token');

http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${host}:${port}`);
  if (requestUrl.pathname === '/api/mapbox-token') {
    const origin = req.headers.origin || '';
    if (origin && origin !== 'http://localhost:8080' && origin !== 'http://127.0.0.1:8080') {
      res.writeHead(403, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
      return res.end(JSON.stringify({error:'Origin not allowed'}));
    }
    try {
      const token = fs.readFileSync(tokenFile, 'utf8').trim();
      if (!/^pk\./.test(token)) throw new Error('Invalid token');
      res.writeHead(200, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex'});
      return res.end(JSON.stringify({token}));
    } catch {
      res.writeHead(404, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
      return res.end(JSON.stringify({error:'Local Mapbox token is not configured'}));
    }
  }
  let name;
  try { name = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, ''); }
  catch { res.writeHead(400); return res.end('Bad Request'); }
  if (!name) name = 'eVTOL_FlightSim_V24.html';
  const target = path.resolve(root, name);
  if (path.dirname(target) !== path.resolve(root)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(target, (error, data) => {
    if (error) { res.writeHead(error.code === 'ENOENT' ? 404 : 500); return res.end('Not Found'); }
    const ext = path.extname(target).toLowerCase();
    const type = ext === '.html' ? 'text/html; charset=utf-8' : ext === '.js' ? 'text/javascript; charset=utf-8' : 'application/octet-stream';
    res.writeHead(200, {'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'});
    res.end(data);
  });
}).listen(port, host, () => console.log(`eVTOL FlightSim: http://localhost:${port}/`));
