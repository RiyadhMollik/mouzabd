/**
 * Payment Cancelled Page
 */
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PaymentStatus } from '../../component/payment';

const PaymentCancelled = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [merchantTransactionId, setMerchantTransactionId] = useState(null);

  useEffect(() => {
    const transactionId = searchParams.get('transaction') || searchParams.get('merchantTransactionId');
    if (transactionId) {
      setMerchantTransactionId(transactionId);
    }
  }, [searchParams]);

  const handleReturnToCheckout = () => {
    // Navigate back to checkout page
    navigate('/checkout');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Cancelled Header */}
          <div className="text-center mb-4">
            <div className="text-warning mb-3">
              <i className="fas fa-times-circle fa-5x"></i>
            </div>
            <h1 className="text-warning">Payment Cancelled</h1>
            <p className="lead text-muted">
              You have cancelled the payment process. Your order has not been completed.
            </p>
          </div>

          {/* Transaction Status */}
          {merchantTransactionId && (
            <div className="mb-4">
              <PaymentStatus 
                merchantTransactionId={merchantTransactionId} 
                refreshInterval={null} // No auto-refresh for cancelled payments
              />
            </div>
          )}

          {/* Information Card */}
          <div className="mb-4">
            <div className="card border-warning">
              <div className="card-header bg-warning text-dark">
                <h5 className="mb-0">
                  <i className="fas fa-info-circle me-2"></i>
                  Payment Cancelled
                </h5>
              </div>
              <div className="card-body">
                <p className="mb-3">
                  You have chosen to cancel the payment process. No charges have been made to your account.
                </p>
                <div className="alert alert-info">
                  <strong>What this means:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Your order has not been processed</li>
                    <li>No payment has been charged</li>
                    <li>Your cart items are still saved</li>
                    <li>You can complete the payment later</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <button 
              className="btn btn-warning btn-lg me-3"
              onClick={handleReturnToCheckout}
            >
              <i className="fas fa-shopping-cart me-2"></i>
              Complete Payment
            </button>
            <button 
              className="btn btn-outline-secondary btn-lg me-3"
              onClick={() => navigate('/cart')}
            >
              <i className="fas fa-edit me-2"></i>
              Edit Cart
            </button>
            <button 
              className="btn btn-outline-primary btn-lg"
              onClick={() => navigate('/')}
            >
              <i className="fas fa-home me-2"></i>
              Continue Shopping
            </button>
          </div>

          {/* Help Section */}
          <div className="mt-5">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-lightbulb me-2"></i>
                  What You Can Do Next
                </h5>
                <div className="row">
                  <div className="col-md-6">
                    <h6>Complete Your Order:</h6>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="fas fa-arrow-right text-primary me-2"></i>
                        <a href="#" onClick={handleReturnToCheckout} className="text-decoration-none">
                          Return to checkout and complete payment
                        </a>
                      </li>
                      <li className="mb-2">
                        <i className="fas fa-arrow-right text-primary me-2"></i>
                        <a href="#" onClick={() => navigate('/cart')} className="text-decoration-none">
                          Review your cart items
                        </a>
                      </li>
                      <li className="mb-2">
                        <i className="fas fa-arrow-right text-primary me-2"></i>
                        <a href="#" onClick={() => navigate('/payment-methods')} className="text-decoration-none">
                          Choose a different payment method
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Need Assistance?</h6>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="fas fa-headset text-success me-2"></i>
                        <a href="#" onClick={() => navigate('/support')} className="text-decoration-none">
                          Contact customer support
                        </a>
                      </li>
                      <li className="mb-2">
                        <i className="fas fa-question-circle text-success me-2"></i>
                        <a href="#" onClick={() => navigate('/faq')} className="text-decoration-none">
                          View payment FAQ
                        </a>
                      </li>
                      <li className="mb-2">
                        <i className="fas fa-phone text-success me-2"></i>
                        Call us at: +880-1234-567890
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save for Later */}
          <div className="mt-4">
            <div className="alert alert-light">
              <h6 className="alert-heading">
                <i className="fas fa-bookmark me-2"></i>
                Save Your Cart
              </h6>
              <p className="mb-0">
                Your cart items are automatically saved. You can return anytime to complete your purchase.
                <button className="btn btn-link p-0 ms-2" onClick={() => navigate('/saved-carts')}>
                  View saved carts
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;