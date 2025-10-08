/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchDivisions,
  fetchDistricts,
  fetchUpazilas,
  fetchSurveyType,
  fetchMouza,
} from "../../utils/api/mapSearch";
import {
  
  fetchKhatianTypes,
} from "../../utils/api/AdvancedSearch";
import Select from "react-select";

const From = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State variables
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [selectedKhatianType, setSelectedKhatianType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
      divisions: ["divisions"],
      districts: (division) => ["districts", division],
      upazilas: (division, district) => ["upazilas", division, district],
      khatianTypes: (division, district, upazila) => [
        "khatianTypes",
        division,
        district,
        upazila,
      ],
      mouza: (division, district, upazila, khatianType) => [
        "mouza",
        division,
        district,
        upazila,
        khatianType,
      ],
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
      // Prefetch popular divisions (you can customize this list)
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
      fetchSurveyType(selectedDivision, selectedDistrict, selectedUpazila),
    enabled: !!selectedDivision && !!selectedDistrict && !!selectedUpazila,
    staleTime: 8 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: [],
    select: useCallback((data) => data || [], []),
  });

  // React Query for mouxa
  const {
    data: mouza = [],
    isLoading: mouzaLoading,
    error: mouzaError,
  } = useQuery({
    queryKey: queryKeys.mouza(
      selectedDivision,
      selectedDistrict,
      selectedUpazila,
      selectedKhatianType
    ),
    queryFn: () =>
      fetchMouza(
        selectedDivision,
        selectedDistrict,
        selectedUpazila,
        selectedKhatianType
      ),
    enabled:
      !!selectedDivision &&
      !!selectedDistrict &&
      !!selectedUpazila &&
      !!selectedKhatianType,
    staleTime: 8 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: [],
    select: useCallback((data) => data || [], []),
  });

  // Optimized selection handlers with prefetching
  const handleDivisionChange = useCallback(
    (division) => {
      setSelectedDivision(division);
      setSelectedDistrict("");
      setSelectedUpazila("");
      setSelectedKhatianType("");

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

      // Prefetch khatian types immediately
      if (upazila && selectedDivision && selectedDistrict) {
        queryClient.prefetchQuery({
          queryKey: queryKeys.khatianTypes(
            selectedDivision,
            selectedDistrict,
            upazila
          ),
          queryFn: () =>
            fetchSurveyType(selectedDivision, selectedDistrict, upazila),
          staleTime: 5 * 60 * 1000,
        });
      }
    },
    [queryClient, queryKeys, selectedDivision, selectedDistrict]
  );

  const handleKhatianTypeChange = useCallback(
    (type) => {
      setSelectedKhatianType(type);

      if (type) {
        queryClient.prefetchQuery({
          queryKey: queryKeys.mouza(
            selectedDivision,
            selectedDistrict,
            selectedUpazila,
            selectedKhatianType
          ),
          queryFn: () =>
            fetchMouza(
              selectedDivision,
              selectedDistrict,
              selectedUpazila,
              selectedKhatianType
            ),
          staleTime: 5 * 60 * 1000,
        });
      }
    },
    [
      queryClient,
      queryKeys,
      selectedDivision,
      selectedDistrict,
      selectedUpazila,
      selectedKhatianType,
    ]
  );

  const filteredMouza = mouza?.filter((type) =>
    `${type?.jl_number}_${type?.mouza_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Memoized loading states
  const loadingStates = useMemo(
    () => ({
      divisions: divisionsLoading,
      districts: districtsLoading,
      upazilas: upazilasLoading,
      khatianTypes: khatianTypesLoading,
      mouza: mouzaLoading,
      overall:
        divisionsLoading ||
        districtsLoading ||
        upazilasLoading ||
        khatianTypesLoading,
    }),
    [
      divisionsLoading,
      districtsLoading,
      upazilasLoading,
      khatianTypesLoading,
      mouzaLoading,
    ]
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

  // Optimized search handler
  const handleSearch = useCallback(() => {
    if (!isFormValid) return;

    navigate("/result", {
      state: {
        selectedDivision,
        selectedDistrict,
        selectedUpazila,
        selectedKhatianType,
        useRealFiles: true,
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

  // Memoized error state
  const hasError = useMemo(
    () =>
      divisionsError ||
      districtsError ||
      upazilasError ||
      khatianTypesError ||
      mouzaError,
    [
      divisionsError,
      districtsError,
      upazilasError,
      khatianTypesError,
      mouzaError,
    ]
  );

  // Error component
  const ErrorDisplay = useMemo(() => {
    if (!hasError) return null;

    return (
      <div className="w-full mx-auto font-sans p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-red-400 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-red-800 font-medium">
              ডেটা লোড করতে সমস্যা হয়েছে
            </h3>
          </div>
          <p className="text-red-700 mt-1">
            অনুগ্রহ করে পেজ রিফ্রেশ করুন অথবা পরে আবার চেষ্টা করুন।
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            পেজ রিফ্রেশ করুন
          </button>
        </div>
      </div>
    );
  }, [hasError]);

  // Memoized loading spinner
  const LoadingSpinner = useMemo(
    () => (
      <div className="flex justify-center items-center p-4">
        <svg
          className="animate-spin h-8 w-8 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    ),
    []
  );

  // Memoized search button content
  const SearchButtonContent = useMemo(() => {
    if (loadingStates.overall) {
      return (
        <>
          <svg
            className="animate-spin h-5 w-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          লোড হচ্ছে...
        </>
      );
    }

    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        অনুসন্ধান
      </>
    );
  }, [loadingStates.overall]);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "green" : "#ccc",
      boxShadow: state.isFocused ? "0 0 0 1px green" : "none",
      "&:hover": {
        borderColor: "green",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "green"
        : state.isFocused
        ? "#f2efe6"
        : "white",
      color: state.isSelected ? "white" : "#333",
      cursor: "pointer",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const divisionOptions = divisions?.map((division) => ({
    value: division?.name,
    label: division?.name,
  }));

  const districtOptions = districts?.map((distric) => ({
    value: distric?.name,
    label: distric?.name,
  }));

  const upozilaOptions = upazilas?.map((upazila) => ({
    value: upazila?.name,
    label: upazila?.name,
  }));

  const serveyTypeOptions = khatianTypes?.map((type) => ({
    value: type,
    label: type,
  }));

  const mouzaOptions = mouza?.map((type) => ({
    value: type?.mouza_name,
    label: `${type?.jl_number}_${type?.mouza_name}`,
  }));

  // Mobile view component
  const MobileView = useMemo(
    () => (
      <div className="space-y-4">
        {/* Division */}
        <div>
          <label htmlFor="division" className="block font-medium mb-1">
            বিভাগ <span className="text-red-500">*</span>
          </label>
          <Select
            options={divisionOptions}
            value={divisionOptions.find(
              (opt) => opt.value === selectedDivision
            )}
            onChange={(selected) => handleDivisionChange(selected?.value)}
            isDisabled={loadingStates.divisions}
            placeholder="বিভাগ নির্বাচন করুন"
            styles={customStyles}
          />

          {loadingStates.divisions && (
            <div className="mt-1 text-sm text-gray-500 flex items-center">
              <div className="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full mr-2"></div>
              বিভাগ লোড হচ্ছে...
            </div>
          )}
        </div>

        {/* District */}
        <div>
          <label htmlFor="district" className="block font-medium mb-1">
            জেলা <span className="text-red-500">*</span>
          </label>
          <Select
            options={districtOptions}
            value={districtOptions.find(
              (opt) => opt.value === selectedDivision
            )}
            onChange={(selected) => handleDistrictChange(selected?.value)}
            isDisabled={loadingStates.districts}
            placeholder="জেলা নির্বাচন করুন"
            styles={customStyles}
          />
          {loadingStates.districts && (
            <div className="mt-1 text-sm text-gray-500 flex items-center">
              <div className="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full mr-2">
                জেলা লোড হচ্ছে..
              </div>
            </div>
          )}
        </div>

        {/* Upazila */}
        <div>
          <label htmlFor="upazila" className="block font-medium mb-1">
            উপজেলা <span className="text-red-500">*</span>
          </label>
          <Select
            options={upozilaOptions}
            value={upozilaOptions.find((opt) => opt.value === selectedDivision)}
            onChange={(selected) => handleUpazilaChange(selected?.value)}
            isDisabled={loadingStates.upazilas}
            placeholder="উপজেলা নির্বাচন করুন"
            styles={customStyles}
          />
          {loadingStates.upazilas && (
            <div className="mt-1 text-sm text-gray-500 flex items-center">
              <div className="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full mr-2"></div>
              উপজেলা লোড হচ্ছে...
            </div>
          )}
        </div>

        {/* Khatian Type */}
        <div>
          <label htmlFor="khatianType" className="block font-medium mb-1">
            সার্ভে টাইপ <span className="text-red-500">*</span>
          </label>
          <Select
            options={serveyTypeOptions}
            value={serveyTypeOptions.find(
              (opt) => opt.value === selectedDivision
            )}
            onChange={(selected) => handleKhatianTypeChange(selected?.value)}
            isDisabled={loadingStates.khatianTypes}
            placeholder="সার্ভে টাইপ নির্বাচন করুন"
            styles={customStyles}
          />
          {loadingStates.khatianTypes && (
            <div className="mt-1 text-sm text-gray-500 flex items-center">
              <div className="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full mr-2"></div>
              সার্ভে টাইপ লোড হচ্ছে...
            </div>
          )}
        </div>

        {/* Mouza Type */}
        <div>
          <label htmlFor="mouza" className="block font-medium mb-1">
            মৌজা <span className="text-red-500">*</span>
          </label>
          <Select
            options={mouzaOptions}
            value={mouzaOptions.find((opt) => opt.value === selectedDivision)}
            isDisabled={loadingStates.mouza}
            placeholder="মৌজা নির্বাচন করুন"
            styles={customStyles}
          />
          {loadingStates.khatianTypes && (
            <div className="mt-1 text-sm text-gray-500 flex items-center">
              <div className="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full mr-2"></div>
              মৌজা লোড হচ্ছে...
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="pt-2">
          <button
            onClick={handleSearch}
            className={`w-full text-white font-medium py-3 px-4 rounded flex items-center justify-center transition-all duration-200 ${
              !isFormValid || loadingStates.overall
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 transform hover:scale-[1.02] active:scale-[0.98]"
            }`}
            disabled={!isFormValid || loadingStates.overall}
          >
            {SearchButtonContent}
          </button>
        </div>
      </div>
    ),
    [
      SearchButtonContent,
      customStyles,
      districtOptions,
      divisionOptions,
      handleDistrictChange,
      handleDivisionChange,
      handleKhatianTypeChange,
      handleSearch,
      handleUpazilaChange,
      isFormValid,
      loadingStates.districts,
      loadingStates.divisions,
      loadingStates.khatianTypes,
      loadingStates.mouza,
      loadingStates.overall,
      loadingStates.upazilas,
      mouzaOptions,
      selectedDivision,
      serveyTypeOptions,
      upozilaOptions,
    ]
  );

  // Desktop view component
  const DesktopView = useMemo(
    () => (
      <div className="border border-gray-200 rounded overflow-hidden bg-white shadow-sm">
        {/* Header Row */}
        <div className="grid grid-cols-5 bg-gradient-to-r from-green-50 to-green-100 border-b border-gray-200">
          <div className="p-3 text-center font-medium border-r border-gray-200">
            বিভাগ
          </div>
          <div className="p-3 text-center font-medium border-r border-gray-200">
            জেলা
          </div>
          <div className="p-3 text-center font-medium border-r border-gray-200">
            উপজেলা/থানা
          </div>
          <div className="p-3 text-center font-medium border-r border-gray-200">
            সার্ভে টাইপ
          </div>
          <div className="p-3 text-center font-medium">মৌজা</div>
        </div>

        {/* Main Selection Grid */}
        <div className="grid grid-cols-5 divide-x divide-gray-200">
          {/* Division Column */}
          <div className="bg-white">
            <div className="max-h-96 overflow-y-auto">
              {loadingStates.divisions
                ? LoadingSpinner
                : divisions?.map((division) => (
                    <div
                      key={division?.id}
                      onClick={() => handleDivisionChange(division?.name)}
                      className={`p-3 cursor-pointer border-b border-b-gray-200 transition-all duration-150 ${
                        selectedDivision === division?.name
                          ? "bg-green-600 text-white shadow-inner"
                          : "hover:bg-green-50 hover:text-green-700"
                      }`}
                    >
                      {division?.name}
                    </div>
                  ))}
            </div>
          </div>

          {/* District Column */}
          <div className="bg-white">
            <div className="max-h-96 overflow-y-auto">
              {loadingStates.districts
                ? LoadingSpinner
                : districts?.map((district) => (
                    <div
                      key={district?.id}
                      onClick={() => handleDistrictChange(district?.name)}
                      className={`p-3 cursor-pointer border-b border-b-gray-200 transition-all duration-150 ${
                        selectedDistrict === district?.name
                          ? "bg-green-600 text-white shadow-inner"
                          : "hover:bg-green-50 hover:text-green-700"
                      }`}
                    >
                      {district?.name}
                    </div>
                  ))}
            </div>
          </div>

          {/* Upazila Column */}
          <div className="bg-white">
            <div className="max-h-96 overflow-y-auto">
              {loadingStates.upazilas
                ? LoadingSpinner
                : upazilas?.map((upazila) => (
                    <div
                      key={upazila?.id}
                      onClick={() => handleUpazilaChange(upazila?.name)}
                      className={`p-3 cursor-pointer border-b border-b-gray-200 transition-all duration-150 ${
                        selectedUpazila === upazila?.name
                          ? "bg-green-600 text-white shadow-inner"
                          : "hover:bg-green-50 hover:text-green-700"
                      }`}
                    >
                      {upazila?.name}
                    </div>
                  ))}
            </div>
          </div>

          {/* Khatian Type Column */}
          <div className="bg-white">
            <div className="max-h-96 overflow-y-auto">
              {loadingStates.khatianTypes
                ? LoadingSpinner
                : khatianTypes?.map((type) => (
                    <div
                      key={type}
                      onClick={() => handleKhatianTypeChange(type)}
                      className={`p-3 cursor-pointer border-b border-b-gray-200 transition-all duration-150 ${
                        selectedKhatianType === type
                          ? "bg-green-600 text-white shadow-inner"
                          : "hover:bg-green-50 hover:text-green-700"
                      }`}
                    >
                      {type}
                    </div>
                  ))}
            </div>
          </div>

          {/* Mouza Column */}
          <div className="bg-white">
            {/* Search bar */}
            {filteredMouza?.length > 0 && (
              <div className="p-3 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="মৌজা খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-600"
                />
              </div>
            )}

            {/* List */}
            <div className="max-h-96 overflow-y-auto">
              {loadingStates.mouza
                ? LoadingSpinner
                : filteredMouza?.length > 0
                ? filteredMouza.map((type) => (
                    <div
                      key={type?.id}
                      className={`p-3 cursor-pointer border-b border-b-gray-200 transition-all duration-150 ${
                        selectedKhatianType === type?.mouza_name
                          ? "bg-green-600 text-white shadow-inner"
                          : "hover:bg-green-50 hover:text-green-700"
                      }`}
                    >
                      {type?.jl_number}_{type?.mouza_name}
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>

        {/* Search Button - Desktop */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-t border-t-gray-200">
          <button
            className={`text-white px-4 py-2 rounded font-medium w-full flex items-center justify-center transition-all duration-200 ${
              !isFormValid || loadingStates.overall
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
            }`}
            onClick={handleSearch}
            disabled={!isFormValid || loadingStates.overall}
          >
            {SearchButtonContent}
          </button>
        </div>
      </div>
    ),
    [
      divisions,
      districts,
      upazilas,
      khatianTypes,
      selectedDivision,
      selectedDistrict,
      selectedUpazila,
      selectedKhatianType,
      loadingStates,
      isFormValid,
      SearchButtonContent,
      LoadingSpinner,
      handleDivisionChange,
      handleDistrictChange,
      handleUpazilaChange,
      handleKhatianTypeChange,
      handleSearch,
      filteredMouza,
      searchTerm,
    ]
  );
  if (hasError) return ErrorDisplay;

  return (
    <div className="w-full mx-auto font-sans">
      {isMobile ? MobileView : DesktopView}
    </div>
  );
};

export default From;
