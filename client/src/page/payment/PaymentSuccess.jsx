/**
 * Payment Success Page
 */
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PaymentStatus } from '../../component/payment';

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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Success Header */}
          <div className="text-center mb-4">
            <div className="text-success mb-3">
              <i className="fas fa-check-circle fa-5x"></i>
            </div>
            <h1 className="text-success">Payment Successful!</h1>
            <p className="lead text-muted">
              Thank you for your payment. Your transaction has been completed successfully.
            </p>
          </div>

          {/* Transaction Status */}
          {merchantTransactionId && (
            <div className="mb-4">
              <PaymentStatus 
                merchantTransactionId={merchantTransactionId} 
                refreshInterval={5000} // Refresh every 5 seconds
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="text-center">
            <button 
              className="btn btn-primary btn-lg me-3"
              onClick={() => navigate('/')}
            >
              <i className="fas fa-home me-2"></i>
              Go to Home
            </button>
            <button 
              className="btn btn-outline-secondary btn-lg"
              onClick={() => navigate('/orders')}
            >
              <i className="fas fa-list me-2"></i>
              View Orders
            </button>
          </div>

          {/* Additional Information */}
          <div className="mt-5">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-info-circle me-2"></i>
                  What's Next?
                </h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="fas fa-envelope text-primary me-2"></i>
                    You will receive a confirmation email shortly
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-receipt text-primary me-2"></i>
                    Your receipt is available in your account
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-headset text-primary me-2"></i>
                    Contact support if you have any questions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;