// server.js - Production startup entrypoint for cPanel / Passenger
const path = require('path');
const fs = require('fs');

const standaloneServer = path.join(__dirname, '.next', 'standalone', 'server.js');

if (fs.existsSync(standaloneServer)) {
  process.env.NODE_ENV = 'production';
  require(standaloneServer);
} else {
  const { createServer } = require('http');
  const next = require('next');

  const dev = process.env.NODE_ENV !== 'production';
  const hostname = '0.0.0.0';
  const port = process.env.PORT || 3000;

  const app = next({ dev, hostname, port, dir: __dirname });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    createServer(async (req, res) => {
      try {
        await handle(req, res);
      } catch (err) {
        console.error('Error occurred handling request:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }).listen(port, () => {
      console.log(`> Server ready on http://${hostname}:${port}`);
    });
  });
}
