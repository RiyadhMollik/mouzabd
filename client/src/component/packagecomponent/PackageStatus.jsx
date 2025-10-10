/**
 * Package Status Component
 * Displays current package status in user profile
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Package, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Clock
} from 'lucide-react';
import PackageService from '../../services/PackageService';
import { getToken } from '../../utils/authUtils';

const PackageStatus = ({ className = "" }) => {
  const navigate = useNavigate();
  const [currentPackage, setCurrentPackage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Utility function for price formatting
  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `৳${numPrice.toLocaleString('bn-BD')}`;
  };

  useEffect(() => {
    loadCurrentPackage();
  }, []);

  const loadCurrentPackage = async () => {
    try {
      // Check if user is authenticated
      const token = getToken();
      if (!token) {
        setCurrentPackage(null);
        return;
      }

      const packages = await PackageService.getUserPackages();
      const active = packages.find(pkg => pkg.is_active);
      setCurrentPackage(active);
    } catch (error) {
      console.error('Error loading current package:', error);
      setCurrentPackage(null);
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const timeDiff = expiry.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const getStatusDisplay = () => {
    if (!currentPackage) return null;
    
    const daysRemaining = getDaysRemaining(currentPackage.expires_at);
    
    if (daysRemaining <= 0) {
      return {
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: <AlertCircle size={16} />,
        status: 'মেয়াদ শেষ',
        message: 'প্যাকেজের মেয়াদ শেষ হয়ে গেছে'
      };
    } else if (daysRemaining <= 7) {
      return {
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: <AlertCircle size={16} />,
        status: 'জরুরি নবায়ন',
        message: `${daysRemaining} দিন বাকি`
      };
    } else if (daysRemaining <= 30) {
      return {
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        icon: <Clock size={16} />,
        status: 'নবায়ন প্রয়োজন',
        message: `${daysRemaining} দিন বাকি`
      };
    } else {
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: <CheckCircle size={16} />,
        status: 'সক্রিয়',
        message: `${daysRemaining} দিন বাকি`
      };
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!currentPackage) {
    return (
      <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Package className="text-gray-400 mr-3" size={20} />
            <div>
              <h3 className="font-semibold text-gray-900">কোনো প্যাকেজ নেই</h3>
              <p className="text-sm text-gray-600">আমাদের সেবা উপভোগ করতে প্যাকেজ কিনুন</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/packages')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
          >
            <Zap className="mr-1" size={14} />
            কিনুন
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusDisplay();
  const isProseller = currentPackage.package.package_type === 'proseller';

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {isProseller && <Crown className="text-purple-600 mr-2" size={20} />}
          <h3 className="font-semibold text-gray-900">বর্তমান প্যাকেজ</h3>
        </div>
        <button
          onClick={() => navigate('/packages/dashboard')}
          className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
        >
          বিস্তারিত
          <ArrowRight className="ml-1" size={14} />
        </button>
      </div>

      <div className="space-y-3">
        {/* Package Name */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">প্যাকেজ:</span>
          <span className="font-medium text-gray-900">{currentPackage.package.name}</span>
        </div>

        {/* Package Price */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">মূল্য:</span>
          <span className="font-medium text-gray-900">
            {formatPrice(currentPackage.package.price)}
          </span>
        </div>

        {/* Status */}
        <div className={`flex items-center justify-between p-3 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
          <div className="flex items-center">
            <span className={statusInfo.color}>{statusInfo.icon}</span>
            <span className={`ml-2 font-medium ${statusInfo.color}`}>{statusInfo.status}</span>
          </div>
          <span className={`text-sm ${statusInfo.color}`}>{statusInfo.message}</span>
        </div>

        {/* Expiry Date */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">মেয়াদ শেষ:</span>
          <span className="text-sm text-gray-900">
            {new Date(currentPackage.expires_at).toLocaleDateString('bn-BD')}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button
          onClick={() => navigate('/packages')}
          className="bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <Zap className="mr-1" size={14} />
          আপগ্রেড
        </button>
        <button
          onClick={() => navigate('/packages/dashboard')}
          className="bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors flex items-center justify-center"
        >
          <Calendar className="mr-1" size={14} />
          ড্যাশবোর্ড
        </button>
      </div>

      {/* Renewal Warning */}
      {getDaysRemaining(currentPackage.expires_at) <= 30 && (
        <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-center">
          <p className="text-xs text-yellow-800">
            নিরবচ্ছিন্ন সেবার জন্য সময়মতো নবায়ন করুন
          </p>
        </div>
      )}
    </div>
  );
};

export default PackageStatus;