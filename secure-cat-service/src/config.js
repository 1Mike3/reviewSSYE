// Centralised Application Configuration
module.exports = {
  // TCP port for the HTTPS server
  port: process.env.PORT || 5501,

  // Base URL of the external authentication service
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://host.docker.internal:5500',

  // Absolute path to the cat images directory
  imageDir: '/usr/src/app/images',

  // Production environment flag
  isProduction: process.env.NODE_ENV === 'production'
};
