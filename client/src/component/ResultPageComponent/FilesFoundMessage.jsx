import React from 'react';

const FilesFoundMessage = ({isQuickSearch,areaInfo,getAreaInfo,goBack}) => {
    return (
        <div className="w-full min-h-screen p-4 bg-gray-100 flex items-center justify-center">
        <div className="text-center p-6 md:p-8 bg-white rounded-lg shadow-md max-w-sm md:max-w-md mx-4">
          <svg
            className="h-12 w-12 md:h-16 md:w-16 text-yellow-500 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h2 className="text-lg md:text-xl font-semibold mb-2">
            কোন ফাইল পাওয়া যায়নি
          </h2>
          <p className="text-sm md:text-base text-gray-700 mb-4">
            {isQuickSearch
              ? `"${areaInfo.quickSearchQuery}" এর জন্য কোন ফাইল পাওয়া যায়নি।`
              : "নির্বাচিত এলাকায় কোন ফাইল পাওয়া যায়নি।"}
          </p>
          <div className="text-xs md:text-sm text-gray-500 mb-4 break-words">
            {getAreaInfo()}
          </div>
          <button
            onClick={goBack}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors text-sm md:text-base"
          >
            ফিরে যান
          </button>
        </div>
      </div>
    );
}

export default FilesFoundMessage;
