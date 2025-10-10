/**
 * Order Success Page
 * Shows successful order completion for both free and paid orders
 */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Home, FileText, Clock } from 'lucide-react';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const data = location.state;
    if (!data) {
      // No order data, redirect to home
      navigate('/', { replace: true });
      return;
    }
    setOrderData(data);
  }, [location.state, navigate]);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const { 
    isFreeOrder, 
    selectedFiles, 
    totalAmount, 
    validationResult,
    fileCount 
  } = orderData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {isFreeOrder ? 'অর্ডার সফল হয়েছে!' : 'পেমেন্ট সফল হয়েছে!'}
            </h1>
            
            <p className="text-gray-600 mb-4">
              {isFreeOrder 
                ? 'আপনার প্যাকেজের দৈনিক সীমার মধ্যে এই অর্ডারটি বিনামূল্যে প্রক্রিয়া করা হয়েছে।'
                : 'আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে।'
              }
            </p>

            {isFreeOrder && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center text-green-700">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="font-medium">প্যাকেজ সুবিধা ব্যবহৃত</span>
                </div>
                {validationResult?.daily_order_status && (
                  <div className="text-sm text-green-600 mt-2">
                    আজকে অবশিষ্ট: {validationResult.daily_order_status.remaining_orders} অর্ডার
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">অর্ডার বিবরণ</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ফাইল সংখ্যা:</span>
                <span className="font-medium">{fileCount}টি</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">মোট পরিমাণ:</span>
                <span className={`font-medium ${isFreeOrder ? 'text-green-600' : 'text-gray-800'}`}>
                  {isFreeOrder ? 'বিনামূল্যে' : `৳${totalAmount}`}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">অর্ডারের তারিখ:</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString('bn-BD')}
                </span>
              </div>

              {isFreeOrder && validationResult?.daily_order_status && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">প্যাকেজ:</span>
                  <span className="font-medium">
                    {validationResult.daily_order_status.package_name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Selected Files */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">নির্বাচিত ফাইলসমূহ</h2>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedFiles?.map((file, index) => (
                <div key={file.id || index} className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-500 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">
                      {file.name || file.title || `ফাইল ${index + 1}`}
                    </p>
                    {file.location && (
                      <p className="text-xs text-gray-500">{file.location}</p>
                    )}
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 p-1">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              হোমে ফিরুন
            </button>
            
            <button
              onClick={() => navigate('/packages')}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              প্যাকেজ দেখুন
            </button>
            
            <button
              onClick={() => navigate(-2)} // Go back to results
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
            >
              আরো অনুসন্ধান
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              সমস্যার জন্য আমাদের সাথে যোগাযোগ করুন: support@mouzabd.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;