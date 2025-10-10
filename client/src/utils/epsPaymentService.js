/**
 * EPS Payment Service for React Frontend
 */
import axios from 'axios';
import { getBaseUrl } from './baseurls';
import { getToken } from './authUtils';

// Create axios instance with base configuration
const epsApi = axios.create({
  baseURL: `${getBaseUrl()}/api/payment`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
epsApi.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
epsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('EPS API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * EPS Payment Service Class
 */
class EpsPaymentService {
  /**
   * Initialize EPS payment and get redirect URL
   * @param {Object} paymentData - Payment initialization data
   * @returns {Promise<Object>} Payment initialization response
   */
  async initializePayment(paymentData) {
    try {
      console.log('Initializing EPS payment:', paymentData);
      
      const response = await epsApi.post('/eps/initialize/', paymentData);
      
      if (response.data.success) {
        console.log('✅ EPS payment initialized successfully');
        console.log('Transaction ID:', response.data.transaction_id);
        console.log('Redirect URL:', response.data.redirect_url);
        
        return {
          success: true,
          transactionId: response.data.transaction_id,
          merchantTransactionId: response.data.merchant_transaction_id,
          redirectUrl: response.data.redirect_url,
          gateway: response.data.gateway
        };
      } else {
        throw new Error(response.data.message || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('❌ EPS payment initialization error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors || 
                          error.message || 
                          'Payment initialization failed';
      
      return {
        success: false,
        message: errorMessage,
        errors: error.response?.data?.errors
      };
    }
  }

  /**
   * Verify EPS transaction status
   * @param {string} merchantTransactionId - Merchant transaction ID
   * @returns {Promise<Object>} Transaction verification response
   */
  async verifyTransaction(merchantTransactionId) {
    try {
      console.log('Verifying EPS transaction:', merchantTransactionId);
      
      const response = await epsApi.get(`/eps/verify/${merchantTransactionId}/`);
      
      if (response.data.success) {
        console.log('✅ EPS transaction verified');
        console.log('Status:', response.data.status);
        
        return {
          success: true,
          status: response.data.status,
          merchantTransactionId: response.data.merchant_transaction_id,
          totalAmount: response.data.total_amount,
          transactionDate: response.data.transaction_date,
          transactionType: response.data.transaction_type,
          financialEntity: response.data.financial_entity,
          customerInfo: response.data.customer_info,
          gateway: response.data.gateway
        };
      } else {
        throw new Error(response.data.message || 'Transaction verification failed');
      }
    } catch (error) {
      console.error('❌ EPS transaction verification error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Transaction verification failed';
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Get transaction status from local database
   * @param {string} merchantTransactionId - Merchant transaction ID
   * @returns {Promise<Object>} Transaction status response
   */
  async getTransactionStatus(merchantTransactionId) {
    try {
      const response = await epsApi.get(`/eps/status/${merchantTransactionId}/`);
      
      if (response.data.success) {
        return {
          success: true,
          transaction: response.data.transaction
        };
      } else {
        throw new Error(response.data.message || 'Failed to get transaction status');
      }
    } catch (error) {
      console.error('❌ Error getting transaction status:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to get transaction status';
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Get EPS configuration
   * @returns {Promise<Object>} EPS configuration response
   */
  async getConfiguration() {
    try {
      const response = await epsApi.get('/eps/config/');
      
      if (response.data.success) {
        return {
          success: true,
          config: response.data.config
        };
      } else {
        throw new Error(response.data.message || 'Failed to get EPS configuration');
      }
    } catch (error) {
      console.error('❌ Error getting EPS configuration:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to get EPS configuration'
      };
    }
  }

  /**
   * Redirect to EPS payment page
   * @param {string} redirectUrl - EPS redirect URL
   * @param {boolean} newWindow - Whether to open in new window (default: false)
   */
  redirectToPayment(redirectUrl, newWindow = false) {
    if (!redirectUrl) {
      throw new Error('Redirect URL is required');
    }

    console.log('Redirecting to EPS payment page:', redirectUrl);

    if (newWindow) {
      // Open in new window/tab
      const paymentWindow = window.open(
        redirectUrl,
        'eps_payment',
        'width=800,height=600,scrollbars=yes,resizable=yes'
      );

      if (!paymentWindow) {
        throw new Error('Failed to open payment window. Please allow popups for this site.');
      }

      return paymentWindow;
    } else {
      // Redirect in same window
      window.location.href = redirectUrl;
    }
  }

  /**
   * Process payment with automatic redirect
   * @param {Object} paymentData - Payment data
   * @param {boolean} newWindow - Whether to open in new window
   * @returns {Promise<Object>} Payment processing result
   */
  async processPayment(paymentData, newWindow = false) {
    try {
      // Initialize payment
      const initResult = await this.initializePayment(paymentData);
      
      if (!initResult.success) {
        return initResult;
      }

      // Store transaction info in localStorage for callback handling
      localStorage.setItem('eps_payment_data', JSON.stringify({
        merchantTransactionId: initResult.merchantTransactionId,
        transactionId: initResult.transactionId,
        amount: paymentData.amount,
        customerEmail: paymentData.customer_email,
        timestamp: Date.now()
      }));

      // Redirect to payment
      this.redirectToPayment(initResult.redirectUrl, newWindow);

      return initResult;
    } catch (error) {
      console.error('❌ Payment processing error:', error);
      return {
        success: false,
        message: error.message || 'Payment processing failed'
      };
    }
  }

  /**
   * Handle payment callback (call this on callback pages)
   * @param {URLSearchParams} searchParams - URL search parameters
   * @returns {Object} Callback processing result
   */
  handlePaymentCallback(searchParams) {
    try {
      const status = searchParams.get('status');
      const merchantTransactionId = searchParams.get('transaction') || 
                                   searchParams.get('merchantTransactionId');
      const amount = searchParams.get('amount');
      const transactionId = searchParams.get('transactionId');

      // Get stored payment data
      const storedData = localStorage.getItem('eps_payment_data');
      let paymentData = null;
      
      if (storedData) {
        try {
          paymentData = JSON.parse(storedData);
        } catch (e) {
          console.warn('Failed to parse stored payment data');
        }
      }

      const result = {
        status: status,
        merchantTransactionId: merchantTransactionId,
        transactionId: transactionId,
        amount: amount,
        gateway: 'eps',
        paymentStatus: status === 'success' ? 'completed' : 'failed',
        orderStatus: status === 'success' ? 'confirmed' : 
                    (status === 'cancel' ? 'cancelled' : 'failed'),
        storedData: paymentData
      };

      console.log('EPS Payment Callback processed:', result);

      // Clear stored data
      localStorage.removeItem('eps_payment_data');

      return result;
    } catch (error) {
      console.error('❌ Error processing payment callback:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to process payment callback'
      };
    }
  }

  /**
   * Validate payment data before submission
   * @param {Object} paymentData - Payment data to validate
   * @returns {Object} Validation result
   */
  validatePaymentData(paymentData) {
    const errors = {};

    // Required fields
    if (!paymentData.order_id) {
      errors.order_id = 'Order ID is required';
    }
    
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      errors.amount = 'Valid amount is required';
    }
    
    if (!paymentData.customer_name) {
      errors.customer_name = 'Customer name is required';
    }
    
    if (!paymentData.customer_email) {
      errors.customer_email = 'Customer email is required';
    } else if (!/\S+@\S+\.\S+/.test(paymentData.customer_email)) {
      errors.customer_email = 'Valid email address is required';
    }
    
    if (!paymentData.customer_phone) {
      errors.customer_phone = 'Customer phone is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors
    };
  }

  /**
   * Format payment data for EPS API
   * @param {Object} data - Raw payment data
   * @returns {Object} Formatted payment data
   */
  formatPaymentData(data) {
    return {
      order_id: data.orderId || data.order_id,
      amount: parseFloat(data.amount).toFixed(2),
      customer_name: data.customerName || data.customer_name,
      customer_email: data.customerEmail || data.customer_email,
      customer_phone: data.customerPhone || data.customer_phone,
      customer_address: data.customerAddress || data.customer_address || 'Dhaka, Bangladesh',
      customer_city: data.customerCity || data.customer_city || 'Dhaka',
      customer_state: data.customerState || data.customer_state || 'Dhaka',
      customer_postcode: data.customerPostcode || data.customer_postcode || '1000',
      customer_country: data.customerCountry || data.customer_country || 'BD',
      product_name: data.productName || data.product_name || 'Digital Product',
      product_category: data.productCategory || data.product_category || 'Digital'
    };
  }
}

// Create singleton instance
const epsPaymentService = new EpsPaymentService();

export default epsPaymentService;