/**
 * Authentication Utilities
 * Helper functions for authentication checks and redirects
 */

/**
 * Get authentication token from localStorage (checking multiple possible keys)
 * @returns {string|null} - Token if found, null otherwise
 */
export const getToken = () => {
  return localStorage.getItem('access_token') ||
         localStorage.getItem('token') ||
         localStorage.getItem('authToken');
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user is logged in
 */
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

/**
 * Redirect to login page with return URL and message
 * @param {Function} navigate - React Router navigate function
 * @param {string} returnUrl - URL to return to after login
 * @param {string} message - Message to show on login page
 */
export const redirectToLogin = (navigate, returnUrl = '/', message = 'লগইন করুন') => {
  navigate('/login', {
    state: {
      returnUrl: returnUrl,
      message: message
    }
  });
};

/**
 * Higher-order function to wrap purchase handlers with authentication check
 * @param {Function} purchaseHandler - Original purchase handler function
 * @param {Function} navigate - React Router navigate function
 * @param {string} returnUrl - URL to return to after login
 * @param {string} message - Message to show on login page
 * @returns {Function} - Wrapped purchase handler
 */
export const withAuthCheck = (purchaseHandler, navigate, returnUrl = '/', message = 'ক্রয় করতে লগইন করুন') => {
  return async (...args) => {
    if (!isAuthenticated()) {
      redirectToLogin(navigate, returnUrl, message);
      return;
    }
    return await purchaseHandler(...args);
  };
};

/**
 * Get user token from localStorage
 * @returns {string|null} - Access token or null
 */
export const getAuthToken = () => {
  return getToken();
};

/**
 * Remove authentication tokens
 */
export const clearAuthTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

/**
 * Check if user needs to login for a specific action
 * @param {Function} navigate - React Router navigate function 
 * @param {string} actionType - Type of action (purchase, order, etc.)
 * @param {string} returnUrl - URL to return to after login
 * @returns {boolean} - True if user is authenticated, false if redirected to login
 */
export const requireAuth = (navigate, actionType = 'এই কাজ', returnUrl = '/') => {
  if (!isAuthenticated()) {
    const messages = {
      purchase: 'প্যাকেজ কিনতে লগইন করুন',
      order: 'অর্ডার করতে লগইন করুন',
      download: 'ডাউনলোড করতে লগইন করুন',
      profile: 'প্রোফাইল দেখতে লগইন করুন'
    };
    
    const message = messages[actionType] || `${actionType} করতে লগইন করুন`;
    redirectToLogin(navigate, returnUrl, message);
    return false;
  }
  return true;
};