/**
 * Google Tag Manager Data Layer Utilities
 */

/**
 * Push an event to the data layer
 * @param {string} event - Event name
 * @param {object} data - Additional event data
 */
export const gtmPushEvent = (event, data = {}) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: event,
      ...data,
    });
    console.log('📊 GTM Event:', event, data);
  }
};

/**
 * Track page view
 * @param {string} pagePath - Page path
 * @param {string} pageTitle - Page title
 */
export const gtmPageView = (pagePath, pageTitle) => {
  gtmPushEvent('pageView', {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

/**
 * Track search event
 * @param {string} searchTerm - Search query
 * @param {number} resultCount - Number of results
 */
export const gtmSearchEvent = (searchTerm, resultCount = 0) => {
  gtmPushEvent('search', {
    search_term: searchTerm,
    result_count: resultCount,
  });
};

/**
 * Track file selection
 * @param {string} fileName - File name
 * @param {string} surveyType - Survey type
 * @param {number} fileCount - Total files selected
 */
export const gtmFileSelect = (fileName, surveyType, fileCount) => {
  gtmPushEvent('file_select', {
    file_name: fileName,
    survey_type: surveyType,
    file_count: fileCount,
  });
};

/**
 * Track add to cart (file selection for purchase)
 * @param {array} files - Selected files
 * @param {number} totalPrice - Total price
 * @param {string} packageName - Package name
 */
export const gtmAddToCart = (files, totalPrice, packageName) => {
  gtmPushEvent('add_to_cart', {
    items: files.map(file => ({
      item_name: file.name,
      item_id: file.id,
      item_category: packageName || 'Unknown',
    })),
    value: totalPrice,
    currency: 'BDT',
  });
};

/**
 * Track checkout initiation
 * @param {number} fileCount - Number of files
 * @param {number} totalPrice - Total price
 * @param {string} packageName - Package name
 */
export const gtmBeginCheckout = (fileCount, totalPrice, packageName) => {
  gtmPushEvent('begin_checkout', {
    file_count: fileCount,
    value: totalPrice,
    currency: 'BDT',
    package_name: packageName,
  });
};

/**
 * Track purchase completion
 * @param {string} transactionId - Transaction ID
 * @param {number} totalPrice - Total price
 * @param {number} fileCount - Number of files
 * @param {string} packageName - Package name
 * @param {string} paymentMethod - Payment method
 */
export const gtmPurchase = (transactionId, totalPrice, fileCount, packageName, paymentMethod) => {
  gtmPushEvent('purchase', {
    transaction_id: transactionId,
    value: totalPrice,
    currency: 'BDT',
    file_count: fileCount,
    package_name: packageName,
    payment_method: paymentMethod,
  });
};

/**
 * Track user login
 * @param {string} method - Login method (google, email, etc.)
 */
export const gtmLogin = (method) => {
  gtmPushEvent('login', {
    method: method,
  });
};

/**
 * Track user signup
 * @param {string} method - Signup method (google, email, etc.)
 */
export const gtmSignup = (method) => {
  gtmPushEvent('sign_up', {
    method: method,
  });
};

/**
 * Track custom event
 * @param {string} eventName - Event name
 * @param {object} eventData - Event data
 */
export const gtmCustomEvent = (eventName, eventData = {}) => {
  gtmPushEvent(eventName, eventData);
};

/**
 * Set user properties
 * @param {string} userId - User ID
 * @param {object} userProperties - User properties
 */
export const gtmSetUser = (userId, userProperties = {}) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      user_id: userId,
      ...userProperties,
    });
    console.log('👤 GTM User Set:', userId, userProperties);
  }
};

/**
 * Track survey type pricing view
 * @param {string} surveyType - Survey type
 * @param {number} price - Price per file
 */
export const gtmViewSurveyPricing = (surveyType, price) => {
  gtmPushEvent('view_survey_pricing', {
    survey_type: surveyType,
    price_per_file: price,
    currency: 'BDT',
  });
};

/**
 * Track error events
 * @param {string} errorType - Type of error
 * @param {string} errorMessage - Error message
 */
export const gtmError = (errorType, errorMessage) => {
  gtmPushEvent('error', {
    error_type: errorType,
    error_message: errorMessage,
  });
};

export default {
  gtmPushEvent,
  gtmPageView,
  gtmSearchEvent,
  gtmFileSelect,
  gtmAddToCart,
  gtmBeginCheckout,
  gtmPurchase,
  gtmLogin,
  gtmSignup,
  gtmCustomEvent,
  gtmSetUser,
  gtmViewSurveyPricing,
  gtmError,
};
