import React from 'react'

import { Download } from "lucide-react"
const HeroSection = () => {
      return (
            <div className='w-full bg-light-foreground min-h-[100dvh] flex py-28 pb-20 gap-6 items-center justify-center flex-col'>
                  <h1 className='text-6xl text-dark-primary-foreground text-center text-[67.3077px] font-extrabold tracking-tighter'>One video is worth a thousand words</h1>
                  <p className=' text-[#3d2e7c] text-[27.4615px] max-w-[840.154px] text-balance text-center '>Easily record and share AI-powered video messages with your teammates and customers to supercharge productivity</p>
                  <div className='flex items-center pt-6 gap-5'>
                        <button className='text-lg cursor-pointer font-medium bg-[#565ADD] border-[5px] border-[#9FA1EC] p-4 text-white rounded-full'>Get Loom for free</button>
                        <button className=' bg-[#f0f1ff] hover:shadow-[0px_0px_1.5rem] hover:shadow-[#565ADD]/50 hover:scale-3d transform-3d transition-all duration-100 hover:-translate-1 cursor-pointer text-[#565add] font-semibold p-4 flex-center  rounded-full'> <Download className='text-[12px] mr-2' size={20} />Install Chrome extension</button>
                  </div>
                  <div className='aspect-video relative overflow-hidden hover: w-full mx-auto md:w-[90%] lg:max-w-[80%] rounded-[3rem] bg-black'>
                        <div className=''></div>
                        <figure className='w-full h-full'>
                              <video className='object-contain' loop muted src="https://cdn.loom.com/sessions/thumbnails/313bf71d20ca47b2a35b6634cefdb761-00001.mp4"></video>
                        </figure>
                  </div>
            </div>
      )
}

export default HeroSection