import React from 'react';
import { File, Image, X } from 'lucide-react';

interface DocumentViewerProps {
  url: string;
  onClose: () => void;
}

export function DocumentViewer({ url, onClose }: DocumentViewerProps) {
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(url);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative max-w-4xl w-full h-[80vh] mx-4 bg-white rounded-lg shadow-xl">
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="h-full p-4 flex items-center justify-center">
          {isImage ? (
            <img
              src={url}
              alt="Document preview"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <iframe
              src={url}
              title="Document preview"
              className="w-full h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}