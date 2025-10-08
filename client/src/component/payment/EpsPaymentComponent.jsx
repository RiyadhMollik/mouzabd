import React, { useState, useCallback, useEffect } from 'react';
import { AlertCircle, CreditCard, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import epsPaymentService from '../../utils/epsPaymentService';
import { convertNumberToBangla } from '../../utils/englishToBangla';

const EpsPaymentComponent = ({ 
  orderData, 
  onPaymentSuccess, 
  onPaymentError, 
  onPaymentCancel,
  isVisible = false 
}) => {
  const [paymentState, setPaymentState] = useState({
    loading: false,
    error: null,
    transactionId: null,
    paymentUrl: null,
    status: 'idle' // idle, processing, success, failed, cancelled
  });

  const [formData, setFormData] = useState({
    customer_name: orderData?.customer_name || '',
    customer_email: orderData?.customer_email || '',
    customer_phone: orderData?.customer_phone || '',
    amount: orderData?.total_amount || 0,
    order_id: orderData?.order_id || '',
    description: orderData?.description || 'Order Payment'
  });

  // Reset state when component becomes visible
  useEffect(() => {
    if (isVisible) {
      setPaymentState({
        loading: false,
        error: null,
        transactionId: null,
        paymentUrl: null,
        status: 'idle'
      });
    }
  }, [isVisible]);

  // Handle form input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Initialize EPS payment
  const handleInitializePayment = useCallback(async () => {
    try {
      setPaymentState(prev => ({ ...prev, loading: true, error: null }));

      // Validate form data
      const validation = epsPaymentService.validatePaymentData(formData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Add success/failure URLs
      const paymentData = {
        ...formData,
        success_url: `${window.location.origin}/payment/success`,
        failure_url: `${window.location.origin}/payment/failed`,
        cancel_url: `${window.location.origin}/payment/cancelled`
      };

      const response = await epsPaymentService.initializePayment(paymentData);

      if (response.success && response.data.payment_url) {
        setPaymentState(prev => ({
          ...prev,
          loading: false,
          transactionId: response.data.transaction_id,
          paymentUrl: response.data.payment_url,
          status: 'processing'
        }));

        // Redirect to EPS payment page
        window.location.href = response.data.payment_url;
      } else {
        throw new Error(response.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      setPaymentState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Payment initialization failed',
        status: 'failed'
      }));
      onPaymentError?.(error);
    }
  }, [formData, onPaymentError]);

  // Check payment status (for polling if needed)
  const checkPaymentStatus = useCallback(async (transactionId) => {
    try {
      const response = await epsPaymentService.getPaymentStatus(transactionId);
      
      if (response.success) {
        const status = response.data.status;
        setPaymentState(prev => ({ ...prev, status }));

        switch (status) {
          case 'SUCCESS':
            onPaymentSuccess?.(response.data);
            break;
          case 'FAILED':
            onPaymentError?.(new Error('Payment failed'));
            break;
          case 'CANCELLED':
            onPaymentCancel?.(response.data);
            break;
        }
      }
    } catch (error) {
      console.error('Payment status check error:', error);
    }
  }, [onPaymentSuccess, onPaymentError, onPaymentCancel]);

  // Cancel payment
  const handleCancelPayment = useCallback(async () => {
    if (!paymentState.transactionId) return;

    try {
      await epsPaymentService.cancelPayment(paymentState.transactionId);
      setPaymentState(prev => ({ ...prev, status: 'cancelled' }));
      onPaymentCancel?.();
    } catch (error) {
      console.error('Payment cancellation error:', error);
    }
  }, [paymentState.transactionId, onPaymentCancel]);

  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <CreditCard className="w-6 h-6 mr-2 text-green-600" />
          EPS সিকিউর পেমেন্ট
        </h3>
        <div className="text-right">
          <div className="text-sm text-gray-600">পেমেন্ট পরিমাণ</div>
          <div className="text-xl font-bold text-green-600">
            ৳{convertNumberToBangla(formData.amount.toFixed(2))}
          </div>
        </div>
      </div>

      {/* Payment Status Display */}
      {paymentState.status !== 'idle' && (
        <div className="mb-6">
          {paymentState.status === 'processing' && (
            <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Loader2 className="w-5 h-5 text-yellow-600 animate-spin mr-2" />
              <div>
                <div className="font-medium text-yellow-800">পেমেন্ট প্রক্রিয়াধীন</div>
                <div className="text-sm text-yellow-700">
                  EPS পেমেন্ট পেজে রিডাইরেক্ট হচ্ছে...
                </div>
              </div>
            </div>
          )}

          {paymentState.status === 'success' && (
            <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <div className="font-medium text-green-800">পেমেন্ট সফল!</div>
                <div className="text-sm text-green-700">
                  আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে।
                </div>
              </div>
            </div>
          )}

          {paymentState.status === 'failed' && (
            <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600 mr-2" />
              <div>
                <div className="font-medium text-red-800">পেমেন্ট ব্যর্থ!</div>
                <div className="text-sm text-red-700">
                  পেমেন্ট সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।
                </div>
              </div>
            </div>
          )}

          {paymentState.status === 'cancelled' && (
            <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <XCircle className="w-5 h-5 text-gray-600 mr-2" />
              <div>
                <div className="font-medium text-gray-800">পেমেন্ট বাতিল</div>
                <div className="text-sm text-gray-700">
                  পেমেন্ট প্রক্রিয়া বাতিল করা হয়েছে।
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {paymentState.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <div>
              <div className="font-medium text-red-800">ত্রুটি</div>
              <div className="text-sm text-red-700">{paymentState.error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Form */}
      {paymentState.status === 'idle' && (
        <div className="space-y-4">
          {/* Customer Name */}
          <div>
            <label htmlFor="eps_customer_name" className="block text-sm font-medium text-gray-700 mb-1">
              গ্রাহকের নাম *
            </label>
            <input
              type="text"
              id="eps_customer_name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="আপনার নাম লিখুন"
              required
            />
          </div>

          {/* Customer Email */}
          <div>
            <label htmlFor="eps_customer_email" className="block text-sm font-medium text-gray-700 mb-1">
              ইমেইল ঠিকানা *
            </label>
            <input
              type="email"
              id="eps_customer_email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="আপনার ইমেইল লিখুন"
              required
            />
          </div>

          {/* Customer Phone */}
          <div>
            <label htmlFor="eps_customer_phone" className="block text-sm font-medium text-gray-700 mb-1">
              মোবাইল নম্বর *
            </label>
            <input
              type="tel"
              id="eps_customer_phone"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="আপনার মোবাইল নম্বর লিখুন"
              required
            />
          </div>

          {/* Payment Description */}
          <div>
            <label htmlFor="eps_description" className="block text-sm font-medium text-gray-700 mb-1">
              পেমেন্ট বিবরণ
            </label>
            <input
              type="text"
              id="eps_description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="অর্ডার বিবরণ"
            />
          </div>

          {/* Payment Info */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm text-green-800 mb-2">
              <strong>পেমেন্ট তথ্য:</strong>
            </div>
            <div className="space-y-1 text-sm text-green-700">
              <div>• আপনি যেকোনো ব্যাংক একাউন্ট, মোবাইল ব্যাংকিং বা কার্ড ব্যবহার করতে পারবেন</div>
              <div>• পেমেন্ট সম্পূর্ণ নিরাপদ এবং SSL এনক্রিপ্টেড</div>
              <div>• পেমেন্ট সফল হলে আপনি তৎক্ষণাৎ নিশ্চিতকরণ পাবেন</div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handleInitializePayment}
            disabled={paymentState.loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              paymentState.loading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
            }`}
          >
            {paymentState.loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                পেমেন্ট শুরু হচ্ছে...
              </div>
            ) : (
              `৳${convertNumberToBangla(formData.amount.toFixed(2))} পেমেন্ট করুন`
            )}
          </button>
        </div>
      )}

      {/* Transaction ID Display */}
      {paymentState.transactionId && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-xs text-gray-600">লেনদেন আইডি</div>
          <div className="font-mono text-sm text-gray-800">{paymentState.transactionId}</div>
        </div>
      )}
    </div>
  );
};

export default EpsPaymentComponent;