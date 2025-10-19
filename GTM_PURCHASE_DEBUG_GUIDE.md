# 🐛 GTM Purchase Event Debugging Guide

## 📊 Issue: Purchase Event Not Firing

The GTM `purchase` event is not being tracked. This guide will help you debug and fix the issue.

## ✅ Changes Made to Fix

### 1. **Enhanced Logging in `trackPurchase()`**

Added comprehensive console logging to debug:
- Input parameters validation
- Files array processing
- Formatted items
- Event data structure
- DataLayer state verification

### 2. **Improved `pushToDataLayer()`**

- ✅ Added window object check (SSR safety)
- ✅ Clear previous ecommerce data before pushing
- ✅ Proper ecommerce object structure for GA4
- ✅ Enhanced logging with event count

### 3. **Fallback Handling**

- ✅ Handle empty files array
- ✅ Fallback to package item if no files
- ✅ Parse float for totalAmount
- ✅ Added paymentStatus option

## 🔍 How to Debug

### Step 1: Check Browser Console

Open your browser's DevTools (F12) and look for these logs:

```javascript
// When trackPurchase is called:
🔍 trackPurchase called with: {
  transactionId: "TXN_123456",
  filesCount: 5,
  files: [...],
  packageInfo: {...},
  totalAmount: 150,
  options: {...}
}

// Formatted items:
📦 Formatted items: [...]

// Event being pushed:
📊 Pushing purchase event to dataLayer: {
  transaction_id: "TXN_123456",
  value: 150,
  currency: "BDT",
  items: [...]
}

// GTM E-commerce Event:
📊 GTM E-commerce Event: purchase {...}

// DataLayer verification:
✅ DataLayer length: 5
✅ Current dataLayer: [...]
✅ Last event: {event: "purchase", ecommerce: {...}}
```

### Step 2: Verify DataLayer Structure

In browser console, run:

```javascript
// Check if dataLayer exists
console.log('DataLayer:', window.dataLayer);

// Get last event
console.log('Last event:', window.dataLayer[window.dataLayer.length - 1]);

// Filter purchase events
console.log('Purchase events:', window.dataLayer.filter(e => e.event === 'purchase'));

// Check ecommerce data
window.dataLayer.forEach((item, index) => {
  if (item.event === 'purchase') {
    console.log(`Purchase #${index}:`, item);
  }
});
```

### Step 3: Verify GTM Container is Loaded

Check if GTM script is present:

```javascript
// Check for GTM container
if (typeof window.google_tag_manager !== 'undefined') {
  console.log('✅ GTM is loaded');
  console.log('Container IDs:', Object.keys(window.google_tag_manager));
} else {
  console.error('❌ GTM is NOT loaded');
}
```

## 🚨 Common Issues & Solutions

### Issue 1: "Window is not defined"

**Symptoms**: 
```
❌ Window object not available - running on server?
```

**Cause**: Trying to access window object during server-side rendering

**Solution**: The updated code now checks for window availability

---

### Issue 2: Event Pushed but Not in GA4

**Symptoms**: 
- Console shows event pushed
- DataLayer contains event
- But event doesn't appear in GA4 DebugView

**Possible Causes**:
1. **GTM Container Not Published**
   - Go to GTM → Versions → Publish your container
   
2. **GTM Tag Not Configured**
   - Go to GTM → Tags
   - Create "GA4 - Purchase Event" tag
   - Event Name: `purchase`
   - Configuration Tag: Your GA4 Configuration Tag
   - Trigger: Custom Event → Event name equals `purchase`

3. **Wrong GA4 Measurement ID**
   - Verify your Measurement ID (G-XXXXXXXXXX) in GA4 Configuration tag

---

### Issue 3: Empty Items Array

**Symptoms**:
```javascript
items: []
```

**Cause**: Files array is empty or undefined

**Solution**: Updated code now uses fallback:
```javascript
const items = Array.isArray(files) && files.length > 0
  ? files.map((file, index) => formatFileItem(file, index, packageInfo))
  : [formatPackageItem(packageInfo, 1)]; // Fallback
```

---

### Issue 4: Event Structure Wrong

**Old Structure** (Won't work with GA4):
```javascript
{
  event: 'purchase',
  transaction_id: 'TXN_123',
  value: 150,
  items: [...]
}
```

**New Structure** (Correct for GA4):
```javascript
{
  event: 'purchase',
  ecommerce: {
    transaction_id: 'TXN_123',
    value: 150,
    currency: 'BDT',
    items: [...]
  }
}
```

**Solution**: Updated `pushToDataLayer()` to wrap e-commerce data properly

---

### Issue 5: Multiple Purchase Events

**Symptoms**: Same transaction tracked multiple times

**Cause**: Component re-rendering or navigation

**Solution**: Add dependency array to useEffect:
```javascript
useEffect(() => {
  trackPurchase(...);
}, []); // Empty array = run once
```

## 🧪 Testing Checklist

### ✅ Browser Console Tests

```javascript
// Test 1: Check dataLayer exists
window.dataLayer !== undefined
// Expected: true

// Test 2: Check dataLayer has events
window.dataLayer.length > 0
// Expected: true

// Test 3: Find purchase event
window.dataLayer.find(e => e.event === 'purchase')
// Expected: Object with purchase data

// Test 4: Verify ecommerce object
window.dataLayer.find(e => e.event === 'purchase')?.ecommerce
// Expected: Object with transaction_id, value, items

// Test 5: Check items array
window.dataLayer.find(e => e.event === 'purchase')?.ecommerce?.items?.length > 0
// Expected: true
```

### ✅ GA4 DebugView Tests

1. **Open GA4 Property**
2. **Go to**: Admin → DebugView
3. **Complete a test purchase**
4. **Look for**:
   - Event name: `purchase`
   - Parameters: `transaction_id`, `value`, `currency`
   - Items: Array with file details

### ✅ GTM Preview Mode

1. **Open GTM Container**
2. **Click**: Preview (top right)
3. **Enter your website URL**
4. **Complete a purchase**
5. **Check**:
   - Summary panel shows "purchase" event
   - Variables panel shows ecommerce data
   - Tags fired (GA4 Purchase tag should fire)

## 📋 Troubleshooting Steps

### Step 1: Verify Function is Called

Add this at the top of your component:

```javascript
console.log('Component mounted');

useEffect(() => {
  console.log('useEffect triggered');
  console.log('About to call trackPurchase');
  
  trackPurchase(
    transactionId,
    files,
    packageInfo,
    totalAmount,
    options
  );
  
  console.log('trackPurchase called');
}, []);
```

**Expected Output**:
```
Component mounted
useEffect triggered
About to call trackPurchase
🔍 trackPurchase called with: {...}
📦 Formatted items: [...]
📊 Pushing purchase event to dataLayer: {...}
📊 GTM E-commerce Event: purchase {...}
✅ DataLayer length: 5
trackPurchase called
```

---

### Step 2: Check Import

Verify trackPurchase is imported correctly:

```javascript
// At top of file
import { trackPurchase } from '../utils/gtmTracking';

// OR
import { trackPurchase } from '@/utils/gtmTracking';
```

---

### Step 3: Check GTM Installation

Verify GTM code in `index.html`:

```html
<!-- In <head> -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>

<!-- In <body> (immediately after opening tag) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

**Replace `GTM-XXXXXXX`** with your actual GTM Container ID!

---

### Step 4: Test with Minimal Data

Try calling trackPurchase with minimal data:

```javascript
trackPurchase(
  'TEST_123',
  [],
  { name: 'Test Package', price_per_file: 100 },
  100,
  { paymentMethod: 'test' }
);
```

Check if this appears in console and dataLayer.

---

### Step 5: Check Network Tab

1. Open DevTools → Network tab
2. Filter by "gtm"
3. Complete purchase
4. Look for requests to:
   - `www.googletagmanager.com/gtm.js`
   - `www.google-analytics.com/g/collect`

If no requests, GTM or GA4 isn't loaded.

## 🎯 Expected Behavior

### When Purchase Event Fires Successfully:

1. **Console Logs**:
```
🔍 trackPurchase called with: {...}
📦 Formatted items: [...]
📊 Pushing purchase event to dataLayer: {...}
🔧 GTM dataLayer initialized: X events
📊 GTM E-commerce Event: purchase {...}
✅ DataLayer length: X
✅ Current dataLayer: [...]
✅ Last event: {event: "purchase", ecommerce: {...}}
```

2. **DataLayer Structure**:
```javascript
{
  event: "purchase",
  ecommerce: {
    transaction_id: "TXN_1729345678",
    value: 150.00,
    currency: "BDT",
    payment_type: "eps",
    customer_type: "returning",
    items: [
      {
        item_id: "file_123",
        item_name: "1_Atghar_SA_RS_2.pdf",
        affiliation: "BD Mouza",
        price: 15.00,
        quantity: 1,
        ...
      }
    ]
  }
}
```

3. **GA4 DebugView**:
- Event appears within 1-2 seconds
- Shows all parameters
- Items array populated

4. **GTM Preview**:
- Purchase event appears in event stream
- All variables populated
- Tags fired successfully

## 🔧 Quick Fixes

### Fix 1: Clear DataLayer Before Push

```javascript
// In your component
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({ ecommerce: null }); // Clear previous
trackPurchase(...);
```

### Fix 2: Force Immediate Push

```javascript
trackPurchase(...);

// Force flush
setTimeout(() => {
  console.log('Final dataLayer:', window.dataLayer);
}, 1000);
```

### Fix 3: Manual DataLayer Push

If trackPurchase isn't working, try manual push:

```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: 'TEST_123',
    value: 100,
    currency: 'BDT',
    items: [{
      item_name: 'Test Item',
      price: 100,
      quantity: 1
    }]
  }
});
```

## 📞 Still Not Working?

If after all debugging the event still doesn't fire:

### Check These:

1. ✅ GTM Container ID is correct in `index.html`
2. ✅ GTM Container is published (not just saved)
3. ✅ GA4 Configuration tag exists and fires on All Pages
4. ✅ Purchase event tag is configured correctly
5. ✅ Trigger is set to Custom Event "purchase"
6. ✅ Browser has no ad blockers (disable for testing)
7. ✅ Not in incognito mode with strict tracking prevention
8. ✅ Internet connection is stable

### Try:

1. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear cache**: Clear browser cache and reload
3. **Different browser**: Test in Chrome, Firefox, Edge
4. **GTM Preview Mode**: Use GTM's built-in preview debugger
5. **GA4 DebugView**: Enable debug mode in GA4

### Test Command:

Run this in browser console after purchase:

```javascript
// Check everything at once
console.log('=== GTM DEBUG INFO ===');
console.log('1. DataLayer exists:', typeof window.dataLayer !== 'undefined');
console.log('2. DataLayer length:', window.dataLayer?.length);
console.log('3. Purchase events:', window.dataLayer?.filter(e => e.event === 'purchase').length);
console.log('4. Last purchase:', window.dataLayer?.filter(e => e.event === 'purchase').pop());
console.log('5. GTM loaded:', typeof window.google_tag_manager !== 'undefined');
console.log('===================');
```

---

**Last Updated**: October 19, 2025  
**Status**: Enhanced with debugging and proper GA4 ecommerce structure  
**Next Steps**: Test with console logs enabled and verify in GTM Preview Mode

