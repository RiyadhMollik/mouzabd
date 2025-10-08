import React, { useState, useEffect } from 'react';
import { Search, File, Clock, ArrowRight } from 'lucide-react';
import _ from 'lodash';
import { getBaseUrl } from '../../utils/baseurls';

const QuickSearch = ({
  searchQuery,
  setSearchQuery,
  handleQuickSearchKeyPress,
  onInputClick
}) => {
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
      setResults(Array.isArray(files) ? files : []);
      setShowDropdown(Array.isArray(files) && files.length > 0);
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
        if (selectedIndex >= 0) {
          handleSelect(results[selectedIndex]);
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
    }, 150);
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
                  onClick={() => handleSelect(item)}
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
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex-shrink-0">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
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
                {results.length} টি ফলাফল • ↑↓ দিয়ে নেভিগেট করুন, Enter দিয়ে নির্বাচন করুন
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