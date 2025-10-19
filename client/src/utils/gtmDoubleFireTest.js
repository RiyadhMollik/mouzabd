/**
 * Test Double-Firing Prevention
 * Run in browser console to verify events fire only once
 */

export const testDoubleFirePrevention = () => {
  console.log('🧪 Testing Double-Fire Prevention...\n');
  
  const results = {
    beginCheckout: 0,
    viewCart: 0,
    purchase: 0,
    addPaymentInfo: 0,
    total: 0
  };
  
  if (!window.dataLayer) {
    console.error('❌ dataLayer not found!');
    return null;
  }
  
  // Count each event type
  window.dataLayer.forEach(event => {
    if (event.event === 'begin_checkout') results.beginCheckout++;
    if (event.event === 'view_cart') results.viewCart++;
    if (event.event === 'purchase') results.purchase++;
    if (event.event === 'add_payment_info') results.addPaymentInfo++;
  });
  
  results.total = window.dataLayer.length;
  
  console.log('📊 Event Count Summary:');
  console.log('─────────────────────────────────');
  console.log(`begin_checkout:    ${results.beginCheckout} ${results.beginCheckout > 1 ? '❌ DUPLICATE!' : '✅'}`);
  console.log(`view_cart:         ${results.viewCart} ${results.viewCart > 1 ? '❌ DUPLICATE!' : '✅'}`);
  console.log(`purchase:          ${results.purchase} ${results.purchase > 1 ? '❌ DUPLICATE!' : '✅'}`);
  console.log(`add_payment_info:  ${results.addPaymentInfo} ${results.addPaymentInfo > 1 ? '❌ DUPLICATE!' : '✅'}`);
  console.log('─────────────────────────────────');
  console.log(`Total events:      ${results.total}`);
  
  // Check for duplicates
  const hasDuplicates = 
    results.beginCheckout > 1 || 
    results.viewCart > 1 || 
    results.purchase > 1;
  
  console.log('\n🎯 Result:');
  if (hasDuplicates) {
    console.log('❌ FOUND DUPLICATES!');
    console.log('💡 Check console for "⏭️ already tracked" messages');
  } else {
    console.log('✅ NO DUPLICATES - All events fire once!');
  }
  
  return results;
};

/**
 * Check for "skip duplicate" messages in console
 */
export const checkSkipMessages = () => {
  console.log('ℹ️ To verify the fix is working:');
  console.log('1. Look for console messages: "⏭️ already tracked, skipping duplicate"');
  console.log('2. These messages confirm duplicates were prevented');
  console.log('3. In production, these messages won\'t appear (no duplicates to prevent)');
};

/**
 * Detailed event inspection
 */
export const inspectEvents = (eventType = 'all') => {
  if (!window.dataLayer) {
    console.error('❌ dataLayer not found!');
    return null;
  }
  
  const events = eventType === 'all' 
    ? window.dataLayer 
    : window.dataLayer.filter(e => e.event === eventType);
  
  console.log(`🔍 Inspecting ${eventType === 'all' ? 'all' : eventType} events:`);
  console.log('─────────────────────────────────────────────');
  
  const grouped = {};
  events.forEach((event, index) => {
    if (event.event) {
      if (!grouped[event.event]) {
        grouped[event.event] = [];
      }
      grouped[event.event].push({ index, event });
    }
  });
  
  Object.keys(grouped).forEach(eventName => {
    const occurrences = grouped[eventName];
    console.log(`\n${eventName}: ${occurrences.length} occurrence(s) ${occurrences.length > 1 ? '❌' : '✅'}`);
    
    if (occurrences.length > 1) {
      console.log('  Duplicate details:');
      occurrences.forEach((item, idx) => {
        console.log(`  ${idx + 1}. Index ${item.index}:`, item.event);
      });
    }
  });
  
  console.log('\n─────────────────────────────────────────────');
  
  return grouped;
};

/**
 * Compare before/after component renders
 */
export const trackEventChanges = () => {
  if (!window.dataLayer) {
    console.error('❌ dataLayer not found!');
    return null;
  }
  
  const initialState = {
    length: window.dataLayer.length,
    events: window.dataLayer.map(e => e.event).filter(Boolean)
  };
  
  console.log('📸 Current dataLayer snapshot:');
  console.log('  Length:', initialState.length);
  console.log('  Events:', initialState.events);
  
  console.log('\n💡 Now perform an action (navigate, click, etc.)');
  console.log('💡 Then run: window.trackEventChanges() again to compare');
  
  return initialState;
};

/**
 * Simulate double-firing test
 */
export const simulateDoubleFireTest = () => {
  console.log('🧪 Simulating double-fire scenario...\n');
  
  const initialLength = window.dataLayer.length;
  
  // Test event
  const testEvent = {
    event: 'test_double_fire',
    timestamp: Date.now(),
    test: true
  };
  
  console.log('1️⃣ Pushing test event (first time)...');
  window.dataLayer.push(testEvent);
  
  console.log('2️⃣ Pushing test event (second time - simulating duplicate)...');
  window.dataLayer.push(testEvent);
  
  const finalLength = window.dataLayer.length;
  const addedEvents = finalLength - initialLength;
  
  console.log('\n📊 Results:');
  console.log(`  Initial length: ${initialLength}`);
  console.log(`  Final length: ${finalLength}`);
  console.log(`  Events added: ${addedEvents}`);
  
  const testEvents = window.dataLayer.filter(e => e.event === 'test_double_fire');
  console.log(`  'test_double_fire' count: ${testEvents.length}`);
  
  if (testEvents.length === 2) {
    console.log('\n⚠️ NOTE: This is expected behavior for manual push!');
    console.log('Our fix only prevents useEffect-based duplicates.');
    console.log('If you push manually twice, both will be recorded.');
  }
  
  // Clean up
  console.log('\n🧹 Note: Test events remain in dataLayer (can\'t remove)');
  
  return testEvents;
};

// Make functions globally available
if (typeof window !== 'undefined') {
  window.testDoubleFirePrevention = testDoubleFirePrevention;
  window.checkSkipMessages = checkSkipMessages;
  window.inspectEvents = inspectEvents;
  window.trackEventChanges = trackEventChanges;
  window.simulateDoubleFireTest = simulateDoubleFireTest;
  
  console.log('🧪 Double-Fire Prevention Test Tools loaded!');
  console.log('📝 Available commands:');
  console.log('   - window.testDoubleFirePrevention() - Check for duplicate events');
  console.log('   - window.inspectEvents(eventType) - Detailed event inspection');
  console.log('   - window.trackEventChanges() - Track changes over time');
  console.log('   - window.checkSkipMessages() - Info about skip messages');
}

export default {
  testDoubleFirePrevention,
  checkSkipMessages,
  inspectEvents,
  trackEventChanges,
  simulateDoubleFireTest
};
