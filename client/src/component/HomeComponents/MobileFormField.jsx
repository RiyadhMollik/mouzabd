import React from 'react';
import MobileInputField from './MobileInputField';

const MobileFormField = ({selectedDivision,handleDivisionChange,divisions,filterOptions,loadingStates,mobileDropdowns,toggleMobileDropdown,handleDropdownSearchChange,dropdownSearchQueries,khatianTypes,handleKhatianTypeChange,selectedKhatianType,upazilas,handleUpazilaChange,selectedUpazila,districts,handleDistrictChange,selectedDistrict}) => {
    return (
        <>
            <div className="space-y-4">
                  <MobileInputField
                    label="বিভাগ"
                    value={selectedDivision}
                    onChange={handleDivisionChange}
                    options={divisions}
                    placeholder="বিভাগ নির্বাচন করুন"
                    required={true}
                    field="division"
                     dropdownSearchQueries={dropdownSearchQueries}
                      handleDropdownSearchChange={handleDropdownSearchChange}
                      toggleMobileDropdown={toggleMobileDropdown}
                      mobileDropdowns={mobileDropdowns}
                      loadingStates={loadingStates}
                      filterOptions={filterOptions}
                  />

                  <MobileInputField
                    label="জেলা"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    options={districts}
                    placeholder="জেলা নির্বাচন করুন"
                    required={true}
                    field="district"
                     dropdownSearchQueries={dropdownSearchQueries}
  handleDropdownSearchChange={handleDropdownSearchChange}
  toggleMobileDropdown={toggleMobileDropdown}
  mobileDropdowns={mobileDropdowns}
  loadingStates={loadingStates}
  filterOptions={filterOptions}
                  />

                  <MobileInputField
                    label="উপজেলা"
                    value={selectedUpazila}
                    onChange={handleUpazilaChange}
                    options={upazilas}
                    placeholder="উপজেলা নির্বাচন করুন"
                    required={true}
                    field="upazila"
                     dropdownSearchQueries={dropdownSearchQueries}
  handleDropdownSearchChange={handleDropdownSearchChange}
  toggleMobileDropdown={toggleMobileDropdown}
  mobileDropdowns={mobileDropdowns}
  loadingStates={loadingStates}
  filterOptions={filterOptions}
                  />

                  <MobileInputField
                    label="সার্ভে টাইপ"
                    value={selectedKhatianType}
                    onChange={handleKhatianTypeChange}
                    options={khatianTypes}
                    placeholder="সার্ভে টাইপ নির্বাচন করুন"
                    required={true}
                    field="surveyType"
                     dropdownSearchQueries={dropdownSearchQueries}
  handleDropdownSearchChange={handleDropdownSearchChange}
  toggleMobileDropdown={toggleMobileDropdown}
  mobileDropdowns={mobileDropdowns}
  loadingStates={loadingStates}
  filterOptions={filterOptions}
                  />
                </div>
        </>
    );
}

export default MobileFormField;
