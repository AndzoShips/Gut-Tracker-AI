"use client";

import { useRef } from "react";
import { Modal, Button, IconButton } from "@whop/frosted-ui";

interface MealScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelected: (image: string) => void;
}

export default function MealScanModal({ isOpen, onClose, onImageSelected }: MealScanModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }
    
    console.log("File selected:", file.name, file.type, file.size);
    
    const reader = new FileReader();
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      alert("Failed to read image file. Please try again.");
    };
    reader.onloadend = () => {
      if (reader.result) {
        console.log("File read successfully, calling onImageSelected");
        // Reset the input so the same file can be selected again
        if (e.target) {
          e.target.value = "";
        }
        onImageSelected(reader.result as string);
        onClose();
      } else {
        console.error("FileReader result is null");
        alert("Failed to process image. Please try again.");
        // Reset the input on error too
        if (e.target) {
          e.target.value = "";
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  return (
    <>
      <Modal
        open={isOpen}
        onClose={(open) => !open && onClose()}
        className="!max-w-sm bg-transparent dark:bg-transparent"
        body={{
          children: (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-green-500 uppercase tracking-widest">Scan</p>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Your Meal</h2>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close scan modal"
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Choose how you'd like to add your meal. Take a live photo or upload one from your gallery.
                </p>
              </div>

              <div className="grid gap-3">
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                  <Button
                    onClick={handleCameraClick}
                    className="w-full flex flex-col gap-1 py-6 border-gray-300 dark:border-gray-600"
                  >
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-lg font-semibold">Take Photo</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Use your device camera</p>
                  </Button>
                </div>

                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                  <Button
                    onClick={handleUploadClick}
                    className="w-full flex flex-col gap-1 py-6 border-gray-300 dark:border-gray-600"
                  >
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-lg font-semibold">Upload Image</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Choose from your library</p>
                  </Button>
                </div>
              </div>
            </div>
          ),
        }}
      />

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </>
  );
}

