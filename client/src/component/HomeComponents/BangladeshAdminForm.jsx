import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import DropdownWithSearch from './DropdownWithSearch';
import MobileInputField from './MobileInputField';
import { fetchDistricts, fetchDivisions, fetchUpazilas, fetchKhatianTypes } from '../../utils/api/AdvancedSearch';
import { packageApi } from '../../utils/api/CommonApi';
import { decodeToken } from '../../utils/TokenDecoder';
import RenderDesktopFields from './RanderDesktopFields';
import MobileFieldsRenderer from './RanderMobileFields';

// Enhanced usePackageData hook with better error handling and retry logic
export const usePackageData = () => {
  return useQuery({
    queryKey: ['packageData'],
    queryFn: async () => {
      console.log('🔄 Fetching package data...'); // Debug log
      
      try {
        const token = await packageApi();
        
        if (!token) {
          throw new Error('Could not retrieve token');
        }
        
        const decoded = decodeToken(token);
        console.log('✅ Package data decoded:', decoded);
        
        if (!decoded) {
          throw new Error('Could not decode token');
        }
        
        return decoded;
      } catch (error) {
        console.error('❌ Error fetching package data:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 3, // Increased retry attempts
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true, // Changed to true to refetch on focus
    refetchOnMount: true, // Changed to true to ensure fresh data on mount
    refetchOnReconnect: true,
    refetchInterval: false,
    // Add network mode to handle offline scenarios
    networkMode: 'online',
    // Add error retry condition
    retryOnMount: true,
  });
};
const aosAttributes = {
  "data-aos": "zoom-out",
  "data-aos-offset": "20",
  "data-aos-delay": "20",
  "data-aos-duration": "1000",
  "data-aos-easing": "ease-in-out",
  "data-aos-mirror": "true",
  "data-aos-once": "false"
};

// Query keys
const queryKeys = {
  divisions: ['divisions'],
  districts: (divisionId) => ['districts', divisionId],
  upazilas: (divisionId, districtId) => ['upazilas', divisionId, districtId],
  khatianTypes: (divisionId, districtId, upazilaId) => ['khatianTypes', divisionId, districtId, upazilaId],
};

// Main Component
const BangladeshAdminForm = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('2');
  
  const [showDropdown, setShowDropdown] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({
    division: '',
    district: '',
    upazila: '',
    khatianType: ''
  });

  const [dropdownSearchQueries, setDropdownSearchQueries] = useState({
    division: '',
    district: '',
    upazila: '',
    khatianType: ''
  });

  const [mobileDropdowns, setMobileDropdowns] = useState({
    division: false,
    district: false,
    upazila: false,
    khatianType: false
  });

  // Get selected values for dependent queries
  const selectedDivision = formData.division;
  const selectedDistrict = formData.district;
  const selectedUpazila = formData.upazila;

  const options = [
    { value: '0', label: 'বাংলাদেশ', fields: 0, packageField: 'Bangladesh' },
    { value: '1', label: 'বিভাগ', fields: 1, packageField: 'Division' },
    { value: '2', label: 'জেলা', fields: 2, packageField: 'District Package' },
    { value: '3', label: 'উপজেলা', fields: 3, packageField: 'subdistrict' },
    //{ value: '4', label: 'খতিয়ান ধরন', fields: 4, packageField: 'survey Type' }, 
  ];

  // Enhanced package data query with better loading states
  const { 
    data: packageData, 
    isLoading: packageLoading, 
    isError: packageError, 
    error: packageErrorDetails,
    isFetching: packageFetching,
    refetch: refetchPackageData,
    isSuccess: packageSuccess
  } = usePackageData();

  // Debug logging for package data
  useEffect(() => {
    console.log('Package Loading:', packageLoading);
    console.log('Package Success:', packageSuccess);
    console.log('Package Data:', packageData);
    console.log('Package Error:', packageError);
    if (packageErrorDetails) {
      console.error('Package Error Details:', packageErrorDetails);
    }
  }, [packageLoading, packageSuccess, packageData, packageError, packageErrorDetails]);

  // Function to get matching package based on selected option
const getMatchingPackage = useCallback(() => {
    console.log('🔍 Getting matching package...');
    console.log('Package Data Full:', packageData);
    console.log('Selected Option:', selectedOption);
    
    if (!packageData || !selectedOption) {
      console.log('❌ No package data or selected option:', { packageData, selectedOption });
      return null;
    }
    
    const selectedOptionData = options.find(opt => opt.value === selectedOption);
    if (!selectedOptionData) {
      console.log('❌ No selected option data found');
      return null;
    }

    console.log('✅ Selected Option Data:', selectedOptionData);

    // Try different possible structures for packageData
    let allPackages = [];
    
    // Structure 1: packageData.data is array
    if (packageData.data && Array.isArray(packageData.data) && packageData.data.length > 0) {
      console.log('📦 Using Structure 1: packageData.data[0]');
      allPackages = [
        ...(packageData.data[0]?.pro || []),
        ...(packageData.data[0]?.regular || [])
      ];
    }
    // Structure 2: packageData has direct pro/regular properties
    else if (packageData.pro || packageData.regular) {
      console.log('📦 Using Structure 2: Direct pro/regular');
      allPackages = [
        ...(packageData.pro || []),
        ...(packageData.regular || [])
      ];
    }
    // Structure 3: packageData.data has direct pro/regular properties
    else if (packageData.data?.pro || packageData.data?.regular) {
      console.log('📦 Using Structure 3: packageData.data direct');
      allPackages = [
        ...(packageData.data.pro || []),
        ...(packageData.data.regular || [])
      ];
    }
    // Structure 4: packageData is array itself
    else if (Array.isArray(packageData) && packageData.length > 0) {
      console.log('📦 Using Structure 4: packageData is array');
      allPackages = [
        ...(packageData[0]?.pro || []),
        ...(packageData[0]?.regular || [])
      ];
    }

    console.log('📋 All packages found:', allPackages);
    console.log('🔍 Looking for field:', selectedOptionData.packageField);

    if (allPackages.length === 0) {
      console.log('❌ No packages found in any structure');
      return null;
    }

    // Try different field name variations
    const fieldVariations = [
      selectedOptionData.packageField,
      selectedOptionData.packageField.toLowerCase(),
      selectedOptionData.packageField.toUpperCase(),
      selectedOptionData.label,
      selectedOptionData.label.toLowerCase()
    ];

    let matchingPackage = null;
    
    for (const fieldName of fieldVariations) {
      matchingPackage = allPackages.find(pkg => 
        pkg.field_name === fieldName || 
        pkg.fieldName === fieldName ||
        pkg.name === fieldName ||
        pkg.type === fieldName
      );
      
      if (matchingPackage) {
        console.log('✅ Found matching package with field:', fieldName);
        break;
      }
    }

    if (!matchingPackage) {
      console.log('❌ No matching package found. Available packages:');
      allPackages.forEach((pkg, index) => {
        console.log(`${index + 1}. Field Name: "${pkg.field_name || pkg.fieldName || pkg.name || 'N/A'}", Package:`, pkg);
      });
    } else {
      console.log('✅ Matching package found:', matchingPackage);
    }

    return matchingPackage;
  }, [packageData, selectedOption, options]);

  // Update selected package when option changes or package data loads
  useEffect(() => {
    if (packageSuccess && packageData) {
      const matchingPackage = getMatchingPackage();
      setSelectedPackage(matchingPackage);
      console.log('Updated selected package:', matchingPackage);
    }
  }, [getMatchingPackage, packageSuccess, packageData]);

  // Retry package data fetch if it fails
  const handleRetryPackageData = () => {
    console.log('Retrying package data fetch...');
    refetchPackageData();
  };

  // React Query for divisions
  const {
    data: divisions = [],
    isLoading: divisionsLoading,
  } = useQuery({
    queryKey: queryKeys.divisions,
    queryFn: fetchDivisions,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: [],
  });

  // React Query for districts
  const {
    data: districts = [],
    isLoading: districtsLoading,
  } = useQuery({
    queryKey: queryKeys.districts(selectedDivision),
    queryFn: () => fetchDistricts(selectedDivision),
    enabled: !!selectedDivision,
    staleTime: 8 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: [],
    select: useCallback((data) => data || [], []),
  });

  // React Query for upazilas
  const {
    data: upazilas = [],
    isLoading: upazilasLoading,
    error: upazilasError,
  } = useQuery({
    queryKey: queryKeys.upazilas(selectedDivision, selectedDistrict),
    queryFn: () => fetchUpazilas(selectedDivision, selectedDistrict),
    enabled: !!selectedDivision && !!selectedDistrict,
    staleTime: 8 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: [],
    select: useCallback((data) => data || [], []),
  });

  // React Query for khatian types
  const {
    data: khatianTypes = [],
    isLoading: khatianTypesLoading,
    error: khatianTypesError,
  } = useQuery({
    queryKey: queryKeys.khatianTypes(
      selectedDivision,
      selectedDistrict,
      selectedUpazila
    ),
    queryFn: () =>
      fetchKhatianTypes(selectedDivision, selectedDistrict, selectedUpazila),
    enabled: !!selectedDivision && !!selectedDistrict && !!selectedUpazila,
    staleTime: 8 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: [],
    select: useCallback((data) => data || [], []),
  });

  // Create loading states object for compatibility with existing components
  const loadingStates = {
    divisions: divisionsLoading,
    districts: districtsLoading,
    upazilas: upazilasLoading,
    khatianTypes: khatianTypesLoading
  };

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    setFormData({
      division: '',
      district: '',
      upazila: '',
      khatianType: ''
    });
    setShowDropdown('');
  };

  const toggleDropdown = (field) => {
    setShowDropdown(showDropdown === field ? '' : field);
  };

  const toggleMobileDropdown = (field) => {
    setMobileDropdowns(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleDropdownSearchChange = (field, value) => {
    setDropdownSearchQueries(prev => ({
      ...prev,
      [field]: value
    }));
  };

  

  const handleDivisionChange = (division) => {
    setFormData(prev => ({ ...prev, division, district: '', upazila: '', khatianType: '' }));
    setShowDropdown('');
    setMobileDropdowns(prev => ({ ...prev, division: false }));
  };

  const handleDistrictChange = (district) => {
    setFormData(prev => ({ ...prev, district, upazila: '', khatianType: '' }));
    setShowDropdown('');
    setMobileDropdowns(prev => ({ ...prev, district: false }));
  };

  const handleUpazilaChange = (upazila) => {
    setFormData(prev => ({ ...prev, upazila, khatianType: '' }));
    setShowDropdown('');
    setMobileDropdowns(prev => ({ ...prev, upazila: false }));
  };

  const handleKhatianTypeChange = (khatianType) => {
    setFormData(prev => ({ ...prev, khatianType }));
    setShowDropdown('');
    setMobileDropdowns(prev => ({ ...prev, khatianType: false }));
  };

  const getFieldsToShow = () => {
    const option = options.find(opt => opt.value === selectedOption);
    return option ? option.fields : 0;
  };

  // Validation function to check if required fields are filled
  const validateRequiredFields = () => {
    const fieldsCount = getFieldsToShow();
    const fieldKeys = ['division', 'district', 'upazila', 'khatianType'];
    
    for (let i = 0; i < fieldsCount; i++) {
      if (!formData[fieldKeys[i]]) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!validateRequiredFields()) {
      alert('দয়া করে সকল প্রয়োজনীয় ক্ষেত্র পূরণ করুন।');
      return;
    }

    // Check if package is selected
    if (!selectedPackage) {
      alert('কোন প্যাকেজ পাওয়া যায়নি। দয়া করে আবার চেষ্টা করুন।');
      return;
    }

    const fieldsCount = getFieldsToShow();
    const fieldKeys = ['division', 'district', 'upazila', 'khatianType'];
    const submittedData = {};
    
    for (let i = 0; i < fieldsCount; i++) {
      submittedData[fieldKeys[i]] = formData[fieldKeys[i]];
    }
    
    // Prepare checkout data
    const checkoutData = {
      searchInfo: submittedData,
      packageInfo: selectedPackage,
      selectedOption: options.find(opt => opt.value === selectedOption),
      totalAmount: selectedPackage.price_per_file,
      timestamp: new Date().toISOString()
    };

    console.log('Checkout Data:', checkoutData);
    
    // Navigate to checkout page with the data
    navigate('/checkout', { 
      state: checkoutData 
    });
  };

  // Package display component
  const PackageDisplay = () => {
    if (packageLoading) {
      return (
        <div className="text-center py-4">
          {/* <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-600">প্যাকেজ লোড হচ্ছে...</p> */}
        </div>
      );
    }

    if (packageError) {
      return (
        <div className="text-center py-4">
          {/* <p className="text-red-600 mb-2">প্যাকেজ লোড করতে সমস্যা হয়েছে।</p>
          <button 
            onClick={handleRetryPackageData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            আবার চেষ্টা করুন
          </button> */}
        </div>
      );
    }

    if (!selectedPackage) {
      return (
        <div className="text-center py-4">
          {/* <p className="text-gray-600">কোন প্যাকেজ পাওয়া যায়নি।</p> */}
        </div>
      );
    }

    // return (
    //   <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
    //     <h3 className="text-lg font-semibold text-green-800 mb-2">
    //       নির্বাচিত প্যাকেজ: {selectedPackage.field_name}
    //     </h3>
    //     <p className="text-green-700">
    //       মূল্য: ৳{selectedPackage.price_per_file}
    //     </p>
    //   </div>
    // );
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown('');
      setMobileDropdowns({
        division: false,
        district: false,
        upazila: false,
        khatianType: false
      });
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <div className="mx-auto p-6 bg-white rounded-lg" >
        {/* Option Selection */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-y-3">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleOptionChange(option.value)}
                className="cursor-pointer transition-all duration-200"
              >
                <span className={`text-lg md:text-xl px-4 py-2 rounded-lg ${
                  selectedOption === option.value
                    ? ' text-green-700 font-bold '
                    : 'text-gray-700 hover:text-green-500 hover:bg-gray-100'
                }`}>
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Package Display */}
        

        {/* Form Fields */}
      {selectedOption && (
  <div className="mb-8">
    {/* Desktop Grid Layout */}
    <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6" key={selectedOption} data-aos="zoom-in"
    data-aos-offset="20"
    data-aos-delay="20"
    data-aos-duration="1000"
    data-aos-easing="ease-in-out"
    data-aos-mirror="true"
    data-aos-once="false">
      <RenderDesktopFields
        getFieldsToShow={getFieldsToShow}
        formData={formData}
        showDropdown={showDropdown}
        toggleDropdown={toggleDropdown}
        divisionsLoading={divisionsLoading}
        divisions={divisions}
        handleDivisionChange={handleDivisionChange}
        dropdownSearchQueries={dropdownSearchQueries}
        handleDropdownSearchChange={handleDropdownSearchChange}
        districtsLoading={districtsLoading}
        districts={districts}
        handleDistrictChange={handleDistrictChange}
        upazilasLoading={upazilasLoading}
        upazilas={upazilas}
        handleUpazilaChange={handleUpazilaChange}
        khatianTypesLoading={khatianTypesLoading}
        khatianTypes={khatianTypes}
        handleKhatianTypeChange={handleKhatianTypeChange}
        DropdownWithSearch={DropdownWithSearch}
      />
    </div>

    {/* Mobile Layout */}
    <div className="md:hidden"   {...aosAttributes}>
      <MobileFieldsRenderer
        getFieldsToShow={getFieldsToShow}
        formData={formData}
        handleDivisionChange={handleDivisionChange}
        divisions={divisions}
        handleDistrictChange={handleDistrictChange}
        districts={districts}
        handleUpazilaChange={handleUpazilaChange}
        upazilas={upazilas}
        handleKhatianTypeChange={handleKhatianTypeChange}
        khatianTypes={khatianTypes}
        dropdownSearchQueries={dropdownSearchQueries}
        handleDropdownSearchChange={handleDropdownSearchChange}
        toggleMobileDropdown={toggleMobileDropdown}
        mobileDropdowns={mobileDropdowns}
        loadingStates={loadingStates}
      />
    </div>
  </div>
)}

{selectedOption && (
  <div className="flex justify-center" key={selectedOption} data-aos="fade-up"
    data-aos-offset="20"
    data-aos-delay="20"
    data-aos-duration="1000"
    data-aos-easing="ease-in-out"
    data-aos-mirror="true"
    data-aos-once="false">
    <button
      onClick={handleSubmit}
      disabled={!validateRequiredFields() || !selectedPackage || packageLoading}
      className={`px-8 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 font-medium shadow-lg ${
        validateRequiredFields() && selectedPackage && !packageLoading
          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 focus:ring-green-500'
          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
      }`}
    >
      {packageLoading ? 'লোড হচ্ছে...' : 'কিনুন'}
    </button>
  </div>
)}

      </div>
    </>
  );
};

export default BangladeshAdminForm;