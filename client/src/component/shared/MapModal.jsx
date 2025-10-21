import React, { useRef, useState } from 'react';
import { X, FileText, Download, Copy } from 'lucide-react';
import download from 'downloadjs';
import { getBaseUrl } from '../../utils/baseurls';

const MapModal = ({
  selectedMap,
  closeModal,
  selectedFiles = [],
  toggleFileSelection = () => {},
  getFileIcon = () => {}
}) => {
  const currentFile = selectedMap;

  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState({ jpg: false, pdf: false });
  const [errorInfo, setErrorInfo] = useState(null); // <-- নতুন state popup এরর রাখার জন্য

  const modalRef = useRef(null);
  const modalContentRef = useRef(null);

  const handleModalOutsideClick = (e) => {
    if (modalRef.current === e.target) {
      closeModal();
    }
  };

  const handleImageLoad = () => setImageLoading(false);
  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleDownload = async (format) => {
    if (!currentFile) return;

    setDownloadLoading(prev => ({ ...prev, [format]: true }));

    try {
      const token = localStorage.getItem("token");
      const downloadUrl = `${getBaseUrl()}/drive/convert-file/?file_id=${currentFile.id}&format=${format}`;

      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      if (format === "pdf" && blob.size === 0) {
        throw new Error("PDF file is empty");
      }

      const fileExtension = format === "pdf" ? ".pdf" : ".jpg";
      const safeName = currentFile.name?.trim();
      const fileName = safeName
        ? (safeName.endsWith(fileExtension) ? safeName : `${safeName}${fileExtension}`)
        : `file_${currentFile.id}${fileExtension}`;

      download(blob, fileName);

    } catch (error) {
      console.error(`Download ${format.toUpperCase()} failed:`, error);

      // 🔥 এখন আর alert না, popup এ দেখানো হবে
      let message = "";
      if (error.message.includes("PDF file is empty")) {
        message = "PDF ফাইল খালি। সার্ভার থেকে সঠিক ডেটা আসছে না।";
      } else if (error.message.includes("HTTP error")) {
        message = `সার্ভার এরর: ${error.message}. অনুগ্রহ করে আবার চেষ্টা করুন।`;
      } else {
        message = `${format.toUpperCase()} ডাউনলোড করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।`;
      }

      setErrorInfo({
        message,
        link: `https://drive.google.com/file/d/${currentFile.id}/view`
      });
    } finally {
      setDownloadLoading(prev => ({ ...prev, [format]: false }));
    }
  };

  const handleCopyLink = () => {
    if (errorInfo?.link) {
      navigator.clipboard.writeText(errorInfo.link);
    }
  };

  if (!currentFile) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 flex items-center justify-center p-4 z-80 bg-transparent"
      onClick={handleModalOutsideClick}
    >
      <div
        ref={modalContentRef}
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 scale-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b ">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900 truncate max-w-md">
              {currentFile.name}
            </h3>
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
              <p className="text-center">এই ফাইলটি প্রিভিউ করা যাচ্ছে না, তবে আপনি এটি ডাউনলোড করতে পারেন</p>
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
              onClick={() => handleDownload('jpg')}
              disabled={downloadLoading.jpg}
              className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors w-full sm:w-auto"
            >
              {downloadLoading.jpg ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  JPG ডাউনলোড হচ্ছে...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  JPG ডাউনলোড করুন
                </>
              )}
            </button>

            <button
              onClick={() => handleDownload('pdf')}
              disabled={downloadLoading.pdf}
              className="flex items-center justify-center px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg font-medium transition-colors w-full sm:w-auto"
            >
              {downloadLoading.pdf ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  PDF ডাউনলোড হচ্ছে...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  PDF ডাউনলোড করুন
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Popup */}
        {errorInfo && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
              <h4 className="text-red-600 font-bold mb-3">এরর!</h4>
              <p className="mb-4 text-gray-700">{errorInfo.message}</p>

              <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <span className="text-sm text-gray-600 truncate">{errorInfo.link}</span>
                <button
                  onClick={handleCopyLink}
                  className="ml-2 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded flex items-center"
                >
                  <Copy className="w-4 h-4 mr-1" /> কপি
                </button>
              </div>

              <a
                href={errorInfo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                সরাসরি ড্রাইবে এক্সেস করুন
              </a>

              <button
                onClick={() => setErrorInfo(null)}
                className="mt-3 text-sm text-gray-500 hover:underline"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapModal;
