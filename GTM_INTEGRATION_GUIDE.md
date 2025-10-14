# Google Tag Manager Integration Guide

## 🎯 Overview

Google Tag Manager (GTM) has been integrated into your application with data layer support for comprehensive event tracking and analytics.

## ✅ What's Been Added

### 1. **Google Tag Manager Script** (`index.html`)
```html
<!-- Initialize Data Layer -->
<script>
  window.dataLayer = window.dataLayer || [];
</script>

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WRPQH9X3');</script>

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WRPQH9X3"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

### 2. **GTM Utilities** (`src/utils/gtm.js`)
Helper functions for tracking events throughout your application.

## 📊 Available Tracking Functions

### 1. **Page Views**
```javascript
import { gtmPageView } from '../utils/gtm';

// Track page view
gtmPageView('/results', 'Search Results');
```

### 2. **Search Events**
```javascript
import { gtmSearchEvent } from '../utils/gtm';

// Track search
gtmSearchEvent('SA_RS', 15); // search term, result count
```

### 3. **File Selection**
```javascript
import { gtmFileSelect } from '../utils/gtm';

// Track file selection
gtmFileSelect('1_Atghar_2.pdf', 'SA_RS', 5); // file name, survey type, total count
```

### 4. **Add to Cart**
```javascript
import { gtmAddToCart } from '../utils/gtm';

// Track when files are selected for purchase
gtmAddToCart(selectedFiles, totalPrice, packageName);
```

### 5. **Begin Checkout**
```javascript
import { gtmBeginCheckout } from '../utils/gtm';

// Track checkout initiation
gtmBeginCheckout(fileCount, totalPrice, packageName);
```

### 6. **Purchase**
```javascript
import { gtmPurchase } from '../utils/gtm';

// Track completed purchase
gtmPurchase(transactionId, totalPrice, fileCount, packageName, paymentMethod);
```

### 7. **User Authentication**
```javascript
import { gtmLogin, gtmSignup } from '../utils/gtm';

// Track login
gtmLogin('google'); // or 'email', 'facebook', etc.

// Track signup
gtmSignup('google');
```

### 8. **Survey Pricing View**
```javascript
import { gtmViewSurveyPricing } from '../utils/gtm';

// Track when user views survey pricing
gtmViewSurveyPricing('SA_RS', 15.00);
```

### 9. **Error Tracking**
```javascript
import { gtmError } from '../utils/gtm';

// Track errors
gtmError('API_ERROR', 'Failed to fetch survey pricing');
```

### 10. **Custom Events**
```javascript
import { gtmCustomEvent } from '../utils/gtm';

// Track any custom event
gtmCustomEvent('filter_applied', {
  filter_type: 'division',
  filter_value: 'ঢাকা বিভাগ',
});
```

## 🎯 Implementation Examples

### Example 1: Track File Selection in ResultPage
```javascript
import { gtmFileSelect, gtmAddToCart } from '../utils/gtm';

const handleFileSelect = (file) => {
  setSelectedFiles(prev => {
    const newSelection = [...prev, file];
    
    // Track file selection
    gtmFileSelect(file.name, surveyType, newSelection.length);
    
    // Track add to cart
    gtmAddToCart(newSelection, calculatePrice(newSelection), packageName);
    
    return newSelection;
  });
};
```

### Example 2: Track Search in InputSearch Component
```javascript
import { gtmSearchEvent } from '../utils/gtm';

const fetchResults = async (query) => {
  const response = await fetch(`/api/search?q=${query}`);
  const data = await response.json();
  
  // Track search event
  gtmSearchEvent(query, data.results.length);
  
  setResults(data.results);
};
```

### Example 3: Track Checkout Flow
```javascript
import { gtmBeginCheckout, gtmPurchase } from '../utils/gtm';

// When user clicks "কিনুন" button
const handlePurchase = () => {
  gtmBeginCheckout(
    selectedFiles.length,
    totalPrice,
    selectedPackage?.field_name
  );
  
  navigate('/checkout');
};

// After successful payment
const handlePaymentSuccess = (transactionId) => {
  gtmPurchase(
    transactionId,
    totalPrice,
    selectedFiles.length,
    selectedPackage?.field_name,
    'bkash' // or 'eps', 'card', etc.
  );
};
```

### Example 4: Track Authentication
```javascript
import { gtmLogin, gtmSignup, gtmSetUser } from '../utils/gtm';

// After successful login
const handleLoginSuccess = (user) => {
  gtmLogin('google');
  gtmSetUser(user.id, {
    user_email: user.email,
    user_name: user.name,
  });
};

// After successful signup
const handleSignupSuccess = (user) => {
  gtmSignup('google');
  gtmSetUser(user.id, {
    user_email: user.email,
    user_name: user.name,
  });
};
```

### Example 5: Track Survey Pricing
```javascript
import { gtmViewSurveyPricing } from '../utils/gtm';

// When survey pricing is calculated
const calculatePrice = async (files) => {
  const surveyType = getSurveyTypeFromPath(files[0].fullPath);
  const pricing = await calculateSurveyPrice(surveyType, files.length);
  
  // Track pricing view
  gtmViewSurveyPricing(surveyType, pricing.price_per_file);
  
  return pricing;
};
```

## 🔧 Recommended Tracking Points

### Home Page (`HomePage.jsx`)
```javascript
useEffect(() => {
  gtmPageView('/', 'Home Page');
}, []);
```

### Search Results (`ResultPage.jsx`)
```javascript
useEffect(() => {
  gtmPageView('/results', 'Search Results');
  
  if (searchResults.length > 0) {
    gtmSearchEvent(searchQuery, searchResults.length);
  }
}, [searchResults]);

// When file is selected
const handleFileToggle = (file) => {
  // ... existing code
  gtmFileSelect(file.name, surveyType, newSelectedFiles.length);
};

// When "কিনুন" button is clicked
const handlePurchase = () => {
  gtmBeginCheckout(selectedFiles.length, totalPrice, packageName);
  gtmAddToCart(selectedFiles, totalPrice, packageName);
  navigate('/checkout');
};
```

### Checkout Page (`CheckoutPage.jsx`)
```javascript
useEffect(() => {
  gtmPageView('/checkout', 'Checkout Page');
}, []);

// After successful payment
const handlePaymentSuccess = (response) => {
  gtmPurchase(
    response.transactionId,
    totalAmount,
    fileCount,
    packageInfo?.field_name,
    paymentMethod
  );
};
```

### Quick Search (`InputSearch.jsx`)
```javascript
// When search results appear
useEffect(() => {
  if (results.length > 0) {
    gtmSearchEvent(searchQuery, results.length);
  }
}, [results]);

// When file is clicked for direct checkout
const handleDirectCheckout = (file) => {
  gtmFileSelect(file.name, surveyType, 1);
  gtmAddToCart([file], totalPrice, packageName);
  gtmBeginCheckout(1, totalPrice, packageName);
  navigate('/checkout');
};
```

## 📋 GTM Container Setup

### In Google Tag Manager Dashboard:

1. **Create Tags**:
   - Google Analytics 4 Configuration
   - Google Analytics 4 Event
   - Facebook Pixel (if needed)
   - Custom HTML tags

2. **Create Triggers**:
   - Page View: `event = pageView`
   - Search: `event = search`
   - File Select: `event = file_select`
   - Add to Cart: `event = add_to_cart`
   - Begin Checkout: `event = begin_checkout`
   - Purchase: `event = purchase`
   - Login: `event = login`
   - Sign Up: `event = sign_up`

3. **Create Variables**:
   - Transaction ID: `{{transactionId}}`
   - Total Price: `{{value}}`
   - Survey Type: `{{survey_type}}`
   - File Count: `{{file_count}}`
   - Package Name: `{{package_name}}`
   - Payment Method: `{{payment_method}}`

## 🧪 Testing

### Console Logging
All GTM events are logged to console in development:
```javascript
📊 GTM Event: search { search_term: "SA_RS", result_count: 15 }
📊 GTM Event: file_select { file_name: "1_Atghar_2.pdf", survey_type: "SA_RS", file_count: 5 }
```

### GTM Preview Mode
1. Go to GTM dashboard
2. Click "Preview"
3. Enter your site URL
4. Interact with your site
5. See events fire in real-time

### Chrome Extension
Install "Google Tag Assistant" to verify GTM is working.

## 📊 Key Metrics to Track

### E-commerce Metrics:
- **Conversion Rate**: (Purchases / Sessions) × 100
- **Average Order Value**: Total Revenue / Number of Orders
- **Cart Abandonment Rate**: (Checkouts Started - Purchases) / Checkouts Started
- **Revenue by Survey Type**: Track which survey types generate most revenue

### User Behavior:
- **Search Success Rate**: Searches with results / Total searches
- **Files per Purchase**: Average number of files bought
- **Popular Survey Types**: Most searched and purchased
- **User Journey**: Path from search → select → checkout → purchase

### Performance:
- **Time to Purchase**: Average time from first search to purchase
- **Bounce Rate**: Users leaving without searching
- **Return Visitors**: Users coming back to purchase more

## 🎯 E-commerce Enhanced Events

All purchase events follow Google Analytics 4 e-commerce format:

```javascript
{
  event: 'purchase',
  transaction_id: 'TXN_12345',
  value: 150.00,
  currency: 'BDT',
  items: [
    {
      item_name: '1_Atghar_SA_RS_2.pdf',
      item_id: 'file_001',
      item_category: 'SA/RS সার্ভে',
      price: 15.00,
      quantity: 1
    }
  ]
}
```

## ✅ Implementation Checklist

### Phase 1: Basic Tracking
- [x] GTM container added to index.html
- [x] Data layer initialized
- [x] GTM utility functions created
- [ ] Page views tracked on all pages
- [ ] Search events tracked

### Phase 2: E-commerce Tracking
- [ ] File selection tracked (add_to_cart)
- [ ] Checkout initiation tracked (begin_checkout)
- [ ] Purchase completion tracked (purchase)
- [ ] Revenue tracking verified

### Phase 3: User Tracking
- [ ] Login events tracked
- [ ] Signup events tracked
- [ ] User properties set
- [ ] User ID passed to GA4

### Phase 4: Custom Events
- [ ] Survey pricing views tracked
- [ ] Error events tracked
- [ ] Filter usage tracked
- [ ] Custom conversions defined

## 🐛 Debugging

### Check if GTM is loaded:
```javascript
console.log(window.dataLayer);
// Should show array of events
```

### Check specific event:
```javascript
window.dataLayer.forEach(event => {
  if (event.event === 'purchase') {
    console.log('Purchase event:', event);
  }
});
```

### Common Issues:

**GTM not loading?**
- Check GTM container ID: `GTM-WRPQH9X3`
- Check network tab for gtm.js request
- Verify no ad blockers are blocking GTM

**Events not firing?**
- Check console for "📊 GTM Event" logs
- Verify event name matches trigger in GTM
- Use GTM Preview mode

**Data layer not working?**
- Ensure `window.dataLayer` exists
- Check initialization order (GTM script before events)

## 📚 Resources

- [GTM Documentation](https://developers.google.com/tag-manager)
- [GA4 E-commerce Guide](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [Data Layer Reference](https://developers.google.com/tag-platform/tag-manager/datalayer)

---

**Status**: ✅ **IMPLEMENTED**  
**GTM Container ID**: GTM-WRPQH9X3  
**Data Layer**: Enabled  
**Tracking Functions**: 13 available

