import React, { useState, useEffect } from 'react';
import { Search, File, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { getBaseUrl } from '../../utils/baseurls';
import { requireAuth } from '../../utils/authUtils';
import { packageApi } from '../../utils/api/CommonApi';
import { decodeToken } from '../../utils/TokenDecoder';

const QuickSearch = ({
  searchQuery,
  setSearchQuery,
  handleQuickSearchKeyPress,
  onInputClick
}) => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Debounced API fetch
  const fetchResults = _.debounce(async (query) => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${getBaseUrl()}/api/drive/search-file/?filename=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      // console.log('API Response:', data);

      const files = data?.files || data?.results || [];
      
      // Filter to show only PDF and JPG/JPEG files
      const filteredFiles = Array.isArray(files) ? files.filter(file => {
        const fileName = file.name?.toLowerCase() || '';
        const mimeType = file.mimeType?.toLowerCase() || '';
        
        // Check if it's a PDF
        const isPdf = fileName.endsWith('.pdf') || mimeType.includes('pdf');
        
        // Check if it's a JPG/JPEG
        const isJpg = fileName.endsWith('.jpg') || 
                      fileName.endsWith('.jpeg') || 
                      mimeType.includes('jpeg') || 
                      mimeType.includes('jpg');
        
        return isPdf || isJpg;
      }) : [];
      
      setResults(filteredFiles);
      setShowDropdown(filteredFiles.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  }, 400);

  // Watch for typing
  useEffect(() => {
    fetchResults(searchQuery);
    return () => fetchResults.cancel();
  }, [searchQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        } else if (searchQuery.trim() && !showDropdown) {
          // If no dropdown, trigger the original quick search
          handleQuickSearchKeyPress(e);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelect = (item) => {
    setSearchQuery(item.name);
    setShowDropdown(false);
    setSelectedIndex(-1);
    
    // Redirect to checkout with the selected file
    handleDirectCheckout(item);
  };

  const calculatePackageForFile = async (fileCount) => {
    try {
      const token = await packageApi();
      if (!token) {
        console.log('Could not retrieve package token');
        return { totalPrice: 0, selectedPackage: null };
      }

      const decoded = decodeToken(token);
      if (!decoded) {
        console.log('Could not decode package token');
        return { totalPrice: 0, selectedPackage: null };
      }

      const packageData = decoded?.data?.[0];
      if (!packageData) {
        console.log('No package data found');
        return { totalPrice: 0, selectedPackage: null };
      }

      const regularPackages = packageData?.regular || [];
      const proPackages = packageData?.pro || [];

      const packages = [
        ...regularPackages,
        ...proPackages,
      ]
        .map((pkg) => {
          const limit = Number(pkg.file_limit || 0);
          const price = parseFloat(pkg.price_per_file || '0');
          const unitPrice = limit > 0 ? price / limit : 0;

          return {
            ...pkg,
            limit,
            unitPrice,
            price_per_file: price,
          };
        })
        .filter(pkg => pkg.limit > 0)
        .sort((a, b) => a.limit - b.limit);

      if (packages.length === 0) {
        console.log('No valid packages found');
        return { totalPrice: 0, selectedPackage: null };
      }

      // Find the appropriate package for the file count
      for (let i = 0; i < packages.length; i++) {
        const current = packages[i];
        const next = packages[i + 1];

        if (fileCount <= current.limit) {
          return {
            totalPrice: Math.ceil(fileCount * current.unitPrice),
            selectedPackage: current
          };
        }

        if (next && fileCount > current.limit && fileCount < next.limit) {
          return {
            totalPrice: Math.ceil(fileCount * current.unitPrice),
            selectedPackage: current
          };
        }
      }

      // If file count exceeds all limits, use the last package
      const lastPackage = packages[packages.length - 1];
      return {
        totalPrice: Math.ceil(fileCount * lastPackage.unitPrice),
        selectedPackage: lastPackage
      };
    } catch (error) {
      console.error('Error calculating package:', error);
      return { totalPrice: 0, selectedPackage: null };
    }
  };

  const handleDirectCheckout = async (file) => {
    // Check authentication first
    if (!requireAuth(navigate, 'order', window.location.pathname)) {
      return;
    }

    // Calculate package info for 1 file
    const { totalPrice, selectedPackage } = await calculatePackageForFile(1);

    // Prepare checkout data for single file
    const checkoutData = {
      selectedFiles: [file],
      selectedFileIds: [file.id],
      packageInfo: selectedPackage, // Now includes calculated package
      totalAmount: totalPrice, // Now includes calculated price
      fileCount: 1,
      searchInfo: {
        searchType: 'quick',
        quickSearchQuery: file.name
      },
      timestamp: new Date().toISOString(),
      directCheckout: true // Flag to indicate this is a direct checkout from search
    };

    console.log('📦 Direct checkout data:', checkoutData);

    // Navigate to checkout page
    navigate('/checkout', { 
      state: checkoutData,
      replace: false 
    });
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding dropdown to allow click events on items
    setTimeout(() => {
      setShowDropdown(false);
      setSelectedIndex(-1);
    }, 200); // Increased delay from 150ms to 200ms
  };

  const getFileIcon = (filename) => {
    const extension = filename?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return '🖼️';
    } else if (['pdf'].includes(extension)) {
      return '📄';
    } else if (['doc', 'docx'].includes(extension)) {
      return '📝';
    } else if (['xls', 'xlsx'].includes(extension)) {
      return '📊';
    } else if (['mp4', 'avi', 'mkv'].includes(extension)) {
      return '🎬';
    } else if (['mp3', 'wav', 'flac'].includes(extension)) {
      return '🎵';
    }
    return '📁';
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 font-medium">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative w-full max-w-lg mx-auto " >
      {/* Search Input */}
      <div className="relative">
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleQuickSearchKeyPress}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="দ্রুত অনুসন্ধান..."
          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl bg-white  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-all duration-200 "
          autoComplete="off"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {/* Loading State */}
          {loading && (
            <div className="px-4 py-3 text-center text-gray-500 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
                <span>খোঁজা হচ্ছে...</span>
              </div>
            </div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <div className="max-h-80 overflow-y-auto">
              {results.map((item, index) => (
                <div
                  key={index}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent blur event
                    handleSelect(item);
                  }}
                  className={`px-4 py-3 cursor-pointer transition-all duration-150 border-b border-gray-50 last:border-b-0 ${
                    selectedIndex === index
                      ? 'bg-green-50 border-l-4 border-l-green-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* File Icon */}
                    <div className="flex-shrink-0">
                      <span className="text-lg">{getFileIcon(item.name)}</span>
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {highlightText(item.name, searchQuery)}
                      </div>
                      {item.size && (
                        <div className="text-xs text-gray-500 mt-1">
                          {(item.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      )}
                      {item.modified && (
                        <div className="flex items-center space-x-1 text-xs text-gray-400 mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(item.modified).toLocaleDateString('bn-BD')}</span>
                        </div>
                      )}
                      {/* Checkout indicator */}
                      <div className="text-xs text-green-600 mt-1 font-medium">
                        ক্লিক করুন চেকআউট করতে →
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex-shrink-0">
                      <ArrowRight className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && results.length === 0 && searchQuery.trim() && (
            <div className="px-4 py-6 text-center text-gray-500">
              <File className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">কোনো ফাইল পাওয়া যায়নি</p>
              <p className="text-xs text-gray-400 mt-1">অন্য কিছু খোঁজার চেষ্টা করুন</p>
            </div>
          )}

          {/* Footer */}
          {!loading && results.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                {results.length} টি ফলাফল • ক্লিক করে সরাসরি চেকআউট করুন
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mobile Overlay */}
      {showDropdown && (
        <div className="fixed inset-0  bg-opacity-20 z-40 md:hidden" />
      )}
    </div>
  );
};

export default QuickSearch;