/**
 * Example Checkout Page with EPS Payment Integration
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EpsPayment } from '../../component/payment';

const Checkout = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState({
    id: 'ORDER-' + Date.now(),
    amount: 1000.00,
    productName: 'Digital Product',
    productCategory: 'Digital'
  });
  
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Dhaka',
    state: 'Dhaka',
    postcode: '1000',
    country: 'BD'
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    validateForm();
  }, [customerData]);

  const validateForm = () => {
    const newErrors = {};

    if (!customerData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!customerData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!customerData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  const handleInputChange = (field, value) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentSuccess = (result) => {
    console.log('Payment successful:', result);
    // The EpsPayment component will handle the redirect
    // You can add additional success handling here if needed
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    // Handle payment error
    alert('Payment failed: ' + error.message);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4>
                <i className="fas fa-shopping-cart me-2"></i>
                Checkout
              </h4>
            </div>
            <div className="card-body">
              {/* Customer Information Form */}
              <form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="customerName" className="form-label">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      id="customerName"
                      value={customerData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="customerEmail" className="form-label">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="customerEmail"
                      value={customerData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="customerPhone" className="form-label">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      id="customerPhone"
                      value={customerData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="customerAddress" className="form-label">
                      Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerAddress"
                      value={customerData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your address"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="customerCity" className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerCity"
                      value={customerData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label htmlFor="customerState" className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerState"
                      value={customerData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="State"
                    />
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label htmlFor="customerPostcode" className="form-label">Postcode</label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerPostcode"
                      value={customerData.postcode}
                      onChange={(e) => handleInputChange('postcode', e.target.value)}
                      placeholder="Postcode"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          {/* Order Summary */}
          <div className="card">
            <div className="card-header">
              <h5>
                <i className="fas fa-receipt me-2"></i>
                Order Summary
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Product:</span>
                <span>{orderData.productName}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Category:</span>
                <span>{orderData.productCategory}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Order ID:</span>
                <code>{orderData.id}</code>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total Amount:</strong>
                <strong className="text-primary">
                  ৳{parseFloat(orderData.amount).toFixed(2)}
                </strong>
              </div>

              {/* Payment Section */}
              <div className="payment-section">
                <h6 className="mb-3">
                  <i className="fas fa-credit-card me-2"></i>
                  Payment Method
                </h6>
                
                <EpsPayment
                  orderData={orderData}
                  customerData={customerData}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  buttonText="Pay Now with EPS"
                  className="d-grid"
                  disabled={!isFormValid}
                  newWindow={false}
                />

                {!isFormValid && (
                  <small className="text-muted d-block mt-2">
                    <i className="fas fa-info-circle me-1"></i>
                    Please fill in all required fields to proceed
                  </small>
                )}
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="card mt-3">
            <div className="card-body">
              <h6 className="card-title">
                <i className="fas fa-shield-alt text-success me-2"></i>
                Secure Payment
              </h6>
              <small className="text-muted">
                Your payment information is encrypted and secure. 
                We use industry-standard security measures to protect your data.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;