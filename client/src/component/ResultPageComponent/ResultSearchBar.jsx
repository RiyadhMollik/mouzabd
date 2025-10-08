import React from 'react';
import { convertNumberToBangla } from '../../utils/englishToBangla';

const ResultSearchBar = ({handleFilterChange,showFilterMenu,setShowFilterMenu,fileTypes ,selectedFiles,filteredAndSearchedFiles, filterType,clearSearch,handleSearchChange,searchQuery,toggleSelectAll}) => {
    return (
      <>
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-3 mb-6 gap-3">
                 <div className="flex items-center">
                   <input
                     type="checkbox"
                     className="w-5 h-5 mr-2 accent-green-600 cursor-pointer"
                     checked={
                       selectedFiles.length === filteredAndSearchedFiles.length &&
                       filteredAndSearchedFiles.length > 0
                     }
                     onChange={toggleSelectAll}
                   />
                   <span className="font-medium text-gray-800 text-sm md:text-base">
                     সকলগুলি নির্বাচন করুন
                     {filteredAndSearchedFiles.length > 0 && (
                       <span className="text-gray-500 text-sm ml-1">
                         ({convertNumberToBangla(filteredAndSearchedFiles.length)} টি)
                       </span>
                     )}
                   </span>
                 </div>
       
                 {/* Search and Filter Controls */}
                 <div className="flex items-center space-x-3 w-full sm:w-auto">
                   {/* Desktop Search Box */}
                   <div className="hidden lg:block relative flex-1">
                     <input
                       type="text"
                       placeholder="ফাইল খুঁজুন..."
                       value={searchQuery}
                       onChange={handleSearchChange}
                       className="border border-gray-300 hover:border-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none px-3 py-1 pr-8 rounded text-sm transition-colors w-48"
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
                     {!searchQuery && (
                       <svg
                         xmlns="http://www.w3.org/2000/svg"
                         className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
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
                     )}
                   </div>
       
                   {/* Filter Button */}
                   <div className="relative">
                     <button
                       className={`border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 px-3 md:px-4 py-1 rounded flex items-center text-gray-700 transition-colors text-sm ${
                         filterType !== "All"
                           ? "bg-green-50 border-green-300 text-green-700"
                           : ""
                       }`}
                       onClick={() => setShowFilterMenu(!showFilterMenu)}
                     >
                       <span>ফিল্টার</span>
                       {filterType !== "All" && (
                         <span className="ml-1 text-xs bg-green-100 text-green-600 px-1 rounded hidden sm:inline">
                           {filterType}
                         </span>
                       )}
                       <svg
                         xmlns="http://www.w3.org/2000/svg"
                         className="h-4 w-4 ml-1"
                         fill="none"
                         viewBox="0 0 24 24"
                         stroke="currentColor"
                       >
                         <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M19 9l-7 7-7-7"
                         />
                       </svg>
                     </button>
       
                     {showFilterMenu && (
                       <div className="absolute lg:right-0 top-10 mt-1 w-32 md:w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                         {fileTypes.map((type) => (
                           <button
                             key={type}
                             className={`w-full text-left px-3 md:px-4 py-2 hover:bg-gray-100 transition-colors text-sm ${
                               filterType === type
                                 ? "bg-green-50 text-green-600"
                                 : "text-gray-700"
                             }`}
                             onClick={() => handleFilterChange(type)}
                           >
                             {type}
                             {filterType === type && (
                               <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 className="h-4 w-4 inline ml-2"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 stroke="currentColor"
                               >
                                 <path
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                                   strokeWidth={2}
                                   d="M5 13l4 4L19 7"
                                 />
                               </svg>
                             )}
                           </button>
                         ))}
                       </div>
                     )}
                   </div>
                 </div>
               </div>
        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-4 p-2 md:p-3 bg-green-50 border border-green-200 rounded text-sm">
            <span className="text-green-700">
              "{searchQuery}" এর জন্য {filteredAndSearchedFiles.length} টি ফাইল
              পাওয়া গেছে
            </span>
            {filteredAndSearchedFiles.length === 0 && (
              <span className="text-green-600 ml-2">
                - অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন
              </span>
            )}
          </div>
        )}

      </>
    );
}

export default ResultSearchBar;
