import React from 'react';
import { Search } from 'lucide-react';

const MobileInputField = ({
    label,
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  type = "select",
  field,
  dropdownSearchQueries = {},
  handleDropdownSearchChange = () => {},
  toggleMobileDropdown = () => {},
  mobileDropdowns = {},
  loadingStates = {},
  filterOptions = (opts, query) => opts, // default: return all
  }) => {
    if (type === "input") {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
          />
        </div>
      );
    }

    const filteredOptions = filterOptions(
      options,
      dropdownSearchQueries[field] || ""
    );

    return (
      <div className="mb-4 relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {/* Input Field */}
        <div
          className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none bg-white cursor-pointer flex justify-between items-center"
          onClick={() => toggleMobileDropdown(field)}
        >
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {value || placeholder}
          </span>
          <span className="text-gray-400">
            <svg
              height="20"
              width="20"
              viewBox="0 0 20 20"
              aria-hidden="true"
              focusable="false"
              className="css-tj5bde-Svg"
            >
              <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
            </svg>
          </span>
        </div>

        {/* Loading indicator */}
        {((field === "division" && loadingStates.divisions) ||
          (field === "district" && loadingStates.districts) ||
          (field === "upazila" && loadingStates.upazilas) ||
          (field === "surveyType" && loadingStates.khatianTypes)) && (
          <div className="mt-1 text-sm text-gray-500 flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full mr-2"></div>
            লোড হচ্ছে...
          </div>
        )}

        {/* Dropdown */}
        {mobileDropdowns[field] && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={dropdownSearchQueries[field] || ""}
                  onChange={(e) =>
                    handleDropdownSearchChange(field, e.target.value)
                  }
                  placeholder="অনুসন্ধান করুন..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors duration-150"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(option);
                    }}
                  >
                    <div className="font-medium text-gray-900">{option}</div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">
                  অনুগ্রহ করে অপেক্ষা করুন
                  
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

export default MobileInputField;