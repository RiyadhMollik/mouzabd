/**
 * Payment Success Page
 */
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PaymentStatus } from '../../component/payment';
import { CheckCircle, Home, ShoppingBag, Mail, Receipt, Headphones, ArrowRight, Download, Info } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [merchantTransactionId, setMerchantTransactionId] = useState(null);

  useEffect(() => {
    const transactionId = searchParams.get('transaction') || searchParams.get('merchantTransactionId');
    if (transactionId) {
      setMerchantTransactionId(transactionId);
    }
  }, [searchParams]);

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



            {/* Footer Note */}

          </div>
          {/* Transaction Status Section */}
          {merchantTransactionId && (
            <div className="px-8 py-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 animate-fade-in animation-delay-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="text-lg font-semibold text-gray-800">{merchantTransactionId}</p>
                  </div>
                </div>
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <PaymentStatus
                merchantTransactionId={merchantTransactionId}
                refreshInterval={5000}
              />
            </div>
          )}

          {/* Content Section */}

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
    </div>
  );
};

export default PaymentSuccess;