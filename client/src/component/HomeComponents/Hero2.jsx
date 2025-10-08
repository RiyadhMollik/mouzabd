import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Check } from 'lucide-react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchDivisions,
  fetchDistricts,
  fetchUpazilas,
  fetchKhatianTypes,
  AllSearchData,
} from "../../utils/api/AdvancedSearch";
import img1 from "../../assets/carousel-back.jpg";
import { getBaseUrl } from "../../utils/baseurls";
// import MobileInputField from "./MobileInputField";
// import DropdownWithSearch from "./DropdownWithSearch";
import QuickSearch from "./InputSearch";
import DesktopFormFields from "./DesktopFormFields";
import MobileFormField from "./MobileFormField";
import BangladeshAdminForm from "./BangladeshAdminForm";



export default function Heros() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
const [results, setResults] = useState([]);
const [activeTab, setActiveTab] = useState('quick');
  // Original Heros states
  const [showDropdown, setShowDropdown] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownSearchQueries, setDropdownSearchQueries] = useState({
    division: "",
    district: "",
    upazila: "",
    surveyType: "",
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Mobile dropdown states
  const [mobileDropdowns, setMobileDropdowns] = useState({
    division: false,
    district: false,
    upazila: false,
    surveyType: false,
  });

  // Advanced form states (replacing the old formData)
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [selectedKhatianType, setSelectedKhatianType] = useState("");

  // Quick search loading state
  const [isQuickSearchLoading, setIsQuickSearchLoading] = useState(false);

  // Memoized screen size check to prevent unnecessary re-renders
  const checkScreenSize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [checkScreenSize]);

  // Optimized query keys with proper cache invalidation
  const queryKeys = useMemo(
    () => ({
      divisions: ["advanceDivisions"],
      districts: (division) => ["advanceDistricts", division],
      upazilas: (division, district) => ["advanceUpazilas", division, district],
      khatianTypes: (division, district, upazila) => [
        "advanceKhatianTypes",
        division,
        district,
        upazila,
      ],
      quickSearch: (filename) => ["quickSearch", filename],
    }),
    []
  );




  // React Query for divisions with prefetching optimization
  const {
    data: divisions = [],
    isLoading: divisionsLoading,
    error: divisionsError,
    isSuccess: divisionsSuccess,
  } = useQuery({
    queryKey: queryKeys.divisions,
    queryFn: fetchDivisions,
    staleTime: 10 * 60 * 1000, // 10 minutes for static data
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: [], // Prevent loading flash
  });

  // Prefetch districts when divisions are loaded
  useEffect(() => {
    if (divisionsSuccess && divisions.length > 0) {
      // Prefetch popular divisions
      const popularDivisions = ["ঢাকা", "চট্টগ্রাম", "খুলনা"];
      popularDivisions.forEach((division) => {
        queryClient.prefetchQuery({
          queryKey: queryKeys.districts(division),
          queryFn: () => fetchDistricts(division),
          staleTime: 5 * 60 * 1000,
        });
      });
    }
  }, [divisionsSuccess, divisions, queryClient, queryKeys]);

  // React Query for districts with optimistic updates
  const {
    data: districts = [],
    isLoading: districtsLoading,
    error: districtsError,
  } = useQuery({
    queryKey: queryKeys.districts(selectedDivision),
    queryFn: () => fetchDistricts(selectedDivision),
    enabled: !!selectedDivision,
    staleTime: 8 * 60 * 1000, // 8 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: [],
    select: useCallback((data) => data || [], []), // Memoized data selector
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

  // Quick Search Handler - This calls AllSearchData API
  const handleQuickSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsQuickSearchLoading(true);

    try {
      // Call AllSearchData API for quick search
      const searchResults = await AllSearchData(searchQuery);

      // Navigate to results page with quick search data
    
      navigate("/result", {
        state: {
          searchType: "quick",
          quickSearchQuery: searchQuery,
          quickSearchResults: searchResults,
          useRealFiles: true,
          // Additional metadata
          timestamp: new Date().toISOString(),
          totalResults: searchResults?.length || 0,
        },
      });
    } catch (error) {
      console.error("Quick search failed:", error);
      // You might want to show an error message to the user here
      alert("অনুসন্ধানে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsQuickSearchLoading(false);
    }
  }, [searchQuery, navigate]);

  // Handle Enter key press for quick search
 const handleQuickSearchKeyPress = async (e) => {

    if (e.key === "Enter" && searchQuery.trim() !== "") {
      try {
        const response = await fetch(`${getBaseUrl}/api/drive/search-file/?filename=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setResults(data.results); // Adjust based on your API's response structure
      } catch (error) {
        console.error("Search error:", error);
      }
    }
  };

  // Optimized selection handlers with prefetching
  const handleDivisionChange = useCallback(
    (division) => {
      setSelectedDivision(division);
      setSelectedDistrict("");
      setSelectedUpazila("");
      setSelectedKhatianType("");
      setShowDropdown("");

      // Clear dropdown search when selection is made
      setDropdownSearchQueries((prev) => ({
        ...prev,
        division: "",
      }));

      // Close mobile dropdowns
      setMobileDropdowns((prev) => ({
        ...prev,
        division: false,
      }));

      // Prefetch districts immediately
      if (division) {
        queryClient.prefetchQuery({
          queryKey: queryKeys.districts(division),
          queryFn: () => fetchDistricts(division),
          staleTime: 5 * 60 * 1000,
        });
      }
    },
    [queryClient, queryKeys]
  );

  const handleDistrictChange = useCallback(
    (district) => {
      setSelectedDistrict(district);
      setSelectedUpazila("");
      setSelectedKhatianType("");
      setShowDropdown("");

      // Clear dropdown search when selection is made
      setDropdownSearchQueries((prev) => ({
        ...prev,
        district: "",
      }));

      // Close mobile dropdowns
      setMobileDropdowns((prev) => ({
        ...prev,
        district: false,
      }));

      // Prefetch upazilas immediately
      if (district && selectedDivision) {
        queryClient.prefetchQuery({
          queryKey: queryKeys.upazilas(selectedDivision, district),
          queryFn: () => fetchUpazilas(selectedDivision, district),
          staleTime: 5 * 60 * 1000,
        });
      }
    },
    [queryClient, queryKeys, selectedDivision]
  );

  const handleUpazilaChange = useCallback(
    (upazila) => {
      setSelectedUpazila(upazila);
      setSelectedKhatianType("");
      setShowDropdown("");

      // Clear dropdown search when selection is made
      setDropdownSearchQueries((prev) => ({
        ...prev,
        upazila: "",
      }));

      // Close mobile dropdowns
      setMobileDropdowns((prev) => ({
        ...prev,
        upazila: false,
      }));

      // Prefetch khatian types immediately
      if (upazila && selectedDivision && selectedDistrict) {
        queryClient.prefetchQuery({
          queryKey: queryKeys.khatianTypes(
            selectedDivision,
            selectedDistrict,
            upazila
          ),
          queryFn: () =>
            fetchKhatianTypes(selectedDivision, selectedDistrict, upazila),
          staleTime: 5 * 60 * 1000,
        });
      }
    },
    [queryClient, queryKeys, selectedDivision, selectedDistrict]
  );

  const handleKhatianTypeChange = useCallback((type) => {
    setSelectedKhatianType(type);
    setShowDropdown("");

    // Clear dropdown search when selection is made
    setDropdownSearchQueries((prev) => ({
      ...prev,
      surveyType: "",
    }));

    // Close mobile dropdowns
    setMobileDropdowns((prev) => ({
      ...prev,
      surveyType: false,
    }));
  }, []);

  // Memoized loading states
  const loadingStates = useMemo(
    () => ({
      divisions: divisionsLoading,
      districts: districtsLoading,
      upazilas: upazilasLoading,
      khatianTypes: khatianTypesLoading,
      overall:
        divisionsLoading ||
        districtsLoading ||
        upazilasLoading ||
        khatianTypesLoading,
    }),
    [divisionsLoading, districtsLoading, upazilasLoading, khatianTypesLoading]
  );

  // Memoized form validation
  const isFormValid = useMemo(() => {
    return (
      selectedDivision &&
      selectedDistrict &&
      selectedUpazila &&
      selectedKhatianType
    );
  }, [
    selectedDivision,
    selectedDistrict,
    selectedUpazila,
    selectedKhatianType,
  ]);

  // Check if quick search is valid
  const isQuickSearchValid = useMemo(() => {
    return searchQuery.trim().length > 0;
  }, [searchQuery]);

  // Advanced search handler - This is for the advanced form search
  // Advanced search handler - This is for the advanced form search
  const handleAdvancedSearch = useCallback(() => {
    if (!isFormValid) return;

    // Navigate with advanced search parameters
    navigate("/result",{
      state: {
        searchType: "advanced",
        // Location hierarchy
        selectedDivision,
        selectedDistrict,
        selectedUpazila,
        selectedKhatianType,
        // Search configuration
        useRealFiles: true,
        // Additional metadata
        timestamp: new Date().toISOString(),
        searchCriteria: {
          division: selectedDivision,
          district: selectedDistrict,
          upazila: selectedUpazila,
          khatianType: selectedKhatianType,
        },
      },
    });
  }, [
    navigate,
    isFormValid,
    selectedDivision,
    selectedDistrict,
    selectedUpazila,
    selectedKhatianType,
  ]);

  // Filter function for dropdown options
  const filterOptions = (options, searchQuery) => {
    if (!searchQuery) return options;
    return options.filter((option) =>
      option.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleDropdownSearchChange = (field, value) => {
    setDropdownSearchQueries((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleDropdown = (dropdownName) => {
    setShowDropdown(showDropdown === dropdownName ? "" : dropdownName);
    // Clear search when opening dropdown
    if (showDropdown !== dropdownName) {
      setDropdownSearchQueries((prev) => ({
        ...prev,
        [dropdownName]: "",
      }));
    }
  };

  const toggleMobileDropdown = (field) => {
    setMobileDropdowns((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Close dropdown when clicking outside
  const handleOutsideClick = () => {
    setShowDropdown("");
    setMobileDropdowns({
      division: false,
      district: false,
      upazila: false,
      surveyType: false,
    });
  };



  

  return (
    <div
      className=""
      style={{
        backgroundImage: `url(${img1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      onClick={handleOutsideClick}
       
    >
      {/* Main Content */}
      <div className="flex items-center justify-center p-4" >
        <div className="w-full max-w-full px-4 py-10 md:py-20 lg:py-36 xl:py-40  lg:max-w-4xl xl:max-w-7xl mx-auto">
          {/* Tab Navigation with Search Input */}
          <div className="flex justify-center -mb-8">
            <div className="bg-white rounded-sm shadow-sm md:w-full max-w-lg" data-aos="fade-down"
                data-aos-offset="20"
                data-aos-delay="20"
                data-aos-duration="1000"
                data-aos-easing="ease-in-out"
                data-aos-mirror="true"
                data-aos-once="false">
              <div className="flex flex-col sm:flex-row items-center justify-center p-4">
              <QuickSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleQuickSearchKeyPress={handleQuickSearchKeyPress}
                onInputClick={() => setShowDropdown(true)}/>
              </div>
            </div>
          </div>

          {/* Main Form Container */}
         
          <div
            className="bg-white rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
             {/* Fixed "or" tab styling */}
             <div className="flex justify-center pt-16 pb-4">
  <div className="flex bg-gray-100 rounded-lg p-1 shadow-inner">
    <button
      onClick={() => setActiveTab('quick')}
      className={`px-6 py-2 rounded-md font-medium md:text-lg font-inter1 transition-all duration-200 ${
        activeTab === 'quick'
          ? 'bg-white text-green-600 shadow-sm'
          : 'text-gray-600 hover:text-gray-800'
      }`}
    >
     ছোট প্যাকেজ
    </button>
    <button
      onClick={() => setActiveTab('advanced')}
      className={`px-6 py-2 rounded-md md:text-lg font-medium font-inter1 transition-all duration-200 ${
        activeTab === 'advanced'
          ? 'bg-white text-green-600 shadow-sm'
          : 'text-gray-600 hover:text-gray-800'
      }`}
    >
     বড় প্যাকেজ
    </button>
  </div>
</div>
            {/* Form Fields */}

{activeTab === 'quick' ? (
        <div className="space-y-4 flex py-6">
          {/* Desktop/Tablet Layout */}
          <div className="flex flex-wrap gap-4  text-sm text-gray-800 max-w-lg mx-auto justify-center">
            <div className="flex items-center gap-3   min-w-0  ">
              {/* <Check className="w-5 h-5 text-green-600 flex-shrink-0" /> */}
              <span className="font-medium text-base lg:text-lg font-inter1">✅ JPG/PDF ফাইল</span>
            </div>
            
            <div className="flex items-center gap-3  min-w-0 ">
             {/* // <Check className="w-5 h-5 text-green-600 flex-shrink-0" /> */}
              <span className="font-medium text-base lg:text-lg font-inter1">✅ প্রিন্ট রেডি ফাইল</span>
            </div>
            <div className="flex items-center gap-3  min-w-0 ">
             {/* // <Check className="w-5 h-5 text-green-600 flex-shrink-0" /> */}
              <span className="font-medium text-base lg:text-lg font-inter1">✅ হার্ড কপি</span>
            </div>
            {/* <div className="flex items-center gap-3 py-4 min-w-0 ">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="font-medium">হেডার/footer</span>
            </div> */}
          </div>

          {/* Mobile Layout */}
          {/* <div className="sm:hidden space-y-3 max-w-sm mx-auto">
            <div className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer border border-gray-200 hover:border-gray-300 text-sm text-gray-800">
              <Check className="w-5 h-5 text-green-600" />
              <span className="font-medium">JPG/PDF জেনারেট</span>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer border border-gray-200 hover:border-gray-300 text-sm text-gray-800">
              <Check className="w-5 h-5 text-green-600" />
              <span className="font-medium">ছবি ক্রপ করা</span>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer border border-gray-200 hover:border-gray-300 text-sm text-gray-800">
              <Check className="w-5 h-5 text-green-600" />
              <span className="font-medium">হেডার/footer</span>
            </div>
          </div> */}
        </div>
      ) : (
        <div className="text-gray-600 text-center ">
          <div className=" flex gap-6  text-sm text-gray-800 max-w-lg mx-auto justify-center">
            <div className="flex items-center gap-3   min-w-0  ">
              {/* <Check className="w-5 h-5 text-green-600 flex-shrink-0" /> */}
              <span className="font-medium text-base lg:text-lg font-inter1">✅ JPG/PDF ফাইল</span>
            </div>
          </div>
        </div>
      )}




             {activeTab === 'quick' ? (
            <div className="px-4 pb-8 lg:pb-17  sm:px-6">
              
              {/* Mobile View */}
              {isMobile ? (
                <MobileFormField
                  selectedDivision={selectedDivision}
                  handleDivisionChange={handleDivisionChange}
                  divisions={divisions}
                  filterOptions={filterOptions}
                  loadingStates={loadingStates}
                  mobileDropdowns={mobileDropdowns}
                  toggleMobileDropdown={toggleMobileDropdown}
                  handleDropdownSearchChange={handleDropdownSearchChange}
  dropdownSearchQueries={dropdownSearchQueries}
  khatianTypes={khatianTypes}
  handleKhatianTypeChange={handleKhatianTypeChange}
  selectedKhatianType={selectedKhatianType}
  upazilas={upazilas}
  handleUpazilaChange={handleUpazilaChange}
  selectedUpazila={selectedUpazila}
  districts={districts}
  handleDistrictChange={handleDistrictChange}
  selectedDistrict={selectedDistrict}
/>

              ) : (
                /* Desktop View */
              <DesktopFormFields 
  selectedDivision={selectedDivision}
  selectedDistrict={selectedDistrict}
  selectedUpazila={selectedUpazila}
  selectedKhatianType={selectedKhatianType}
  divisions={divisions}
  districts={districts}
  upazilas={upazilas}
  khatianTypes={khatianTypes}
  showDropdown={showDropdown}
  toggleDropdown={toggleDropdown}
  dropdownSearchQueries={dropdownSearchQueries}
  handleDropdownSearchChange={handleDropdownSearchChange}
  handleDivisionChange={handleDivisionChange}
  handleDistrictChange={handleDistrictChange}
  handleUpazilaChange={handleUpazilaChange}
  handleKhatianTypeChange={handleKhatianTypeChange}
  loadingStates={loadingStates}
/>

              )}

              {/* Error Messages */}
              {(divisionsError ||
                districtsError ||
                upazilasError ||
                khatianTypesError) && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-red-800 text-sm">
                    ডেটা লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।
                  </div>
                </div>
              )}
            </div>):(
           
                <BangladeshAdminForm  />
              
      
            )}
            </div>
            {activeTab === 'quick' &&  ( <div className="flex justify-center -mt-8" data-aos="fade-up"
             data-aos-offset="20"
                data-aos-delay="20"
               data-aos-duration="1000"
              data-aos-easing="ease-in-out"
              data-aos-mirror="true"
                data-aos-once="false">
         <button
         type="button"
              
              onClick={() => {
                // দ্রুত অনুসন্ধান এবং উন্নত অনুসন্ধান দুটোই handle করবে
                if (searchQuery.trim()) {
                  
                  handleQuickSearch(); // দ্রুত অনুসন্ধান
                  
                } else if (isFormValid) {
                 
                  handleAdvancedSearch(); // উন্নত অনুসন্ধান
                  
                }
              }}
              disabled={
                (!isQuickSearchValid && !isFormValid) ||
                isQuickSearchLoading ||
                loadingStates.overall
              }
              className={`px-8 py-3 rounded-lg font-medium text-white transition-all duration-200 flex items-center space-x-2 ${
                (isQuickSearchValid || isFormValid) &&
                !isQuickSearchLoading &&
                !loadingStates.overall
                  ? "bg-green-600 hover:bg-green-700  cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              <Search className="h-5 w-5" />
              <span>
                {loadingStates.overall ? "লোড হচ্ছে..." : "উন্নত অনুসন্ধান"}
              </span>
            </button>
          </div>)}
        </div>
      </div>
    </div>
  );
}