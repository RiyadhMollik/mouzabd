import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchFiles } from "../utils/api/AdvancedSearch";

import { X, FileText, File, Download, ExternalLink, Image, FileSpreadsheet, Presentation, Eye } from "lucide-react";
import ValidSearch from "../component/ResultPageComponent/ValidSearch";
import ResultLoading from "../component/ResultPageComponent/ResultLoading";
import ErrorResult from "../component/ResultPageComponent/ErrorResult";
import FilesFoundMessage from "../component/ResultPageComponent/FilesFoundMessage";
import ResultPageHeader from "../component/ResultPageComponent/ResultPageHeader";
import ResultSearchBar from "../component/ResultPageComponent/ResultSearchBar";
import SummaryBox from "../component/ResultPageComponent/SummaryBox";
import ResultCard from "../component/ResultPageComponent/ResultCard";
import ResultModal from "../component/ResultPageComponent/ResultModal";
import { decodeToken } from "../utils/TokenDecoder";
import { packageApi } from "../utils/api/CommonApi";
import { convertNumberToBangla } from "../utils/englishToBangla";

const ResultPage = () => {
  // State
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  
  // Refs
  const modalRef = useRef(null);
  const modalContentRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state || {};

  // Determine search type
  const isQuickSearch = locationState.searchType === "quick";
  const isAreaSearch = !isQuickSearch && locationState.selectedDivision;

 

  // Function to get file icon based on file type
  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'image':
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="w-6 h-6 text-blue-500" />;
      case 'document':
      case 'doc':
      case 'docx':
        return <FileText className="w-6 h-6 text-blue-600" />;
      case 'sheet':
      case 'xls':
      case 'xlsx':
        return <FileSpreadsheet className="w-6 h-6 text-green-600" />;
      case 'slides':
      case 'ppt':
      case 'pptx':
        return <Presentation className="w-6 h-6 text-orange-600" />;
      default:
        return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  // Function to handle file view - FIXED: Now properly handles the event parameter
  const handleViewFile = (file, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentFile(file);
    setShowModal(true);
    setImageLoading(true);
    setImageError(false);
  };

  // Modal functions
  const closeModal = () => {
    setShowModal(false);
    setCurrentFile(null);
    setImageLoading(false);
    setImageError(false);
  };

  const handleModalOutsideClick = (e) => {
    if (modalRef.current && !modalContentRef.current?.contains(e.target)) {
      closeModal();
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Function to transform Google Drive API response to expected format
  const transformGoogleDriveFiles = (driveFiles) => {
    // Handle the case where driveFiles might be a string
    let filesArray = driveFiles;

    if (typeof driveFiles === "string") {
      try {
        filesArray = JSON.parse(driveFiles);
      } catch (error) {
        console.error("Failed to parse driveFiles:", error);
        return [];
      }
    }

    if (!Array.isArray(filesArray)) {
      console.error("driveFiles is not an array:", filesArray);
      return [];
    }

    return filesArray.map((file) => {
      // Extract file type from mimeType or file extension
      let fileType = "Unknown";
      if (file.mimeType) {
        if (file.mimeType.includes("image")) fileType = "Image";
        else if (file.mimeType.includes("pdf")) fileType = "PDF";
        else if (file.mimeType.includes("document")) fileType = "Document";
        else if (file.mimeType.includes("spreadsheet")) fileType = "Sheet";
        else if (file.mimeType.includes("presentation")) fileType = "Slides";
        else if (file.mimeType === "image/jpeg") fileType = "JPG";
        else if (file.mimeType === "image/png") fileType = "PNG";
      } else if (file.name) {
        const extension = file.name.split(".").pop()?.toUpperCase();
        fileType = extension || "File";
      }

      return {
        id: file.id,
        name: file.name || "Unnamed File",
        type: fileType,
        size: file.size || "0 KB",
        mimeType: file.mimeType,
        parents: file.parents,
      };
    });
  };

  // React Query for area-based search
  const {
    data: areaSearchFiles = [],
    isLoading: isAreaSearchLoading,
    error: areaSearchError,
    refetch: refetchAreaSearch,
    isError: isAreaSearchError,
  } = useQuery({
    queryKey: [
      "files",
      locationState.selectedDivision,
      locationState.selectedDistrict,
      locationState.selectedUpazila,
      locationState.selectedKhatianType,
    ],
    queryFn: async () => {
      const {
        selectedDivision,
        selectedDistrict,
        selectedUpazila,
        selectedKhatianType,
      } = locationState;

      if (
        !selectedDivision ||
        !selectedDistrict ||
        !selectedUpazila ||
        !selectedKhatianType
      ) {
        throw new Error("Missing required area information");
      }

      const result = await fetchFiles(
        selectedDivision,
        selectedDistrict,
        selectedUpazila,
        selectedKhatianType
      );

      return transformGoogleDriveFiles(result);
    },
    enabled:
      isAreaSearch &&
      !!(
        locationState.selectedDivision &&
        locationState.selectedDistrict &&
        locationState.selectedUpazila &&
        locationState.selectedKhatianType
      ),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  // Create areaInfo object for easy access
  const areaInfo = useMemo(
    () => ({
      selectedDivision: locationState.selectedDivision || "",
      selectedDistrict: locationState.selectedDistrict || "",
      selectedUpazila: locationState.selectedUpazila || "",
      selectedKhatianType: locationState.selectedKhatianType || "",
      quickSearchQuery: locationState.quickSearchQuery || "",
    }),
    [locationState]
  );

  const parseQuickSearchResults = (results) => {
    if (!results) return [];

    // If it's already an array, return it
    if (Array.isArray(results)) return results;

    // If it's a string, try to parse it
    if (typeof results === "string") {
      try {
        return JSON.parse(results);
      } catch (error) {
        console.error("Failed to parse quickSearchResults:", error);
        return [];
      }
    }

    return [];
  };

  // Determine which files to use based on search type
  const files = useMemo(() => {
    if (isQuickSearch) {
      // Parse quick search results properly
      const quickResults = parseQuickSearchResults(
        locationState.quickSearchResults
      );
  
      return transformGoogleDriveFiles(quickResults);
    } else {
      // Use area search results
      return areaSearchFiles;
    }
  }, [isQuickSearch, locationState.quickSearchResults, areaSearchFiles]);

  // Loading and error states
  const isLoading = isAreaSearch ? isAreaSearchLoading : false;
  const error = isAreaSearch ? areaSearchError : null;
  const isError = isAreaSearch ? isAreaSearchError : false;

  // Memoized file types for filter
  const fileTypes = useMemo(() => {
    if (!files || files.length === 0) return ["All"];
    const types = [...new Set(files.map((file) => file.type))];
    return ["All", ...types.sort()];
  }, [files]);

  // Handle file selection
  const toggleFileSelection = (id) => {
  setSelectedFiles((prev) => {
    const newSelection = prev.includes(id) 
      ? prev.filter((fileId) => fileId !== id) 
      : [...prev, id];
    
    console.log('Files selected:', newSelection.length);
    return newSelection;
  });
};
  // Memoized filtered and searched files
  const filteredAndSearchedFiles = useMemo(() => {
    if (!files || files.length === 0) return [];

    let filtered =
      filterType === "All"
        ? files
        : files.filter((file) => file.type === filterType);

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [files, filterType, searchQuery]);

  // Handle "select all" checkbox
  const toggleSelectAll = () => {
    if (
      selectedFiles.length === filteredAndSearchedFiles.length &&
      filteredAndSearchedFiles.length > 0
    ) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredAndSearchedFiles.map((file) => file.id));
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedFiles([]);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSelectedFiles([]);
    setShowMobileSearch(false);
  };

  // Handle filter change
  const handleFilterChange = (type) => {
    setFilterType(type);
    setShowFilterMenu(false);
    setSelectedFiles([]);
  };
const usePackageData = () => {
  return useQuery({
    queryKey: ['packageData'],
    queryFn: async () => {
      try {
        console.log('Fetching package data...'); // ডিবাগিং
        
        const token = await packageApi();
        console.log('Token received:', token ? 'Yes' : 'No'); // ডিবাগিং
        
        if (!token) throw new Error('Could not retrieve token');

        const decoded = decodeToken(token);
        console.log('Decoded data:', decoded); // ডিবাগিং
        
        if (!decoded) throw new Error('Could not decode token');

        const packageData = decoded?.data?.[0];
        console.log('Package data:', packageData); // ডিবাগিং
        
        return packageData; // ✅ RETURN the actual package object
      } catch (error) {
        console.error('Package data fetch error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // ✅ cacheTime পরিবর্তে gcTime ব্যবহার করুন
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: true, // ✅ true করুন
    enabled: true, // ✅ স্পষ্টভাবে enabled করুন
  });
};
          
const { data: packageData, isLoading: isPackageLoading, error: packageError } = usePackageData();
useEffect(() => {
  console.log('Package data changed:', packageData);
  console.log('Package loading:', isPackageLoading);
  if (packageError) console.log('Package error:', packageError);
}, [packageData, isPackageLoading, packageError]);

const { totalPrice, selectedPackage } = useMemo(() => {
  console.log('Calculating package...', { packageData, selectedFilesCount: selectedFiles.length });

  if (!packageData || isPackageLoading) {
    console.log('Package data not available yet');
    return { totalPrice: 0, selectedPackage: null };
  }

  // ✅ Fix structure if data nested
  const packageInfo = Array.isArray(packageData?.data)
    ? packageData.data[0]
    : packageData;

  if (!packageInfo) {
    console.log('Package info not found');
    return { totalPrice: 0, selectedPackage: null };
  }

  const selectedCount = selectedFiles.length;

  if (selectedCount === 0) {
    console.log('No files selected');
    return { totalPrice: 0, selectedPackage: null };
  }

  const regularPackages = packageInfo?.regular || [];
  const proPackages = packageInfo?.pro || [];

  console.log('Available packages:', { regular: regularPackages, pro: proPackages });

  const packages = [
    ...regularPackages,
    ...proPackages,
  ]
    .map((pkg) => {
      const limit = Number(pkg.file_limit || 0);
      const price = parseFloat(pkg.price_per_file || '0');
      const unitPrice = limit > 0 ? price / limit : 0;

      return {
        ...pkg,
        limit,
        unitPrice,
        price_per_file: price,
      };
    })
    .filter(pkg => pkg.limit > 0)
    .sort((a, b) => a.limit - b.limit);

  console.log('Processed packages:', packages);

  if (packages.length === 0) {
    console.log('No valid packages found');
    return { totalPrice: 0, selectedPackage: null };
  }

  for (let i = 0; i < packages.length; i++) {
    const current = packages[i];
    const next = packages[i + 1];

    if (selectedCount <= current.limit) {
      const result = {
        totalPrice: Math.ceil(selectedCount * current.unitPrice),
        selectedPackage: current
      };
      console.log('Selected package:', result);
      return result;
    }

    if (next && selectedCount > current.limit && selectedCount < next.limit) {
      const result = {
        totalPrice: Math.ceil(selectedCount * current.unitPrice),
        selectedPackage: current
      };
      console.log('Selected package (in range):', result);
      return result;
    }
  }

  const lastPackage = packages[packages.length - 1];
  const result = {
    totalPrice: Math.ceil(selectedCount * lastPackage.unitPrice),
    selectedPackage: lastPackage
  };
  console.log('Selected package (last):', result);
  return result;
}, [packageData, selectedFiles.length, isPackageLoading]); // 👈 updated dependencies

console.log(selectedPackage)

  // Handle retry
  const handleRetry = () => {
    if (isAreaSearch) {
      refetchAreaSearch();
    } else {
      // For quick search, you might want to refresh the page or go back
      window.location.reload();
    }
  };

  // Handle purchase
const handlePurchase = () => {
  // ✅ Prevent purchase when no files are selected
  if (selectedFiles.length === 0) {
    //alert('দয়া করে কমপক্ষে একটি ফাইল নির্বাচন করুন'); // "Please select at least one file"
    return;
  }

  // Get selected file details
  const selectedFileDetails = files.filter(file => selectedFiles.includes(file.id));
  
  // Checkout data to pass
  const checkoutData = {
    selectedFiles: selectedFileDetails,
    selectedFileIds: selectedFiles,
    packageInfo: selectedPackage,
    totalAmount: totalPrice,
    fileCount: selectedFiles.length,
    searchInfo: {
      searchType: isQuickSearch ? 'quick' : 'area',
      ...(isQuickSearch ? 
        { quickSearchQuery: areaInfo.quickSearchQuery } : 
        {
          division: areaInfo.selectedDivision,
          district: areaInfo.selectedDistrict,
          upazila: areaInfo.selectedUpazila,
          khatianType: areaInfo.selectedKhatianType
        }
      )
    },
    timestamp: new Date().toISOString()
  };

  // Navigate to checkout page with data
  navigate('/checkout', { 
    state: checkoutData,
    replace: false 
  });
};

  // Go back function
  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  // Get header title based on search type
  const getHeaderTitle = () => {
    if (isQuickSearch) {
      return `"${convertNumberToBangla(areaInfo.quickSearchQuery)}" এর জন্য অনুসন্ধান ফলাফল`;
    } else if (isAreaSearch) {
      return `ফাইল অনুসন্ধান ফলাফল - ${areaInfo.selectedDivision} > ${areaInfo.selectedDistrict} > ${areaInfo.selectedUpazila} > ${areaInfo.selectedKhatianType}`;
    }
    return "অনুসন্ধান ফলাফল";
  };

  const getMobileHeaderTitle = () => {
    if (isQuickSearch) {
      return "অনুসন্ধান ফলাফল";
    }
    return "অনুসন্ধান ফলাফল";
  };

  const getAreaInfo = () => {
    if (isQuickSearch) {
      return `"${areaInfo.quickSearchQuery}" এর জন্য ${
        locationState.totalResults || files.length
      } টি ফাইল`;
    } else if (isAreaSearch) {
      return `${areaInfo.selectedDivision} > ${areaInfo.selectedDistrict} > ${areaInfo.selectedUpazila} > ${areaInfo.selectedKhatianType}`;
    }
    return "";
  };

  // Check if we have valid search data
  const hasValidSearchData =
    isQuickSearch || (isAreaSearch && areaInfo.selectedDivision);

  // Render missing search info state
  if (!hasValidSearchData) {
    return <ValidSearch goBack={goBack} />;
  }

  // Render loading state
  if (isLoading) {
    return <ResultLoading getAreaInfo={getAreaInfo} />;
  }

  // Render error state
  if (isError || error) {
    return (
      <ErrorResult error={error} handleRetry={handleRetry} goBack={goBack} />
    );
  }

  // Show message when no files found
  if (!files || files.length === 0) {
    return (
      <FilesFoundMessage
        isQuickSearch={isQuickSearch}
        areaInfo={areaInfo}
        getAreaInfo={getAreaInfo}
        goBack={goBack}
      />
    );
  }
console.log(filteredAndSearchedFiles)
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 pb-20 md:pb-4">
      {/* Header */}
      <ResultPageHeader
        goBack={goBack}
        getAreaInfo={getAreaInfo}
        getHeaderTitle={getHeaderTitle}
        getMobileHeaderTitle={getMobileHeaderTitle}
        showMobileSearch={showMobileSearch}
        setShowMobileSearch={setShowMobileSearch}
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        clearSearch={clearSearch}
      />

      <div className="w-full bg-white md:border border-gray-300 md:rounded-lg shadow-sm p-4 relative">
        {/* Header with checkbox and controls */}
        <ResultSearchBar
          handleFilterChange={handleFilterChange}
          showFilterMenu={showFilterMenu}
          setShowFilterMenu={setShowFilterMenu}
          fileTypes={fileTypes}
          selectedFiles={selectedFiles}
          filteredAndSearchedFiles={filteredAndSearchedFiles}
          filterType={filterType}
          clearSearch={clearSearch}
          handleSearchChange={handleSearchChange}
          searchQuery={searchQuery}
          toggleSelectAll={toggleSelectAll}
          totalPrice={totalPrice} selectedPackage={selectedPackage} 
        />

        {/* File boxes */}
        {filteredAndSearchedFiles?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 md:gap-4 mb-16">
            {filteredAndSearchedFiles?.map((file) => (
             <ResultCard
                key={file.id || file._id || file.name}
                file={file}
                selectedFiles={selectedFiles}
                toggleFileSelection={toggleFileSelection}
                getFileIcon={getFileIcon}
                handleViewFile={handleViewFile}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 md:py-16">
            <svg
              className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
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
            <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">
              কোন ফাইল পাওয়া যায়নি
            </h3>
            <p className="text-sm md:text-base text-gray-500 px-4">
              আপনার অনুসন্ধান মানদণ্ড অনুযায়ী কোন ফাইল খুঁজে পাওয়া যায়নি।
            </p>
            {(searchQuery || filterType !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterType("All");
                  setSelectedFiles([]);
                  setShowMobileSearch(false);
                }}
                className="mt-3 text-green-600 hover:text-green-800 font-medium text-sm md:text-base"
              >
                সব ফিল্টার সাফ করুন
              </button>
            )}
          </div>
        )}

        {/* Summary box - responsive positioning */}
          <SummaryBox totalPrice={totalPrice} selectedPackage={selectedPackage} selectedFiles={selectedFiles} handlePurchase={handlePurchase}/>
      </div>

      {/* Beautiful Modal for file preview */}
      {showModal && currentFile && (
        <ResultModal
          imageLoading={imageLoading}
          toggleFileSelection={toggleFileSelection}
          selectedFiles={selectedFiles}
          modalContentRef={modalContentRef}
          imageError={imageError}
          modalRef={modalRef}
          handleModalOutsideClick={handleModalOutsideClick}
          handleImageLoad={handleImageLoad}
          handleImageError={handleImageError}
          currentFile={currentFile}
          getFileIcon={getFileIcon}
          downloadLoading={downloadLoading}
          closeModal={closeModal}
          handlePurchase={handlePurchase}
        />
      )}

      {/* Click outside to close filter menu */}
      {showFilterMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowFilterMenu(false)}
        />
      )}
    </div>
  );
};

export default ResultPage;