import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const SectionThree = () => {
      return (
            <div className='pt-20 md:py-24'>
                  <div className='px-4'>
                        <h1 className='sm:text-5xl text-3xl text-center max-sm:text-left font-bold'>The easiest screen recorder you’ll ever use</h1>
                        <p className='text-center md:text-2xl text-lg max-md:text-left lg:mt-4 mt-3 foo'>Record in a few clicks. Share anywhere. Collaborate better.</p>
                  </div>

                  <div className='px-4  md:py-24'>
                        <div className='w-full mx-auto gap-12 lg:max-w-[70%] grid grid-cols-2 max-md:grid-cols-1'>
                              <div className='mt-20'>
                                    <div className='flex flex-1  gap-4'>
                                          <div className='max-md:hidden'>
                                                <div className='bg-[#FFEBE7] animate-pulse size-12 rounded-full flex-center'>
                                                      <div className='bg-[#FF623E] animate-pulse duration-300 size-4 rounded-full'></div>
                                                </div>
                                          </div>
                                          <div className='space-y-4'>
                                                <h1 className='text-2xl lg:text-3xl font-bold'>Lightning fast screen <br /> recording</h1>
                                                <p className='text-lg lg:text-xl text-left'>Easily record your screen and camera. <br /> Record on any device using Loop’s Chrome extension, <br /> desktop app or mobile app.</p>
                                                <Link href={"/login"}>
                                                      <button className='p-4 text-white font-black  px-6 rounded-full bg-primary'>Record now</button>
                                                </Link>
                                          </div>
                                    </div>
                              </div>
                              <div className='overflow-hidden rounded-4xl max-h-[34rem] max-md:w-full relative flex-1 aspect-square'>
                                    <Image width={2000} height={2000} loading='lazy' alt='' className='rounded-4xl' src={"/banner(2).webp"} />
                              </div>
                        </div>
                  </div>
                  <div className='w-full space-y-4 text-white py-24 bg-black md:rounded-[45px] p-4 mx-auto md:max-w-[95%]'>
                        <h1 className='text-white text-4xl font-bold text-center'>Keep your content safe</h1>
                        <p className='font-medium mt-5 text-center xl:max-w-3xl max-w-2xl text-xl md:text-2xl mx-auto'>Enterprise-grade security to keep your data and your customer’s data private and secure. We offer SSO, SCIM as well as custom data retention policies and privacy settings.</p>

                  </div>
            </div>
      )
}

export default SectionThree