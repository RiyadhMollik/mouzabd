import React from 'react';

const HandleCheckout = () => {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-orange-50 py-8 px-4">
        <div className="container mx-auto max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Checkout Data Found</h2>
            <p className="text-gray-600 mb-4">
              Please go back and select a package to proceed with checkout.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
        </>
    );
}

export default HandleCheckout;
