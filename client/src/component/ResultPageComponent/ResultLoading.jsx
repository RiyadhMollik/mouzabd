import React from 'react';

const ResultLoading = ({getAreaInfo}) => {
    return (
         <div className="w-full min-h-screen p-4 bg-gray-100 flex items-center justify-center">
        <div className="text-center px-4">
          <svg
            className="animate-spin h-10 w-10 md:h-12 md:w-12 text-green-500 mx-auto mb-4"
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
          <p className="text-base md:text-lg font-medium text-gray-700">
            ফাইলগুলি লোড হচ্ছে...
          </p>
          <p className="text-xs md:text-sm text-gray-500 mt-2">
            অনুগ্রহ করে অপেক্ষা করুন
          </p>
          <div className="mt-4 text-xs text-gray-400 break-words">
            {getAreaInfo()}
          </div>
        </div>
      </div>
    );
}

export default ResultLoading;
