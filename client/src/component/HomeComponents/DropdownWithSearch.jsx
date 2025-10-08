import React from "react";
import { Search } from "lucide-react";

// Optional default filter function if not provided
const defaultFilterOptions = (options, query) =>
  options.filter((opt) =>
    opt.toLowerCase().includes(query.toLowerCase())
  );

const DropdownWithSearch = ({
  field,
  options,
  placeholder = "অনুসন্ধান করুন...",
  onSelect,
  searchQuery,
  onSearchChange,
  renderOption,
  isLoading = false,
  filterOptions = defaultFilterOptions,
}) => {
  const filteredOptions = filterOptions(options, searchQuery);

  return (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
      {/* Search Input */}
      <div className="p-3 border-b border-gray-100 bg-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(field, e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* Options List */}
      <div className="max-h-48 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center p-4">
            <div className="animate-spin h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredOptions.length > 0 ? (
          filteredOptions.map((option, index) => (
            <div
              key={index}
              className="p-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors duration-150"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(option);
              }}
            >
              {renderOption ? (
                renderOption(option)
              ) : (
                <div className="font-medium text-gray-900">{option}</div>
              )}
            </div>
          ))
        ) : (
          <div className="p-3 text-center text-gray-500">
            অনুগ্রহ করে অপেক্ষা করুন
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownWithSearch;
