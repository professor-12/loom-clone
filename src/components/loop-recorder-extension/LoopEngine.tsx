"use client"
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
      Grid2x2,
      Home,
      Mic,
      MicOff,
      Pause,
      Play,

      Square,
      Video,
      VideoOff,
      X,
      Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import useScreenRecord from "@/hooks/useScreenRecord";
import UploadProgressModal from "../upload-progress";
import axios from "axios";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import OverLayay from "./overlay";
import { motion } from "motion/react";
import DeleteModal from "../modals/DeleteModal";

const LoopVideoEngine = ({ onClose }: { onClose: () => void }) => {
      const { push } = useRouter();
      const [useCamera, setUseCamera] = useState(true);
      const [useMicrophone, setUseMicrophone] = useState(true);
      const [progress, setProgress] = useState(0);
      const [open, setOpen] = useState(false);
      const [abortController, setAbortController] = useState<AbortController | null>(null);
      const videoRef = useRef<HTMLVideoElement | null>(null);

      const {
            startRecording,
            stopRecording,
            pauseRecording,
            resumeRecording,
            isPaused,
            cameraStream,
            recording,
            isNotPermitted,
            startCamera,
            startMic,
            stopMic,
            startScreen,
            stopCamera,
            stopAll,
            duration
      } = useScreenRecord(upLoadVideo);

      useEffect(() => {
            const el = videoRef.current;
            if (el) {
                  el.srcObject = cameraStream ?? null;
                  el.play().catch(() => { });
            }
            return () => {
                  if (el) {
                        try {
                              (el as HTMLVideoElement).srcObject = null;
                        } catch (e) { }
                  }
            };
      }, [cameraStream]);

      useEffect(() => {
            startCamera();
            startMic();
            return () => {
                  stopAll({ upload: false });
                  if (abortController) abortController.abort();
            };
      }, []);

      useEffect(() => {
            if (isNotPermitted) {
                  toast.error("Please accept permission");
                  close();
            }
      }, [isNotPermitted]);

      async function upLoadVideo(finalStream: Blob) {
            if (!finalStream) return;

            setOpen(true);
            setProgress(0);

            const formData = new FormData();
            formData.append("file", finalStream, "recording.webm");

            const controller = new AbortController();
            setAbortController(controller);
            try {
                  await axios.post("/api/video/upload", formData, {
                        signal: controller.signal,
                        onUploadProgress: (event) => {
                              if (event.total) {
                                    const percent = Math.round((event.loaded * 100) / event.total);
                                    setProgress(percent);
                              }
                        },
                  });

                  setProgress(100);
                  toast.success("Video uploaded successfully");
                  push("/library");
            } catch (err: any) {
                  if (err?.code === "ERR_CANCELED" || err?.name === "CanceledError") {
                        console.log("Upload canceled");
                        toast.error("Upload canceled");
                  } else {
                        console.error(err);
                        toast.error("Failed to upload Video to the server");
                  }
            } finally {
                  setOpen(false);
                  setAbortController(null);
                  close();
            }
      }

      const cancelUpload = () => {
            if (abortController) {
                  abortController.abort();
                  setAbortController(null);
            }
      };

      const startRecordingSafely = async () => {
            // handlePlay()
            startRecording();
      };

      const close = (cancel: boolean = false) => {
            stopAll({ upload: cancel });
            onClose();
      };

      return (
            <>
                  {!recording && (
                        <div onClick={_ => close(false)}>
                              <OverLayay />
                        </div>
                  )}

                  <UploadProgressModal
                        open={open}
                        progress={progress}
                  />
                  {!recording && !open && (
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} className="fixed text-muted z-[99999999] w-[18rem] top-12 right-12 rounded-3xl p-4 bg-[#1F1F21]">
                              <div className="text-white/60 justify-between flex items-center">
                                    <X onClick={() => close(true)} className="cursor-pointer" aria-label="close overlay" />
                                    <Link href="/">
                                          <Home aria-label="home" />
                                    </Link>
                              </div>

                              <div className="space-y-3 font-bold pt-5">
                                    <div className="hover:bg-primary flex items-center gap-2 px-4 rounded-xl transition-all duration-200 bg-[#2C2C2E] cursor-pointer hover:text-white p-3">
                                          <Grid2x2 />
                                          <span>Window</span>
                                    </div>

                                    <div
                                          onClick={() => {
                                                setUseCamera((prev) => {
                                                      if (prev) {
                                                            stopCamera();
                                                      } else {
                                                            startCamera();
                                                      }
                                                      return !prev;
                                                });
                                          }}
                                          className="hover:bg-primary group flex items-center gap-2 px-4 rounded-xl transition-all justify-between duration-200 bg-[#2C2C2E] cursor-pointer hover:text-white p-3"
                                    >
                                          <div className="flex items-center gap-1">
                                                {useCamera ? <Video /> : <VideoOff stroke="red" className="text-red" />}
                                                <span>Camera</span>
                                          </div>
                                          <span
                                                className={`text-xs group-hover:bg-white group-hover:text-primary ${useCamera ? "bg-green-600/90" : "bg-[#FB2C36]/70"
                                                      } p-2 rounded-lg`}
                                          >
                                                {useCamera ? "ON" : "OFF"}
                                          </span>
                                    </div>

                                    <div
                                          onClick={() => {
                                                setUseMicrophone((prev) => {
                                                      if (prev) stopMic();
                                                      else startMic();
                                                      return !prev;
                                                });
                                          }}
                                          className="hover:bg-primary group flex items-center gap-2 px-4 rounded-xl transition-all justify-between duration-200 bg-[#2C2C2E] cursor-pointer hover:text-white p-3"
                                    >
                                          <div className="flex items-center gap-1">
                                                {useMicrophone ? <Mic /> : <MicOff stroke="red" className="text-red" />}
                                                <span>Microphone</span>
                                          </div>
                                          <span
                                                className={`text-xs group-hover:bg-white group-hover:text-primary ${useMicrophone ? "bg-green-600/90" : "bg-[#FB2C36]/70"
                                                      } p-2 rounded-lg`}
                                          >
                                                {useMicrophone ? "ON" : "OFF"}
                                          </span>
                                    </div>

                                    <div className="w-full">
                                          {!recording ? (
                                                <Button
                                                      onClick={() => {
                                                            startRecordingSafely();
                                                      }}
                                                      className="w-full bg-red-500 font-semibold rounded-xl h-12"
                                                >
                                                      Start Recording
                                                </Button>
                                          ) : (
                                                <Button onClick={() => stopRecording(true)} className="w-full bg-red-500 font-semibold rounded-xl h-12">
                                                      Stop Recording
                                                </Button>
                                          )}
                                    </div>
                              </div>

                              <p className="text-center text-xs text-muted/60 pt-3">5 min recording limits</p>
                        </motion.div>
                  )}

                  <div className="fixed z-[9999999] duration-150 transition-all gap-4 items-end text-muted flex  min-w-[18rem] px-5 bottom-1 left-1 rounded-3xl p-4">
                        <motion.div animate={{ scale: 1 }} initial={{ scale: 0.2 }} transition={{ duration: .09 }} className="w-[20rem] aspect-square bg-white overflow-hidden rounded-full">
                              {cameraStream ? (
                                    <video
                                          muted
                                          className="w-full h-full object-cover -scale-x-100"
                                          autoPlay
                                          playsInline
                                          ref={videoRef}
                                    />
                              ) : (
                                    <div className="bg-primary flex-center w-full text-5xl font-bold h-full text-white">B</div>
                              )}
                        </motion.div>

                        <div className={`${!recording ? "bg-[#2C2C2E]/60" : "bg-[#1F1F21]"} flex px-3 space-x-4 py-3 h-12 rounded-2xl ring-4 ring-muted`}>
                              <Square
                                    fill={recording ? "red" : "none"}
                                    stroke={recording ? "red" : "currentColor"}
                                    className="ring-0 cursor-pointer"
                                    onClick={async () => {
                                          if (recording) stopRecording(true);
                                    }}
                                    aria-label="stop"
                              />

                              {recording ? (
                                    isPaused ? (
                                          <Play className="cursor-pointer" onClick={() => resumeRecording()} aria-label="resume" />
                                    ) : (
                                          <Pause className="cursor-pointer" onClick={() => pauseRecording()} aria-label="pause" />
                                    )
                              ) : (
                                    <Play className="opacity-50 cursor-not-allowed" aria-hidden />
                              )}

                              <h2 className="font-bold">{new Date(duration * 1000).toISOString().substr(14, 5)}</h2>
                              <Trash2 onClick={() => close(false)} className="cursor-pointer hover:stroke-accent" aria-label="delete/close" />
                        </div>
                  </div >
            </>
      );
};

export default LoopVideoEngine;
