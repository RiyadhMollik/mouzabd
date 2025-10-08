import React, { useState, useEffect, useContext } from 'react';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../provider/AuthProvider';
import imag from "../assets/bdmouza2.gif";

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userdata } = useContext(AuthContext);

  // Get params from URL
  const params = new URLSearchParams(location.search);
  const invoiceId = params.get("invoice_id");
  const paymentID = params.get("paymentID");
  const paymentStatus = params.get("status");

  // State
  const [invoiceValidationStatus, setInvoiceValidationStatus] = useState(null);
  const [invoiceValidating, setInvoiceValidating] = useState(false);
  const [error, setError] = useState(null);

  // Validate invoice function
const validateInvoice = async (id) => {
  try {
    setInvoiceValidating(true);
    setError(null);

    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Invalid invoice/payment ID format');
    }

    const trimmedId = id.trim();
    console.log('Validating invoice/payment with ID:', trimmedId);

    const token = user?.token || userdata?.token || localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token.replace('Bearer ', '')}`;
    }

    // এখানে কন্ডিশনাল লজিক
    let requestBody;
    if (paymentID) {
      requestBody = JSON.stringify({
        payment_id: paymentID,
        status: paymentStatus || "",
      });
    } else {
      requestBody = JSON.stringify({
        invoice_id: invoiceId,
      });
    }

    console.log("Request Body:", requestBody);

    const response = await fetch('https://api.bdmouza.com/purchase-alt/validate/', {
      method: 'POST',
      headers: headers,
      body: requestBody,
    });

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {               
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error || errorData.detail || errorMessage;
      } catch {
        errorMessage = responseText || errorMessage;
      }
      throw new Error(`Invoice validation failed: ${errorMessage}`);
    }

    let data = JSON.parse(responseText);
    setInvoiceValidationStatus(data);
    return data;
  } catch (err) {
    setError(`Invoice validation error: ${err.message}`);
    setInvoiceValidationStatus({ success: false, error: err.message });
    return null;
  } finally {
    setInvoiceValidating(false);
  }
};



  // useEffect to validate invoice only when status=success
 useEffect(() => {
  if ((paymentStatus === "success" && paymentID) || (!paymentID && invoiceId)) {
    const timer = setTimeout(() => {
      validateInvoice(paymentID || invoiceId);
    }, 1000);
    return () => clearTimeout(timer);
  }
}, [invoiceId, paymentID, paymentStatus]);

  const handleContinue = () => {
    navigate('/map/list');
  };

  // Cancel state
  if (paymentStatus && paymentStatus !== "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8">
          <AlertCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Cancelled</h1>
          <p className="text-gray-600 mb-6">
            আপনার পেমেন্ট বাতিল করা হয়েছে বা ব্যর্থ হয়েছে।
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (invoiceValidating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <Loader className="w-24 h-24 text-blue-500 mx-auto animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Processing Payment
          </h1>
          <p className="text-gray-600 mb-8">
            আপনার পেমেন্ট যাচাই করা হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8">
          <AlertCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Payment Verification Failed
          </h1>
          <p className="text-gray-600 mb-8">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => validateInvoice(invoiceId)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Retry Verification
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center bg-white rounded-lg p-8">
        {/* Payment ID display */}
        {paymentID && (
          <div className="mb-4 text-gray-700 text-sm">
            Payment ID: {paymentID}
          </div>
        )}

        {/* Invoice validation status */}
        {invoiceId && invoiceValidationStatus && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              invoiceValidationStatus.success !== false
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center justify-center">
              {invoiceValidationStatus.success !== false ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
              <div className="ml-2">
                Invoice {invoiceId}: {invoiceValidationStatus.success !== false ? 'Verified' : 'Failed'}
              </div>
            </div>
          </div>
        )}

        {/* Success message */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে।
        </h1>
        <div className="mb-6">
          <img src={imag} alt="Success" />
        </div>
        <button
          onClick={handleContinue}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Continue to Maps
        </button>
      </div>
    </div>
  );
}
