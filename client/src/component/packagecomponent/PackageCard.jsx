/**
 * Package Card Component
 * Displays individual package information with features and purchase button
 */
import React from 'react';
import { Crown, Star, Check, Zap } from 'lucide-react';

const PackageCard = ({ 
  packageData, 
  onPurchase, 
  isLoading = false, 
  currentPackage = null,
  className = "" 
}) => {
  const {
    id,
    name,
    package_type,
    duration_type,
    price,
    description,
    features_list,
    is_popular
  } = packageData;

  const isCurrentPackage = currentPackage && currentPackage.package.id === id;
  const isProseller = package_type === 'proseller';
  const isPopular = is_popular;

  // Utility functions
  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `৳${numPrice.toLocaleString('bn-BD')}`;
  };

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

  const handlePurchase = () => {
    if (!isLoading && !isCurrentPackage) {
      onPurchase(packageData);
    }
  };

  return (
    <div className={`relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Star size={14} fill="currentColor" />
            জনপ্রিয়
          </div>
        </div>
      )}

      {/* Current Package Badge */}
      {isCurrentPackage && (
        <div className="absolute -top-3 right-4">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            সক্রিয়
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Package Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-2">
            {isProseller && <Crown className="text-purple-600 mr-2" size={24} />}
            <h3 className="text-xl font-bold text-gray-800">{name}</h3>
          </div>
          
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${getPackageTypeColor(package_type)}`}>
            {package_type === 'regular' ? 'রেগুলার' : 'প্রো-সেলার'}
          </div>

          <div className="text-3xl font-bold text-gray-900 mb-1">
            {formatPrice(price)}
          </div>
          
          <div className="text-gray-500 text-sm">
            {getDurationDisplay(duration_type)}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-center mb-6 text-sm leading-relaxed">
          {description}
        </p>

        {/* Features List */}
        <div className="space-y-3 mb-6">
          {features_list && features_list.map((feature, index) => (
            <div key={index} className="flex items-center text-sm">
              <Check className="text-green-500 mr-3 flex-shrink-0" size={16} />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* Purchase Button */}
        <button
          onClick={handlePurchase}
          disabled={isLoading || isCurrentPackage}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
            isCurrentPackage
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : isProseller
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              প্রক্রিয়াকরণ...
            </div>
          ) : isCurrentPackage ? (
            'বর্তমান প্যাকেজ'
          ) : (
            <div className="flex items-center justify-center">
              <Zap className="mr-2" size={16} />
              এখনই কিনুন
            </div>
          )}
        </button>

        {/* Additional Info for ProSeller */}
        {isProseller && !isCurrentPackage && (
          <p className="text-xs text-center text-purple-600 mt-2">
            ⚡ তাৎক্ষণিক অ্যাক্টিভেশন
          </p>
        )}
      </div>
    </div>
  );
};

export default PackageCard;