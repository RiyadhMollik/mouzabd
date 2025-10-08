/**
 * Payment Status Component
 * Displays payment transaction status and details
 */
import React, { useState, useEffect } from 'react';
import epsPaymentService from '../../utils/epsPaymentService';

const PaymentStatus = ({ merchantTransactionId, refreshInterval = null }) => {
  const [transaction, setTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  useEffect(() => {
    if (merchantTransactionId) {
      fetchTransactionStatus();
    }
  }, [merchantTransactionId]);

  useEffect(() => {
    let interval;
    if (refreshInterval && merchantTransactionId) {
      interval = setInterval(() => {
        fetchTransactionStatus(true);
      }, refreshInterval);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [refreshInterval, merchantTransactionId]);

  const fetchTransactionStatus = async (isRefresh = false) => {
    if (!isRefresh) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const result = await epsPaymentService.getTransactionStatus(merchantTransactionId);
      
      if (result.success) {
        setTransaction(result.transaction);
        setLastRefresh(new Date());
      } else {
        setError(result.message || 'Failed to fetch transaction status');
      }
    } catch (error) {
      setError(error.message || 'Error fetching transaction status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchTransactionStatus();
  };

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const result = await epsPaymentService.verifyTransaction(merchantTransactionId);
      if (result.success) {
        // Refresh the local transaction data
        await fetchTransactionStatus();
      } else {
        setError(result.message || 'Verification failed');
      }
    } catch (error) {
      setError(error.message || 'Verification error');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'warning', icon: 'clock', text: 'Pending' },
      processing: { color: 'info', icon: 'spinner', text: 'Processing' },
      completed: { color: 'success', icon: 'check-circle', text: 'Completed' },
      failed: { color: 'danger', icon: 'exclamation-circle', text: 'Failed' },
      cancelled: { color: 'secondary', icon: 'times-circle', text: 'Cancelled' },
      refunded: { color: 'primary', icon: 'undo', text: 'Refunded' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`badge bg-${config.color}`}>
        <i className={`fas fa-${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    if (!paymentStatus) return null;

    const statusConfig = {
      success: { color: 'success', icon: 'check', text: 'Success' },
      completed: { color: 'success', icon: 'check', text: 'Completed' },
      failed: { color: 'danger', icon: 'times', text: 'Failed' },
      fail: { color: 'danger', icon: 'times', text: 'Failed' },
      cancelled: { color: 'secondary', icon: 'ban', text: 'Cancelled' },
      cancel: { color: 'secondary', icon: 'ban', text: 'Cancelled' }
    };

    const config = statusConfig[paymentStatus.toLowerCase()] || { color: 'secondary', icon: 'question', text: paymentStatus };
    return (
      <span className={`badge bg-${config.color}`}>
        <i className={`fas fa-${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  if (!merchantTransactionId) {
    return (
      <div className="alert alert-warning">
        <i className="fas fa-exclamation-triangle me-2"></i>
        No transaction ID provided
      </div>
    );
  }

  if (isLoading && !transaction) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading transaction status...</p>
        </div>
      </div>
    );
  }

  if (error && !transaction) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
          <button className="btn btn-outline-primary" onClick={handleRefresh}>
            <i className="fas fa-refresh me-1"></i>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="alert alert-info">
        <i className="fas fa-info-circle me-2"></i>
        No transaction found with ID: {merchantTransactionId}
      </div>
    );
  }

  return (
    <div className="payment-status">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="fas fa-receipt me-2"></i>
            Payment Status
          </h5>
          <div>
            <button 
              className="btn btn-outline-secondary btn-sm me-2" 
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <i className={`fas fa-refresh ${isLoading ? 'fa-spin' : ''} me-1`}></i>
              Refresh
            </button>
            {!transaction.is_verified && (
              <button 
                className="btn btn-outline-primary btn-sm" 
                onClick={handleVerify}
                disabled={isLoading}
              >
                <i className="fas fa-check me-1"></i>
                Verify
              </button>
            )}
          </div>
        </div>
        
        <div className="card-body">
          {error && (
            <div className="alert alert-warning alert-dismissible">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          <div className="row">
            <div className="col-md-6">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td><strong>Transaction ID:</strong></td>
                    <td><code>{transaction.merchant_transaction_id}</code></td>
                  </tr>
                  <tr>
                    <td><strong>EPS Transaction ID:</strong></td>
                    <td>
                      {transaction.eps_transaction_id ? (
                        <code>{transaction.eps_transaction_id}</code>
                      ) : (
                        <span className="text-muted">Not available</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Order ID:</strong></td>
                    <td><code>{transaction.customer_order_id}</code></td>
                  </tr>
                  <tr>
                    <td><strong>Amount:</strong></td>
                    <td>
                      <strong className="text-primary">
                        {parseFloat(transaction.amount).toFixed(2)} {transaction.currency}
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Status:</strong></td>
                    <td>{getStatusBadge(transaction.status)}</td>
                  </tr>
                  <tr>
                    <td><strong>Payment Status:</strong></td>
                    <td>
                      {transaction.payment_status ? 
                        getPaymentStatusBadge(transaction.payment_status) : 
                        <span className="text-muted">Not set</span>
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="col-md-6">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td><strong>Customer:</strong></td>
                    <td>{transaction.customer_name}</td>
                  </tr>
                  <tr>
                    <td><strong>Email:</strong></td>
                    <td>{transaction.customer_email}</td>
                  </tr>
                  <tr>
                    <td><strong>Phone:</strong></td>
                    <td>{transaction.customer_phone}</td>
                  </tr>
                  <tr>
                    <td><strong>Product:</strong></td>
                    <td>{transaction.product_name}</td>
                  </tr>
                  <tr>
                    <td><strong>Created:</strong></td>
                    <td>{new Date(transaction.created_at).toLocaleString()}</td>
                  </tr>
                  {transaction.completed_at && (
                    <tr>
                      <td><strong>Completed:</strong></td>
                      <td>{new Date(transaction.completed_at).toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {transaction.financial_entity_name && (
            <div className="mt-3">
              <div className="alert alert-info">
                <strong>Bank/Financial Institution:</strong> {transaction.financial_entity_name}
              </div>
            </div>
          )}

          <div className="row mt-3">
            <div className="col-md-4">
              <div className={`text-center p-3 rounded ${transaction.is_verified ? 'bg-success' : 'bg-warning'} bg-opacity-10`}>
                <i className={`fas fa-${transaction.is_verified ? 'shield-check' : 'shield-exclamation'} fa-2x ${transaction.is_verified ? 'text-success' : 'text-warning'} mb-2`}></i>
                <br />
                <span className={`badge bg-${transaction.is_verified ? 'success' : 'warning'}`}>
                  {transaction.is_verified ? 'Verified' : 'Not Verified'}
                </span>
                {transaction.verification_attempts > 0 && (
                  <small className="d-block text-muted mt-1">
                    Attempts: {transaction.verification_attempts}
                  </small>
                )}
              </div>
            </div>
            
            <div className="col-md-4">
              <div className={`text-center p-3 rounded ${transaction.is_successful ? 'bg-success' : 'bg-danger'} bg-opacity-10`}>
                <i className={`fas fa-${transaction.is_successful ? 'check-circle' : 'times-circle'} fa-2x ${transaction.is_successful ? 'text-success' : 'text-danger'} mb-2`}></i>
                <br />
                <span className={`badge bg-${transaction.is_successful ? 'success' : 'danger'}`}>
                  {transaction.is_successful ? 'Successful' : 'Not Successful'}
                </span>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className={`text-center p-3 rounded ${transaction.can_be_refunded ? 'bg-info' : 'bg-secondary'} bg-opacity-10`}>
                <i className={`fas fa-${transaction.can_be_refunded ? 'undo' : 'ban'} fa-2x ${transaction.can_be_refunded ? 'text-info' : 'text-secondary'} mb-2`}></i>
                <br />
                <span className={`badge bg-${transaction.can_be_refunded ? 'info' : 'secondary'}`}>
                  {transaction.can_be_refunded ? 'Refundable' : 'Not Refundable'}
                </span>
              </div>
            </div>
          </div>

          {lastRefresh && (
            <small className="text-muted d-block mt-3">
              <i className="fas fa-clock me-1"></i>
              Last updated: {lastRefresh.toLocaleString()}
            </small>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;