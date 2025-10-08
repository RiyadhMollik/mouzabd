import React from 'react';

const ErrorResult = ({error,handleRetry,goBack}) => {
    return (
        <div className="w-full min-h-screen p-4 bg-gray-100 flex items-center justify-center">
        <div className="text-center p-6 md:p-8 bg-white rounded-lg shadow-md max-w-sm md:max-w-md mx-4">
          <svg
            className="h-12 w-12 md:h-16 md:w-16 text-red-500 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-lg md:text-xl font-semibold mb-2 text-red-600">
            সমস্যা হয়েছে!
          </h2>
          <p className="text-sm md:text-base text-gray-700 mb-4">
            {error?.message ||
              "ফাইল লোড করার সময় সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={handleRetry}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors text-sm md:text-base"
            >
              আবার চেষ্টা করুন
            </button>
            <button
              onClick={goBack}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors text-sm md:text-base"
            >
              ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
}

export default ErrorResult;
