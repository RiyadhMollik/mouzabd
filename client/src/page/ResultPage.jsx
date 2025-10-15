import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchFiles } from "../utils/api/AdvancedSearch";
import { calculateSurveyPrice, extractSurveyType } from "../utils/api/SurveyPricingApi";

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
import DailyOrderStatus from "../component/packagecomponent/DailyOrderStatus";
import OrderValidationModal from "../component/packagecomponent/OrderValidationModal";
import { decodeToken } from "../utils/TokenDecoder";
import { packageApi } from "../utils/api/CommonApi";
import { convertNumberToBangla } from "../utils/englishToBangla";
import PackageService from "../services/PackageService";
import { requireAuth, getToken } from "../utils/authUtils";

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
  
  // Order validation modal state
  const [showOrderValidation, setShowOrderValidation] = useState(false);
  const [orderData, setOrderData] = useState(null);
  
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

  // Custom sorting function to sort by main serial (first number) then sub serial (last number)
  const sortFilesByName = (filesArray) => {
    if (!filesArray || filesArray.length === 0) return filesArray;

    return [...filesArray].sort((a, b) => {
      const nameA = a.name || '';
      const nameB = b.name || '';

      // Helper to convert Bengali numerals to English
      const bengaliToEnglish = {
        '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
        '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
      };

      const convertBengaliToEnglish = (str) => {
        return str.split('').map(c => bengaliToEnglish[c] || c).join('');
      };

      // Extract main serial (first number) and sub serial (last number before extension)
      // Pattern: "১_আটঘর_২_1_Atghar_2.jpg" 
      // Main serial: 1 (first number)
      // Sub serial: 2 (last number before .jpg)
      
      const getSerials = (name) => {
        // Remove file extension
        const nameWithoutExt = name.replace(/\.[^.]+$/, '');
        
        // Find first number (main serial) - could be Bengali or English
        const firstNumMatch = nameWithoutExt.match(/^([০-৯]+|[0-9]+)/);
        let mainSerial = 0;
        
        if (firstNumMatch) {
          const numStr = firstNumMatch[1];
          // Check if it's Bengali number
          if (/[০-৯]/.test(numStr)) {
            const englishNum = convertBengaliToEnglish(numStr);
            mainSerial = parseInt(englishNum, 10);
          } else {
            mainSerial = parseInt(numStr, 10);
          }
        }
        
        // Find last number (sub serial) - look for number at the end or before extension
        // Pattern could be: _2.jpg or _২.jpg
        const lastNumMatch = nameWithoutExt.match(/[_\s]([০-৯]+|[0-9]+)$/);
        let subSerial = 0;
        
        if (lastNumMatch) {
          const numStr = lastNumMatch[1];
          // Check if it's Bengali number
          if (/[০-৯]/.test(numStr)) {
            const englishNum = convertBengaliToEnglish(numStr);
            subSerial = parseInt(englishNum, 10);
          } else {
            subSerial = parseInt(numStr, 10);
          }
        }
        
        return { mainSerial, subSerial };
      };

      const serialsA = getSerials(nameA);
      const serialsB = getSerials(nameB);

      // First, sort by main serial (first number)
      if (serialsA.mainSerial !== serialsB.mainSerial) {
        return serialsA.mainSerial - serialsB.mainSerial;
      }

      // If main serials are equal, sort by sub serial (last number)
      if (serialsA.subSerial !== serialsB.subSerial) {
        return serialsA.subSerial - serialsB.subSerial;
      }

      // If both serials are equal, do alphabetical sort
      return nameA.localeCompare(nameB, 'bn');
    });
  };

  // Determine which files to use based on search type
  const files = useMemo(() => {
    if (isQuickSearch) {
      // Parse quick search results properly
      const quickResults = parseQuickSearchResults(
        locationState.quickSearchResults
      );
  
      const transformedFiles = transformGoogleDriveFiles(quickResults);
      return sortFilesByName(transformedFiles);
    } else {
      // Use area search results
      return sortFilesByName(areaSearchFiles);
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

// Survey-based pricing calculation
const useSurveyPricing = (selectedFileCount, khatianType) => {
  return useQuery({
    queryKey: ['surveyPricing', khatianType, selectedFileCount],
    queryFn: async () => {
      if (selectedFileCount === 0) {
        return { totalPrice: 0, pricePerFile: 0 };
      }

      try {
        const surveyType = extractSurveyType(khatianType);
        console.log('🏷️ Survey type extracted:', surveyType, 'from khatian:', khatianType);
        
        const response = await calculateSurveyPrice(surveyType, selectedFileCount);
        console.log('💵 Survey price response:', response);
        
        if (response.success && response.pricing) {
          return {
            totalPrice: response.pricing.total_price,
            pricePerFile: response.pricing.price_per_file,
            surveyType: response.pricing.survey_type,
            displayName: response.pricing.display_name,
          };
        }
        
        // Fallback to default pricing
        console.warn('⚠️ Survey pricing response invalid, using fallback');
        return { totalPrice: 0, pricePerFile: 0 };
      } catch (error) {
        console.error('❌ Survey pricing error:', error);
        // Return fallback instead of throwing to allow package pricing to work
        return { totalPrice: 0, pricePerFile: 0 };
      }
    },
    enabled: selectedFileCount > 0 && Boolean(khatianType),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once to fail fast
    retryDelay: 1000,
  });
};
          
const { data: packageData, isLoading: isPackageLoading, error: packageError } = usePackageData();

// Get survey pricing based on khatian type
const { 
  data: surveyPricing, 
  isLoading: isSurveyPricingLoading,
  error: surveyPricingError
} = useSurveyPricing(
  selectedFiles.length, 
  locationState.selectedKhatianType || areaInfo.selectedKhatianType
);

// Debug logging for survey pricing
useEffect(() => {
  console.log('🔍 Survey Pricing Debug:', {
    surveyPricing,
    isSurveyPricingLoading,
    surveyPricingError,
    selectedFilesCount: selectedFiles.length,
    khatianType: locationState.selectedKhatianType || areaInfo.selectedKhatianType
  });
}, [surveyPricing, isSurveyPricingLoading, surveyPricingError, selectedFiles.length]);

useEffect(() => {
  console.log('Package data changed:', packageData);
  console.log('Package loading:', isPackageLoading);
  if (packageError) console.log('Package error:', packageError);
}, [packageData, isPackageLoading, packageError]);

const { totalPrice, selectedPackage } = useMemo(() => {
  console.log('💰 Calculating price...', { 
    surveyPricing, 
    isSurveyPricingLoading,
    packageData, 
    selectedFilesCount: selectedFiles.length,
    khatianType: areaInfo.selectedKhatianType
  });

  // Wait for survey pricing to load if files are selected
  if (selectedFiles.length > 0 && isSurveyPricingLoading) {
    console.log('⏳ Waiting for survey pricing...');
    return { totalPrice: 0, selectedPackage: null };
  }

  // Priority 1: Use survey-based pricing if available
  if (surveyPricing && surveyPricing.totalPrice > 0 && selectedFiles.length > 0) {
    console.log('✅ Using survey-based pricing:', surveyPricing);
    return {
      totalPrice: Math.ceil(surveyPricing.totalPrice),
      selectedPackage: {
        name: surveyPricing.displayName || 'Survey Based Pricing',
        price_per_file: surveyPricing.pricePerFile,
        file_limit: selectedFiles.length,
        package_type: 'survey',
        survey_type: surveyPricing.surveyType
      }
    };
  }

  console.log('⚠️ Survey pricing not available, using package pricing');

  // Priority 2: Use package-based pricing as fallback
  if (!packageData || isPackageLoading) {
    console.log('📦 Package data not available yet');
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
}, [surveyPricing, isSurveyPricingLoading, packageData, selectedFiles.length, isPackageLoading, areaInfo.selectedKhatianType]);

console.log('💳 Final Price:', { totalPrice, selectedPackage });

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
const handlePurchase = async () => {
  // ✅ Prevent purchase when no files are selected
  if (selectedFiles.length === 0) {
    //alert('দয়া করে কমপক্ষে একটি ফাইল নির্বাচন করুন'); // "Please select at least one file"
    return;
  }

  // ✅ Removed authentication check - users can login on checkout page if needed
  // This allows guests to reach checkout page and see pricing/details before logging in

  // Get selected file details
  const selectedFileDetails = files.filter(file => selectedFiles.includes(file.id));
  
  // Prepare checkout data
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

  // Check if user has package with daily limits
  try {
    const packageInfo = await PackageService.hasActivePackageWithLimits();
    
    if (!packageInfo.hasPackage || !packageInfo.hasLimits) {
      // No package or unlimited package, proceed with normal payment
      proceedToCheckout(checkoutData);
      return;
    }

    // User has package with limits, show validation modal
    setOrderData({
      ...checkoutData,
      orderDetails: {
        title: `${selectedFiles.length} ফাইল অর্ডার`,
        price: totalPrice,
        description: `${selectedFiles.length}টি ফাইলের জন্য অর্ডার`,
        selectedFiles: selectedFiles  // Pass selected files for file count
      }
    });
    setShowOrderValidation(true);
    
  } catch (error) {
    console.error('Error checking package status:', error);
    // On error, proceed with normal payment flow
    proceedToCheckout(checkoutData);
  }
};

// Handle free order (within daily limit)
const handleFreeOrder = (validationResult) => {
  setShowOrderValidation(false);
  
  // Add free order flag to order data
  const freeOrderData = {
    ...orderData,
    isFreeOrder: true,
    validationResult: validationResult,
    totalAmount: 0 // Free order
  };
  
  // Navigate directly to checkout page for free orders
  navigate('/checkout', { 
    state: freeOrderData,
    replace: false 
  });
};

// Handle paid order (daily limit exceeded)
const handlePaidOrder = () => {
  setShowOrderValidation(false);
  proceedToCheckout(orderData);
};

// Standard checkout flow
const proceedToCheckout = (checkoutData) => {
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
          
        {/* Daily Order Status - Show for authenticated users */}
        {getToken() && (
          <div className="mt-4">
            <DailyOrderStatus showDetails={true} />
          </div>
        )}
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

      {/* Order Validation Modal */}
      <OrderValidationModal
        isOpen={showOrderValidation}
        onClose={() => setShowOrderValidation(false)}
        onProceedFree={handleFreeOrder}
        onProceedPaid={handlePaidOrder}
        orderDetails={orderData?.orderDetails || {}}
      />

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