const crypto = require('crypto');

const SECRET = process.env.CRYPTO_SECRET || 'safebite_default_secret_key_32ch!!';

/**
 * Generate HMAC-SHA256 token
 * Format: base64(userId.role.timestamp).HMAC
 */
const generateToken = (userId, role) => {
  const timestamp = Date.now();
  const payload = Buffer.from(JSON.stringify({ userId, role, timestamp })).toString('base64url');
  const hmac = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  return `${payload}.${hmac}`;
};

/**
 * Verify token and return decoded payload or null
 */
const verifyToken = (token) => {
  try {
    if (!token) return null;
    const [payload, hmac] = token.split('.');
    if (!payload || !hmac) return null;

    const expectedHmac = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(hmac, 'hex'), Buffer.from(expectedHmac, 'hex'))) {
      return null;
    }

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());

    // Token expires in 7 days
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - decoded.timestamp > SEVEN_DAYS) return null;

    return decoded;
  } catch {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
