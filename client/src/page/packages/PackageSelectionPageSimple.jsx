/**
 * Simple Package Selection Page for Testing
 */
import React from 'react';

const PackageSelectionPageSimple = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Package Selection</h1>
        <p className="text-gray-600 mb-8">Browse and select your preferred package</p>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Regular Package</h3>
            <p className="text-gray-600 mb-4">Basic features for everyday use</p>
            <div className="text-2xl font-bold text-blue-600 mb-4">৳999/মাস</div>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Select Package
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-purple-500">
            <h3 className="text-xl font-bold text-gray-900 mb-2">ProSeller Package</h3>
            <p className="text-gray-600 mb-4">Advanced features for professionals</p>
            <div className="text-2xl font-bold text-purple-600 mb-4">৳2,999/মাস</div>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
              Select Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageSelectionPageSimple;