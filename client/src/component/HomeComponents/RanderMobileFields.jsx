import React from 'react';
import MobileInputField from './MobileInputField'; // Adjust the import path as needed

const MobileFieldsRenderer = ({
  getFieldsToShow,
  formData,
  handleDivisionChange,
  divisions,
  handleDistrictChange,
  districts,
  handleUpazilaChange,
  upazilas,
  handleKhatianTypeChange,
  khatianTypes,
  dropdownSearchQueries,
  handleDropdownSearchChange,
  toggleMobileDropdown,
  mobileDropdowns,
  loadingStates,
}) => {
  const fieldsCount = getFieldsToShow();

  const fieldConfigs = [
    {
      key: "division-mobile",
      label: "বিভাগ",
      value: formData.division,
      onChange: handleDivisionChange,
      options: divisions,
      placeholder: "বিভাগ নির্বাচন করুন",
      field: "division",
    },
    {
      key: "district-mobile",
      label: "জেলা",
      value: formData.district,
      onChange: handleDistrictChange,
      options: districts,
      placeholder: "জেলা নির্বাচন করুন",
      field: "district",
    },
    {
      key: "upazila-mobile",
      label: "উপজেলা",
      value: formData.upazila,
      onChange: handleUpazilaChange,
      options: upazilas,
      placeholder: "উপজেলা নির্বাচন করুন",
      field: "upazila",
    },
    {
      key: "khatianType-mobile",
      label: "খতিয়ান ধরন",
      value: formData.khatianType,
      onChange: handleKhatianTypeChange,
      options: khatianTypes,
      placeholder: "খতিয়ান ধরন নির্বাচন করুন",
      field: "khatianType",
    },
  ];

  return (
    <>
      {fieldConfigs.slice(0, fieldsCount).map((config) => (
        <MobileInputField
          key={config.key}
          label={config.label}
          value={config.value}
          onChange={config.onChange}
          options={config.options}
          placeholder={config.placeholder}
          field={config.field}
          dropdownSearchQueries={dropdownSearchQueries}
          handleDropdownSearchChange={handleDropdownSearchChange}
          toggleMobileDropdown={toggleMobileDropdown}
          mobileDropdowns={mobileDropdowns}
          loadingStates={loadingStates}
          required={true}
        />
      ))}
    </>
  );
};

export default MobileFieldsRenderer;
