import React from 'react';

const RenderDesktopFields = ({ 
  getFieldsToShow,
  formData,
  showDropdown,
  toggleDropdown,
  divisionsLoading,
  divisions,
  handleDivisionChange,
  dropdownSearchQueries,
  handleDropdownSearchChange,
  districtsLoading,
  districts,
  handleDistrictChange,
  upazilasLoading,
  upazilas,
  handleUpazilaChange,
  khatianTypesLoading,
  khatianTypes,
  handleKhatianTypeChange,
  DropdownWithSearch
}) => {
  const fieldsCount = getFieldsToShow();
  const fields = [];

  // Division field
  if (fieldsCount >= 1) {
    fields.push(
      <div key="division" className="hidden md:block" >
        <label className="block text-base font-medium text-gray-700 mb-2 uppercase tracking-wide">
          বিভাগ <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown("division");
            }}
          >
            <div className="font-bold text-gray-900 text-lg">
              {formData.division || "বিভাগ নির্বাচন করুন"}
            </div>
            {divisionsLoading && (
              <div className="text-xs text-gray-500 mt-1 flex items-center">
                <div className="animate-spin h-3 w-3 border border-green-500 border-t-transparent rounded-full mr-1"></div>
                লোড হচ্ছে...
              </div>
            )}
            <span className="text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
              </svg>
            </span>
          </div>
          {showDropdown === "division" && (
            <DropdownWithSearch
              field="division"
              options={divisions}
              onSelect={handleDivisionChange}
              searchQuery={dropdownSearchQueries.division}
              onSearchChange={handleDropdownSearchChange}
              isLoading={divisionsLoading}
              renderOption={(division) => (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{division}</div>
                    <div className="text-sm text-gray-500">বাংলাদেশ</div>
                  </div>
                  <div className="text-sm text-gray-400 font-mono">
                    {division.includes("ঢাকা") ? "DAC" : "BGD"}
                  </div>
                </div>
              )}
            />
          )}
        </div>
      </div>
    );
  }

  // District field
  if (fieldsCount >= 2) {
    fields.push(
      <div key="district" className="hidden md:block">
        <label className="block text-base font-medium text-gray-700 mb-2 uppercase tracking-wide">
          জেলা <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown("district");
            }}
          >
            <div className="font-bold text-gray-900 text-lg">
              {formData.district || "জেলা নির্বাচন করুন"}
            </div>
            {districtsLoading && (
              <div className="text-xs text-gray-500 mt-1 flex items-center">
                <div className="animate-spin h-3 w-3 border border-green-500 border-t-transparent rounded-full mr-1"></div>
                লোড হচ্ছে...
              </div>
            )}
            <span className="text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
              </svg>
            </span>
          </div>
          {showDropdown === "district" && (
            <DropdownWithSearch
              field="district"
              options={districts}
              onSelect={handleDistrictChange}
              searchQuery={dropdownSearchQueries.district}
              onSearchChange={handleDropdownSearchChange}
              isLoading={districtsLoading}
              renderOption={(district) => (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{district}</div>
                    <div className="text-sm text-gray-500">বাংলাদেশ</div>
                  </div>
                </div>
              )}
            />
          )}
        </div>
      </div>
    );
  }

  // Upazila field
  if (fieldsCount >= 3) {
    fields.push(
      <div key="upazila" className="hidden md:block">
        <label className="block text-base font-medium text-gray-700 mb-2 uppercase tracking-wide">
          উপজেলা <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown("upazila");
            }}
          >
            <div className="font-bold text-gray-900 text-lg">
              {formData.upazila || "উপজেলা নির্বাচন করুন"}
            </div>
            {upazilasLoading && (
              <div className="text-xs text-gray-500 mt-1 flex items-center">
                <div className="animate-spin h-3 w-3 border border-green-500 border-t-transparent rounded-full mr-1"></div>
                লোড হচ্ছে...
              </div>
            )}
            <span className="text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
              </svg>
            </span>
          </div>
          {showDropdown === "upazila" && (
            <DropdownWithSearch
              field="upazila"
              options={upazilas}
              onSelect={handleUpazilaChange}
              searchQuery={dropdownSearchQueries.upazila}
              onSearchChange={handleDropdownSearchChange}
              isLoading={upazilasLoading}
              renderOption={(upazila) => (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{upazila}</div>
                    <div className="text-sm text-gray-500">বাংলাদেশ</div>
                  </div>
                </div>
              )}
            />
          )}
        </div>
      </div>
    );
  }

  // Khatian Type field
  if (fieldsCount >= 4) {
    fields.push(
      <div key="khatianType" className="hidden md:block">
        <label className="block text-base font-medium text-gray-700 mb-2 uppercase tracking-wide">
          খতিয়ান ধরন <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown("khatianType");
            }}
          >
            <div className="font-bold text-gray-900 text-lg">
              {formData.khatianType || "খতিয়ান ধরন নির্বাচন করুন"}
            </div>
            {khatianTypesLoading && (
              <div className="text-xs text-gray-500 mt-1 flex items-center">
                <div className="animate-spin h-3 w-3 border border-green-500 border-t-transparent rounded-full mr-1"></div>
                লোড হচ্ছে...
              </div>
            )}
            <span className="text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
              </svg>
            </span>
          </div>
          {showDropdown === "khatianType" && (
            <DropdownWithSearch
              field="khatianType"
              options={khatianTypes}
              onSelect={handleKhatianTypeChange}
              searchQuery={dropdownSearchQueries.khatianType}
              onSearchChange={handleDropdownSearchChange}
              isLoading={khatianTypesLoading}
              renderOption={(khatianType) => (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{khatianType}</div>
                    <div className="text-sm text-gray-500">খতিয়ান ধরন</div>
                  </div>
                </div>
              )}
            />
          )}
        </div>
      </div>
    );
  }

  return (
  <
    
    
  >
    {fields}
  </>
);
};

export default RenderDesktopFields;