import React from 'react';

const ResultPageHeader = ({searchQuery,handleSearchChange,clearSearch,goBack,getAreaInfo,getHeaderTitle,getMobileHeaderTitle,showMobileSearch ,setShowMobileSearch}) => {
    return (
       <>
       
         <div className="bg-white border-b md:bg-transparent md:border-0 p-4">
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <button
            onClick={goBack}
            className="md:hidden flex items-center text-gray-600 hover:text-gray-800 transition-colors mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <h2 className="text-sm md:text-2xl font-semibold flex-1 md:flex-none">
            <span className="hidden md:inline">{getHeaderTitle()}</span>
            <span className="md:hidden">{getMobileHeaderTitle()}</span>
          </h2>

          {/* Mobile search toggle */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
          </button>
        </div>

        {/* Mobile area info */}
        <div className="md:hidden text-xs text-gray-500 break-words">
          {getAreaInfo()}
        </div>
      </div> 
      {showMobileSearch && (
        <div className="md:hidden bg-white border-b p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="ফাইল খুঁজুন..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full border border-gray-300 hover:border-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none px-3 py-2 pr-8 rounded text-sm transition-colors"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
       </>
    );
}

export default ResultPageHeader;
