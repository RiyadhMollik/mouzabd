/**
 * Package Selection Page with Mock Data
 * For testing when API is not available
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreditCard, Shield, Zap, Crown, ArrowLeft, Check } from 'lucide-react';

const PackageSelectionPageMock = () => {
  const navigate = useNavigate();
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);

  // Mock data for testing
  const mockPackages = [
    {
      id: 1,
      name: 'Regular Monthly',
      package_type: 'regular',
      duration_type: 'monthly',
      price: 999,
      description: 'মৌলিক ফিচারসহ মাসিক প্যাকেজ',
      features_list: ['মৌলিক ম্যাপ অ্যাক্সেস', 'স্ট্যান্ডার্ড সাপোর্ট', 'বেসিক ফিচার'],
      is_popular: false
    },
    {
      id: 2,
      name: 'Regular Yearly',
      package_type: 'regular',
      duration_type: 'yearly',
      price: 9999,
      description: 'সাশ্রয়ী বার্ষিক প্যাকেজ',
      features_list: ['সকল রেগুলার ফিচার', 'বার্ষিক ছাড়', 'অগ্রাধিকার সাপোর্ট'],
      is_popular: true
    },
    {
      id: 3,
      name: 'ProSeller Monthly',
      package_type: 'proseller',
      duration_type: 'monthly',
      price: 2999,
      description: 'পেশাদারদের জন্য মাসিক প্যাকেজ',
      features_list: ['সকল প্রিমিয়াম ফিচার', 'ডেডিকেটেড সাপোর্ট', 'অ্যাডভান্সড অ্যানালিটিক্স'],
      is_popular: false
    },
    {
      id: 4,
      name: 'ProSeller Yearly',
      package_type: 'proseller',
      duration_type: 'yearly',
      price: 29999,
      description: 'পেশাদারদের জন্য বার্ষিক প্যাকেজ',
      features_list: ['সকল প্রো ফিচার', 'বার্ষিক বিশাল ছাড়', 'VIP সাপোর্ট'],
      is_popular: true
    }
  ];

  const mockCurrentPackage = null; // No current package for testing

  const handlePackagePurchase = async (packageData) => {
    try {
      setSelectedPackageId(packageData.id);
      setPurchaseLoading(true);
      
      // Mock purchase flow
      toast.success('এটি একটি টেস্ট - সত্যিকারের পেমেন্ট প্রক্রিয়া নয়');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      toast.error('প্যাকেজ কেনার সময় সমস্যা হয়েছে');
    } finally {
      setPurchaseLoading(false);
      setSelectedPackageId(null);
    }
  };

  const formatPrice = (price) => `৳${price.toLocaleString('bn-BD')}`;
  
  const getDurationDisplay = (durationType) => {
    const durations = {
      'monthly': 'প্রতি মাস',
      'yearly': 'প্রতি বছর',
      'lifetime': 'আজীবন'
    };
    return durations[durationType] || durationType;
  };

  const getPackageTypeColor = (packageType) => {
    return packageType === 'proseller' 
      ? 'bg-purple-100 text-purple-800'
      : 'bg-blue-100 text-blue-800';
  };

  const regular = mockPackages.filter(pkg => pkg.package_type === 'regular');
  const proseller = mockPackages.filter(pkg => pkg.package_type === 'proseller');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">প্যাকেজ নির্বাচন (টেস্ট)</h1>
                <p className="text-gray-600 mt-1">Mock ডাটা দিয়ে টেস্ট ভার্সন</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-green-600">
              <Shield size={20} />
              <span className="text-sm font-medium">EPS সিকিউর পেমেন্ট</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Regular Packages */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">রেগুলার প্যাকেজ</h2>
            <p className="text-gray-600">মৌলিক ফিচারসহ সাশ্রয়ী প্যাকেজ</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regular.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-lg p-6">
                {pkg.is_popular && (
                  <div className="text-center mb-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">জনপ্রিয়</span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${getPackageTypeColor(pkg.package_type)}`}>
                    রেগুলার
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {formatPrice(pkg.price)}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {getDurationDisplay(pkg.duration_type)}
                  </div>
                </div>

                <p className="text-gray-600 text-center mb-6 text-sm">{pkg.description}</p>

                <div className="space-y-3 mb-6">
                  {pkg.features_list.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <Check className="text-green-500 mr-3 flex-shrink-0" size={16} />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePackagePurchase(pkg)}
                  disabled={purchaseLoading && selectedPackageId === pkg.id}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  {purchaseLoading && selectedPackageId === pkg.id ? 'প্রক্রিয়াকরণ...' : 'এখনই কিনুন'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ProSeller Packages */}
        <div>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-2">
              <Crown className="text-purple-600 mr-2" size={28} />
              <h2 className="text-2xl font-bold text-gray-900">প্রো-সেলার প্যাকেজ</h2>
            </div>
            <p className="text-gray-600">উন্নত ফিচার ও অগ্রাধিকার সহায়তা</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proseller.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
                {pkg.is_popular && (
                  <div className="text-center mb-4">
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">জনপ্রিয়</span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <Crown className="text-purple-600 mr-2" size={24} />
                    <h3 className="text-xl font-bold text-gray-800">{pkg.name}</h3>
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${getPackageTypeColor(pkg.package_type)}`}>
                    প্রো-সেলার
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {formatPrice(pkg.price)}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {getDurationDisplay(pkg.duration_type)}
                  </div>
                </div>

                <p className="text-gray-600 text-center mb-6 text-sm">{pkg.description}</p>

                <div className="space-y-3 mb-6">
                  {pkg.features_list.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <Check className="text-green-500 mr-3 flex-shrink-0" size={16} />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePackagePurchase(pkg)}
                  disabled={purchaseLoading && selectedPackageId === pkg.id}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-sm bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  {purchaseLoading && selectedPackageId === pkg.id ? 'প্রক্রিয়াকরণ...' : 'এখনই কিনুন'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageSelectionPageMock;