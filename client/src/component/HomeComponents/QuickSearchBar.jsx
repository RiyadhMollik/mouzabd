import React from 'react';
import { Search } from 'lucide-react';

const QuickSearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  handleQuickSearch, 
  handleQuickSearchKeyPress,
  isQuickSearchLoading 
}) => {
  return (
    <div className="flex justify-center -mb-8">
      <div className="bg-white rounded-sm shadow-sm lg:w-full max-w-lg">
        <div className="flex flex-col sm:flex-row items-center justify-center p-4">
          <div className="w-full sm:w-auto">
            <div className="relative flex justify-center w-full sm:w-106">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleQuickSearchKeyPress}
                placeholder="দ্রুত অনুসন্ধান..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSearchBar;