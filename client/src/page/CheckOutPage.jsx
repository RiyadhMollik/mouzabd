import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getExtrafeature } from '../utils/api/CommonApi';
import { decodeToken } from '../utils/TokenDecoder';

import { File, Folder } from 'lucide-react';
import { getBaseUrl } from '../utils/baseurls';
import LeftCheckout from '../component/checkoutcomponent/LeftCheckout';
import RightCheckout from '../component/checkoutcomponent/RightCheckout';
import HandleCheckout from '../component/checkoutcomponent/HandleCheckout';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import translate from 'translate-google-api';
import packageService from '../services/PackageService';
import {
  trackBeginCheckout,
  trackAddPaymentInfo,
  trackPurchase,
  trackViewCart,
} from '../utils/gtmTracking';


const extrafeaturesData = () => {
  return useQuery({
    queryKey: ['extrafeatures'],
    queryFn: async () => {
      const token = await getExtrafeature();
      if (!token) throw new Error('Could not retrieve token');
      const decoded = decodeToken(token);
      console.log('Decoded extra features data:', decoded.data);
      if (!decoded) throw new Error('Could not decode token');
      return decoded;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

const CheckoutPage = () => {
  const { userdata, logIn } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const checkoutData = location.state;
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone_number: '',
    mobile_number: '',     
    whatsapp: '',
    paymentMethod:'eps'
  });

  const [selectedTab,setselectedTab]=useState("");
  const [sameAsPhone, setSameAsPhone] = useState(false);
  const [selectedExtraFeatures, setSelectedExtraFeatures] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Free order state
  const [isFreeOrder, setIsFreeOrder] = useState(checkoutData?.isFreeOrder || false);
  const [orderValidationResult, setOrderValidationResult] = useState(checkoutData?.validationResult || null);
  const [isCheckingLimits, setIsCheckingLimits] = useState(!checkoutData?.isFreeOrder);

  // Additional features & modal
  const [showAdditionalModal, setShowAdditionalModal] = useState(false);
  const [selectedFeatureForModal, setSelectedFeatureForModal] = useState(null);
  const [selectedAdditionals, setSelectedAdditionals] = useState({});
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const { data: extraFeatures, isLoading: featuresLoading, error: featuresError } = extrafeaturesData();

  // Extract data from checkoutData first
  if (!checkoutData) {
    return <HandleCheckout/>;
  }

  console.log('🔍 CheckoutData received:', {
    checkoutData,
    isFreeOrderFlag: checkoutData?.isFreeOrder,
    validationResult: checkoutData?.validationResult,
    totalAmount: checkoutData?.totalAmount
  });

  const isFileBased = checkoutData.selectedFiles && Array.isArray(checkoutData.selectedFiles);
  const isDivisionBased = checkoutData.selectedOption && checkoutData.searchInfo;

  let selectedFiles, selectedFileIds, packageInfo, totalAmount, fileCount, searchInfo, selectedOption;

  if (isFileBased) {
    ({ selectedFiles = [], selectedFileIds = [], packageInfo = {}, totalAmount = 0, fileCount = 0, searchInfo = {} } = checkoutData);
    console.log('File-based checkout detected');
  } else if (isDivisionBased) {
    ({ packageInfo = {}, searchInfo = {}, selectedOption = {}, totalAmount = 0 } = checkoutData);
    console.log('Division-based checkout detected');
    
    selectedFiles = [];
    selectedFileIds = [];
    
    if (searchInfo && Object.keys(searchInfo).length > 0) {
      const searchParts = [];
      if (searchInfo.division) searchParts.push(searchInfo.division);
      if (searchInfo.district) searchParts.push(searchInfo.district);
      if (searchInfo.upazila) searchParts.push(searchInfo.upazila);
      if (searchInfo.khatianType) searchParts.push(searchInfo.khatianType);
      if (searchInfo.mouza) searchParts.push(searchInfo.mouza);
      
      const fileName = searchParts.length > 0 ? `${searchParts.join('_')}` : `search_result_${Date.now()}.pdf`;
      
      const searchBasedFile = {
        id: `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: fileName,
        type: 'PDF',
        size: 'Search Result',
        mimeType: 'application/pdf',
        webViewLink: null,
        thumbnailLink: null,
        searchData: { ...searchInfo },
        selectedOption: { ...selectedOption },
        isSearchBased: true,
        createdAt: new Date().toISOString()
      };
      
      selectedFiles = [searchBasedFile];
      selectedFileIds = [searchBasedFile.id];
    }
    
    fileCount = parseInt(selectedOption?.fields) || 1;
  } else {
    ({ selectedFiles = [], selectedFileIds = [], packageInfo = {}, totalAmount = 0, fileCount = 0, searchInfo = {} } = checkoutData);
  }

  // Check if validation result already exists from previous page
  const existingValidation = checkoutData.validationResult || checkoutData.isFreeOrder;
  console.log('🎯 Existing validation from checkoutData:', {
    isFreeOrder: checkoutData.isFreeOrder,
    validationResult: checkoutData.validationResult,
    existingValidation
  });

  useEffect(() => {
    if (extraFeatures?.data && extraFeatures.data.length > 0 && selectedExtraFeatures.length === 0) {
      const sortedFeatures = getSortedExtraFeatures();
      if (sortedFeatures.length > 0) {
        setSelectedExtraFeatures([sortedFeatures[0].id]);
      }
    }
  }, [extraFeatures]);

  // Check if order qualifies as free (within daily limits)
  useEffect(() => {
    const checkFreeOrderEligibility = async () => {
      // First check if we already have validation result from previous page
      if (checkoutData.isFreeOrder || (checkoutData.validationResult?.within_daily_limit)) {
        console.log('✅ Using existing validation result - FREE ORDER');
        setIsFreeOrder(true);
        setOrderValidationResult(checkoutData.validationResult);
        setIsCheckingLimits(false);
        return;
      }

      if (!userdata || !fileCount) {
        setIsCheckingLimits(false);
        return;
      }

      try {
        console.log('🔍 Checking free order eligibility for', fileCount, 'files');
        const validationResult = await packageService.validateOrderLimit(fileCount);
        
        console.log('📊 Free order validation result:', validationResult);
        
        if (validationResult.can_order && validationResult.within_daily_limit) {
          setIsFreeOrder(true);
          setOrderValidationResult(validationResult);
          console.log('✅ Order qualifies as FREE within daily limits');
        } else {
          setIsFreeOrder(false);
          setOrderValidationResult(validationResult);
          console.log('💰 Order requires payment - outside daily limits');
        }
      } catch (error) {
        console.error('❌ Error checking free order eligibility:', error);
        setIsFreeOrder(false);
        setOrderValidationResult(null);
      } finally {
        setIsCheckingLimits(false);
      }
    };

    checkFreeOrderEligibility();
  }, [userdata, fileCount, checkoutData.isFreeOrder, checkoutData.validationResult]);

  // GTM: Track begin_checkout when page loads
  useEffect(() => {
    if (selectedFiles && selectedFiles.length > 0 && packageInfo && totalAmount) {
      console.log('📊 GTM: Tracking begin_checkout');
      trackBeginCheckout(
        selectedFiles,
        packageInfo,
        totalAmount,
        null // coupon if available
      );
      
      // Also track view_cart
      trackViewCart(selectedFiles, packageInfo, totalAmount);
    }
  }, []); // Run once on mount

  const getSortedExtraFeatures = () => {
    if (!extraFeatures?.data) return [];
    return [...extraFeatures.data].sort((a, b) => {
      const priceA = parseFloat(a.offer_price || a.price || 0);
      const priceB = parseFloat(b.offer_price || b.price || 0);
      if (priceA !== priceB) return priceA - priceB;
      return (a.name || '').localeCompare(b.name || '');
    });
  };

  const calculatePrices = () => {
    console.log('💰 calculatePrices called with:', {
      isFreeOrder,
      orderValidationResult,
      within_daily_limit: orderValidationResult?.within_daily_limit,
      isCheckingLimits
    });

    // If this is a free order within daily limits, return zero prices
    if (isFreeOrder && orderValidationResult?.within_daily_limit) {
      console.log('💚 Calculating prices for FREE order');
      return {
        baseAmount: 0,
        extraFeaturesTotal: 0,
        additionalFeaturesTotal: 0,
        subtotal: 0,
        finalTotal: 0,
        isFirstFeatureSelected: false,
        isFreeOrder: true
      };
    }

    // Also check if checkoutData indicates this is a free order
    if (isFreeOrder || checkoutData.isFreeOrder) {
      console.log('💚 Calculating prices for FREE order (from checkoutData)');
      return {
        baseAmount: 0,
        extraFeaturesTotal: 0,
        additionalFeaturesTotal: 0,
        subtotal: 0,
        finalTotal: 0,
        isFirstFeatureSelected: false,
        isFreeOrder: true
      };
    }

    const sortedFeatures = getSortedExtraFeatures();
    const firstFeatureId = sortedFeatures.length > 0 ? sortedFeatures[0].id : null;
    const isFirstFeatureSelected = firstFeatureId && selectedExtraFeatures.includes(firstFeatureId);
    
    let baseAmount = 0;
    if (isFirstFeatureSelected) {
      baseAmount = parseFloat(totalAmount) || 0;
      if (baseAmount === 0 && packageInfo && fileCount > 0) {
        const pricePerFile = parseFloat(packageInfo?.price_per_file || packageInfo?.price || 0);
        if (!isNaN(pricePerFile) && !isNaN(fileCount)) {
          baseAmount = pricePerFile * fileCount;
        }
      }
    }
    
    let extraFeaturesTotal = 0;
    if (selectedExtraFeatures.length > 0 && extraFeatures?.data) {
      extraFeaturesTotal = selectedExtraFeatures.reduce((total, featureId) => {
        const feature = extraFeatures.data.find(f => f.id === featureId);
        if (feature) {
          const price = parseFloat(feature.offer_price || feature.price || 0);
          const count = parseInt(fileCount) || 1;
          if (!isNaN(price) && !isNaN(count)) {
            return total + (price * count);
          }
        }
        return total;
      }, 0);
    }

    let additionalFeaturesTotal = 0;
    Object.keys(selectedAdditionals).forEach(featureId => {
      const additionalSelections = selectedAdditionals[featureId];
      Object.keys(additionalSelections).forEach(additionalId => {
        if (additionalSelections[additionalId]) {
          const feature = extraFeatures?.data?.find(f => f.id.toString() === featureId.toString());
          if (feature && feature.additionals) {
            const additional = feature.additionals.find(a => a.id.toString() === additionalId.toString());
            if (additional) {
              const additionalPrice = parseFloat(additional.offer_price || additional.price || 0);
              const count = parseInt(fileCount) || 1;
              if (!isNaN(additionalPrice) && !isNaN(count)) {
                additionalFeaturesTotal += additionalPrice * count;
              }
            }
          }
        }
      });
    });

    const validBaseAmount = isNaN(baseAmount) ? 0 : baseAmount;
    const validExtraFeaturesTotal = isNaN(extraFeaturesTotal) ? 0 : extraFeaturesTotal;
    const validAdditionalFeaturesTotal = isNaN(additionalFeaturesTotal) ? 0 : additionalFeaturesTotal;
    const subtotal = validBaseAmount + validExtraFeaturesTotal + validAdditionalFeaturesTotal;
    const finalTotal = subtotal;

    return {
      baseAmount: validBaseAmount,
      extraFeaturesTotal: validExtraFeaturesTotal,
      additionalFeaturesTotal: validAdditionalFeaturesTotal,
      subtotal: isNaN(subtotal) ? 0 : subtotal,
      finalTotal: isNaN(finalTotal) ? 0 : finalTotal,
      isFirstFeatureSelected,
      isFreeOrder: false
    };
  };

  const prices = calculatePrices();
  
  console.log('📊 Final prices object:', {
    prices,
    isFreeOrder,
    isCheckingLimits,
    orderValidationResult
  });

  const handleExtraFeatureToggle = (featureId) => {
    const feature = extraFeatures?.data?.find(f => f.id === featureId);
    if (feature && feature.additionals && feature.additionals.length > 0) {
      setSelectedFeatureForModal(feature);
      setShowAdditionalModal(true);
    } else {
      setSelectedExtraFeatures(prev => {
        if (prev.includes(featureId)) {
          return prev.filter(id => id !== featureId);
        } else {
          return [...prev, featureId];
        }
      });
    }
  };

  const closeAdditionalModal = () => {
    setShowAdditionalModal(false);
    setSelectedFeatureForModal(null);
  };

  const handleAdditionalToggle = (featureId, additionalId) => {
    setSelectedAdditionals(prev => ({
      ...prev,
      [featureId]: {
        ...prev[featureId],
        [additionalId]: !prev[featureId]?.[additionalId]
      }
    }));
  };

  const handleAddressChange = (e) => {
    setDeliveryAddress(e.target.value);
  };

  const handleModalProceed = () => {
    const featureId = selectedFeatureForModal?.id;
    if (featureId) {
      setSelectedExtraFeatures(prev => {
        if (!prev.includes(featureId)) return [...prev, featureId];
        return prev;
      });
    }
    closeAdditionalModal();
  };

  const handleFeatureDeselectionFromModal = () => {
    const featureId = selectedFeatureForModal?.id;
    if (featureId) {
      setSelectedExtraFeatures(prev => prev.filter(id => id !== featureId));
      setSelectedAdditionals(prev => {
        const na = { ...prev };
        delete na[featureId];
        return na;
      });
    }
    closeAdditionalModal();
  };

  const isDeliveryAddressRequired = () => {
    return selectedExtraFeatures.some(featureId => {
      const feature = extraFeatures?.data?.find(f => f.id === featureId);
      return feature && feature.additionals && feature.additionals.length > 0;
    });
  };

  const getDeliveryAddressMessage = () => {
    const featuresWithAdditionals = selectedExtraFeatures.filter(featureId => {
      const feature = extraFeatures?.data?.find(f => f.id === featureId);
      return feature && feature.additionals && feature.additionals.length > 0;
    });

    if (featuresWithAdditionals.length > 0) {
      const featureNames = featuresWithAdditionals
        .map(featureId => {
          const feature = extraFeatures?.data?.find(f => f.id === featureId);
          return feature?.name;
        })
        .filter(Boolean);

      return `আপনি নিম্নোক্ত সেবাগুলো নির্বাচন করেছেন যার জন্য ডেলিভারি ঠিকানা আবশ্যক: ${featureNames.join(', ')}`;
    }
    return '';
  };

  // ✅ handle both "phone_number" and "mobile_number"
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if ((name === 'phone_number' || name === 'mobile_number') && sameAsPhone) {
      setFormData(prev => ({
        ...prev,
        whatsapp: value
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setSameAsPhone(isChecked);
    if (isChecked) {
      const resolved = formData.mobile_number || formData.phone_number || '';
      setFormData(prev => ({
        ...prev,
        whatsapp: resolved
      }));
    }
  };

  // ✅ resolve single mobile for validation + payload
  const resolveMobile = () =>
    (formData.mobile_number || formData.phone_number || mobileNumber || userdata?.phone || userdata?.phone_number || '')
      .toString()
      .trim();

  const processPurchase = async (purchaseData) => {
    try {
      const tokenSources = [
        () => localStorage.getItem('authToken'),
        () => localStorage.getItem('token'),
        () => localStorage.getItem('accessToken'),
        () => sessionStorage.getItem('authToken'),
        () => sessionStorage.getItem('token')
      ];

      let token = null;
      let tokenSource = 'none';
      for (let i = 0; i < tokenSources.length; i++) {
        token = tokenSources[i]();
        if (token) {
          tokenSource = ['localStorage.authToken', 'localStorage.token', 'localStorage.accessToken', 'sessionStorage.authToken', 'sessionStorage.token'][i];
          break;
        }
      }

      console.log('Token Debug:', {
        tokenFound: !!token,
        tokenSource: tokenSource,
        tokenLength: token ? token.length : 0,
        userDataExists: !!userdata,
        userEmail: userdata?.email
      });

      console.log('📦 Purchase Data Validation:', {
        package: purchaseData.package,
        amount: purchaseData.amount,
        fileCount: purchaseData.file_name?.length || 0,
        hasExtraFeatures: !!(purchaseData.extra_features?.length),
        hasAdditionalFeatures: !!(purchaseData.note?.length),
        hasDeliveryAddress: !!purchaseData.delivery_address,
        checkoutType: purchaseData.checkout_type
      });

      const headers = { 'Content-Type': 'application/json' };
      if (userdata && token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('✅ Adding Authorization header');
      }

      const cleanedPurchaseData = {
        ...purchaseData,
        amount: parseFloat(purchaseData.amount) || 0,
        package: purchaseData.package?.toString(),
        file_name: Array.isArray(purchaseData.file_name) ? purchaseData.file_name : [purchaseData.file_name].filter(Boolean)
      };

      Object.keys(cleanedPurchaseData).forEach(key => {
        if (cleanedPurchaseData[key] === undefined || cleanedPurchaseData[key] === null || cleanedPurchaseData[key] === '') {
          delete cleanedPurchaseData[key];
        }
      });

      console.log('🚀 Final Request Details:', {
        url: `${getBaseUrl()}/purchase-alt/`,
        method: 'POST',
        headers: Object.keys(headers),
        bodySize: JSON.stringify(cleanedPurchaseData).length,
        cleanedData: cleanedPurchaseData
      });

      const response = await fetch(`${getBaseUrl()}/purchase-alt/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(cleanedPurchaseData)
      });

      const contentType = response.headers.get('content-type');
      let responseData;

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        if (response.status === 400) {
          console.error('❌ 400 Bad Request Details:', {
            status: response.status,
            statusText: response.statusText,
            responseData: responseData,
            requestData: cleanedPurchaseData
          });

          let errorMessage = 'Bad Request: ';
          if (typeof responseData === 'object') {
            if (responseData.error) errorMessage += responseData.error;
            else if (responseData.message) errorMessage += responseData.message;
            else if (responseData.detail) errorMessage += responseData.detail;
            else errorMessage += JSON.stringify(responseData);
          } else {
            errorMessage += responseData.toString();
          }
          throw new Error(errorMessage);
        }

        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        if (typeof responseData === 'object' && responseData.error) {
          errorMessage += ` - ${responseData.error}`;
        }
        throw new Error(errorMessage);
      }

      console.log('✅ Purchase API Success:', responseData);
      return responseData;

    } catch (error) {
      console.error('💥 Purchase API Error Details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
      } else if (error.message.includes('400')) {
        throw new Error(`Validation Error: ${error.message}`);
      } else {
        throw error;
      }
    }
  };

const handleSubmit = async () => {
  setIsSubmitting(true);

  try {
    console.log('🔄 Starting purchase process...');
    const isUserAuthenticated = !!userdata;

    // ✅ Resolve mobile number (will be sent if available, but no error if empty)
    const resolvedMobile = resolveMobile();
    console.log("📞 Phone for validation:", resolvedMobile);

    // Validation
    const validationErrors = [];

    // 👉 User register হলে email + password লাগবে
    if (!isUserAuthenticated) {
      if (!formData.email?.trim()) validationErrors.push('Email');
      if (!formData.password?.trim()) validationErrors.push('Password');
    }

    // 👉 Delivery address check
    if (isDeliveryAddressRequired() && !deliveryAddress.trim()) {
      const featuresNeedingAddress = selectedExtraFeatures
        .filter(featureId => {
          const feature = extraFeatures?.data?.find(f => f.id === featureId);
          return feature && feature.additionals && feature.additionals.length > 0;
        })
        .map(featureId => {
          const feature = extraFeatures?.data?.find(f => f.id === featureId);
          return feature?.name;
        })
        .filter(Boolean);

      validationErrors.push(
        `Delivery Address (required for: ${featuresNeedingAddress.join(', ')})`
      );
    }

    if (validationErrors.length > 0) {
      throw new Error(
        `Please fill in the following required fields: ${validationErrors.join(', ')}`
      );
    }

    // if (!packageInfo?.id && !packageInfo?.package_id && !packageInfo?.pk) {
    //   throw new Error('Package information is missing');
    // }

    // For free orders, we don't need to validate total amount
    if (!isFreeOrder && (!prices.finalTotal || prices.finalTotal <= 0)) {
      throw new Error('Invalid total amount');
    }

    // 👉 Files prepare
    let fileNames = [];
    if (selectedFiles.length > 0) {
      fileNames = selectedFiles.map(file =>
        file.isSearchBased ? file.name : (file.name || `file_${Date.now()}`)
      );
    } else {
      fileNames = [`file_${Date.now()}.pdf`];
    }

    // 👉 Purchase payload
    const purchaseData = {
      package: packageInfo?.id || packageInfo?.package_id || packageInfo?.pk,
      amount: parseFloat(prices.finalTotal.toFixed(2)),
      file_name: fileNames,
      file_count: fileCount, // Add explicit file count
      payment_method: formData.paymentMethod || 'bkash',
    };

    console.log('💳 Purchase data preparation:', {
      isFreeOrder,
      finalTotal: prices.finalTotal,
      amount: purchaseData.amount,
      packageId: purchaseData.package,
      packageInfo: packageInfo,
      fileCount: fileCount,
      checkoutDataIsFree: checkoutData.isFreeOrder
    });

    if (isDivisionBased && searchInfo) {
      purchaseData.search_info = searchInfo;
      purchaseData.selected_option = selectedOption;
      purchaseData.checkout_type = 'division_based';
    } else if (isFileBased) {
      purchaseData.checkout_type = 'file_based';
      if (selectedFileIds.length > 0) {
        purchaseData.file_ids = selectedFileIds;
      }
    }

    // ✅ Add mobile_number only if available
    if (resolvedMobile) {
      purchaseData.mobile_number = resolvedMobile;
    }

    if (!isUserAuthenticated) {
      purchaseData.email = formData.email.trim();
      purchaseData.password = formData.password;
    }

    if (selectedExtraFeatures.length > 0) {
      purchaseData.extra_features = selectedExtraFeatures;
    }

    // 👉 Note তৈরি (selected additionals থেকে)
    const additionalFeatureNames = [];
    Object.keys(selectedAdditionals).forEach(featureId => {
      const additionalSelections = selectedAdditionals[featureId];
      Object.keys(additionalSelections).forEach(additionalId => {
        if (additionalSelections[additionalId]) {
          const mainFeature = extraFeatures?.data?.find(
            f => f.id.toString() === featureId.toString()
          );
          if (mainFeature && mainFeature.additionals) {
            const additionalFeature = mainFeature.additionals.find(
              a => a.id.toString() === additionalId.toString()
            );
            if (additionalFeature?.name) {
              additionalFeatureNames.push(additionalFeature.name);
            }
          }
        }
      });
    });
    if (additionalFeatureNames.length > 0) {
      purchaseData.note = additionalFeatureNames.join(', ');
    }

    if (isDeliveryAddressRequired() && deliveryAddress.trim()) {
      purchaseData.delivery_address = deliveryAddress.trim();
    }

    console.log('Final purchase data:', purchaseData);

    // For free orders, add validation result to the purchase data
    if (isFreeOrder && orderValidationResult) {
      purchaseData.is_free_order = true;
      purchaseData.validation_result = orderValidationResult;
    }

    // For free orders, skip the purchase API and handle directly
    if (isFreeOrder || parseFloat(prices.finalTotal) === 0) {
      console.log('✅ Processing free order via API');
      
      try {
        // Call the free order API
        const freeOrderResponse = await packageService.processFreeOrder(purchaseData);
        
        console.log('📝 Free order API response:', freeOrderResponse);
        
        if (freeOrderResponse.success) {
          // 📊 GTM: Track free order as purchase with 0 value
          console.log('📊 GTM: Tracking free order purchase');
          const transactionId = freeOrderResponse.order_id || freeOrderResponse.id || `FREE_ORDER_${Date.now()}`;
          trackPurchase(
            transactionId,
            selectedFiles,
            packageInfo,
            0, // Free order - 0 amount
            {
              paymentMethod: 'free',
              customerType: userdata ? 'returning' : 'new',
              coupon: 'FREE_DAILY_LIMIT',
            }
          );
          
          // Handle successful free order
          toast.success('অর্ডার সফল হয়েছে! বিনামূল্যে প্রক্রিয়া করা হয়েছে।', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
          
          // Redirect to map list after a short delay
          setTimeout(() => {
            navigate('/map/list');
          }, 2000);
          
          return; // Exit early for free orders
        } else {
          throw new Error(freeOrderResponse.message || 'Failed to process free order');
        }
        
      } catch (error) {
        console.error('❌ Free order API error:', error);
        throw new Error(error.response?.data?.message || error.message || 'Failed to process free order');
      }
    }

    const response = await processPurchase(purchaseData);

    // � GTM: Track add_payment_info
    console.log('📊 GTM: Tracking add_payment_info');
    trackAddPaymentInfo(
      selectedFiles,
      packageInfo,
      parseFloat(prices.finalTotal.toFixed(2)),
      formData.paymentMethod || 'bkash'
    );

    // �👉 Auto login
    if (!isUserAuthenticated && formData.email && formData.password) {
      console.log('👤 Attempting auto-login after purchase...');
      setIsLoggingIn(true);
      try {
        await logIn(formData.email, formData.password);
      } catch (loginError) {
        console.error('Login error:', loginError);
      } finally {
        setIsLoggingIn(false);
      }
    }

    // 👉 Payment handling (only for paid orders now)
    if (formData.paymentMethod === 'eps') {
      // Handle EPS payment
      console.log('💳 Processing EPS payment...');
      
      // Import EPS payment service dynamically
      const { default: epsPaymentService } = await import('../utils/epsPaymentService');
      
      try {
        const epsPaymentData = {
          amount: parseFloat(prices.finalTotal.toFixed(2)),
          customer_name: userdata?.name || formData.email?.split('@')[0] || 'Customer',
          customer_email: userdata?.email || formData.email,
          customer_phone: resolvedMobile || userdata?.phone || userdata?.phone_number,
          order_id: response.order_id || `ORDER_${Date.now()}`,
          description: `Purchase - ${packageInfo?.field_name || 'Service'}`,
          success_url: `${window.location.origin}/payment/success`,
          failure_url: `${window.location.origin}/payment/failed`,
          cancel_url: `${window.location.origin}/payment/cancelled`
        };

        console.log('🔄 Initializing EPS payment:', epsPaymentData);
        const epsResponse = await epsPaymentService.initializePayment(epsPaymentData);
        console.log('EPS Payment Response:', epsResponse);
        
        if (epsResponse.success && epsResponse.redirectUrl) {
          console.log('💳 Redirecting to EPS payment URL:', epsResponse.redirectUrl);
          window.location.href = epsResponse.redirectUrl;
        } else {
          throw new Error(epsResponse.message || 'Failed to initialize EPS payment');
        }
      } catch (epsError) {
        console.error('EPS Payment Error:', epsError);
        toast.error(`EPS Payment Error: ${epsError.message || 'Failed to process payment'}`);
        throw epsError;
      }
    } else if (response.payment_url) {
      console.log('💳 Redirecting to payment URL:', response.payment_url);
      window.location.href = response.payment_url;
    } else if (response.success || response.status === 'success') {
      // Check if this is a free order (from isFreeOrder flag or zero amount)
      const orderIsFree = isFreeOrder || checkoutData?.isFreeOrder || parseFloat(prices.finalTotal) === 0;
      
      // 📊 GTM: Track successful purchase
      console.log('📊 GTM: Tracking purchase');
      const transactionId = response.order_id || response.id || response.purchase_id || `ORDER_${Date.now()}`;
      trackPurchase(
        transactionId,
        selectedFiles,
        packageInfo,
        parseFloat(prices.finalTotal.toFixed(2)),
        {
          paymentMethod: formData.paymentMethod || 'bkash',
          customerType: userdata ? 'returning' : 'new',
          coupon: null, // Add coupon if you have one
        }
      );
      
      if (orderIsFree) {
        console.log('✅ Free order completed successfully, redirecting to map list');
        toast.success('অর্ডার সফল হয়েছে!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        setTimeout(() => {
          navigate('/map/list');
        }, 2000);
      } else {
        alert('Purchase completed successfully!');
        navigate('/');
      }
    } else {
      console.warn('⚠️ Unexpected response format:', response);
      alert('Purchase initiated successfully, but no payment URL received.');
    }

  } catch (error) {
    console.error('💥 Purchase failed:', error);

    const errorMessagesBN = {
      "Invalid password for existing user.": "অবৈধ পাসওয়ার্ড। অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।",
      "User does not exist.": "ইউজার পাওয়া যায়নি। অনুগ্রহ করে সঠিক তথ্য দিন।",
      "Email is required.": "ইমেইল আবশ্যক।",
      "Phone number is required.": "ফোন নাম্বার আবশ্যক।", // আর কোনো validation এ দেখাবে না
      "Please fill in the following required fields: Phone Number, Email, Password": "অনুগ্রহ করে নিম্নলিখিত আবশ্যক ক্ষেত্রগুলো পূরণ করুন: ফোন নাম্বার, ইমেইল, পাসওয়ার্ড",
      "Invalid total amount": "অবৈধ মোট মূল্য।",
      "Package information is missing": "প্যাকেজের তথ্য পাওয়া যায়নি।",
      "Network error: Unable to connect to server. Please check your internet connection.": "নেটওয়ার্ক সমস্যা: সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি। ইন্টারনেট চেক করুন।",
    };

    let userMessage = 'ক্রয় ব্যর্থ হয়েছে।';
    if (error?.message) userMessage = error.message;
    if (error?.responseData?.error) userMessage = error.responseData.error;
    else if (error?.responseData?.message) userMessage = error.responseData.message;
    else if (error?.responseText) {
      try {
        const data = JSON.parse(error.responseText);
        if (data.error) userMessage = data.error;
        else if (data.message) userMessage = data.message;
      } catch(e) {
        console.log(e);
      }
    }

    if (errorMessagesBN[userMessage]) {
      userMessage = errorMessagesBN[userMessage];
    }

    toast.error(userMessage, {
      position: "top-right",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });

  } finally {
    setIsSubmitting(false);
    setIsLoggingIn(false);
  }
};



  const handleGoogleSuccess = async ({ credential }) => {
    try {
      if (!credential) throw new Error('No token received from Google');
      await logIn('google', { token: credential });
    } catch (e) {
      console.error(e);
      alert('Google login failed. Please try again.');
    }
  };
  
  const handleGoogleError = (error) => {
    console.error("Google Login Failed:", error);
    alert('Google authentication failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-green-50 py-8 px-2">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          ফাইল ক্রয় সম্পূর্ণ করুন
        </h1>
        
        {isLoggingIn && (
          <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Logging in...</span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 container mx-auto">
          <LeftCheckout 
            packageInfo={packageInfo}
            setselectedTab={setselectedTab}
            featuresLoading={featuresLoading}
            handleCheckboxChange={handleCheckboxChange}
            featuresError={featuresError}
            handleInputChange={handleInputChange}
            sameAsPhone={sameAsPhone}
            formData={formData}
            isSubmitting={isSubmitting || isLoggingIn}
            handleSubmit={handleSubmit}
            extraFeatures={extraFeatures}
            userdata={userdata}
            getSortedExtraFeatures={getSortedExtraFeatures}
            selectedExtraFeatures={selectedExtraFeatures}
            prices={prices}
            handleExtraFeatureToggle={handleExtraFeatureToggle}
            handleGoogleSuccess={handleGoogleSuccess}
            handleGoogleError={handleGoogleError}
            isFileBased={isFileBased}
            isDivisionBased={isDivisionBased}
            selectedOption={selectedOption}
            searchInfo={searchInfo}
            showAdditionalModal={showAdditionalModal}
            selectedFeatureForModal={selectedFeatureForModal}
            selectedAdditionals={selectedAdditionals}
            deliveryAddress={deliveryAddress}
            mobileNumber = {mobileNumber}
            closeAdditionalModal={closeAdditionalModal}
            handleAdditionalToggle={handleAdditionalToggle}
            handleAddressChange={handleAddressChange}
            handleModalProceed={handleModalProceed}
            handleFeatureDeselectionFromModal={handleFeatureDeselectionFromModal}
            isDeliveryAddressRequired={isDeliveryAddressRequired}
            getDeliveryAddressMessage={getDeliveryAddressMessage}
            isFreeOrder={isFreeOrder}
            isCheckingLimits={isCheckingLimits}
            orderValidationResult={orderValidationResult}
          />

          <RightCheckout  
            packageInfo={packageInfo} 
            selectedTab={selectedTab}
            prices={prices} 
            selectedFiles={selectedFiles} 
            fileCount={fileCount}
            userdata={userdata}
            isSubmitting={isSubmitting || isLoggingIn}
            handleSubmit={handleSubmit}
            isFileBased={isFileBased}
            isDivisionBased={isDivisionBased}
            selectedOption={selectedOption}
            searchInfo={searchInfo}
            selectedAdditionals={selectedAdditionals}
            extraFeatures={extraFeatures}
            selectedExtraFeatures={selectedExtraFeatures}
            deliveryAddress={deliveryAddress}
            mobileNumber = {mobileNumber}
            isDeliveryAddressRequired={isDeliveryAddressRequired}
            isFreeOrder={isFreeOrder}
            isCheckingLimits={isCheckingLimits}
            orderValidationResult={orderValidationResult}
          />
          <ToastContainer 
            position="top-right" 
            autoClose={5000} 
            hideProgressBar={false} 
            newestOnTop={true} 
            closeOnClick 
            pauseOnHover 
            draggable 
            theme="colored"
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
