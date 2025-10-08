/**
 * Package Selection Page
 * Displays available packages and handles package purchases
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreditCard, Shield, Zap, Crown, ArrowLeft, Check } from 'lucide-react';
import PackageCard from '../../component/packagecomponent/PackageCard';
import PackageService from '../../services/PackageService';

const PackageSelectionPage = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [userPackages, setUserPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);

  // Load packages and user's current packages
  useEffect(() => {
    loadPackageData();
  }, []);

  const loadPackageData = async () => {
    try {
      setLoading(true);
      const [availablePackages, currentPackages] = await Promise.all([
        PackageService.getAvailablePackages(),
        PackageService.getUserPackages()
      ]);
      
      // Handle the case where API might return an object instead of array
      console.log('Available packages response:', availablePackages);
      console.log('Current packages response:', currentPackages);
      
      const packagesArray = Array.isArray(availablePackages) ? availablePackages : availablePackages?.packages || [];
      const userPackagesArray = Array.isArray(currentPackages) ? currentPackages : currentPackages?.packages || [];
      
      setPackages(packagesArray);
      setUserPackages(userPackagesArray);
    } catch (error) {
      toast.error('প্যাকেজ তথ্য লোড করতে সমস্যা হয়েছে');
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePackagePurchase = async (packageData) => {
    try {
      setSelectedPackageId(packageData.id);
      setPurchaseLoading(true);

      const purchaseResponse = await PackageService.purchasePackage(packageData.id);
      
      if (purchaseResponse.payment_url) {
        // Redirect to EPS payment
        toast.success('পেমেন্ট গেটওয়েতে রিডিরেক্ট করা হচ্ছে...');
        window.location.href = purchaseResponse.payment_url;
      } else {
        toast.error('পেমেন্ট URL পাওয়া যায়নি');
      }
    } catch (error) {
      toast.error(error.message || 'প্যাকেজ কেনার সময় সমস্যা হয়েছে');
      console.error('Package purchase error:', error);
    } finally {
      setPurchaseLoading(false);
      setSelectedPackageId(null);
    }
  };

  const getCurrentPackage = () => {
    // Ensure userPackages is an array before using find
    if (!Array.isArray(userPackages)) {
      console.warn('UserPackages is not an array:', userPackages);
      return null;
    }
    return userPackages.find(pkg => pkg.is_active) || null;
  };

  const groupPackagesByType = () => {
    // Ensure packages is an array before filtering
    if (!Array.isArray(packages)) {
      console.warn('Packages is not an array:', packages);
      return { regular: [], proseller: [] };
    }
    
    const regular = packages.filter(pkg => pkg.package_type === 'regular');
    const proseller = packages.filter(pkg => pkg.package_type === 'proseller');
    return { regular, proseller };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">প্যাকেজ লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const { regular, proseller } = groupPackagesByType();
  const currentPackage = getCurrentPackage();

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
                <h1 className="text-2xl font-bold text-gray-900">প্যাকেজ নির্বাচন</h1>
                <p className="text-gray-600 mt-1">আপনার প্রয়োজন অনুযায়ী সেরা প্যাকেজ বেছে নিন</p>
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
        {/* Current Package Info */}
        {currentPackage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="text-white" size={20} />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-green-900">
                  আপনার বর্তমান প্যাকেজ: {currentPackage.package.name}
                </h3>
                <p className="text-green-700 text-sm">
                  মেয়াদ শেষ: {new Date(currentPackage.expires_at).toLocaleDateString('bn-BD')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Regular Packages */}
        {regular.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">রেগুলার প্যাকেজ</h2>
              <p className="text-gray-600">মৌলিক ফিচারসহ সাশ্রয়ী প্যাকেজ</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regular.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  packageData={pkg}
                  onPurchase={handlePackagePurchase}
                  isLoading={purchaseLoading && selectedPackageId === pkg.id}
                  currentPackage={currentPackage}
                />
              ))}
            </div>
          </div>
        )}

        {/* ProSeller Packages */}
        {proseller.length > 0 && (
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
                <PackageCard
                  key={pkg.id}
                  packageData={pkg}
                  onPurchase={handlePackagePurchase}
                  isLoading={purchaseLoading && selectedPackageId === pkg.id}
                  currentPackage={currentPackage}
                />
              ))}
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">কেন আমাদের প্যাকেজ বেছে নেবেন?</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="text-blue-600" size={24} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">নিরাপদ পেমেন্ট</h4>
              <p className="text-gray-600 text-sm">EPS পেমেন্ট গেটওয়ে দিয়ে সম্পূর্ণ নিরাপদ লেনদেন</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-green-600" size={24} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">তাৎক্ষণিক অ্যাক্টিভেশন</h4>
              <p className="text-gray-600 text-sm">পেমেন্ট সম্পন্ন হলেই আপনার প্যাকেজ সক্রিয় হয়ে যাবে</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-purple-600" size={24} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">24/7 সাপোর্ট</h4>
              <p className="text-gray-600 text-sm">যেকোনো সমস্যায় আমরা আছি আপনার পাশে</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            কোনো প্রশ্ন আছে? 
            <button 
              onClick={() => navigate('/contact')}
              className="text-blue-600 hover:text-blue-700 font-medium ml-1"
            >
              আমাদের সাথে যোগাযোগ করুন
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PackageSelectionPage;