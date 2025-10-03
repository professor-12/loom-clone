"use client";
import React, { useEffect } from "react";
import useScreenRecord from "@/hooks/useScreenRecord";

const ScreenRecorder = () => {
      const {
            startRecording,
            stopRecording,
            stopScreenShare,
            stopCamera,
            stream,
            isRecording,
            isCameraOn,
            isScreenSharing,
            videoUrl,
            setupStream
      } = useScreenRecord();



      return (
            <div className="p-4 border rounded-lg flex flex-col gap-4 w-[400px]">
                  <h2 className="font-semibold text-lg">Screen Recorder</h2>

                  {/* Live Preview */}
                  {stream && (
                        <video
                              className="rounded border"
                              ref={(video) => {
                                    if (video && stream) {
                                          video.srcObject = stream;
                                          video.play();
                                    }
                              }}
                              autoPlay
                              muted
                        />
                  )}

                  {/* Controls */}
                  <div className="flex gap-2 flex-wrap">
                        {!isRecording ? (
                              <button
                                    onClick={startRecording}
                                    className="px-4 py-2 bg-green-600 text-white rounded"
                              >
                                    Start Recording
                              </button>
                        ) : (
                              <button
                                    onClick={stopRecording}
                                    className="px-4 py-2 bg-red-600 text-white rounded"
                              >
                                    Stop Recording
                              </button>
                        )}

                        {isScreenSharing && (
                              <button
                                    onClick={stopScreenShare}
                                    className="px-4 py-2 bg-yellow-600 text-white rounded"
                              >
                                    Stop Screen Share
                              </button>
                        )}

                        {isCameraOn && (
                              <button
                                    onClick={stopCamera}
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                              >
                                    Stop Camera
                              </button>
                        )}
                  </div>

                  {/* Status */}
                  <div className="text-sm text-gray-700 space-y-1">
                        <p>🎥 Recording: {isRecording ? "Yes" : "No"}</p>
                        <p>🖥️ Screen Sharing: {isScreenSharing ? "Yes" : "No"}</p>
                        <p>📷 Camera: {isCameraOn ? "Yes" : "No"}</p>
                  </div>

                  {/* Recorded Video Playback */}
                  {videoUrl && (
                        <div>
                              <h3 className="font-medium">Recorded Video</h3>
                              <video src={videoUrl} controls className="w-full rounded mt-2" />
                        </div>
                  )}
            </div>
      );
};

export default ScreenRecorder;
