"use client";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import React from "react";

interface UploadProgressModalProps {
      open: boolean;
      progress: number;
      onCancel?: () => void;
}

const UploadProgressModal: React.FC<UploadProgressModalProps> = ({
      open,
      progress,
      onCancel,
}) => {
      return (
            <AnimatePresence>
                  {open && (
                        <motion.div
                              className="fixed inset-0 z-[999999999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                        >
                              <motion.div
                                    className="bg-white dark:bg-neutral-900 p-6 rounded-2xl w-[90%] max-w-sm shadow-lg"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                              >
                                    <div className="w-full h-3 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden mb-3">
                                          <motion.div
                                                className="h-3 bg-blue-500"
                                                animate={{ width: `${progress}%` }}
                                                transition={{ ease: "easeInOut", duration: 0.2 }}
                                          />
                                    </div>

                                    <div className="flex justify-between items-center">
                                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                {progress < 100 ? `Uploading... ${progress}%` : "Processing..."}
                                          </div>

                                          {onCancel && (
                                                <button
                                                      onClick={onCancel}
                                                      className="text-sm text-red-500 hover:text-red-600 font-medium"
                                                >
                                                      Cancel
                                                </button>
                                          )}
                                    </div>
                              </motion.div>
                        </motion.div>
                  )}
            </AnimatePresence>
      );
};

export default UploadProgressModal;
