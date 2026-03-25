// JWT Authentication Middleware
const { importSPKI, jwtVerify } = require('jose');
const { createPublicKey } = require('crypto');
const config = require('../config');

let publicKey = null;

/**
 * Fetches and caches the Auth Service's RSA public key.
 */
async function getPublicKey() {
  if (publicKey) return publicKey;

  const response = await fetch(`${config.authServiceUrl}/auth-wellknown`);
  const data = await response.json();

  // Convert from PKCS1 to SPKI key format
  const spkiPem = createPublicKey(data.public_key)
    .export({ format: 'pem', type: 'spki' });

  publicKey = await importSPKI(spkiPem, 'RS256');
  return publicKey;
}

/**
 * Express middleware to verify JWTs in the auth_token cookie.
 */
const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.redirect('/login');
    }

    // Verify JWT signature and expiration
    const key = await getPublicKey();
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['RS256']
    });

    // Attach decoded payload to the request
    req.user = payload;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.clearCookie('auth_token');
    return res.status(401).render('error', { message: 'Session expired or invalid. Please login again.' });
  }
};

module.exports = verifyToken;
