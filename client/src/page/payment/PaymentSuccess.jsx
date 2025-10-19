import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag, Mail, Receipt, Headphones, ArrowRight, Download, Info } from 'lucide-react';
import { trackPurchase, initDataLayer } from '../../utils/gtmTracking';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [merchantTransactionId, setMerchantTransactionId] = useState(null);
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  const [gtmStatus, setGtmStatus] = useState({ tracked: false, method: null }); // Track GTM status
  const hasTracked = useRef(false); // Prevent double-firing in React StrictMode

  useEffect(() => {
    const transactionId = searchParams.get('transaction') || searchParams.get('merchantTransactionId');
    if (transactionId) {
      setMerchantTransactionId(transactionId);
    }
  }, [searchParams]);

  // GTM: Track purchase event on success page load
  useEffect(() => {
    // Prevent double-firing in React StrictMode
    if (hasTracked.current) {
      console.log('⏭️ GTM purchase already tracked, skipping duplicate');
      return;
    }
    
    // Re-initialize GTM dataLayer (in case it was lost during redirect)
    initDataLayer();
    console.log('🔧 Re-initialized GTM dataLayer on PaymentSuccess page');
    
    // Add a small delay to ensure GTM is fully loaded after redirect
    const trackPurchaseWithDelay = setTimeout(() => {
      console.log('🎯 PaymentSuccess mounted - checking for order details...');
      console.log('🔍 localStorage keys:', Object.keys(localStorage));
      console.log('🔍 sessionStorage keys:', Object.keys(sessionStorage));
      
      // Get transaction ID from URL
      const transactionId = searchParams.get('transaction') || 
                           searchParams.get('merchantTransactionId') ||
                           `TXN_${Date.now()}`;
      
      console.log('💳 Transaction ID:', transactionId);

      // Try sessionStorage first (more reliable for redirects)
      let storedOrderDetails = sessionStorage.getItem('pending_order_gtm');
      let storageSource = 'sessionStorage';
      
      // Fallback to localStorage
      if (!storedOrderDetails) {
        storedOrderDetails = localStorage.getItem('pending_order_gtm');
        storageSource = 'localStorage';
      }
      
      console.log(`📦 Retrieved from ${storageSource}:`, storedOrderDetails?.substring(0, 100));
      
      let orderDetails = null;

      if (storedOrderDetails) {
        try {
          orderDetails = JSON.parse(storedOrderDetails);
          console.log(`✅ Successfully parsed order details from ${storageSource}:`, orderDetails);
          
          // Clear from both storages
          localStorage.removeItem('pending_order_gtm');
          sessionStorage.removeItem('pending_order_gtm');
          console.log('🗑️ Cleared pending_order_gtm from both storages');
        } catch (error) {
          console.error('❌ Error parsing stored order details:', error);
        }
      } else {
        console.warn('⚠️ No order details in localStorage or sessionStorage');
      }

    // Fallback: Try to get from location state (for direct payments)
    if (!orderDetails && location.state?.orderDetails) {
      orderDetails = location.state.orderDetails;
      console.log('📦 Retrieved order details from location state:', orderDetails);
    }

    if (orderDetails) {
      const { files, packageInfo, totalAmount, paymentMethod } = orderDetails;
      
      console.log('📊 GTM: Tracking purchase on success page', {
        transactionId,
        totalAmount,
        paymentMethod,
        filesCount: files?.length || 0,
        packageInfo: packageInfo
      });

      // Track the purchase
      if (files && files.length > 0) {
        console.log('✅ Tracking purchase WITH files:', files.length);
        trackPurchase(
          transactionId,
          files,
          packageInfo,
          totalAmount,
          {
            paymentMethod: paymentMethod || 'eps',
            customerType: 'returning', // Could be enhanced with actual user data
            paymentStatus: 'success'
          }
        );
        hasTracked.current = true; // Mark as tracked
        setGtmStatus({ tracked: true, method: storageSource }); // Update GTM status
      } else {
        // Track with package info only if no files
        console.log('⚠️ Tracking purchase WITHOUT files (using package info)');
        trackPurchase(
          transactionId,
          [],
          packageInfo,
          totalAmount,
          {
            paymentMethod: paymentMethod || 'eps',
            paymentStatus: 'success'
          }
        );
        hasTracked.current = true; // Mark as tracked
        setGtmStatus({ tracked: true, method: `${storageSource} (no files)` }); // Update GTM status
      }
    } else {
      // Fallback: Track with minimal data from URL params
      console.warn('⚠️ No order details found in localStorage or location.state');
      console.log('🔍 Available URL params:', {
        transaction: searchParams.get('transaction'),
        merchantTransactionId: searchParams.get('merchantTransactionId'),
        amount: searchParams.get('amount'),
        files: searchParams.get('files'),
        package: searchParams.get('package'),
        allParams: Object.fromEntries(searchParams.entries())
      });
      
      const amount = parseFloat(searchParams.get('amount') || 0);
      const filesCount = parseInt(searchParams.get('files') || 0);
      const packageName = searchParams.get('package') || 'Unknown Package';
      
      if (amount > 0) {
        console.log('💰 Tracking with URL params:', { amount, filesCount, packageName });
        
        // Create minimal package info from URL params
        const minimalPackageInfo = {
          field_name: packageName,
        };
        
        // Create placeholder files if count is available
        const placeholderFiles = filesCount > 0 
          ? Array(filesCount).fill(null).map((_, idx) => ({
              id: `file_${idx}`,
              name: `File ${idx + 1}`,
              mimeType: 'application/pdf'
            }))
          : [];
        
        trackPurchase(
          transactionId,
          placeholderFiles,
          minimalPackageInfo,
          amount,
          {
            paymentMethod: 'eps',
            paymentStatus: 'success'
          }
        );
        hasTracked.current = true; // Mark as tracked
        setGtmStatus({ tracked: true, method: 'URL params' }); // Update GTM status
      } else {
        console.error('❌ Cannot track purchase - no order details and no amount in URL');
        setGtmStatus({ tracked: false, method: 'No data available' }); // Update GTM status
      }
    }
    }, 1000); // 1 second delay to ensure GTM is loaded after redirect

    // Cleanup timeout on unmount
    return () => clearTimeout(trackPurchaseWithDelay);
  }, [searchParams, location.state]);

  useEffect(() => {
    if (redirectCountdown <= 0) {
      navigate('/map/list', { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      setRedirectCountdown((count) => count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [redirectCountdown, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      {/* Animated background circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-40 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Main Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6 animate-slide-up">
          {/* Success Header with Gradient */}
          <div className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 px-8 py-12 text-center overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            {/* Success Icon with Animation */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute w-32 h-32 bg-white rounded-full opacity-20 animate-ping"></div>
              <div className="absolute w-28 h-28 bg-white rounded-full opacity-30 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-500 hover:scale-110">
                <CheckCircle className="w-16 h-16 text-green-500" strokeWidth={2.5} />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Payment Successful!
            </h1>
            <p className="text-xl text-green-50 max-w-2xl mx-auto">
              Thank you for your payment. Your transaction has been completed successfully.
            </p>

            {/* Decorative elements */}
            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white opacity-20 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-white opacity-20 rounded-full"></div>
          </div>
          <div className="px-8 py-8">
            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4 mb-8 animate-slide-up animation-delay-600">
              <button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3 group"
              >
                <Home className="w-5 h-5" />
                <span>Go to Home</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => navigate('/map/list')}
                className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 group"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>View Orders</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 animate-fade-in animation-delay-800">
              <Info className="w-4 h-4 text-green-500" />
              <span>Redirecting to your orders in {redirectCountdown} second{redirectCountdown === 1 ? '' : 's'}...</span>
            </div>

            {/* Footer Note */}

          </div>
        </div>

        {/* Security Badge */}
        <div className="text-center animate-fade-in animation-delay-1000">
          <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 font-medium">Secure Payment Protected</span>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
        </div>
      </div>

      {/* Floating particles decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-emerald-400 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-teal-400 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-green-300 rounded-full animate-float animation-delay-3000"></div>
      </div>

      {/* GTM Status Indicator (Development Only) */}
      {import.meta.env.DEV && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg text-sm font-mono ${
          gtmStatus.tracked 
            ? 'bg-green-500 text-white' 
            : 'bg-yellow-500 text-gray-900'
        }`}>
          <div className="flex items-center gap-2">
            {gtmStatus.tracked ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>GTM: ✅ Tracked via {gtmStatus.method}</span>
              </>
            ) : (
              <>
                <Info className="w-4 h-4" />
                <span>GTM: Waiting...</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;