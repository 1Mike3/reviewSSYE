// Entry Point for the Secure Cat Service
const https = require('https');
const fs = require('fs');
const app = require('./app');
const config = require('./config');

// TLS certificate configuration
const options = {
  key: fs.readFileSync('cert.key'),
  cert: fs.readFileSync('cert.crt')
};

// Create and start the HTTPS server
const server = https.createServer(options, app);

server.listen(config.port, () => {
  console.log(`Secure Server running on https://localhost:${config.port}`);
  console.log(`Connected to Auth Service at: ${config.authServiceUrl}`);
});
