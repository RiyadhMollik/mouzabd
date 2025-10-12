import React, { useState, useEffect, useContext } from 'react';
import { CheckCircle, AlertCircle, Loader, Home, FileText, ArrowRight, Download, RefreshCw, XCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../provider/AuthProvider';
import imag from "../assets/bdmouza2.gif";
import { getBaseUrl } from '../utils/baseurls';

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userdata } = useContext(AuthContext);

  // Get params from URL
  const params = new URLSearchParams(location.search);
  const invoiceId = params.get("invoice_id");
  const paymentID = params.get("paymentID");
  const paymentStatus = params.get("status");

  // State
  const [invoiceValidationStatus, setInvoiceValidationStatus] = useState(null);
  const [invoiceValidating, setInvoiceValidating] = useState(false);
  const [error, setError] = useState(null);

  // Validate invoice function
const validateInvoice = async (id) => {
  try {
    setInvoiceValidating(true);
    setError(null);

    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Invalid invoice/payment ID format');
    }

    const trimmedId = id.trim();
    console.log('Validating invoice/payment with ID:', trimmedId);

    const token = user?.token || userdata?.token || localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token.replace('Bearer ', '')}`;
    }

    // এখানে কন্ডিশনাল লজিক
    let requestBody;
    if (paymentID) {
      requestBody = JSON.stringify({
        payment_id: paymentID,
        status: paymentStatus || "",
      });
    } else {
      requestBody = JSON.stringify({
        invoice_id: invoiceId,
      });
    }

    console.log("Request Body:", requestBody);

    const response = await fetch(`${getBaseUrl()}/api/purchase-alt/validate/`, {
      method: 'POST',
      headers: headers,
      body: requestBody,
    });

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {               
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error || errorData.detail || errorMessage;
      } catch {
        errorMessage = responseText || errorMessage;
      }
      throw new Error(`Invoice validation failed: ${errorMessage}`);
    }

    let data = JSON.parse(responseText);
    setInvoiceValidationStatus(data);
    return data;
  } catch (err) {
    setError(`Invoice validation error: ${err.message}`);
    setInvoiceValidationStatus({ success: false, error: err.message });
    return null;
  } finally {
    setInvoiceValidating(false);
  }
};



  // useEffect to validate invoice only when status=success
 useEffect(() => {
  if ((paymentStatus === "success" && paymentID) || (!paymentID && invoiceId)) {
    const timer = setTimeout(() => {
      validateInvoice(paymentID || invoiceId);
    }, 1000);
    return () => clearTimeout(timer);
  }
}, [invoiceId, paymentID, paymentStatus]);

  const handleContinue = () => {
    navigate('/map/list');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // Cancel/Failed state
  if (paymentStatus && paymentStatus !== "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-lg w-full mx-auto">
          {/* Animated background circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>

          {/* Main card */}
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 px-8 py-6 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-bounce-slow">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Payment Cancelled
              </h1>
              <p className="text-red-100">
                পেমেন্ট বাতিল করা হয়েছে
              </p>
            </div>

            {/* Content */}
            <div className="px-8 py-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-gray-700 text-center">
                  আপনার পেমেন্ট বাতিল করা হয়েছে বা ব্যর্থ হয়েছে। আবার চেষ্টা করুন।
                </p>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleGoHome}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <Home className="w-5 h-5" />
                  <span>হোম পেজে ফিরে যান</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (invoiceValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-lg w-full mx-auto">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>

          {/* Main card */}
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Content */}
            <div className="px-8 py-12 text-center">
              {/* Animated loader */}
              <div className="relative mb-8">
                <div className="inline-flex items-center justify-center">
                  <div className="absolute w-32 h-32 border-4 border-blue-200 rounded-full animate-ping"></div>
                  <div className="absolute w-24 h-24 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  <Loader className="w-12 h-12 text-blue-500 animate-pulse" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                Processing Payment
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                আপনার পেমেন্ট যাচাই করা হচ্ছে...
              </p>

              {/* Progress steps */}
              <div className="max-w-xs mx-auto space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Verifying payment information</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-300"></div>
                  <span>Processing transaction</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-600"></div>
                  <span>Updating your account</span>
                </div>
              </div>

              {/* Decorative element */}
              <div className="mt-8 flex justify-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce animation-delay-400"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-lg w-full mx-auto">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>

          {/* Main card */}
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 px-8 py-6 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-shake">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Verification Failed
              </h1>
              <p className="text-red-100">
                পেমেন্ট যাচাই ব্যর্থ হয়েছে
              </p>
            </div>

            {/* Content */}
            <div className="px-8 py-8">
              {/* Error message */}
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-800 mb-1">Error Details</h3>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => validateInvoice(invoiceId)}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>আবার চেষ্টা করুন</span>
                </button>
                <button
                  onClick={handleGoHome}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Home className="w-5 h-5" />
                  <span>হোম পেজে ফিরে যান</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full mx-auto">
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-40 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        {/* Main card */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Success header with gradient */}
          <div className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 px-8 py-10 text-center overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            {/* Success icon with animation */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute w-32 h-32 bg-white rounded-full opacity-20 animate-ping"></div>
              <div className="absolute w-28 h-28 bg-white rounded-full opacity-30 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
                <CheckCircle className="w-16 h-16 text-green-500" strokeWidth={2.5} />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white mb-3 animate-fade-in">
              Payment Successful!
            </h1>
            <p className="text-xl text-green-50 animate-fade-in animation-delay-200">
              আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে
            </p>
          </div>

          {/* Content section */}
          <div className="px-8 py-8">
            {/* Payment/Invoice details */}
            <div className="space-y-4 mb-8">
              {/* Payment ID */}
              {paymentID && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 animate-slide-up">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment ID</p>
                        <p className="text-lg font-semibold text-gray-800">{paymentID}</p>
                      </div>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              )}

              {/* Invoice validation status */}
              {invoiceId && invoiceValidationStatus && (
                <div className={`border rounded-xl p-4 animate-slide-up animation-delay-200 ${
                  invoiceValidationStatus.success !== false
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                    : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        invoiceValidationStatus.success !== false
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}>
                        {invoiceValidationStatus.success !== false ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Invoice Status</p>
                        <p className={`text-lg font-semibold ${
                          invoiceValidationStatus.success !== false
                            ? 'text-green-800'
                            : 'text-red-800'
                        }`}>
                          {invoiceId} - {invoiceValidationStatus.success !== false ? 'Verified ✓' : 'Failed ✗'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Success animation/image */}
            <div className="mb-8 flex justify-center animate-slide-up animation-delay-400">
              <div className="relative">
                <div className="absolute inset-0 bg-green-200 rounded-full filter blur-2xl opacity-30 animate-pulse"></div>
                <img 
                  src={imag} 
                  alt="Success" 
                  className="relative w-48 h-48 object-contain"
                />
              </div>
            </div>

            {/* Success message box */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8 animate-slide-up animation-delay-600">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  🎉 অভিনন্দন!
                </h3>
                <p className="text-gray-600">
                  আপনার ট্রানজেকশন সফলভাবে প্রসেস করা হয়েছে। আপনি এখন আপনার ম্যাপ এবং ফাইলগুলি দেখতে পারবেন।
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 animate-slide-up animation-delay-800">
              <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3 group"
              >
                <span className="text-lg">আপনার ম্যাপ দেখুন</span>
                <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={handleGoHome}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-4 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>হোম পেজে ফিরে যান</span>
              </button>
            </div>

            {/* Footer info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                আপনার অর্ডারের একটি কপি আপনার ইমেইলে পাঠানো হয়েছে
              </p>
            </div>
          </div>
        </div>

        {/* Floating particles decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-emerald-400 rounded-full animate-float animation-delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-teal-400 rounded-full animate-float animation-delay-2000"></div>
          <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-green-300 rounded-full animate-float animation-delay-3000"></div>
        </div>
      </div>
    </div>
  );
}
