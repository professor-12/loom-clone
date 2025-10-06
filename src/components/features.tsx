import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { HiMiniArrowRight } from "react-icons/hi2";
import { IoCheckmark } from "react-icons/io5";



const Features = () => {
      return (
            <>
                  <div className='max-w-5xl mx-auto w-full flex items-center gap-12 max-sm:flex-col-reverse  px-6 max-sm:pt-20 pt-12 pb-20'>
                        <div className='overflow-hidden border lg:h-[35rem]  flex-1 rounded-4xl relative'>
                              <video src="/hero-bubb.mp4" className='size-[15rem] absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] rounded-full object-cover' autoPlay loop></video>
                              <Image src={"/bunn.png"} className='w-full h-full object-center' width={700} height={100} alt='Visual Studio Code Image' />
                        </div>
                        <div className='flex col-span-2 min-w-[40%]'>
                              <div className='w-full'>
                                    <h1 className='text-3xl font-bold'>Engage and connect <br />with video</h1>
                                    <p className='text-xl leading-7 mt-4 sm:max-w-[20rem]'>Easily collaborate by adding emojis, comments, tasks and CTAs to your video message. Empower remote teams to communicate better across timezones using transcripts and captions in 50+ languages.</p>
                                    <Link href={"/login"} className='text-blue-600 items-center flex font-bold text-xl mt-12'>Connect over video <HiMiniArrowRight /> </Link>
                              </div>
                        </div>
                  </div>
                  {/* Use cases */}
                  <div className='px-6 py-20'>
                        <h1 className='text-center text-6xl mb-10 font-bold'>Video messaging for all use cases</h1>
                        <div className='grid md:grid-cols-2 py-12 gap-20 lg:grid-cols-3  sm:grid-cols-1 xl:grid-cols-4'>
                              <div className='lg:flex cursor-pointer hover:scale-105 duration-200 transition-all'>
                                    <div className='rounded-4xl md:p-11 p-8 pt-8 gap-4 bg-[#EDFDD4] flex items-center md:flex-col'>
                                          <Image className='aspect-square min-w-0 flex-1 w-full max-h-[11.1rem] rounded-2xl bg-black/20 mx-auto' src={"/sales.avif"} alt='' width={200} height={200} />
                                          <div className='flex-1'>

                                                <div className='text-2xl font-bold md:text-center mt-8'>Sales</div>
                                                <p className='md:text-center max-w-[13rem] md:mx-auto font-mono'>Personalize your pitch with video outreach to close more deals</p>
                                          </div>
                                    </div>
                              </div>
                              <div className='lg:flex cursor-pointer hover:scale-105 duration-200 transition-all'>
                                    <div className='rounded-4xl  items-center md:p-11 p-8 pt-8 gap-4 bg-[#F5EBFA] flex md:flex-col'>
                                          <Image className='aspect-square min-w-0 flex-1 w-full max-h-[11.1rem] rounded-2xl bg-black/20 mx-auto' src={"/engineering.avif"} alt='' width={200} height={200} />
                                          <div className='flex-1'>
                                                <div className='text-2xl font-extrabold md:text-center mt-8'>Engineering</div>
                                                <p className='md:text-center max-w-[13rem] font-mono md:mx-auto'>Add visual context to your code to accelerate your sprints</p>
                                          </div>
                                    </div>
                              </div>
                              <div className='items-center lg:flex cursor-pointer hover:scale-105 duration-200 transition-all'>
                                    <div className='items-center rounded-4xl md:p-11 p-8 pt-8 gap-4 bg-[#E4EDF9] flex md:flex-col'>
                                          <Image className='aspect-square min-w-0 flex-1 w-full max-h-[11.1rem] rounded-2xl bg-black/20 mx-auto' src={"/support.avif"} alt='' width={200} height={200} />
                                          <div className='flex-1'>
                                                <div className='text-2xl font-bold text-center mt-8'>Customer support</div>
                                                <p className='text-center max-w-[13rem] md:mx-auto font-mono'>Personalize your pitch with video outreach to close more deals</p>
                                          </div>
                                    </div>
                              </div>
                              <div className='items-center lg:flex cursor-pointer hover:scale-105 duration-200 transition-all'>
                                    <div className=' items-center rounded-4xl md:p-11 p-8 pt-8 gap-4 bg-[#FDF3D2] flex md:flex-col'>
                                          <Image className='aspect-square min-w-0 flex-1 w-full max-h-[11.1rem] rounded-2xl bg-black/20 mx-auto' src={"/design.avif"} alt='' width={200} height={200} />
                                          <div className='flex-1'>
                                                <div className='text-2xl font-bold text-center mt-8'>Design</div>
                                                <p className='md:text-center max-w-[13rem] mx-auto font-mono'>Share ideas  and provide feedback over video to enhance designs</p>
                                          </div>
                                    </div>
                              </div>

                        </div>
                  </div>

                  {/*  */}
                  <div className='mx-auto w-full  gap-10  px-6 max-sm:pt-20 pt-12 pb-20'>
                        <h1 className='text-center md:text-[60px] xl:text-[70px] font-extrabold tracking-tighter max-md:text-4xl max-sm:text-3xl'>Powerful features for easy, custom recordings</h1>
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