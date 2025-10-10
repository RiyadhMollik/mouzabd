/**
 * Order Validation Modal
 * Shows order validation status and handles free/paid order flow
 */
import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Clock, Zap, CreditCard } from 'lucide-react';
import PackageService from '../../services/PackageService';

const OrderValidationModal = ({ 
  isOpen, 
  onClose, 
  onProceedFree, 
  onProceedPaid, 
  orderDetails = {} 
}) => {
  const [validationStatus, setValidationStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && orderDetails.selectedFiles) {
      validateOrder();
    }
  }, [isOpen, orderDetails.selectedFiles]);

  const validateOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fileCount = orderDetails.selectedFiles?.length || 1;
      const response = await PackageService.validateOrderLimit(fileCount);
      setValidationStatus(response);
      
      if (!response.success) {
        setError(response.message || 'Validation failed');
      }
    } catch (err) {
      console.error('Order validation error:', err);
      setError('Unable to validate order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedFree = () => {
    if (validationStatus?.is_free_order) {
      onProceedFree(validationStatus);
    }
  };

  const handleProceedPaid = () => {
    onProceedPaid(validationStatus);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Order Validation</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Validating order...</span>
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={validateOrder}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : validationStatus ? (
            <div className="space-y-4">
              {/* Order Details */}
              {orderDetails.title && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="font-medium text-gray-800 mb-1">Order Details</h3>
                  <p className="text-sm text-gray-600">{orderDetails.title}</p>
                  {orderDetails.price && (
                    <p className="text-sm text-gray-600">Amount: ৳{orderDetails.price}</p>
                  )}
                </div>
              )}

              {/* Validation Result */}
              {validationStatus.is_free_order ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">Free Order Available!</span>
                  </div>
                  <p className="text-sm text-green-700 mb-3">
                    This order is covered by your package daily limit.
                  </p>
                  
                  {validationStatus.daily_order_status && (
                    <div className="text-xs text-green-600 space-y-1">
                      <div>Remaining today: {validationStatus.daily_order_status.remaining_orders}</div>
                      <div>Package: {validationStatus.daily_order_status.package_name}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <CreditCard className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="font-medium text-yellow-800">Paid Order Required</span>
                  </div>
                  <p className="text-sm text-yellow-700 mb-3">
                    {validationStatus.message || 'Daily limit reached. This will be a paid order.'}
                  </p>
                  
                  {validationStatus.daily_order_status && (
                    <div className="text-xs text-yellow-600 space-y-1">
                      <div>Used today: {validationStatus.daily_order_status.orders_used_today}/{validationStatus.daily_order_status.daily_limit}</div>
                      <div>Package: {validationStatus.daily_order_status.package_name}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                {validationStatus.is_free_order ? (
                  <>
                    <button
                      onClick={handleProceedFree}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Proceed (Free)
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleProceedPaid}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay & Order
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Initializing validation...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderValidationModal;