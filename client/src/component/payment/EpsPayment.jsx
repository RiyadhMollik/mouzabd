/**
 * EPS Payment Component
 * Handles EPS payment initialization and processing
 */
import React, { useState, useEffect } from 'react';
import epsPaymentService from '../../utils/epsPaymentService';

const EpsPayment = ({ 
  orderData, 
  customerData, 
  onSuccess, 
  onError, 
  onCancel,
  buttonText = "Pay with EPS",
  className = "",
  disabled = false,
  newWindow = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    // Load EPS configuration on component mount
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      const result = await epsPaymentService.getConfiguration();
      if (result.success) {
        setConfig(result.config);
      } else {
        console.warn('Failed to load EPS configuration:', result.message);
      }
    } catch (error) {
      console.warn('Error loading EPS configuration:', error);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate required data
      if (!orderData || !customerData) {
        throw new Error('Order data and customer data are required');
      }

      // Format payment data
      const paymentData = epsPaymentService.formatPaymentData({
        order_id: orderData.id || orderData.orderId,
        amount: orderData.amount,
        customer_name: customerData.name || customerData.customerName,
        customer_email: customerData.email || customerData.customerEmail,
        customer_phone: customerData.phone || customerData.customerPhone,
        customer_address: customerData.address || customerData.customerAddress,
        customer_city: customerData.city || customerData.customerCity,
        customer_state: customerData.state || customerData.customerState,
        customer_postcode: customerData.postcode || customerData.customerPostcode,
        customer_country: customerData.country || customerData.customerCountry,
        product_name: orderData.productName || orderData.product_name,
        product_category: orderData.productCategory || orderData.product_category
      });

      // Validate payment data
      const validation = epsPaymentService.validatePaymentData(paymentData);
      if (!validation.isValid) {
        const errorMessages = Object.values(validation.errors).join(', ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }

      // Process payment
      const result = await epsPaymentService.processPayment(paymentData, newWindow);

      if (result.success) {
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        throw new Error(result.message || 'Payment processing failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message);
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if EPS is not active
  if (config && !config.is_active) {
    return null;
  }

  return (
    <div className={`eps-payment ${className}`}>
      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          <strong>Payment Error:</strong> {error}
        </div>
      )}
      
      <button
        type="button"
        className={`btn btn-primary eps-payment-btn ${isLoading ? 'disabled' : ''}`}
        onClick={handlePayment}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Processing...
          </>
        ) : (
          buttonText
        )}
      </button>
      
      {config && config.is_sandbox && (
        <small className="text-muted d-block mt-2">
          <i className="fas fa-info-circle me-1"></i>
          Test mode (Sandbox)
        </small>
      )}
    </div>
  );
};

export default EpsPayment;