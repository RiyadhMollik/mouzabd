import { Eye } from 'lucide-react';
import React from 'react';

const ResultCard = ({file,selectedFiles,toggleFileSelection,getFileIcon,handleViewFile}) => {
    return (
        <>
   <div
                key={file.id}
                className={`border ${
                  selectedFiles.includes(file.id)
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                } rounded-md h-24 md:h-32 relative transition-colors cursor-pointer`}
                onClick={() => toggleFileSelection(file.id)}
              >
                <input
                  type="checkbox"
                  className="absolute top-1 m-2 md:top-2 left-1 md:left-2 w-3 h-3 md:w-4 md:h-4 accent-green-600 "
                  checked={selectedFiles.includes(file.id)}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFileSelection(file.id);
                  }}
                />

                <button
                  onClick={(e) => handleViewFile(file, e)}
                  className="absolute top-1 md:top-2 right-1 md:right-2 w-6 h-6 md:w-8 md:h-8 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors z-10"
                  title="ফাইল দেখুন"
                >
                  <Eye className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                </button>

                <div className="absolute inset-0 flex flex-col items-center justify-center p-1 md:p-2">
                  {/* File type icon */}
                  <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center mb-1 md:mb-2">
                    {getFileIcon(file.type)}
                  </div>

                  {/* Filename */}
                  <span
                    className="text-xs text-center truncate w-full px-1"
                    title={file.name}
                  >
                    {file.name}
                  </span>
                  {/* <span className="text-xs text-gray-500 mt-1">{file.size}</span> */}
                </div>
              </div>
        </>
    );
}

export default ResultCard;
