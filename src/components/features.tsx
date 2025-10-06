import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { HiMiniArrowRight } from "react-icons/hi2";
import { IoCheckmark } from "react-icons/io5";



const Features = () => {
      return (
            <>
                  <div className='max-w-5xl mx-auto w-full flex items-center gap-12 max-sm:flex-col-reverse  px-6 max-sm:pt-20 pt-12 pb-20'>
                        <div className='overflow-hidden backdrop-invert-100 brightness-75 lg:h-[35rem] bg-blue-50 flex-1 rounded-4xl relative'>
                              <video src="/hero-bubb.mp4" className='size-[15rem] absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] rounded-full object-cover' autoPlay loop></video>
                              <Image src={"/visual-studio-code.webp"} className='w-full h-full object-center' width={700} height={100} alt='Visual Studio Code Image' />
                        </div>
                        <div className='flex col-span-2 min-w-[40%]'>
                              <div className='w-full'>
                                    <h1 className='text-3xl font-bold'>Engage and connect <br />with video</h1>
                                    <p className='text-xl leading-7 mt-4 sm:max-w-[20rem]'>Easily collaborate by adding emojis, comments, tasks and CTAs to your video message. Empower remote teams to communicate better across timezones using transcripts and captions in 50+ languages.</p>
                                    <Link href={"/login"} className='text-blue-600 items-center flex font-bold text-xl mt-12'>Connect over video <HiMiniArrowRight /> </Link>
                              </div>
                        </div>
                  </div>

                  <div className='mx-auto w-full  gap-12   px-6 max-sm:pt-20 pt-12 pb-20'>
                        <h1 className='text-center text-[70px] font-extrabold tracking-tighter max-sm:text-3xl'>Powerful features for easy, custom recordings</h1>
                        <div className='max-w-4xl max-sm:grid-cols-1 pt-16 mx-auto w-full grid gap-y-9 grid-cols-2 gap-3'>
                              <div className='flex items-center gap-3'>
                                    <div className='bg-[#E9F2FE] size-9 p-1 rounded-full flex-center'><IoCheckmark className='text-blue-500 text-5xl' /></div>
                                    <p className='text-xl'>Screen and camera recording</p>
                              </div>
                              <div className='flex items-center gap-3'>
                                    <div className='bg-[#E9F2FE] size-9 p-1 rounded-full flex-center'><IoCheckmark className='text-blue-500 text-5xl' /></div>
                                    <p className='text-xl'>Easy sharing and embedding</p>
                              </div>
                              <div className='flex items-center gap-3'>
                                    <div className='bg-[#E9F2FE] size-9 p-1 rounded-full flex-center'><IoCheckmark className='text-blue-500 text-5xl' /></div>
                                    <p className='text-xl'>Trim and stitch video clips</p>
                              </div>
                              <div className='flex items-center gap-3'>
                                    <div className='bg-[#E9F2FE] size-9 p-1 rounded-full flex-center'><IoCheckmark className='text-blue-500 text-5xl' /></div>
                                    <p className='text-xl'>Download and upload</p>
                              </div>
                              <div className='flex items-center gap-3'>
                                    <div className='bg-[#E9F2FE] size-9 p-1 rounded-full flex-center'><IoCheckmark className='text-blue-500 text-5xl' /></div>
                                    <p className='text-xl'>Transcriptions and closed captions</p>
                              </div>
                              <div className='flex items-center gap-3'>
                                    <div className='bg-[#E9F2FE] size-9 p-1 rounded-full flex-center'><IoCheckmark className='text-blue-500 text-5xl' /></div>
                                    <p className='text-xl'>Video privacy controls</p>
                              </div>
                              <div className='flex items-center gap-3'>
                                    <div className='bg-[#E9F2FE] size-9 p-1 rounded-full flex-center'><IoCheckmark className='text-blue-500 text-5xl' /></div>
                                    <p className='text-xl'>Custom background</p>
                              </div>
                              <div className='flex items-center gap-3'>
                                    <div className='bg-[#E9F2FE] size-9 p-1 rounded-full flex-center'><IoCheckmark className='text-blue-500 text-5xl' /></div>
                                    <p className='text-xl'>Video and viewer insights</p>
                              </div>

                        </div>
                  </div>
            </>
      )
}

export default Features