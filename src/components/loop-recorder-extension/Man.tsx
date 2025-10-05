"use client"
import React, { useEffect, useState } from 'react'
import OverLayay from './overlay'
import { Grid2x2, Home, Mic, MicOff, Pause, Play, RotateCcw, Square, Video, VideoOff, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import useScreenRecord from '@/hooks/useScreenRecord'
import UploadProgressModal from '../upload-progress'
import axios from 'axios'
import { toast } from 'sonner'

const LoopVideoEngine = ({ onClose }: { onClose: () => void }) => {
      const [useCamera, setUseCamera] = useState(true)
      const [useMicrophone, setUseMicrophone] = useState(true)
      const [progress, setProgress] = useState(0);
      const [open, setOpen] = useState(false);
      const [cancelTokenSource, setCancelTokenSource] = useState<any>(null);


      const upLoadVideo = async (finalStream: Blob) => {
            setOpen(true);
            setProgress(0);
            const formData = new FormData()
            formData.set("file", finalStream)
            const source = axios.CancelToken.source();
            setCancelTokenSource(source);

            try {
                  await axios.post("/api/video/upload", formData, {
                        cancelToken: source.token,
                        onUploadProgress: (event) => {
                              if (event.total) {
                                    const percent = Math.round((event.loaded * 100) / event.total);
                                    setProgress(percent);
                              }
                        },
                  });

                  setProgress(100);
                  setOpen(false)
                  toast.success("Video uploaded successfully")
                  // close()
            } catch (err: any) {
                  if (axios.isCancel(err)) {
                        console.log("Upload canceled");
                        toast.error("Upload canceled")
                  } else {
                        console.error(err);
                        toast.error("Failed to upload Video to the server")
                  }
                  setOpen(false);
            } finally {
                  close()
            }
      }

      const {
            startRecording,
            stopRecording,
            pauseRecording,
            resumeRecording,
            isPaused,
            cameraStream,
            recordedBlob,
            recording,
            isNotPermitted,
            startCamera,
            startMic,
            stopMic,
            startScreen,
            stopCamera,
            stopAll
      } = useScreenRecord(upLoadVideo);

      useEffect(() => {
            startCamera()
            startMic()
            startScreen()
      }, [])

      const close = () => {
            stopAll()
            onClose()
      }
      useEffect(() => {
            if (isNotPermitted) {
                  toast.error("Please accept permission")
                  close()
            }
      }, [isNotPermitted])

      const handlePlay = () => {
            const audio = new Audio("https://www.gstatic.com/meet/sounds/join_call_6a6a67d6bcc7a4e373ed40fdeff3930a.ogg");
            audio.play().catch((err) => console.error("Playback failed:", err));
      };


      return (
            <>
                  {
                        !recording &&
                        <div>
                              <OverLayay />
                        </div>
                  }
                  <UploadProgressModal open={open} progress={progress} />
                  {
                        !recording && !open &&
                        <div className={`fixed  duration-150 transition-all text-muted z-20 w-[18rem] px-5 top-12  rounded-3xl p-4 bg-[#1F1F21] right-12`}>
                              <div className='text-white/60 justify-between flex items-center'>
                                    <X onClick={close} className='cursor-pointer' />
                                    <a href="/"><Home /></a>
                              </div>
                              <div className='space-y-3 font-bold  pt-5'>
                                    <div className='hover:bg-primary flex items-center gap-2 px-4 rounded-xl transition-all duration-200 bg-[#2C2C2E] cursor-pointer hover:text-white p-3'>
                                          <Grid2x2 />
                                          <span>Window</span>
                                    </div>
                                    <div onClick={() => {
                                          setUseCamera((prev) => {
                                                if (prev) {
                                                      stopCamera()
                                                } else {
                                                      startCamera()
                                                }
                                                return !prev

                                          })
                                    }} className='hover:bg-primary group flex items-center gap-2 px-4 rounded-xl transition-all justify-between duration-200 bg-[#2C2C2E] cursor-pointer hover:text-white p-3'>
                                          <div className='flex items-center gap-1'>
                                                {
                                                      useCamera ?
                                                            <Video /> :
                                                            <VideoOff stroke='red' className='text-red' />
                                                }
                                                <span>Camera</span>
                                          </div>
                                          <span className={`text-xs group-hover:bg-white group-hover:text-primary ${useCamera ? 'bg-green-600/90' : 'bg-[#FB2C36]/70'}  p-2 rounded-lg`}>{useCamera ? "ON" : "OFF"}</span>
                                    </div>
                                    <div onClick={() => {
                                          setUseMicrophone((prev) => {
                                                if (prev) {
                                                      stopMic()
                                                } else {
                                                      startMic()
                                                }
                                                return !prev
                                          }
                                          )
                                    }} className='hover:bg-primary group flex items-center gap-2 px-4 rounded-xl transition-all justify-between duration-200 bg-[#2C2C2E] cursor-pointer hover:text-white p-3'>
                                          <div className='flex items-center gap-1'>
                                                {
                                                      useMicrophone ?
                                                            <Mic /> :
                                                            <MicOff stroke='red' className='text-red' />
                                                }
                                                <span>Microphone</span>
                                          </div>
                                          <span className={`text-xs group-hover:bg-white group-hover:text-primary ${useMicrophone ? 'bg-green-600/90' : 'bg-[#FB2C36]/70'}  p-2 rounded-lg`}>{useMicrophone ? "ON" : "OFF"}</span>
                                    </div>
                                    <div className='w-full'>
                                          {
                                                !recording ?
                                                      <Button onClick={() => { handlePlay(); setTimeout(startRecording, 700); }} className='w-full bg-red-500 font-semibold rounded-xl h-12'>Start Recording</Button>
                                                      :
                                                      <Button onClick={() => stopRecording()} className='w-full bg-red-500 font-semibold rounded-xl h-12'>Stop Recording</Button>
                                          }
                                    </div>
                              </div>
                              <p className='text-center text-xs text-muted/60 pt-3'>5 min recording limits</p>
                        </div>
                  }

                  <div className={`fixed  duration-150 transition-all gap-4 items-end text-muted flex z-20 min-w-[18rem] px-5 bottom-1 left-1  rounded-3xl p-4`}>
                        <div className='size-[20rem] bg-white overflow-hidden rounded-full'>
                              {
                                    cameraStream ?
                                          <video muted className='w-full h-full  object-cover -scale-x-100' autoPlay ref={(el) => el && (el.srcObject = cameraStream) as any}></video> :
                                          <div className='bg-primary flex-center w-full text-5xl font-bold h-full text-white'>B</div>
                              }
                        </div>
                        {/* {
                              recordedBlob &&
                              <video className='w-[24rem] h-[24rem]' autoPlay src={URL.createObjectURL(recordedBlob)}></video>
                        } */}
                        <div className={`${!recording ? 'bg-[#2C2C2E]/60' : 'bg-[#1F1F21]'} flex px-3 space-x-4 py-3 h-12 rounded-2xl ring-4 ring-muted`}>
                              <Square fill={recording ? "red" : "none"} stroke={recording ? "red" : "currentColor"} className='ring-0 cursor-pointer' onClick={stopRecording} />
                              {isPaused ?
                                    <Pause onClick={() => { recording && resumeRecording() }} /> :
                                    <Play onClick={() => recording && pauseRecording()} />
                              }
                              <h2 className='font-bold'>5:30</h2>
                              <div>
                                    <RotateCcw />
                              </div>
                              <Trash2 onClick={close} className='cursor-pointer hover:stroke-accent' />
                        </div>
                  </div >

                  <div></div>
            </>
      )
}

export default LoopVideoEngine