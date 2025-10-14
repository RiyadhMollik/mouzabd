# New Survey Types Added

## 🎯 Overview

Added **5 new survey types** to the pricing system, expanding from 5 to 10 total survey types.

## ✅ New Survey Types Added

### 1. **DIYARA (দিয়ারা)**
- **Code**: `DIYARA`
- **Display Name**: দিয়ারা সার্ভে
- **Price**: ৳15.00 per file
- **Description**: দিয়ারা সার্ভে টাইপের জন্য মূল্য

### 2. **RS_BS (RS/BS)**
- **Code**: `RS_BS`
- **Display Name**: RS/BS সার্ভে
- **Price**: ৳20.00 per file
- **Description**: RS এবং BS সার্ভে টাইপের জন্য মূল্য

### 3. **BS_RS (BS/RS)**
- **Code**: `BS_RS`
- **Display Name**: BS/RS সার্ভে
- **Price**: ৳20.00 per file
- **Description**: BS এবং RS সার্ভে টাইপের জন্য মূল্য

### 4. **CS_SA (CS/SA)**
- **Code**: `CS_SA`
- **Display Name**: CS/SA সার্ভে
- **Price**: ৳18.00 per file
- **Description**: CS এবং SA সার্ভে টাইপের জন্য মূল্য

### 5. **SA_CS (SA/CS)**
- **Code**: `SA_CS`
- **Display Name**: SA/CS সার্ভে
- **Price**: ৳18.00 per file
- **Description**: SA এবং CS সার্ভে টাইপের জন্য মূল্য

## 📊 Complete Survey Type Pricing Table

| Survey Type | Display Name | Price per File | Sort Order |
|-------------|--------------|----------------|------------|
| SA_RS | SA/RS সার্ভে | ৳15.00 | 1 |
| CS | CS সার্ভে | ৳20.00 | 2 |
| BS | BS সার্ভে | ৳25.00 | 3 |
| SA | SA সার্ভে | ৳15.00 | 4 |
| RS | RS সার্ভে | ৳15.00 | 5 |
| **DIYARA** | **দিয়ারা সার্ভে** | **৳15.00** | **6** ✨ NEW |
| **RS_BS** | **RS/BS সার্ভে** | **৳20.00** | **7** ✨ NEW |
| **BS_RS** | **BS/RS সার্ভে** | **৳20.00** | **8** ✨ NEW |
| **CS_SA** | **CS/SA সার্ভে** | **৳18.00** | **9** ✨ NEW |
| **SA_CS** | **SA/CS সার্ভে** | **৳18.00** | **10** ✨ NEW |

## 💰 Price Breakdown

### ৳15.00 per file:
- SA_RS
- SA
- RS
- **DIYARA** ✨ NEW

### ৳18.00 per file:
- **CS_SA** ✨ NEW
- **SA_CS** ✨ NEW

### ৳20.00 per file:
- CS
- **RS_BS** ✨ NEW
- **BS_RS** ✨ NEW

### ৳25.00 per file:
- BS

## 🔄 Changes Made

### 1. Backend: `populate_survey_pricing.py`
Added 5 new entries to the survey types data:

```python
{
    'survey_type': 'DIYARA',
    'display_name': 'দিয়ারা সার্ভে',
    'base_price': Decimal('15.00'),
    'description': 'দিয়ারা সার্ভে টাইপের জন্য মূল্য',
    'sort_order': 6
},
{
    'survey_type': 'RS_BS',
    'display_name': 'RS/BS সার্ভে',
    'base_price': Decimal('20.00'),
    'description': 'RS এবং BS সার্ভে টাইপের জন্য মূল্য',
    'sort_order': 7
},
{
    'survey_type': 'BS_RS',
    'display_name': 'BS/RS সার্ভে',
    'base_price': Decimal('20.00'),
    'description': 'BS এবং RS সার্ভে টাইপের জন্য মূল্য',
    'sort_order': 8
},
{
    'survey_type': 'CS_SA',
    'display_name': 'CS/SA সার্ভে',
    'base_price': Decimal('18.00'),
    'description': 'CS এবং SA সার্ভে টাইপের জন্য মূল্য',
    'sort_order': 9
},
{
    'survey_type': 'SA_CS',
    'display_name': 'SA/CS সার্ভে',
    'base_price': Decimal('18.00'),
    'description': 'SA এবং CS সার্ভে টাইপের জন্য মূল্য',
    'sort_order': 10
}
```

### 2. Frontend: `SurveyPricingApi.js`
Updated `extractSurveyType()` function to recognize new survey types:

```javascript
export const extractSurveyType = (khatianType) => {
  const normalized = khatianType.toUpperCase().trim();
  
  // Check for exact matches (order matters - check longer strings first)
  if (normalized === 'SA_RS' || normalized === 'SA/RS') return 'SA_RS';
  if (normalized === 'RS_BS' || normalized === 'RS/BS') return 'RS_BS';
  if (normalized === 'BS_RS' || normalized === 'BS/RS') return 'BS_RS';
  if (normalized === 'CS_SA' || normalized === 'CS/SA') return 'CS_SA';
  if (normalized === 'SA_CS' || normalized === 'SA/CS') return 'SA_CS';
  if (normalized === 'DIYARA' || normalized === 'দিয়ারা') return 'DIYARA';
  // ... existing code
};
```

### 3. Database Population
Ran command: `python manage.py populate_survey_pricing`

**Result**:
```
✅ Created: DIYARA - ৳15.00
✅ Created: RS_BS - ৳20.00
✅ Created: BS_RS - ৳20.00
✅ Created: CS_SA - ৳18.00
✅ Created: SA_CS - ৳18.00

✨ Complete! Created: 5, Updated: 5
```

## 🎯 Detection Logic

### Path-Based Detection
Files with these survey types in their path will be automatically detected:

#### Example Paths:
```
মৌজা ম্যাপ ফাইল/ঢাকা বিভাগ/ফরিদপুর/নগরকান্দা/DIYARA/file.pdf
→ Detected: DIYARA → Price: ৳15

মৌজা ম্যাপ ফাইল/ঢাকা বিভাগ/মুন্সিগঞ্জ/শ্রীনগর/RS_BS/file.jpg
→ Detected: RS_BS → Price: ৳20

মৌজা ম্যাপ ফাইল/ঢাকা বিভাগ/ফরিদপুর/সালথা/BS_RS/file.pdf
→ Detected: BS_RS → Price: ৳20

মৌজা ম্যাপ ফাইল/ঢাকা বিভাগ/ঢাকা/ধামরাই/CS_SA/file.jpg
→ Detected: CS_SA → Price: ৳18

মৌজা ম্যাপ ফাইল/ঢাকা বিভাগ/নারায়ণগঞ্জ/রূপগঞ্জ/SA_CS/file.pdf
→ Detected: SA_CS → Price: ৳18
```

### Matching Patterns
The system will detect these variations:

| Input | Detected As | Price |
|-------|-------------|-------|
| `DIYARA` | DIYARA | ৳15 |
| `দিয়ারা` | DIYARA | ৳15 |
| `RS_BS` | RS_BS | ৳20 |
| `RS/BS` | RS_BS | ৳20 |
| `BS_RS` | BS_RS | ৳20 |
| `BS/RS` | BS_RS | ৳20 |
| `CS_SA` | CS_SA | ৳18 |
| `CS/SA` | CS_SA | ৳18 |
| `SA_CS` | SA_CS | ৳18 |
| `SA/CS` | SA_CS | ৳18 |

## 🧪 Testing Guide

### Test Case 1: DIYARA Files
1. Search for files in DIYARA folder
2. **Expected Price**: ৳15 per file
3. **Badge**: দিয়ারা সার্ভে

### Test Case 2: RS_BS Files
1. Search for files in RS_BS or RS/BS folder
2. **Expected Price**: ৳20 per file
3. **Badge**: RS/BS সার্ভে

### Test Case 3: BS_RS Files
1. Search for files in BS_RS or BS/RS folder
2. **Expected Price**: ৳20 per file
3. **Badge**: BS/RS সার্ভে

### Test Case 4: CS_SA Files
1. Search for files in CS_SA or CS/SA folder
2. **Expected Price**: ৳18 per file
3. **Badge**: CS/SA সার্ভে

### Test Case 5: SA_CS Files
1. Search for files in SA_CS or SA/CS folder
2. **Expected Price**: ৳18 per file
3. **Badge**: SA/CS সার্ভে

### Test Multiple Files:
| Files | Survey Type | Unit Price | Total |
|-------|-------------|------------|-------|
| 1 file | DIYARA | ৳15 | ৳15 |
| 10 files | RS_BS | ৳20 | ৳200 |
| 5 files | CS_SA | ৳18 | ৳90 |
| 20 files | BS_RS | ৳20 | ৳400 |
| 100 files | SA_CS | ৳18 | ৳1,800 |

## 📋 API Response Example

### GET `/api/survey-pricing/`
```json
{
  "success": true,
  "survey_types": [
    {
      "id": 1,
      "survey_type": "SA_RS",
      "display_name": "SA/RS সার্ভে",
      "base_price": "15.00",
      "is_active": true,
      "sort_order": 1
    },
    // ... existing types ...
    {
      "id": 6,
      "survey_type": "DIYARA",
      "display_name": "দিয়ারা সার্ভে",
      "base_price": "15.00",
      "is_active": true,
      "sort_order": 6
    },
    {
      "id": 7,
      "survey_type": "RS_BS",
      "display_name": "RS/BS সার্ভে",
      "base_price": "20.00",
      "is_active": true,
      "sort_order": 7
    },
    {
      "id": 8,
      "survey_type": "BS_RS",
      "display_name": "BS/RS সার্ভে",
      "base_price": "20.00",
      "is_active": true,
      "sort_order": 8
    },
    {
      "id": 9,
      "survey_type": "CS_SA",
      "display_name": "CS/SA সার্ভে",
      "base_price": "18.00",
      "is_active": true,
      "sort_order": 9
    },
    {
      "id": 10,
      "survey_type": "SA_CS",
      "display_name": "SA/CS সার্ভে",
      "base_price": "18.00",
      "is_active": true,
      "sort_order": 10
    }
  ]
}
```

### POST `/api/survey-pricing/calculate/`
```json
// Request for DIYARA
{
  "survey_type": "DIYARA",
  "file_count": 10
}

// Response
{
  "success": true,
  "pricing": {
    "survey_type": "DIYARA",
    "display_name": "দিয়ারা সার্ভে",
    "price_per_file": 15.00,
    "file_count": 10,
    "total_price": 150.00
  }
}
```

## 🔄 Migration Notes

### For Existing Installations:
1. Pull latest code
2. Run: `python manage.py populate_survey_pricing`
3. Restart Django server
4. Restart React dev server
5. Clear browser cache

### For Production Deployment:
```bash
# SSH to production server
ssh user@api.bdmouza.com

# Navigate to project
cd /path/to/mouzabd/server

# Pull changes
git pull origin main

# Activate virtual environment (if using)
source venv/bin/activate

# Run populate command
python manage.py populate_survey_pricing

# Restart server
sudo systemctl restart gunicorn
```

## 📊 Statistics

### Before:
- Total Survey Types: **5**
- Price Range: ৳15 - ৳25
- Unique Price Points: 3 (৳15, ৳20, ৳25)

### After:
- Total Survey Types: **10** (+5)
- Price Range: ৳15 - ৳25 (same)
- Unique Price Points: 4 (৳15, ৳18, ৳20, ৳25) (+1)

### New Price Point:
- **৳18.00**: CS_SA, SA_CS (middle ground between CS and SA)

## ✅ Benefits

### 1. **More Granular Pricing**
- Combination survey types (RS_BS, CS_SA) have their own prices
- Better reflects actual survey type costs

### 2. **Regional Support**
- DIYARA (দিয়ারা) for specific regional surveys
- Bengali name recognition built-in

### 3. **Flexible Pricing**
- ৳18 price point for hybrid surveys (CS_SA, SA_CS)
- Between CS (৳20) and SA (৳15)

### 4. **Bidirectional Support**
- RS_BS and BS_RS both supported
- CS_SA and SA_CS both supported
- Handles different naming conventions

## 🚀 Next Steps

### 1. Update File Organization
Organize files into new survey type folders:
```
মৌজা ম্যাপ ফাইল/
  ├── DIYARA/
  ├── RS_BS/
  ├── BS_RS/
  ├── CS_SA/
  └── SA_CS/
```

### 2. Test All Variations
- Test path detection
- Test price calculation
- Test checkout flow
- Test admin interface

### 3. Monitor Usage
Track which survey types are most used:
- Check purchase statistics
- Analyze popular survey types
- Adjust pricing if needed

## 📝 Checklist

### Implementation:
- [x] Add new survey types to populate command
- [x] Update frontend detection logic
- [x] Run populate command
- [x] Verify database entries
- [x] Test API endpoints

### Testing:
- [ ] Test DIYARA detection and pricing
- [ ] Test RS_BS detection and pricing
- [ ] Test BS_RS detection and pricing
- [ ] Test CS_SA detection and pricing
- [ ] Test SA_CS detection and pricing
- [ ] Test Bengali name detection (দিয়ারা)
- [ ] Test slash variations (RS/BS vs RS_BS)

### Documentation:
- [x] Document new survey types
- [x] Update pricing table
- [x] Create migration guide
- [x] Document API examples

---

**Status**: ✅ **COMPLETED**  
**New Survey Types**: 5 (DIYARA, RS_BS, BS_RS, CS_SA, SA_CS)  
**Total Survey Types**: 10  
**Database Updated**: Yes (5 created, 5 updated)  
**Frontend Updated**: Yes (detection logic enhanced)

