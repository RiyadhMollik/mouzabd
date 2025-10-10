/**
 * Package Management Service
 * Handles all package-related API calls
 */
import axios from 'axios';
import { getBaseUrl } from '../utils/baseurls';
import { getToken } from '../utils/authUtils';

class PackageService {
  // Helper method to get authorization headers
  getAuthHeaders() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Get all available packages
  async getAvailablePackages() {
    try {
      const response = await axios.get(`${getBaseUrl()}/api/packages/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching packages:', error);
      throw error;
    }
  }

  // Get package details by ID
  async getPackageDetails(packageId) {
    try {
      const response = await axios.get(`${getBaseUrl()}/api/packages/${packageId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching package details:', error);
      throw error;
    }
  }

  // Purchase a package
  async purchasePackage(packageId, paymentMethod = 'eps') {
    try {
      console.log('Attempting to purchase package:', packageId);
      console.log('Auth headers:', this.getAuthHeaders());
      
      const response = await axios.post(`${getBaseUrl()}/api/packages/purchase/`, {
        package_id: packageId,
        payment_method: paymentMethod
      }, {
        headers: this.getAuthHeaders()
      });
      
      console.log('Purchase response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error purchasing package:', error);
      console.error('Error response:', error.response?.data);
      
      // If it's a network error or backend is down
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Backend server is not running. Please start the Django server.');
      }
      
      // If it's an authentication error
      if (error.response?.status === 401) {
        throw new Error('Please log in to purchase packages.');
      }
      
      // If it's a validation error
      if (error.response?.status === 400) {
        const message = error.response?.data?.message || 'Invalid request data';
        throw new Error(message);
      }
      
      // Generic error with backend response
      const message = error.response?.data?.message || error.message || 'Unknown error occurred';
      throw new Error(message);
    }
  }

  // Get user's packages (current and history)
  async getUserPackages() {
    try {
      const response = await axios.get(`${getBaseUrl()}/api/user/packages/`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user packages:', error);
      throw error;
    }
  }

  // Get user's package usage stats
  async getUserPackageUsage() {
    try {
      const response = await axios.get(`${getBaseUrl()}/api/user/packages/usage/`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching package usage:', error);
      throw error;
    }
  }

  // Daily Order Limit Methods

  // Get daily order status
  async getDailyOrderStatus() {
    try {
      const response = await axios.get(`${getBaseUrl()}/api/user/packages/daily-status/`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching daily order status:', error);
      throw error;
    }
  }

  // Validate if user can place an order (reserves slot if available)
  async validateOrderLimit(fileCount = 1) {
    try {
      const response = await axios.post(`${getBaseUrl()}/api/user/packages/validate-order/`, {
        file_count: fileCount
      }, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error validating order limit:', error);
      throw error;
    }
  }

  // Get daily usage history
  async getDailyUsageHistory() {
    try {
      const response = await axios.get(`${getBaseUrl()}/api/user/packages/usage-history/`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching usage history:', error);
      throw error;
    }
  }

  // Check if user has an active package with daily limits
  async hasActivePackageWithLimits() {
    try {
      const packageData = await this.getUserPackages();
      if (packageData?.current_package && packageData.current_package.package) {
        const dailyLimit = packageData.current_package.package.daily_order_limit;
        return {
          hasPackage: true,
          hasLimits: dailyLimit > 0,
          dailyLimit: dailyLimit,
          packageName: packageData.current_package.package.name
        };
      }
      return {
        hasPackage: false,
        hasLimits: false,
        dailyLimit: 0,
        packageName: null
      };
    } catch (error) {
      console.error('Error checking package status:', error);
      return {
        hasPackage: false,
        hasLimits: false,
        dailyLimit: 0,
        packageName: null
      };
    }
  }

  // Get user's package usage
  async getPackageUsage() {
    try {
      const response = await axios.get(`${getBaseUrl()}/api/user/packages/usage/`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching package usage:', error);
      throw error;
    }
  }

  // Calculate days until expiration
  getDaysUntilExpiration(expirationDate) {
    const now = new Date();
    const expiry = new Date(expirationDate);
    const timeDiff = expiry.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  }

  // Get user-friendly duration display
  getDurationDisplay(durationType, durationDays = null) {
    switch (durationType) {
      case 'monthly':
        return '30 Days';
      case 'yearly':
        return '1 Year';
      case 'lifetime':
        return 'Lifetime';
      default:
        return `${durationDays} Days`;
    }
  }

  // Check if package is popular
  isPopular(packageData) {
    return packageData.is_popular;
  }

  /**
   * Format price in Bangladeshi Taka
   * @param {number} price - Price amount
   * @returns {string} Formatted price string
   */
  static formatPrice(price) {
    return `৳${price.toLocaleString('bn-BD')}`;
  }

  /**
   * Get duration display text
   * @param {string} durationType - Duration type (monthly, yearly, lifetime)
   * @returns {string} Duration display text
   */
  static getDurationDisplay(durationType) {
    const durations = {
      'monthly': 'প্রতি মাস',
      'yearly': 'প্রতি বছর',
      'lifetime': 'আজীবন'
    };
    return durations[durationType] || durationType;
  }

  // Process a free order within daily limits
  async processFreeOrder(orderData) {
    try {
      const response = await axios.post(`${getBaseUrl()}/api/user/packages/process-free-order/`, orderData, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error processing free order:', error);
      throw error;
    }
  }

  /**
   * Get package type color classes
   * @param {string} packageType - Package type (regular, proseller)
   * @returns {string} CSS classes for styling
   */
  static getPackageTypeColor(packageType) {
    return packageType === 'proseller' 
      ? 'bg-purple-100 text-purple-800'
      : 'bg-blue-100 text-blue-800';
  }
}

export default new PackageService();