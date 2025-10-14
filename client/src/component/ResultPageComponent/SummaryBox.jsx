import React from 'react';
import { convertNumberToBangla } from '../../utils/englishToBangla';

const SummaryBox = ({totalPrice,selectedPackage,selectedFiles,handlePurchase}) => {
  console.log(selectedPackage)
  // Helper to hide file extension
  const getFileBaseName = (name) => name ? name.replace(/\.[^/.]+$/, '') : '';
  return (
    <>
      <div className="fixed bottom-50 lg:bottom-80 right-4 left-auto border-t md:border border-gray-300 bg-white p-4 w-48 md:w-64 md:rounded-md shadow-lg z-20">
        <div className="block">
          <div className="flex-1 md:w-full">
            <div className="border-b border-gray-200 pb-2 mb-2">
              <div className="flex justify-between">
                <span className="text-gray-700 text-sm">ফাইল সংখ্যা:</span>
                <span className="font-medium text-sm truncate ml-2">
                  <span className="font-medium text-base">{convertNumberToBangla(selectedFiles.length || 0)}</span>
                </span>
              </div>
              {/* Show selected file names without extension */}
              {selectedFiles.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="truncate">{getFileBaseName(file.name)}</div>
                  ))}
                </div>
              )}
            </div>

              {/* <div className=" border-b border-gray-200 pb-2 mb-2">
                <div className="flex justify-between">
                  <span className="text-gray-700 text-sm">প্যাকেজ:</span>
                  <span
                    className="font-medium text-sm truncate ml-2"
                    
                  >

                    {
                  selectedFiles.length === 0? <span className="font-medium text-sm">N/A</span>:<span className="font-medium text-sm">{selectedPackage?.field_name}</span>
                  }
                    
                  </span>
                </div>
              </div> */}
              <div className="flex justify-between border-b border-gray-200 pb-2 mb-2">
                <span className="text-gray-700 text-sm">মূল্য:</span>
                {
                  selectedFiles.length === 0? <span className="font-medium text-sm">0 ৳</span>:<span className="font-medium text-sm">{convertNumberToBangla(totalPrice)} ৳</span>
                }
                
              </div>
            </div>
            <div className=" ml-0 mt-3 animate-bounce items-center block">
              <button
                className={`px-4 py-2 w-full rounded text-sm ${
                  selectedFiles.length > 0
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                } transition-colors whitespace-nowrap`}
                disabled={selectedFiles.length === 0}
                onClick={handlePurchase}
              >
                কিনুন ({convertNumberToBangla(selectedFiles.length)})
              </button>
            </div>
          </div>
        </div>
        </>
    );
}

export default SummaryBox;
