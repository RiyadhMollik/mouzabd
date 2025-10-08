/**
 * User Package Dashboard
 * Displays current package, usage stats, and package history
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Crown, 
  Calendar, 
  TrendingUp, 
  Package, 
  CreditCard, 
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import PackageService from '../../services/PackageService';

const UserPackageDashboard = () => {
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserPackages();
  }, []);

  const loadUserPackages = async () => {
    try {
      setLoading(true);
      const response = await PackageService.getUserPackages();
      console.log('User packages response:', response); // Debug log
      setPackageData(response);
    } catch (error) {
      toast.error('প্যাকেজ তথ্য লোড করতে সমস্যা হয়েছে');
      console.error('Error loading user packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadUserPackages();
      toast.success('তথ্য আপডেট হয়েছে');
    } catch (error) {
      toast.error('রিফ্রেশ করতে সমস্যা হয়েছে');
    } finally {
      setRefreshing(false);
    }
  };

  const getCurrentPackage = () => {
    return packageData?.current_package || null;
  };

  const getPackageHistory = () => {
    const history = packageData?.package_history || [];
    return history.filter(pkg => !pkg.is_active).sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
  };

  // Utility function for price formatting
  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `৳${numPrice.toLocaleString('bn-BD')}`;
  };

  const getDaysRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const timeDiff = expiry.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const getStatusColor = (isActive, expiresAt) => {
    if (!isActive) return 'text-gray-500';
    const daysRemaining = getDaysRemaining(expiresAt);
    if (daysRemaining <= 7) return 'text-red-500';
    if (daysRemaining <= 30) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = (isActive, expiresAt) => {
    if (!isActive) return <Clock className="text-gray-500" size={16} />;
    const daysRemaining = getDaysRemaining(expiresAt);
    if (daysRemaining <= 7) return <AlertCircle className="text-red-500" size={16} />;
    return <CheckCircle className="text-green-500" size={16} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">প্যাকেজ তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const currentPackage = getCurrentPackage();
  const packageHistory = getPackageHistory();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">আমার প্যাকেজ</h1>
              <p className="text-gray-600 mt-1">প্যাকেজ তথ্য ও ব্যবহারের বিবরণ</p>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} size={16} />
              রিফ্রেশ
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Current Package */}
        {currentPackage ? (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">বর্তমান প্যাকেজ</h2>
              {getStatusIcon(currentPackage.is_active, currentPackage.expires_at)}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Package Info */}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  {currentPackage.package.package_type === 'proseller' && (
                    <Crown className="text-purple-600 mr-2" size={20} />
                  )}
                  <Package className="text-blue-600" size={20} />
                </div>
                <h3 className="font-semibold text-gray-900">{currentPackage.package.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {formatPrice(currentPackage.package.price)}
                </p>
              </div>

              {/* Status */}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <TrendingUp className="text-green-600 mx-auto mb-2" size={20} />
                <h3 className="font-semibold text-gray-900">স্ট্যাটাস</h3>
                <p className={`text-sm mt-1 ${getStatusColor(currentPackage.is_active, currentPackage.expires_at)}`}>
                  {currentPackage.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                </p>
              </div>

              {/* Expiry */}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="text-orange-600 mx-auto mb-2" size={20} />
                <h3 className="font-semibold text-gray-900">মেয়াদ শেষ</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(currentPackage.expires_at).toLocaleDateString('bn-BD')}
                </p>
                {currentPackage.is_active && (
                  <p className={`text-xs mt-1 ${getStatusColor(currentPackage.is_active, currentPackage.expires_at)}`}>
                    {getDaysRemaining(currentPackage.expires_at)} দিন বাকি
                  </p>
                )}
              </div>

              {/* Purchase Date */}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <CreditCard className="text-blue-600 mx-auto mb-2" size={20} />
                <h3 className="font-semibold text-gray-900">ক্রয়ের তারিখ</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(currentPackage.created_at).toLocaleDateString('bn-BD')}
                </p>
              </div>
            </div>

            {/* Package Features */}
            {currentPackage.package.features_list && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">প্যাকেজ ফিচারসমূহ:</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {currentPackage.package.features_list.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="text-green-500 mr-2 flex-shrink-0" size={14} />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Renewal Alert */}
            {currentPackage.is_active && getDaysRemaining(currentPackage.expires_at) <= 30 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="text-yellow-600 mr-2" size={16} />
                  <p className="text-sm text-yellow-800">
                    আপনার প্যাকেজের মেয়াদ শীঘ্রই শেষ হবে। নিরবচ্ছিন্ন সেবার জন্য নতুন প্যাকেজ কিনুন।
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* No Active Package */
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={48} />
            <h2 className="text-xl font-bold text-gray-900 mb-2">কোনো সক্রিয় প্যাকেজ নেই</h2>
            <p className="text-gray-600 mb-6">
              আমাদের সেবা উপভোগ করতে একটি প্যাকেজ কিনুন
            </p>
            <button
              onClick={() => navigate('/packages')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
            >
              প্যাকেজ দেখুন
              <ArrowRight className="ml-2" size={16} />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate('/packages')}
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Package className="mr-2" size={20} />
            নতুন প্যাকেজ কিনুন
          </button>
          
          <button
            onClick={() => navigate('/profile')}
            className="bg-gray-600 text-white p-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <TrendingUp className="mr-2" size={20} />
            প্রোফাইল দেখুন
          </button>
        </div>

        {/* Package History */}
        {packageHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">প্যাকেজ ইতিহাস</h3>
            
            <div className="space-y-4">
              {packageHistory.map((pkg) => (
                <div key={pkg.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    {pkg.package.package_type === 'proseller' && (
                      <Crown className="text-purple-600 mr-3" size={16} />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{pkg.package.name}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(pkg.created_at).toLocaleDateString('bn-BD')} - {' '}
                        {new Date(pkg.expires_at).toLocaleDateString('bn-BD')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatPrice(pkg.package.price)}
                    </p>
                    <p className="text-sm text-gray-500">মেয়াদ শেষ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPackageDashboard;