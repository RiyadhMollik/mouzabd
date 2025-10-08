import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { decodeToken } from "../../utils/TokenDecoder";
import { heroApi } from "../../utils/api/CommonApi";
import Heros from "./Hero2";

// Custom hook for hero data with React Query
const useHeroData = () => {
  return useQuery({
    queryKey: ["heroData"],
    queryFn: async () => {
      const token = await heroApi();

      if (!token) {
        throw new Error("Could not retrieve token");
      }

      const decoded = decodeToken(token);

      if (!decoded) {
        throw new Error("Could not decode token");
      }

      return decoded;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Use React Query for data fetching
  const {
    data: bannerData,
    isLoading,
    error,
    isError,
    refetch,
  } = useHeroData();

  const goToNextSlide = () => {
    if (!isTransitioning && bannerData && bannerData.data[0].items.length > 1) {
      setIsTransitioning(true);
      setCurrentSlide((prev) =>
        prev === bannerData.data[0].items.length - 1 ? 0 : prev + 1
      );
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const goToPrevSlide = () => {
    if (!isTransitioning && bannerData && bannerData.data[0].items.length > 1) {
      setIsTransitioning(true);
      setCurrentSlide((prev) =>
        prev === 0 ? bannerData.data[0].items.length - 1 : prev - 1
      );
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const goToSlide = (index) => {
    if (!isTransitioning && currentSlide !== index) {
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Auto-play functionality
  useEffect(() => {
    if (
      !bannerData ||
      !bannerData.data[0]?.items ||
      bannerData.data[0].items.length <= 1
    ) {
      return;
    }

    const interval = setInterval(() => {
      goToNextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, isTransitioning, bannerData]);

  // Reset slide when data changes
  useEffect(() => {
    if (bannerData && bannerData.data[0]?.items) {
      setCurrentSlide(0);
    }
  }, [bannerData]);

  // Loading state with improved skeleton
  if (isLoading) {
    return (
      <div className="w-full h-96 sm:h-[28rem] md:h-[32rem] lg:h-[36rem] xl:h-[40rem] relative overflow-hidden bg-gray-200 animate-pulse">
        {/* Skeleton background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>

        {/* Skeleton content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          {/* Title skeleton */}
          <div className="w-3/4 max-w-2xl h-12 sm:h-16 md:h-20 bg-white/30 rounded-lg mb-4 animate-pulse"></div>

          {/* Description skeleton */}
          <div className="w-2/3 max-w-xl h-6 sm:h-8 bg-white/20 rounded-lg mb-6 animate-pulse"></div>

          {/* Button skeletons */}
          <div className="flex gap-4">
            <div className="w-24 sm:w-32 h-10 sm:h-12 bg-white/30 rounded-lg animate-pulse"></div>
            <div className="w-24 sm:w-32 h-10 sm:h-12 bg-white/20 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Navigation skeleton */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white/30 rounded-full animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (isError) {
    return (
      <div className="w-full h-96 sm:h-[28rem] md:h-[32rem] lg:h-[36rem] xl:h-[40rem] flex items-center justify-center bg-gray-100">
        <div className="text-center px-4">
          <div className="text-xl text-red-600 mb-4">
            Error: {error?.message || "Failed to load banner content"}
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (
    !bannerData ||
    !bannerData.data ||
    bannerData.data.length === 0 ||
    !bannerData.data[0].items ||
    bannerData.data[0].items.length === 0
  ) {
    return (
      <div className="w-full h-96 sm:h-[28rem] md:h-[32rem] lg:h-[36rem] xl:h-[40rem] flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">No banner content available</div>
      </div>
    );
  }

  const bannerItems = bannerData.data[0].items;

  return (
    <div className="relative w-full h-96 sm:h-[28rem] md:h-[32rem] lg:h-[36rem] xl:h-[40rem] overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {bannerItems.map((item, index) => (
          <div
            key={item.id}
            className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
              currentSlide === index
                ? "opacity-100 z-10 transform scale-100"
                : "opacity-0 z-0 transform scale-105"
            }`}
          >
            {/* Background Image with optimized loading */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Heros/>
         
          </div>
        ))}
      </div>

      {/* Only show navigation controls if there's more than one slide */}
      {bannerItems.length > 1 && (
        <>
          {/* Navigation Arrows - Responsive sizing and positioning */}
          <button
            onClick={goToPrevSlide}
            className="absolute left-2 sm:left-4 md:left-6 top-1/2 transform -translate-y-1/2 p-1 sm:p-2 md:p-3 rounded-full bg-white/20 hover:bg-white/40 text-white z-20 transition-all duration-300 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6 md:w-8 md:h-8" />
          </button>
          <button
            onClick={goToNextSlide}
            className="absolute right-2 sm:right-4 md:right-6 top-1/2 transform -translate-y-1/2 p-1 sm:p-2 md:p-3 rounded-full bg-white/20 hover:bg-white/40 text-white z-20 transition-all duration-300 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6 md:w-8 md:h-8" />
          </button>

          {/* Indicator Dots - Improved styling */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-20">
            {bannerItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "bg-white scale-125"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Hero;
