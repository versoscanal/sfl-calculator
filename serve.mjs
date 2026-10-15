import { createServer } from 'node:http';
import { readFile } from 'node:fs';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)));
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

const server = createServer(function (request, response) {
  const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = resolve(root, '.' + requestedPath);
  if (filePath !== root && !filePath.startsWith(root + sep)) {
    response.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Forbidden');
    return;
  }
  readFile(filePath, function (error, contents) {
    if (error) {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }
    response.writeHead(200, { 'content-type': mimeTypes[extname(filePath)] || 'application/octet-stream' });
    response.end(contents);
  });
});

server.listen(4173, '127.0.0.1', function () {
  process.stdout.write('SFL Calculator preview: http://127.0.0.1:4173\n');
});
