/**
 * Payment Callback Handler Component
 * Handles payment success, failure, and cancellation callbacks
 */
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import epsPaymentService from '../../utils/epsPaymentService';

const PaymentCallback = ({ 
  onSuccess, 
  onFailure, 
  onCancel,
  successRedirect = '/payment/success',
  failureRedirect = '/payment/failed',
  cancelRedirect = '/payment/cancelled'
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [callbackData, setCallbackData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    processCallback();
  }, []);

  const processCallback = async () => {
    try {
      // Process the callback
      const result = epsPaymentService.handlePaymentCallback(searchParams);
      setCallbackData(result);

      // Verify transaction if merchantTransactionId is available
      if (result.merchantTransactionId) {
        try {
          const verificationResult = await epsPaymentService.verifyTransaction(result.merchantTransactionId);
          if (verificationResult.success) {
            result.verificationData = verificationResult;
          }
        } catch (verificationError) {
          console.warn('Transaction verification failed:', verificationError);
        }
      }

      // Handle different statuses
      switch (result.status) {
        case 'success':
          if (onSuccess) {
            onSuccess(result);
          } else {
            // Auto-redirect after 3 seconds
            setTimeout(() => {
              navigate(successRedirect);
            }, 3000);
          }
          break;
          
        case 'cancel':
          if (onCancel) {
            onCancel(result);
          } else {
            setTimeout(() => {
              navigate(cancelRedirect);
            }, 3000);
          }
          break;
          
        default: // 'fail' or any other status
          if (onFailure) {
            onFailure(result);
          } else {
            setTimeout(() => {
              navigate(failureRedirect);
            }, 3000);
          }
          break;
      }
    } catch (error) {
      console.error('Callback processing error:', error);
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="card">
          <div className="card-body text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="card-title">Processing Payment...</h5>
            <p className="card-text text-muted">
              Please wait while we process your payment response.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-danger mb-3">
              <i className="fas fa-exclamation-triangle fa-3x"></i>
            </div>
            <h5 className="card-title text-danger">Processing Error</h5>
            <p className="card-text">{error}</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!callbackData) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-warning mb-3">
              <i className="fas fa-question-circle fa-3x"></i>
            </div>
            <h5 className="card-title">No Payment Data</h5>
            <p className="card-text">
              No payment data found in the callback.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default callback display (if no custom handlers are provided)
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card">
        <div className="card-body text-center">
          {callbackData.status === 'success' ? (
            <>
              <div className="text-success mb-3">
                <i className="fas fa-check-circle fa-3x"></i>
              </div>
              <h5 className="card-title text-success">Payment Successful!</h5>
              <p className="card-text">
                Your payment has been processed successfully.
              </p>
              {callbackData.merchantTransactionId && (
                <p className="text-muted small">
                  Transaction ID: {callbackData.merchantTransactionId}
                </p>
              )}
              <p className="text-muted">
                Redirecting to success page in 3 seconds...
              </p>
            </>
          ) : callbackData.status === 'cancel' ? (
            <>
              <div className="text-warning mb-3">
                <i className="fas fa-times-circle fa-3x"></i>
              </div>
              <h5 className="card-title text-warning">Payment Cancelled</h5>
              <p className="card-text">
                You have cancelled the payment process.
              </p>
              <p className="text-muted">
                Redirecting to cancelled page in 3 seconds...
              </p>
            </>
          ) : (
            <>
              <div className="text-danger mb-3">
                <i className="fas fa-exclamation-circle fa-3x"></i>
              </div>
              <h5 className="card-title text-danger">Payment Failed</h5>
              <p className="card-text">
                Unfortunately, your payment could not be processed.
              </p>
              <p className="text-muted">
                Redirecting to failure page in 3 seconds...
              </p>
            </>
          )}
          
          <div className="mt-3">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;