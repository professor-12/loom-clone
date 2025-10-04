import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const SecondHero = () => {
      return (

            <div className='py-20 md:py-24 space-y-3 md:space-y-12 flex flex-col items-center'>
                  <h1 className='text-center mx-auto max-md:text-2xl text-5xl text-balance md:max-w-[70%]  font-semibold text-dark-primary-foreground'>Millions of people across 400,000 <br /> companies choose Loop</h1>
                  <Link href={"/signup"} className='mx-auto block'>
                        <button className='text-lg cursor-pointer font-medium bg-[#565ADD] border-[5px] border-[#9FA1EC] p-4 text-white rounded-full'>Get Loop for free</button>
                  </Link>
                  <div className='w-full py-6 md:py-12   md:max-w-[95%] mx-auto'>
                        <div className='w-full pb-12 max-md:flex-col md:rounded-[4rem] flex items-center  gap-12 md:px-24 max-md:px-6 aspect-video bg-[#2B1C50]'>
                              <Image src={"/trend.avif"} width={600} height={600} alt='Trend' className="rounded-xl w-[35rem] h-[35rem]" />
                              <div className='space-y-3 md:space-y-5'>
                                    <h1 className='text-2xl max-md:text-lg font-extrabold text-[#D1D1F7]'>Try for free</h1>
                                    <h1 className='max-md:text-3xl lg:text-7xl tracking-tighter font-extrabold text-[#F0F1FF]'>Loopify</h1>
                                    <p className='lg:text-[30px] text-lg  lg:leading-11 text-[#D1D1F7] font-medium'>Share flawless videos without lifting a finger. Loopify auto-enhances your video and instantly transforms your script into a doc, message, or bug report. Try for free today.</p>
                                    <Link href={"/signup"} className='mx-auto block'>
                                          <button className='text-lg cursor-pointer font-medium bg-[#565ADD] border-[5px] border-[#9FA1EC] p-4 text-white rounded-full'>Try now</button>
                                    </Link>
                              </div>
                        </div>
                  </div>
            </div>
      )
}

export default SecondHero