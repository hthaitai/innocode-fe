import { jwtDecode } from 'jwt-decode';

/**
 * Decode JWT token and extract user information
 * @param {string} token - JWT token string
 * @returns {object|null} - User object with id, email, name, role or null if invalid
 */
export const decodeJWT = (token) => {
  if (!token || token === 'null') {
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    
    // Extract user info from JWT payload
    // Support both standard claims and Microsoft XML schema claims
    const user = {
      id: decoded.userId || decoded.id || decoded.sub || 
           decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      email: decoded.email,
      name: decoded.fullName || decoded.name || decoded.fullname || 
            decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      role: (decoded.role || 
             decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 
             '').toLowerCase(), // Normalize role to lowercase
    };

    // Validate that essential fields exist
    if (!user.id || !user.email || !user.role) {
      console.error('❌ JWT missing required fields:', decoded);
      return null;
    }

    return user;
  } catch (error) {
    console.error('❌ JWT decode error:', error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token string
 * @returns {boolean} - True if token is expired or invalid
 */
export const isTokenExpired = (token) => {
  if (!token || token === 'null') {
    return true;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    
    // Check if token has exp claim and if it's expired
    if (decoded.exp && decoded.exp < currentTime) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Token expiration check error:', error);
    return true;
  }
};

/**
 * Get token expiration time in seconds
 * @param {string} token - JWT token string
 * @returns {number|null} - Expiration time in seconds (Unix timestamp) or null if invalid
 */
export const getTokenExpiration = (token) => {
  if (!token || token === 'null') {
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    return decoded.exp || null;
  } catch (error) {
    console.error('❌ Token expiration get error:', error);
    return null;
  }
};

/**
 * Get time remaining until token expires in milliseconds
 * @param {string} token - JWT token string
 * @returns {number|null} - Time remaining in milliseconds, or null if invalid/expired
 */
export const getTokenTimeRemaining = (token) => {
  const exp = getTokenExpiration(token);
  if (!exp) {
    return null;
  }

  const currentTime = Date.now() / 1000; // Convert to seconds
  const timeRemaining = (exp - currentTime) * 1000; // Convert to milliseconds

  return timeRemaining > 0 ? timeRemaining : null;
};

/**
 * Check if token should be refreshed (expires within threshold)
 * @param {string} token - JWT token string
 * @param {number} thresholdMinutes - Minutes before expiry to trigger refresh (default: 5)
 * @returns {boolean} - True if token should be refreshed
 */
export const shouldRefreshToken = (token, thresholdMinutes = 5) => {
  const timeRemaining = getTokenTimeRemaining(token);
  if (!timeRemaining) {
    return true; // Token expired or invalid, should refresh
  }

  const thresholdMs = thresholdMinutes * 60 * 1000;
  return timeRemaining <= thresholdMs;
};

