/**
 * GTM Testing Helper
 * Use these functions in browser console to test GTM events
 */

import { trackPurchase } from './gtmTracking';

/**
 * Test purchase event with sample data
 * Usage in console: window.testGTMPurchase()
 */
export const testPurchaseEvent = () => {
  console.log('🧪 Testing GTM Purchase Event...');
  
  const testData = {
    transactionId: `TEST_${Date.now()}`,
    files: [
      {
        id: 'file_1',
        name: 'Test_Mouza_Map.pdf',
        mimeType: 'application/pdf'
      }
    ],
    packageInfo: {
      field_name: 'Test Package',
      survey_type: 'CS',
      price_per_file: 100
    },
    totalAmount: 100,
    options: {
      paymentMethod: 'eps',
      paymentStatus: 'success'
    }
  };
  
  console.log('📦 Test data:', testData);
  
  trackPurchase(
    testData.transactionId,
    testData.files,
    testData.packageInfo,
    testData.totalAmount,
    testData.options
  );
  
  console.log('✅ Test purchase event sent!');
  console.log('🔍 Check dataLayer:', window.dataLayer.filter(e => e.event === 'purchase'));
};

/**
 * Check if GTM is loaded
 */
export const checkGTM = () => {
  console.log('🔍 GTM Status Check:');
  console.log('-------------------');
  
  // Check if dataLayer exists
  if (typeof window.dataLayer !== 'undefined') {
    console.log('✅ dataLayer exists');
    console.log('📊 dataLayer length:', window.dataLayer.length);
    console.log('📊 dataLayer contents:', window.dataLayer);
  } else {
    console.error('❌ dataLayer does not exist!');
  }
  
  // Check if GTM container is loaded
  if (typeof window.google_tag_manager !== 'undefined') {
    console.log('✅ GTM container loaded');
    console.log('📦 GTM containers:', Object.keys(window.google_tag_manager));
  } else {
    console.warn('⚠️ GTM container not detected');
  }
  
  // Check for purchase events
  if (window.dataLayer) {
    const purchaseEvents = window.dataLayer.filter(e => e.event === 'purchase');
    console.log('💰 Purchase events found:', purchaseEvents.length);
    if (purchaseEvents.length > 0) {
      console.log('📊 Purchase events:', purchaseEvents);
    }
  }
  
  return {
    dataLayerExists: typeof window.dataLayer !== 'undefined',
    dataLayerLength: window.dataLayer?.length || 0,
    gtmLoaded: typeof window.google_tag_manager !== 'undefined',
    purchaseEventsCount: window.dataLayer?.filter(e => e.event === 'purchase').length || 0
  };
};

/**
 * Get stored order details from storage
 */
export const checkStoredOrder = () => {
  console.log('🔍 Checking stored order details...');
  console.log('-------------------');
  
  const fromLocalStorage = localStorage.getItem('pending_order_gtm');
  const fromSessionStorage = sessionStorage.getItem('pending_order_gtm');
  
  console.log('📦 localStorage:', fromLocalStorage ? 'Found' : 'Empty');
  if (fromLocalStorage) {
    try {
      console.log('📦 localStorage data:', JSON.parse(fromLocalStorage));
    } catch (e) {
      console.error('❌ Failed to parse localStorage data');
    }
  }
  
  console.log('📦 sessionStorage:', fromSessionStorage ? 'Found' : 'Empty');
  if (fromSessionStorage) {
    try {
      console.log('📦 sessionStorage data:', JSON.parse(fromSessionStorage));
    } catch (e) {
      console.error('❌ Failed to parse sessionStorage data');
    }
  }
  
  return {
    localStorage: fromLocalStorage,
    sessionStorage: fromSessionStorage
  };
};

/**
 * Manually store test order data
 */
export const storeTestOrder = () => {
  const testOrder = {
    files: [
      {
        id: 'test_file_1',
        name: 'Test_Map.pdf',
        mimeType: 'application/pdf'
      }
    ],
    packageInfo: {
      field_name: 'Test Package',
      survey_type: 'CS',
      price_per_file: 150
    },
    totalAmount: 150,
    paymentMethod: 'eps',
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('pending_order_gtm', JSON.stringify(testOrder));
  sessionStorage.setItem('pending_order_gtm', JSON.stringify(testOrder));
  
  console.log('✅ Test order stored in both localStorage and sessionStorage');
  console.log('📦 Test order data:', testOrder);
  
  return testOrder;
};

/**
 * Clear stored order data
 */
export const clearStoredOrder = () => {
  localStorage.removeItem('pending_order_gtm');
  sessionStorage.removeItem('pending_order_gtm');
  console.log('🗑️ Cleared order data from both storages');
};

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  window.testGTMPurchase = testPurchaseEvent;
  window.checkGTM = checkGTM;
  window.checkStoredOrder = checkStoredOrder;
  window.storeTestOrder = storeTestOrder;
  window.clearStoredOrder = clearStoredOrder;
  
  console.log('🧪 GTM Test Helpers loaded!');
  console.log('📝 Available commands:');
  console.log('  - window.testGTMPurchase() - Test purchase event');
  console.log('  - window.checkGTM() - Check GTM status');
  console.log('  - window.checkStoredOrder() - Check stored order data');
  console.log('  - window.storeTestOrder() - Store test order data');
  console.log('  - window.clearStoredOrder() - Clear stored order data');
}

export default {
  testPurchaseEvent,
  checkGTM,
  checkStoredOrder,
  storeTestOrder,
  clearStoredOrder
};
