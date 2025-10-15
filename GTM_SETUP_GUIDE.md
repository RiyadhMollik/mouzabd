# 🚀 Google Tag Manager Setup Guide

## ✅ What's Already Done

1. ✅ GTM code snippet added to `client/index.html`
2. ✅ Data Layer initialization added to `client/src/main.jsx`
3. ✅ GTM tracking utility created (`client/src/utils/gtmTracking.js`)
4. ✅ CheckOutPage integrated with GTM events

## 📝 Steps to Complete Setup

### Step 1: Create GTM Container (5 minutes)

1. **Go to Google Tag Manager**
   - Visit: https://tagmanager.google.com
   - Sign in with your Google account

2. **Create Account**
   - Click "Create Account"
   - Account Name: `BD Mouza`
   - Country: Bangladesh
   - Click "Continue"

3. **Setup Container**
   - Container Name: `BD Mouza Website`
   - Target Platform: **Web**
   - Click "Create"

4. **Accept Terms**
   - Read and accept the terms of service
   - Click "Yes"

5. **Get Container ID**
   - You'll see a popup with installation instructions
   - **Copy the Container ID** (looks like `GTM-XXXXXX`)
   - You can close this popup (we've already added the code)

### Step 2: Replace GTM Container ID (1 minute)

Open `client/index.html` and replace **both** instances of `GTM-XXXXXXX` with your actual Container ID:

```html
<!-- Find this line (appears twice) -->
'GTM-XXXXXXX'

<!-- Replace with your actual ID, for example -->
'GTM-ABC1234'
```

**Two locations to replace:**
1. In the `<head>` section (JavaScript snippet)
2. In the `<body>` section (noscript iframe)

### Step 3: Create GA4 Property (10 minutes)

1. **Go to Google Analytics**
   - Visit: https://analytics.google.com
   - Sign in with your Google account

2. **Create Property**
   - Click "Admin" (gear icon, bottom left)
   - Click "+ Create Property"
   - Property Name: `BD Mouza`
   - Time Zone: `Bangladesh`
   - Currency: `Bangladesh Taka (৳)`
   - Click "Next"

3. **Business Information**
   - Industry: E-commerce
   - Business Size: Select appropriate size
   - Click "Next"

4. **Business Objectives**
   - Select "Generate leads" and "Examine user behavior"
   - Click "Create"

5. **Data Collection**
   - Platform: Web
   - Website URL: Your domain
   - Stream Name: `BD Mouza Web`
   - Click "Create Stream"

6. **Get Measurement ID**
   - Copy the **Measurement ID** (looks like `G-XXXXXXXXXX`)
   - Keep this page open

### Step 4: Connect GTM to GA4 (5 minutes)

1. **Back to GTM** (https://tagmanager.google.com)
   - Open your BD Mouza container

2. **Create GA4 Configuration Tag**
   - Click "Tags" in left menu
   - Click "New"
   - Tag Name: `GA4 Configuration`
   - Click "Tag Configuration"
   - Choose "Google Analytics: GA4 Configuration"
   - Paste your **Measurement ID** (G-XXXXXXXXXX)
   - Click "Triggering"
   - Select "All Pages"
   - Click "Save"

3. **Create Purchase Event Tag**
   - Click "New" tag
   - Tag Name: `GA4 - Purchase Event`
   - Tag Configuration: "Google Analytics: GA4 Event"
   - Configuration Tag: Select `GA4 Configuration`
   - Event Name: `purchase`
   - Click "Triggering"
   - Click "+" to create new trigger
   - Trigger Name: `Purchase Event`
   - Trigger Type: "Custom Event"
   - Event Name: `purchase`
   - Save trigger
   - Save tag

4. **Create Other E-commerce Event Tags**
   
   Repeat the same process for each event:
   
   | Tag Name | Event Name | Trigger Event Name |
   |----------|------------|-------------------|
   | GA4 - Begin Checkout | begin_checkout | begin_checkout |
   | GA4 - Add Payment Info | add_payment_info | add_payment_info |
   | GA4 - View Cart | view_cart | view_cart |
   | GA4 - View Item List | view_item_list | view_item_list |
   | GA4 - Select Item | select_item | select_item |
   | GA4 - Add to Cart | add_to_cart | add_to_cart |

5. **Publish Container**
   - Click "Submit" (top right)
   - Version Name: `Initial Setup - E-commerce Tracking`
   - Version Description: `Added GA4 configuration and e-commerce event tags`
   - Click "Publish"

### Step 5: Test Installation (5 minutes)

1. **Preview Mode**
   - In GTM, click "Preview" (top right)
   - Enter your website URL
   - Click "Connect"

2. **Test Events**
   - Navigate through your site
   - Go to checkout page
   - Complete a purchase
   - Check GTM Preview shows all events firing

3. **Check GA4 Real-time**
   - Go to GA4 → Reports → Realtime
   - You should see your test activity
   - Events should appear in real-time

4. **Check Browser Console**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for: `📊 GTM Event:` logs
   - Verify events are firing correctly

### Step 6: Enable E-commerce Reporting (2 minutes)

1. **In GA4 Admin**
   - Go to Admin → Data display
   - Click "Ecommerce Settings"
   - Toggle **ON**: "Show ecommerce events"
   - Toggle **ON**: "Mark purchases as conversions"
   - Click "Save"

2. **Mark Key Events** (formerly conversions)
   - Go to Admin → Events
   - Find `purchase` event
   - Toggle **ON** "Mark as key event"
   - Repeat for `begin_checkout` if desired

## 🧪 Testing Checklist

After setup, test these scenarios:

### Free Order Test
- [ ] Search for files
- [ ] Go to checkout
- [ ] Complete free order
- [ ] Check console for events:
  - [ ] `begin_checkout`
  - [ ] `view_cart`
  - [ ] `add_payment_info`
  - [ ] `purchase` (value: 0, payment: free)

### Paid Order Test (bKash)
- [ ] Search for files
- [ ] Go to checkout
- [ ] Select bKash payment
- [ ] Complete purchase
- [ ] Check console for events:
  - [ ] `begin_checkout`
  - [ ] `view_cart`
  - [ ] `add_payment_info`
  - [ ] `purchase` (with transaction ID)

### Paid Order Test (EPS)
- [ ] Search for files
- [ ] Go to checkout
- [ ] Select EPS payment
- [ ] Complete purchase
- [ ] Check same events as above

## 🔍 Troubleshooting

### Issue: "No Google tags found"
**Solution**: Make sure you've:
1. ✅ Replaced `GTM-XXXXXXX` with your actual Container ID
2. ✅ Published your GTM container
3. ✅ Cleared browser cache and reloaded page

### Issue: Events not showing in GA4
**Solution**: 
1. Check GTM Preview mode - are events firing in GTM?
2. Check GA4 tag is configured correctly with right Measurement ID
3. Wait 24-48 hours for data to appear in standard reports (Real-time should be instant)

### Issue: dataLayer is undefined
**Solution**: 
1. Check GTM code is in `<head>` section
2. Verify `initDataLayer()` is called in main.jsx
3. Clear cache and reload

### Issue: Purchase event not firing
**Solution**:
1. Check console for error messages
2. Verify `trackPurchase()` is called after successful order
3. Check transaction ID is generated correctly

## 📊 What You'll See in GA4

### Immediate (Real-time Reports):
- Active users on site
- Events firing in real-time
- Page views and sessions
- E-commerce purchases

### After 24 Hours:
- E-commerce overview
- Product performance (files sold)
- Revenue reports
- Shopping behavior funnel
- Checkout behavior analysis

### After 1 Week:
- User demographics
- Traffic sources
- Conversion rates
- Average order value
- Popular survey types

## 🎯 Quick Reference

### Your GTM Container ID
```
GTM-XXXXXXX  ← Replace this!
```

### Your GA4 Measurement ID
```
G-XXXXXXXXXX  ← Get from GA4 setup
```

### Events Being Tracked
1. ✅ `view_item_list` - Search results
2. ✅ `select_item` - File selection
3. ✅ `add_to_cart` - Add files to cart
4. ✅ `view_cart` - View checkout page
5. ✅ `begin_checkout` - Start checkout
6. ✅ `add_payment_info` - Payment method selected
7. ✅ `purchase` - Order completed

### Test URLs
- **GTM Preview**: https://tagmanager.google.com/tagmanager/account-setup-guide
- **GA4 Real-time**: https://analytics.google.com → Reports → Realtime
- **GTM Debug**: Add `#gtm-debug` to your URL

## 📞 Support Resources

- **GTM Help**: https://support.google.com/tagmanager
- **GA4 Help**: https://support.google.com/analytics
- **GTM Community**: https://www.en.advertisercommunity.com/t5/Google-Tag-Manager/ct-p/Google-Tag-Manager

---

## ✨ Summary

**Total Setup Time**: ~30 minutes

**What's Installed**:
- ✅ Google Tag Manager container
- ✅ Google Analytics 4 property
- ✅ E-commerce event tracking
- ✅ Purchase tracking (free & paid)
- ✅ Customer behavior tracking

**Next Steps**:
1. Replace `GTM-XXXXXXX` with your Container ID
2. Create GA4 tags in GTM
3. Publish container
4. Test thoroughly
5. Monitor real-time reports

🎉 **You're ready to track e-commerce events!**
