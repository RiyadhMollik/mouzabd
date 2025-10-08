import React, { useEffect } from 'react';
import {  X, FileText,  Download, ExternalLink } from "lucide-react";
// Install: npm install file-saver
// import { saveAs } from 'file-saver';
import download from 'downloadjs';
import { getBaseUrl } from '../../utils/baseurls';

const ResultModal = ({handlePurchase,imageLoading,toggleFileSelection,selectedFiles,modalContentRef,imageError,modalRef,handleModalOutsideClick,handleImageLoad,handleImageError,currentFile,getFileIcon,downloadLoading, handleDownload,closeModal}) => {
    
    //  Using file-saver library 
const handleAutoDownload = async () => {
  try {
    const isPDF = currentFile?.name?.toLowerCase().endsWith(".pdf");

    // Use a different endpoint for PDF to JPG conversion
    const downloadUrl = isPDF
      ? `${getBaseUrl()}/api/drive/preview/?file_id=${currentFile.id}`
      : `${getBaseUrl()}/api/drive/preview/?file_id=${currentFile.id}`;

    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();

    const fileNameBase = currentFile.name?.split(".")[0] || `file_${currentFile.id}`;
    const fileName = `${fileNameBase}.jpg`;

    download(blob, fileName); // Downloads as JPG
  } catch (error) {
    console.error("Download failed:", error);
  }
};



  useEffect(() => {
    if (currentFile && currentFile.type?.startsWith("image")) {
      handleAutoDownload();
    }
  }, [currentFile]);


  

    return (
        <>
          <div
          ref={modalRef}
          className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-90 backdrop-blur-sm"
          onClick={handleModalOutsideClick}
        >
          <div
            ref={modalContentRef}
            className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-green-500"
                  checked={selectedFiles.includes(currentFile.id)}
                  onChange={() => toggleFileSelection(currentFile.id)}
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                    {currentFile.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      {currentFile.type}
                    </span>
                    {/* <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      {currentFile.size}
                    </span> */}
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-6 max-h-96">
              {imageLoading && (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
                  <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
                </div>
              )}

              {imageError && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <FileText className="w-16 h-16 mb-4" />
                  <h4 className="text-xl font-semibold mb-2">ফাইল প্রিভিউ উপলব্ধ নেই</h4>
                  <p className="text-center">
                    এই ফাইলটি প্রিভিউ করা যাচ্ছে না, তবে আপনি এটি ডাউনলোড করতে পারেন
                  </p>
                </div>
              )}

              {!imageError && (
                <div className="flex justify-center">
                  <img
                    src={`${getBaseUrl()}/api/drive/preview/?file_id=${currentFile.id}`}
                    alt={currentFile.name}
                    className={`max-w-full h-auto max-h-80 object-contain rounded-lg shadow-lg ${imageLoading ? 'hidden' : 'block'}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t bg-gray-50 space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="p-1 bg-gray-200 rounded">
                  {getFileIcon(currentFile.type)}
                </div>
                <span>File ID: {currentFile.id.substring(0, 8)}...</span>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <button
                  onClick={handleAutoDownload}
                  disabled={downloadLoading}
                  className="hidden items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors w-full sm:w-auto"
                >
                  {downloadLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      ডাউনলোড হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      ফ্রী ডাউনলোড করুন
                    </>
                  )}
                </button>

 <button
  onClick={() => {
  if (!selectedFiles.includes(currentFile.id)) {
    toggleFileSelection(currentFile.id);

    // ছোট্ট delay দিয়ে handlePurchase কল করি
    setTimeout(() => {
      handlePurchase();
    }, 100); // 100ms delay is enough
  } else {
    handlePurchase();
  }
}}
  className="flex items-center text- justify-center px-4 py-2 bg-[#FFD700] hover:bg-[#E6BE00] text-black rounded-lg font-medium transition-colors w-full sm:w-auto"
>
  <ExternalLink className="w-4 h-4 mr-2" />
  প্রিমিয়াম কোয়ালিটি ফাইল ডাউনলোড
</button>



                {/* <button
                  onClick={closeModal}
                  className="flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors w-full sm:w-auto"
                >
                  বন্ধ করুন
                </button> */}
              </div>
            </div>
          </div>
        </div>  
        </>
    );
}

export default ResultModal;