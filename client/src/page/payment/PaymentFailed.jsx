/**
 * Payment Failed Page
 */
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PaymentStatus } from '../../component/payment';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [merchantTransactionId, setMerchantTransactionId] = useState(null);

  useEffect(() => {
    const transactionId = searchParams.get('transaction') || searchParams.get('merchantTransactionId');
    if (transactionId) {
      setMerchantTransactionId(transactionId);
    }
  }, [searchParams]);

  const handleRetryPayment = () => {
    // Navigate back to checkout or payment page
    navigate('/checkout');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Failed Header */}
          <div className="text-center mb-4">
            <div className="text-danger mb-3">
              <i className="fas fa-exclamation-circle fa-5x"></i>
            </div>
            <h1 className="text-danger">Payment Failed</h1>
            <p className="lead text-muted">
              Unfortunately, your payment could not be processed at this time.
            </p>
          </div>

          {/* Transaction Status */}
          {merchantTransactionId && (
            <div className="mb-4">
              <PaymentStatus 
                merchantTransactionId={merchantTransactionId} 
                refreshInterval={null} // No auto-refresh for failed payments
              />
            </div>
          )}

          {/* Error Information */}
          <div className="mb-4">
            <div className="card border-danger">
              <div className="card-header bg-danger text-white">
                <h5 className="mb-0">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Payment Issue
                </h5>
              </div>
              <div className="card-body">
                <p className="mb-3">Your payment could not be completed due to one of the following reasons:</p>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="fas fa-credit-card text-danger me-2"></i>
                    Insufficient funds in your account
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-ban text-danger me-2"></i>
                    Payment declined by your bank
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-wifi text-danger me-2"></i>
                    Network connection issues
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-clock text-danger me-2"></i>
                    Session timeout
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-exclamation text-danger me-2"></i>
                    Technical error with the payment gateway
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <button 
              className="btn btn-danger btn-lg me-3"
              onClick={handleRetryPayment}
            >
              <i className="fas fa-redo me-2"></i>
              Try Again
            </button>
            <button 
              className="btn btn-outline-secondary btn-lg me-3"
              onClick={() => navigate('/')}
            >
              <i className="fas fa-home me-2"></i>
              Go to Home
            </button>
            <button 
              className="btn btn-outline-info btn-lg"
              onClick={() => navigate('/support')}
            >
              <i className="fas fa-headset me-2"></i>
              Contact Support
            </button>
          </div>

          {/* Help Section */}
          <div className="mt-5">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-question-circle me-2"></i>
                  Need Help?
                </h5>
                <div className="row">
                  <div className="col-md-6">
                    <h6>Before Retrying:</h6>
                    <ul className="list-unstyled">
                      <li className="mb-1">
                        <i className="fas fa-check text-success me-2"></i>
                        Check your account balance
                      </li>
                      <li className="mb-1">
                        <i className="fas fa-check text-success me-2"></i>
                        Verify your payment details
                      </li>
                      <li className="mb-1">
                        <i className="fas fa-check text-success me-2"></i>
                        Ensure stable internet connection
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Alternative Options:</h6>
                    <ul className="list-unstyled">
                      <li className="mb-1">
                        <i className="fas fa-credit-card text-primary me-2"></i>
                        Try a different payment method
                      </li>
                      <li className="mb-1">
                        <i className="fas fa-university text-primary me-2"></i>
                        Use a different bank account
                      </li>
                      <li className="mb-1">
                        <i className="fas fa-phone text-primary me-2"></i>
                        Contact your bank
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;