/**
 * GTM Tag Assistant Connection Helper
 * Run this in browser console to diagnose GTM issues
 */

export const diagnoseTAGConnection = () => {
  console.log('🔍 ========================================');
  console.log('🔍 GTM Tag Assistant Diagnostic Report');
  console.log('🔍 ========================================\n');

  const results = {
    gtmLoaded: false,
    dataLayerExists: false,
    gtmContainerId: null,
    tagsFound: [],
    errors: [],
    warnings: [],
    suggestions: []
  };

  // 1. Check if dataLayer exists
  console.log('1️⃣ Checking dataLayer...');
  if (typeof window.dataLayer !== 'undefined') {
    results.dataLayerExists = true;
    console.log('   ✅ dataLayer exists');
    console.log('   📊 dataLayer length:', window.dataLayer.length);
    console.log('   📊 dataLayer:', window.dataLayer);
  } else {
    results.dataLayerExists = false;
    results.errors.push('dataLayer does not exist');
    console.log('   ❌ dataLayer does NOT exist');
  }

  // 2. Check if GTM container is loaded
  console.log('\n2️⃣ Checking GTM container...');
  if (typeof window.google_tag_manager !== 'undefined') {
    results.gtmLoaded = true;
    const containers = Object.keys(window.google_tag_manager);
    results.gtmContainerId = containers[0];
    console.log('   ✅ GTM container loaded');
    console.log('   📦 Container ID:', results.gtmContainerId);
    console.log('   📦 All containers:', containers);
  } else {
    results.gtmLoaded = false;
    results.errors.push('GTM container not loaded');
    console.log('   ❌ GTM container NOT loaded');
  }

  // 3. Check for GTM script in DOM
  console.log('\n3️⃣ Checking GTM script in DOM...');
  const gtmScripts = Array.from(document.scripts).filter(script => 
    script.src.includes('googletagmanager.com/gtm.js')
  );
  
  if (gtmScripts.length > 0) {
    console.log('   ✅ GTM script found in DOM');
    gtmScripts.forEach((script, idx) => {
      console.log(`   📄 Script ${idx + 1}:`, script.src);
      const match = script.src.match(/id=([^&]+)/);
      if (match) {
        console.log(`   🏷️  Container ID: ${match[1]}`);
      }
    });
  } else {
    results.errors.push('No GTM script found in DOM');
    console.log('   ❌ No GTM script found in DOM');
  }

  // 4. Check for GTM noscript iframe
  console.log('\n4️⃣ Checking GTM noscript iframe...');
  const gtmIframes = Array.from(document.querySelectorAll('iframe')).filter(iframe => 
    iframe.src.includes('googletagmanager.com/ns.html')
  );
  
  if (gtmIframes.length > 0) {
    console.log('   ✅ GTM noscript iframe found');
  } else {
    results.warnings.push('No GTM noscript iframe found (not critical)');
    console.log('   ⚠️  No GTM noscript iframe found');
  }

  // 5. Check if running in Preview Mode
  console.log('\n5️⃣ Checking GTM Preview Mode...');
  const isPreviewMode = document.cookie.includes('gtm_debug') || 
                        window.location.search.includes('gtm_debug');
  
  if (isPreviewMode) {
    console.log('   ✅ GTM Preview Mode is ACTIVE');
  } else {
    console.log('   ℹ️  GTM Preview Mode is NOT active');
    results.suggestions.push('Use GTM Preview Mode for debugging: GTM Dashboard → Preview');
  }

  // 6. Check for ad blockers
  console.log('\n6️⃣ Checking for ad blockers...');
  const testAd = document.createElement('div');
  testAd.innerHTML = '&nbsp;';
  testAd.className = 'adsbox';
  document.body.appendChild(testAd);
  
  setTimeout(() => {
    if (testAd.offsetHeight === 0) {
      results.warnings.push('Ad blocker might be blocking GTM');
      console.log('   ⚠️  Ad blocker might be blocking GTM');
      results.suggestions.push('Disable ad blocker and refresh page');
    } else {
      console.log('   ✅ No ad blocker detected');
    }
    document.body.removeChild(testAd);
  }, 100);

  // 7. Check network requests
  console.log('\n7️⃣ Checking network requests...');
  console.log('   ℹ️  Open DevTools → Network tab');
  console.log('   ℹ️  Filter by "gtm" to see GTM requests');
  console.log('   ℹ️  Look for: gtm.js, collect, analytics.js');

  // 8. Check for CSP (Content Security Policy)
  console.log('\n8️⃣ Checking Content Security Policy...');
  const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (metaCSP) {
    console.log('   ⚠️  CSP meta tag found:', metaCSP.content);
    results.warnings.push('CSP might be blocking GTM');
  } else {
    console.log('   ✅ No CSP meta tag found');
  }

  // 9. Check browser console for errors
  console.log('\n9️⃣ Checking for console errors...');
  console.log('   ℹ️  Check console for red errors related to:');
  console.log('   - googletagmanager.com');
  console.log('   - CORS errors');
  console.log('   - Script loading errors');

  // 10. Check HTTPS
  console.log('\n🔟 Checking protocol...');
  if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
    console.log('   ✅ Running on', window.location.protocol);
  } else {
    results.warnings.push('Not running on HTTPS (might affect some features)');
    console.log('   ⚠️  Running on HTTP (Tag Assistant works better on HTTPS)');
  }

  // Summary
  console.log('\n📊 ========================================');
  console.log('📊 SUMMARY');
  console.log('📊 ========================================');
  console.log('dataLayer Exists:', results.dataLayerExists ? '✅' : '❌');
  console.log('GTM Loaded:', results.gtmLoaded ? '✅' : '❌');
  console.log('Container ID:', results.gtmContainerId || 'Not found');
  
  if (results.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    results.errors.forEach(error => console.log('   -', error));
  }
  
  if (results.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    results.warnings.forEach(warning => console.log('   -', warning));
  }
  
  if (results.suggestions.length > 0) {
    console.log('\n💡 SUGGESTIONS:');
    results.suggestions.forEach(suggestion => console.log('   -', suggestion));
  }

  // Tag Assistant specific checks
  console.log('\n🏷️  ========================================');
  console.log('🏷️  TAG ASSISTANT SPECIFIC CHECKS');
  console.log('🏷️  ========================================');
  
  console.log('\n1. Is Tag Assistant extension installed?');
  console.log('   - Chrome: chrome://extensions');
  console.log('   - Look for "Tag Assistant Legacy (by Google)"');
  console.log('   - Or "Tag Assistant Companion"');
  
  console.log('\n2. Is Tag Assistant enabled?');
  console.log('   - Click Tag Assistant icon in browser toolbar');
  console.log('   - Click "Enable" button');
  console.log('   - Refresh the page (F5)');
  
  console.log('\n3. Try Tag Assistant troubleshooting:');
  console.log('   - Click Tag Assistant icon');
  console.log('   - If no tags found, click "Record"');
  console.log('   - Perform actions on the page');
  console.log('   - Click "Stop Recording"');
  
  console.log('\n4. Alternative: Use GTM Preview Mode');
  console.log('   - Go to GTM Dashboard');
  console.log('   - Click "Preview" button');
  console.log('   - Enter your website URL');
  console.log('   - Debug in the preview panel');

  console.log('\n5. Alternative: Use GA4 DebugView');
  console.log('   - GA4 Dashboard → Configure → DebugView');
  console.log('   - Enable debug mode with: ');
  console.log('   - Chrome extension or ?gtm_debug=1 in URL');

  return results;
};

/**
 * Quick GTM health check
 */
export const quickGTMCheck = () => {
  const status = {
    dataLayer: typeof window.dataLayer !== 'undefined',
    gtm: typeof window.google_tag_manager !== 'undefined',
    containerId: null,
    events: 0
  };

  if (status.gtm) {
    const containers = Object.keys(window.google_tag_manager);
    status.containerId = containers[0];
  }

  if (status.dataLayer) {
    status.events = window.dataLayer.length;
  }

  console.log('🔍 Quick GTM Status:');
  console.log('   dataLayer:', status.dataLayer ? '✅' : '❌');
  console.log('   GTM Container:', status.gtm ? '✅' : '❌');
  console.log('   Container ID:', status.containerId || 'Not found');
  console.log('   Events in dataLayer:', status.events);

  if (status.dataLayer && status.gtm) {
    console.log('\n✅ GTM is working! Tag Assistant issue might be:');
    console.log('   1. Extension not installed/enabled');
    console.log('   2. Need to refresh after enabling');
    console.log('   3. Browser extension conflict');
    console.log('   4. Try GTM Preview Mode instead');
  } else {
    console.log('\n❌ GTM not properly loaded');
    console.log('   Run: window.diagnoseTAGConnection() for details');
  }

  return status;
};

/**
 * Test GTM by pushing a test event
 */
export const testGTMEvent = () => {
  if (typeof window.dataLayer === 'undefined') {
    console.error('❌ dataLayer not available');
    return false;
  }

  console.log('🧪 Pushing test event to dataLayer...');
  
  window.dataLayer.push({
    event: 'test_event',
    test_parameter: 'test_value',
    timestamp: new Date().toISOString()
  });

  console.log('✅ Test event pushed');
  console.log('📊 Current dataLayer:', window.dataLayer);
  console.log('\nℹ️  If Tag Assistant is working, it should show this event');
  
  return true;
};

/**
 * Check if GTM Preview Mode is active
 */
export const checkPreviewMode = () => {
  const isPreview = document.cookie.includes('gtm_debug') || 
                    window.location.search.includes('gtm_debug') ||
                    window.location.hash.includes('gtm_debug');

  if (isPreview) {
    console.log('✅ GTM Preview Mode is ACTIVE');
    console.log('   You should see the GTM debug panel at the bottom');
  } else {
    console.log('⚠️  GTM Preview Mode is NOT active');
    console.log('\n💡 To enable Preview Mode:');
    console.log('   1. Go to GTM Dashboard');
    console.log('   2. Click "Preview" button (top right)');
    console.log('   3. Enter your website URL');
    console.log('   4. Click "Connect"');
    console.log('   5. Debug panel will appear at bottom of your site');
  }

  return isPreview;
};

// Make functions globally available
if (typeof window !== 'undefined') {
  window.diagnoseTAGConnection = diagnoseTAGConnection;
  window.quickGTMCheck = quickGTMCheck;
  window.testGTMEvent = testGTMEvent;
  window.checkPreviewMode = checkPreviewMode;
  
  console.log('🏷️  Tag Assistant Helper loaded!');
  console.log('📝 Available commands:');
  console.log('   - window.quickGTMCheck() - Quick health check');
  console.log('   - window.diagnoseTAGConnection() - Full diagnostic');
  console.log('   - window.testGTMEvent() - Push test event');
  console.log('   - window.checkPreviewMode() - Check preview mode status');
}

export default {
  diagnoseTAGConnection,
  quickGTMCheck,
  testGTMEvent,
  checkPreviewMode
};
