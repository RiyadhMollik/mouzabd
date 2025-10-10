/**
 * Daily Order Status Component
 * Shows user's daily order limit status and usage
 */
import React, { useState, useEffect } from 'react';
import { Clock, Check, AlertCircle, Zap, Calendar } from 'lucide-react';
import PackageService from '../../services/PackageService';

const DailyOrderStatus = ({ className = "", showDetails = true }) => {
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrderStatus();
  }, []);

  const loadOrderStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user has an active package
      const packageInfo = await PackageService.hasActivePackageWithLimits();
      
      if (!packageInfo.hasPackage) {
        setOrderStatus({
          hasPackage: false,
          message: 'No active package found'
        });
        return;
      }

      if (!packageInfo.hasLimits) {
        setOrderStatus({
          hasPackage: true,
          hasLimits: false,
          isUnlimited: true,
          packageName: packageInfo.packageName,
          message: 'Unlimited orders available'
        });
        return;
      }

      // Get detailed status for packages with limits
      const statusResponse = await PackageService.getDailyOrderStatus();
      
      if (statusResponse.success) {
        setOrderStatus({
          hasPackage: true,
          hasLimits: true,
          ...statusResponse.daily_order_status
        });
      } else {
        setError(statusResponse.message || 'Failed to load order status');
      }
    } catch (err) {
      console.error('Error loading order status:', err);
      setError('Unable to load order status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!orderStatus || !orderStatus.hasLimits) return 'text-green-600';
    
    if (orderStatus.can_order) {
      if (orderStatus.remaining_orders > 5) return 'text-green-600';
      if (orderStatus.remaining_orders > 2) return 'text-yellow-600';
      return 'text-orange-600';
    }
    return 'text-red-600';
  };

  const getStatusIcon = () => {
    if (!orderStatus) return <Clock className="w-4 h-4" />;
    
    if (!orderStatus.hasPackage) return <AlertCircle className="w-4 h-4" />;
    if (!orderStatus.hasLimits || orderStatus.isUnlimited) return <Zap className="w-4 h-4" />;
    if (orderStatus.can_order) return <Check className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getStatusMessage = () => {
    if (!orderStatus) return 'Loading...';
    
    if (!orderStatus.hasPackage) {
      return 'No active package';
    }
    
    if (!orderStatus.hasLimits || orderStatus.isUnlimited) {
      return 'Unlimited orders';
    }
    
    if (orderStatus.can_order) {
      return `${orderStatus.remaining_orders} free orders remaining`;
    }
    
    return 'Daily limit reached';
  };

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-100 rounded-lg p-3 ${className}`}>
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 text-red-600 rounded-lg p-3 text-sm ${className}`}>
        <div className="flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={getStatusColor()}>
              {getStatusIcon()}
            </div>
            <span className={`ml-2 text-sm font-medium ${getStatusColor()}`}>
              {getStatusMessage()}
            </span>
          </div>
          
          {orderStatus?.hasLimits && showDetails && (
            <div className="text-xs text-gray-500">
              {orderStatus.orders_used_today}/{orderStatus.daily_limit}
            </div>
          )}
        </div>

        {showDetails && orderStatus?.hasLimits && (
          <div className="mt-2 space-y-2">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  orderStatus.can_order ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ 
                  width: `${Math.min(100, (orderStatus.orders_used_today / orderStatus.daily_limit) * 100)}%` 
                }}
              ></div>
            </div>

            {/* Details */}
            <div className="flex justify-between text-xs text-gray-600">
              <span>Used: {orderStatus.orders_used_today}</span>
              <span>Limit: {orderStatus.daily_limit}</span>
            </div>
          </div>
        )}

        {orderStatus?.package_name && (
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            {orderStatus.package_name} Package
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyOrderStatus;