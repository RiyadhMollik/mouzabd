import { FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { decodeToken } from "../../utils/TokenDecoder";
import { packageApi } from "../../utils/api/CommonApi";
import { memo, useMemo } from "react";
import BangladeshAdminForm from "../HomeComponents/BangladeshAdminForm";

// Loading component for better reusability
const LoadingSpinner = memo(() => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
));

// Error component for better reusability
const ErrorMessage = memo(({ error, onRetry }) => (
  <div className="text-center p-8 text-red-600">
    <h3 className="text-xl font-bold mb-2">Error</h3>
    <p className="mb-4">{error}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try Again
      </button>
    )}
  </div>
));

// Empty state component
const EmptyState = memo(() => (
  <div className="text-center p-8">
    <h3 className="text-xl font-bold mb-2">No packages available</h3>
    <p>Please check back later.</p>
  </div>
));

// Package card component for better performance
const PackageCard = memo(({ pkg }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="h-4" style={{ backgroundColor: pkg.color }}></div>
    <div className="p-6 flex flex-col items-center">
      <div className="w-16 h-16 flex items-center justify-center rounded-lg mb-4">
        {pkg.icon ? (
          <img 
            src={pkg.icon} 
            alt={pkg.field_name} 
            className="w-12 h-12"
            loading="lazy"
          />
        ) : (
          <FileText className="w-12 h-12" style={{ color: pkg.color }} />
        )}
      </div>
      <h3 className="text-xl lg:text-2xl font-inter1 font-medium text-center">
        {pkg.field_name}
      </h3>
      <h6 className="text-xl font-inter1">দাম: {pkg.price_per_file} টাকা</h6>
      {pkg.is_static === true ? (
        <p className="text-gray-600 mt-2">ফাইল সীমা: {pkg.file_range}</p>
      ) : (
        <p className="text-gray-600 mt-2">ফাইল সীমা: {pkg.file_limit}</p>
      )}
    </div>
  </div>
));

// Package grid component
const PackageGrid = memo(({ packages, title }) => {
  if (!packages || packages.length === 0) return null;

  return (
    <>
      <h5 className="text-lg lg:text-xl xl:text-2xl font-inter1 font-bold my-8">
        {title}
      </h5>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </>
  );
});

// Custom hook for package data fetching
export const usePackageData = () => {
  return useQuery({
    queryKey: ['packageData'],
    queryFn: async () => {
      try {
        const token = await packageApi();
        
        if (!token) {
          throw new Error('Could not retrieve token');
        }
        
        const decoded = decodeToken(token);
        console.log('Decoded token:', decoded); // Debug log
        
        if (!decoded) {
          throw new Error('Could not decode token');
        }
        
        return decoded;
      } catch (error) {
        console.error('Package data fetch error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true, // Changed to true to refetch on focus
    refetchOnMount: true, // Changed to true to always refetch on mount
    refetchOnReconnect: true, // Add this for network reconnection
    enabled: true, // Ensure query is enabled by default
  });
};

export default function Package() {
  const {
    data: decodedToken,
    isLoading,
    error,
    isError,
    refetch
  } = usePackageData();

  // Debug logging
  console.log('Package component render:', {
    isLoading,
    isError,
    hasData: !!decodedToken,
    dataStructure: decodedToken ? Object.keys(decodedToken) : null
  });

  // Memoize package data extraction with better error handling
  const packageData = useMemo(() => {
    if (!decodedToken) {
      console.log('No decoded token available');
      return null;
    }
    
    // Handle different possible data structures
    let data = null;
    if (decodedToken.data && Array.isArray(decodedToken.data) && decodedToken.data.length > 0) {
      data = decodedToken.data[0];
    } else if (decodedToken.data && !Array.isArray(decodedToken.data)) {
      data = decodedToken.data;
    } else if (decodedToken && !decodedToken.data) {
      data = decodedToken;
    }
    
    console.log('Extracted package data:', data);
    return data;
  }, [decodedToken]);

  // Extract individual data with fallbacks
  const text = packageData?.text || null;
  const video_url = packageData?.video_url || null;
  const regular = packageData?.regular || [];
  const pro = packageData?.pro || [];

  // Handle loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Handle error state
  if (isError) {
    return (
      <ErrorMessage 
        error={error?.message || 'An error occurred while fetching package data'} 
        onRetry={refetch}
      />
    );
  }

  // If we have no data after loading
  if (!packageData) {
    console.log('No package data available after loading');
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-bold mb-2">No package data available</h3>
        <p className="mb-4">Unable to load package information.</p>
        <button 
          onClick={refetch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 text-gray-800">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Text side */}
          <div 
            className="w-full md:w-1/2 mb-6 md:mb-0"
            data-aos="fade-down"
            data-aos-offset="20"
            data-aos-delay="20"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            data-aos-mirror="true"
            data-aos-once="false"
          >
            {text ? (
              <div 
                dangerouslySetInnerHTML={{ __html: text }} 
                className="prose max-w-none" 
              />
            ) : (
              <div className="text-center p-4 text-gray-500">
                No text content available
              </div>
            )}
          </div>
          
          {/* Form side */}
          <div 
            className="w-full md:w-1/2"
            data-aos="fade-up"
            data-aos-offset="200"
            data-aos-delay="200"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            data-aos-mirror="true"
            data-aos-once="false"
          >
            <BangladeshAdminForm />
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-inter1 font-bold text-center mb-12 text-green-800">
          আমাদের প্যাকেজ
        </h2>
        
        {/* Regular Packages */}
        <div 
          data-aos="fade-up"
          data-aos-offset="20"
          data-aos-delay="20"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
          data-aos-mirror="true"
          data-aos-once="false"
        >
          <PackageGrid packages={regular} title="রেগুলার" />
        </div>
        
        {/* Pro Packages */}
        <div 
          data-aos="fade-up"
          data-aos-offset="20"
          data-aos-delay="200"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
          data-aos-mirror="true"
          data-aos-once="false"
        >
          <PackageGrid packages={pro} title="ProSeller" />
        </div>
      </div>
    </div>
  );
}