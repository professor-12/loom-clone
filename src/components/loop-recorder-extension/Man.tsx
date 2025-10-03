"use client"
import React, { useEffect, useState } from 'react'
import OverLayay from './overlay'
import { Camera, Grid2x2, Home, Mic, MicOff, Octagon, Pause, PauseCircle, Play, RotateCcw, Square, Trash, Upload, Video, VideoOff, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import useScreenRecord from '@/hooks/useScreenRecord'

const LoopVideoEngine = ({ onClose }: { onClose: () => void }) => {
      const [useCamera, setUseCamera] = useState(true)
      const [useMicrophone, setUseMicrophone] = useState(true)
      const upLoadVideo = (finalStream: MediaStream) => {
            console.log(finalStream)
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
            stopAll,
            toggleCamera,
            toggleMic
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
                  close()
            }
      }, [isNotPermitted])


      return (
            <>
                  {
                        !recording &&
                        <div onClick={close}>
                              <OverLayay />
                        </div>
                  }
                  {
                        !recording &&
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
                                                      <Button onClick={() => startRecording()} className='w-full bg-red-500 font-semibold rounded-xl h-12'>Start Recording</Button>
                                                      :
                                                      <Button onClick={() => stopRecording()} className='w-full bg-red-500 font-semibold rounded-xl h-12'>Stop Recording</Button>
                                          }
                                    </div>
                              </div>
                              <p className='text-center text-xs text-muted/60 pt-3'>5 min recording limits</p>
                        </div>
                  }

                  <div onDragStart={(e) => { console.log(e) }} onMouseOver={(e) => { console.log(e) }} className={`fixed  duration-150 transition-all gap-4 items-end text-muted flex z-20 min-w-[18rem] px-5 bottom-1 left-1  rounded-3xl p-4`}>
                        <div className='size-[20rem] bg-white overflow-hidden rounded-full'>
                              <video muted className='w-full h-full  object-cover -scale-x-100' autoPlay ref={(el) => el && (el.srcObject = cameraStream) as any}></video>
                        </div>
                        {
                              recordedBlob &&
                              <video className='w-[24rem] h-[24rem]' autoPlay src={URL.createObjectURL(recordedBlob)}></video>
                        }
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