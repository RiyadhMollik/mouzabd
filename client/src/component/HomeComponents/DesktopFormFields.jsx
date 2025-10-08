import React from 'react';
import DropdownWithSearch from './DropdownWithSearch';

const DesktopFormFields = ({
  selectedDivision,
  selectedDistrict,
  selectedUpazila,
  selectedKhatianType,
  divisions,
  districts,
  upazilas,
  khatianTypes,
  showDropdown,
  toggleDropdown,
  dropdownSearchQueries,
  handleDropdownSearchChange,
  handleDivisionChange,
  handleDistrictChange,
  handleUpazilaChange,
  handleKhatianTypeChange,
  loadingStates
}) => {
  return (
    <>
    
    
    <div className="space-y-6 overflow-x: hidden;">
                  <div className="grid mb-4 lg:mb-0 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6" data-aos="zoom-in"
    data-aos-offset="20"
    data-aos-delay="20"
    data-aos-duration="1000"
    data-aos-easing="ease-in-out"
    data-aos-mirror="true"
    data-aos-once="false">
                    {/* বিভাগ */}
                    <div className="md:col-span-1 lg:col-span-1">
                      <label className="block text-base font-inter1 font-medium text-gray-700 mb-2 uppercase tracking-wide">
                        বিভাগ
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
                            {selectedDivision || "বিভাগ নির্বাচন করুন"}
                          </div>
                          {loadingStates.divisions && (
                            <div className="text-xs text-gray-500 mt-1 flex items-center">
                              <div className="animate-spin h-3 w-3 border border-green-500 border-t-transparent rounded-full mr-1"></div>
                              লোড হচ্ছে...
                            </div>
                          )}
                          <span className="text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2">
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
                        {showDropdown === "division" && (
                          <DropdownWithSearch
                            field="division"
                            options={divisions}
                            onSelect={handleDivisionChange}
                            searchQuery={dropdownSearchQueries.division}
                            onSearchChange={handleDropdownSearchChange}
                            isLoading={loadingStates.divisions}
                            renderOption={(division) => (
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {division}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    বাংলাদেশ
                                  </div>
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

                    {/* জেলা */}
                    <div className="md:col-span-1 lg:col-span-1">
                      <label className="block text-base font-inter1 font-medium text-gray-700 mb-2 uppercase tracking-wide">
                        জেলা
                      </label>
                      <div className="relative">
                        <div
                          className={`bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors ${
                            selectedDivision
                              ? "cursor-pointer"
                              : "cursor-not-allowed opacity-50"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedDivision) {
                              toggleDropdown("district");
                            }
                          }}
                        >
                          <div className="font-bold text-gray-900 text-lg">
                            {selectedDistrict || "জেলা নির্বাচন করুন"}
                          </div>
                          {loadingStates.districts && (
                            <div className="text-xs text-gray-500 mt-1 flex items-center">
                              <div className="animate-spin h-3 w-3 border border-green-500 border-t-transparent rounded-full mr-1"></div>
                              লোড হচ্ছে...
                            </div>
                          )}
                          <span className="text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2">
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
                        {showDropdown === "district" && selectedDivision && (
                          <DropdownWithSearch
                            field="district"
                            options={districts}
                            onSelect={handleDistrictChange}
                            searchQuery={dropdownSearchQueries.district}
                            onSearchChange={handleDropdownSearchChange}
                            isLoading={loadingStates.districts}
                            renderOption={(district) => (
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {district}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {selectedDivision}
                                  </div>
                                </div>
                              </div>
                            )}
                          />
                        )}
                      </div>
                    </div>

                    {/* উপজেলা */}
                    <div className="md:col-span-1 lg:col-span-1">
                      <label className="block text-base font-inter1 font-medium text-gray-700 mb-2 uppercase tracking-wide">
                        উপজেলা
                      </label>
                      <div className="relative">
                        <div
                          className={`bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors ${
                            selectedDistrict
                              ? "cursor-pointer"
                              : "cursor-not-allowed opacity-50"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedDistrict) {
                              toggleDropdown("upazila");
                            }
                          }}
                        >
                          <div className="font-bold text-gray-900 text-lg">
                            {selectedUpazila || "উপজেলা নির্বাচন করুন"}
                          </div>
                          {loadingStates.upazilas && (
                            <div className="text-xs text-gray-500 mt-1 flex items-center">
                              <div className="animate-spin h-3 w-3 border border-green-500 border-t-transparent rounded-full mr-1"></div>
                              লোড হচ্ছে...
                            </div>
                          )}
                          <span className="text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2">
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
                        {showDropdown === "upazila" && selectedDistrict && (
                          <DropdownWithSearch
                            field="upazila"
                            options={upazilas}
                            onSelect={handleUpazilaChange}
                            searchQuery={dropdownSearchQueries.upazila}
                            onSearchChange={handleDropdownSearchChange}
                            isLoading={loadingStates.upazilas}
                            renderOption={(upazila) => (
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {upazila}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {selectedDistrict}
                                  </div>
                                </div>
                              </div>
                            )}
                          />
                        )}
                      </div>
                    </div>

                    {/* সার্ভে টাইপ */}
                    <div className="md:col-span-1 lg:col-span-1">
                      <label className="block text-base font-inter1 font-medium text-gray-700 mb-2 uppercase tracking-wide">
                        সার্ভে টাইপ
                      </label>
                      <div className="relative">
                        <div
                          className={`bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors ${
                            selectedUpazila
                              ? "cursor-pointer"
                              : "cursor-not-allowed opacity-50"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedUpazila) {
                              toggleDropdown("surveyType");
                            }
                          }}
                        >
                          <div className="font-bold text-gray-900 text-lg">
                            {selectedKhatianType || "সার্ভে টাইপ নির্বাচন করুন"}
                          </div>
                          {loadingStates.khatianTypes && (
                            <div className="text-xs text-gray-500 mt-1 flex items-center">
                              <div className="animate-spin h-3 w-3 border border-green-500 border-t-transparent rounded-full mr-1"></div>
                              লোড হচ্ছে...
                            </div>
                          )}
                          <span className="text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2">
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
                        {showDropdown === "surveyType" && selectedUpazila && (
                          <DropdownWithSearch
                            field="surveyType"
                            options={khatianTypes}
                            onSelect={handleKhatianTypeChange}
                            searchQuery={dropdownSearchQueries.surveyType}
                            onSearchChange={handleDropdownSearchChange}
                            isLoading={loadingStates.khatianTypes}
                            renderOption={(type) => (
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {type}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    খতিয়ান ধরন
                                  </div>
                                </div>
                              </div>
                            )}
                          />
                        )}
                      </div>
                    </div>
                  </div>

           
                </div>
    </>
  );
};

export default DesktopFormFields;