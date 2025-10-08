import React, { useState } from 'react';
import { Plus, Minus, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { decodeToken } from '../../utils/TokenDecoder';
import { getFaq } from '../../utils/api/CommonApi';
import { useQuery } from '@tanstack/react-query';

const FAQSection = () => {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (index) => {
    setOpenItem(prev => prev === index ? null : index);
  };

  // API call hook
  const { 
    data: apiData, 
    isLoading, 
    isError, 
    error, 
    refetch,
    isFetching 
  } = useQuery({
    queryKey: ['FaqData'],
    queryFn: async () => {
      const token = await getFaq();
      
      if (!token) {
        throw new Error('Could not retrieve token');
      }
      
      const decoded = decodeToken(token);
      // console.log('Decoded FAQ Data:', decoded);
      
      if (!decoded) {
        throw new Error('Could not decode token');
      }
      
      return decoded;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  // Process FAQ data based on API response structure
  const getFaqData = () => {
    if (!apiData) return [];
    
    // Handle different possible API response structures
    if (Array.isArray(apiData)) {
      return apiData;
    } else if (apiData.data && Array.isArray(apiData.data)) {
      return apiData.data;
    } else if (apiData.faqs && Array.isArray(apiData.faqs)) {
      return apiData.faqs;
    } else if (apiData.items && Array.isArray(apiData.items)) {
      return apiData.items;
    }
    
    return [];
  };

  const faqData = getFaqData();

  // Loading state
  if (isLoading) {
    return (
      <div className=" flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">FAQ তথ্য লোড হচ্ছে...</h2>
          <p className="text-gray-600">অনুগ্রহ করে অপেক্ষা করুন</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className=" flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">তথ্য লোড করতে সমস্যা</h2>
          <p className="text-gray-600 mb-6">
            {error?.message || 'FAQ তথ্য লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'}
          </p>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isFetching ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!faqData || faqData.length === 0) {
    return (
      <div className=" flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">কোনো তথ্য পাওয়া যায়নি</h2>
          <p className="text-gray-600 mb-6">
            বর্তমানে কোনো FAQ তথ্য উপলব্ধ নেই।
          </p>
          
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="container mx-auto px-4 py-10 sm:py-16">
        {/* Header */}
        <div className="text-center mb-12 mt-5"  data-aos="zoom-in-down"
    data-aos-offset="20"
    data-aos-delay="20"
    data-aos-duration="1000"
    data-aos-easing="ease-in-out"
    data-aos-mirror="true"
    data-aos-once="false">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
              প্রশ্ন ও উত্তর
            </h1>
            {isFetching && (
              <Loader2 className="w-6 h-6 animate-spin text-green-600 ml-3" />
            )}
          </div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            আপনার যেকোন প্রশ্নের উত্তর পেতে আমাদের FAQ দেখুন।
          </p>
         
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4"  data-aos="fade-up"
    data-aos-offset="20"
    data-aos-delay="20"
    data-aos-duration="1000"
    data-aos-easing="ease-in-out"
    data-aos-mirror="true"
    data-aos-once="false">
          {faqData.map((item, index) => {
            const isOpen = openItem === index;
            
            return (
              <div
                key={item.id || index}
                className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50   transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-4 sm:px-8 py-3 lg:py-6 text-left flex items-center justify-between hover:bg-white/50 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center ">
                      <span className="text-white font-bold text-lg">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-lg sm:text-xl font-semibold text-gray-800 leading-relaxed group-hover:text-green-700 transition-colors">
                      {item.question || item.title || `প্রশ্ন ${index + 1}`}
                    </span>
                  </div>
                  
                  <div className="flex-shrink-0 ml-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen 
                        ? 'bg-green-100 text-green-600 rotate-180' 
                        : 'bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-600'
                    }`}>
                     {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />} 
                    </div>
                  </div>
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                 <div className="px-6 sm:px-8 pb-6">
  <div className="ml-1 lg:ml-12 border-l-4 border-green-200 pl-4 rounded-r-xl py-4">
    <div
      className="text-base sm:text-lg text-gray-700 leading-relaxed"
      dangerouslySetInnerHTML={{
        __html: item.answer || item.description || item.content || 'উত্তর উপলব্ধ নেই।'
      }}
    />
  </div>
</div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default FAQSection;