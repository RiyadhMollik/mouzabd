/**
 * Google Tag Manager (GTM) Data Layer Utility
 * E-commerce tracking events for GA4
 */

/**
 * Initialize GTM data layer if not exists
 */
export const initDataLayer = () => {
  window.dataLayer = window.dataLayer || [];
};

/**
 * Push event to GTM data layer
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
export const pushToDataLayer = (event, data) => {
  initDataLayer();
  window.dataLayer.push({
    event,
    ...data,
  });
  console.log('📊 GTM Event:', event, data);
};

/**
 * Format file item for GTM
 * @param {Object} file - File object
 * @param {number} index - Item index
 * @param {Object} packageInfo - Package information
 * @returns {Object} Formatted item
 */
export const formatFileItem = (file, index = 0, packageInfo = null) => {
  return {
    item_id: file.id || file.name,
    item_name: file.name,
    affiliation: "BD Mouza",
    index: index,
    item_brand: "BD Mouza Map Service",
    item_category: "Digital Files",
    item_category2: packageInfo?.survey_type || "Survey Files",
    item_category3: file.mimeType?.includes('pdf') ? 'PDF' : 'Image',
    item_category4: packageInfo?.field_name || "Standard",
    item_list_id: "search_results",
    item_list_name: "Search Results",
    price: packageInfo?.price_per_file || 0,
    quantity: 1,
  };
};

/**
 * Format package for GTM
 * @param {Object} packageInfo - Package information
 * @param {number} fileCount - Number of files
 * @returns {Object} Formatted item
 */
export const formatPackageItem = (packageInfo, fileCount = 1) => {
  return {
    item_id: packageInfo?.id || packageInfo?.field_name,
    item_name: packageInfo?.field_name || "Package",
    affiliation: "BD Mouza",
    item_brand: "BD Mouza",
    item_category: "Package",
    item_category2: packageInfo?.survey_type || packageInfo?.package_type || "Survey Package",
    item_category3: packageInfo?.is_survey_pricing ? "Survey Based" : "Package Based",
    price: packageInfo?.price_per_file || packageInfo?.base_price || 0,
    quantity: fileCount,
  };
};

/**
 * Track when user views search results
 * @param {Array} files - Array of file objects
 * @param {Object} searchInfo - Search parameters
 */
export const trackViewItemList = (files, searchInfo = {}) => {
  const items = files.slice(0, 10).map((file, index) => 
    formatFileItem(file, index)
  );

  pushToDataLayer('view_item_list', {
    item_list_id: "search_results",
    item_list_name: "Search Results",
    items: items,
  });
};

/**
 * Track when user selects a file from results
 * @param {Object} file - Selected file
 * @param {number} index - File index in list
 * @param {Object} packageInfo - Package information
 */
export const trackSelectItem = (file, index = 0, packageInfo = null) => {
  pushToDataLayer('select_item', {
    item_list_id: "search_results",
    item_list_name: "Search Results",
    items: [formatFileItem(file, index, packageInfo)],
  });
};

/**
 * Track when user views item details
 * @param {Object} file - File object
 * @param {Object} packageInfo - Package information
 */
export const trackViewItem = (file, packageInfo = null) => {
  const price = packageInfo?.price_per_file || 0;
  
  pushToDataLayer('view_item', {
    currency: "BDT",
    value: price,
    items: [formatFileItem(file, 0, packageInfo)],
  });
};

/**
 * Track when user adds files to cart (selects for checkout)
 * @param {Array} files - Selected files
 * @param {Object} packageInfo - Package information
 * @param {number} totalAmount - Total amount
 */
export const trackAddToCart = (files, packageInfo, totalAmount) => {
  const items = files.map((file, index) => 
    formatFileItem(file, index, packageInfo)
  );

  pushToDataLayer('add_to_cart', {
    currency: "BDT",
    value: totalAmount,
    items: items,
  });
};

/**
 * Track when user views cart/checkout page
 * @param {Array} files - Files in cart
 * @param {Object} packageInfo - Package information
 * @param {number} totalAmount - Total amount
 */
export const trackViewCart = (files, packageInfo, totalAmount) => {
  const items = files.map((file, index) => 
    formatFileItem(file, index, packageInfo)
  );

  pushToDataLayer('view_cart', {
    currency: "BDT",
    value: totalAmount,
    items: items,
  });
};

/**
 * Track when user removes item from cart
 * @param {Object} file - Removed file
 * @param {Object} packageInfo - Package information
 */
export const trackRemoveFromCart = (file, packageInfo) => {
  const price = packageInfo?.price_per_file || 0;
  
  pushToDataLayer('remove_from_cart', {
    currency: "BDT",
    value: price,
    items: [formatFileItem(file, 0, packageInfo)],
  });
};

/**
 * Track when user begins checkout
 * @param {Array} files - Files being purchased
 * @param {Object} packageInfo - Package information
 * @param {number} totalAmount - Total amount
 * @param {string} coupon - Coupon code (optional)
 */
export const trackBeginCheckout = (files, packageInfo, totalAmount, coupon = null) => {
  const items = files.map((file, index) => 
    formatFileItem(file, index, packageInfo)
  );

  const eventData = {
    currency: "BDT",
    value: totalAmount,
    items: items,
  };

  if (coupon) {
    eventData.coupon = coupon;
  }

  pushToDataLayer('begin_checkout', eventData);
};

/**
 * Track when user adds shipping/delivery information
 * @param {Array} files - Files being purchased
 * @param {Object} packageInfo - Package information
 * @param {number} totalAmount - Total amount
 * @param {string} deliveryMethod - Delivery method
 */
export const trackAddShippingInfo = (files, packageInfo, totalAmount, deliveryMethod = "Standard") => {
  const items = files.map((file, index) => 
    formatFileItem(file, index, packageInfo)
  );

  pushToDataLayer('add_shipping_info', {
    currency: "BDT",
    value: totalAmount,
    shipping_tier: deliveryMethod,
    items: items,
  });
};

/**
 * Track when user adds payment information
 * @param {Array} files - Files being purchased
 * @param {Object} packageInfo - Package information
 * @param {number} totalAmount - Total amount
 * @param {string} paymentMethod - Payment method (bKash, EPS, etc.)
 */
export const trackAddPaymentInfo = (files, packageInfo, totalAmount, paymentMethod) => {
  const items = files.map((file, index) => 
    formatFileItem(file, index, packageInfo)
  );

  pushToDataLayer('add_payment_info', {
    currency: "BDT",
    value: totalAmount,
    payment_type: paymentMethod,
    items: items,
  });
};

/**
 * Track successful purchase
 * @param {string} transactionId - Transaction/Purchase ID
 * @param {Array} files - Purchased files
 * @param {Object} packageInfo - Package information
 * @param {number} totalAmount - Total amount paid
 * @param {Object} options - Additional options (tax, shipping, coupon, etc.)
 */
export const trackPurchase = (
  transactionId,
  files,
  packageInfo,
  totalAmount,
  options = {}
) => {
  const items = files.map((file, index) => 
    formatFileItem(file, index, packageInfo)
  );

  const eventData = {
    transaction_id: transactionId,
    value: totalAmount,
    currency: "BDT",
    items: items,
  };

  // Add optional parameters
  if (options.tax) eventData.tax = options.tax;
  if (options.shipping) eventData.shipping = options.shipping;
  if (options.coupon) eventData.coupon = options.coupon;
  if (options.paymentMethod) eventData.payment_type = options.paymentMethod;
  if (options.customerType) eventData.customer_type = options.customerType; // 'new' or 'returning'

  pushToDataLayer('purchase', eventData);
};

/**
 * Track refund
 * @param {string} transactionId - Original transaction ID
 * @param {Array} files - Refunded files
 * @param {Object} packageInfo - Package information
 * @param {number} refundAmount - Refund amount
 */
export const trackRefund = (transactionId, files, packageInfo, refundAmount) => {
  const items = files.map((file, index) => 
    formatFileItem(file, index, packageInfo)
  );

  pushToDataLayer('refund', {
    transaction_id: transactionId,
    value: refundAmount,
    currency: "BDT",
    items: items,
  });
};

/**
 * Track package/promotion view
 * @param {Object} packageInfo - Package information
 * @param {string} promotionName - Promotion name
 * @param {string} creativeName - Creative/banner name
 */
export const trackViewPromotion = (packageInfo, promotionName, creativeName = "Package Banner") => {
  const item = formatPackageItem(packageInfo, 1);

  pushToDataLayer('view_promotion', {
    creative_name: creativeName,
    creative_slot: "featured_package",
    promotion_id: packageInfo?.id,
    promotion_name: promotionName,
    items: [item],
  });
};

/**
 * Track package/promotion selection
 * @param {Object} packageInfo - Package information
 * @param {string} promotionName - Promotion name
 * @param {string} creativeName - Creative/banner name
 */
export const trackSelectPromotion = (packageInfo, promotionName, creativeName = "Package Banner") => {
  const item = formatPackageItem(packageInfo, 1);

  pushToDataLayer('select_promotion', {
    creative_name: creativeName,
    creative_slot: "featured_package",
    promotion_id: packageInfo?.id,
    promotion_name: promotionName,
    items: [item],
  });
};

/**
 * Track custom event
 * @param {string} eventName - Custom event name
 * @param {Object} eventData - Event data
 */
export const trackCustomEvent = (eventName, eventData = {}) => {
  pushToDataLayer(eventName, eventData);
};

export default {
  initDataLayer,
  pushToDataLayer,
  trackViewItemList,
  trackSelectItem,
  trackViewItem,
  trackAddToCart,
  trackViewCart,
  trackRemoveFromCart,
  trackBeginCheckout,
  trackAddShippingInfo,
  trackAddPaymentInfo,
  trackPurchase,
  trackRefund,
  trackViewPromotion,
  trackSelectPromotion,
  trackCustomEvent,
};
