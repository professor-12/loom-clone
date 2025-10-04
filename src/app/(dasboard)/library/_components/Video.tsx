// "use client"
import { auth } from '@/actions/auth.actions'
import { Button } from '@/components/ui/button'
import { div } from 'motion/react-client'
import Image from 'next/image'
import { BiCommentDetail } from 'react-icons/bi'
import { FaRegSmile } from 'react-icons/fa'
import { LuEye } from 'react-icons/lu'
// import React, { useState } from 'react'

const Video = () => {
      // const [openVideo, setOpenVideo] = useState(false)
      return (
            <div>
                  <div className='flex justify-between'>
                        <h1 className='font-bold text-lg'>Videos</h1>
                        <div className='flex items-center gap-3'>
                              <Button variant={"outline"} className='rounded-lg font-semibold text-black/99 text-xs'>Upload Date</Button>
                              <Button variant={"outline"} className='rounded-lg font-semibold text-black/90 text-xs'>Newest to Oldest</Button>
                        </div>
                  </div>

                  <div className='grid py-12 gap-3 xl:grid-cols-4  sm:grid-cols-2 lg:grid-cols-3 grid-cols-1'>
                        <VideoCard />
                        <VideoCard />
                        <VideoCard />
                        <VideoCard />
                        <VideoCard />
                  </div>
            </div>
      )
}

export default Video



export const VideoCard = async () => {
      const { data } = await auth()
      return <div className='overflow-hidden flex flex-col cursor-pointer rounded-3xl transition-all duration-200 hover:ring-primary ring-transparent ring-2  h-[22rem] bg-slate-300/30'>
            <div className='h-[50%] bg-black/30'></div>
            <div className='flex-1 p-3 pb-6 flex flex-col justify-between'>
                  <div className='flex items-center gap-2'>
                        <div className='size-8 flex-center font-bold bg-slate-300 rounded-full'>
                              <h1 className='capitalize'>{data?.email.substring(0, 1)}</h1>
                        </div>
                        <div>
                              <h1 className='font-bold'>Badejo Emmanuel</h1>
                              <p className='text-xs'>Public</p>
                        </div>
                  </div>
                  <div className='font-bold'>This is the Video</div>
                  <div className='flex text-muted-foreground font-light items-center gap-4'>
                        <p className='flex items-center gap-1'>
                              <LuEye />
                              <span className='text-sm'>0</span>
                        </p>
                        <p className='flex items-center gap-1'>
                              <BiCommentDetail />
                              <span className='text-sm'>4</span>
                        </p>
                        <p className='flex items-center gap-1'>
                              <FaRegSmile />
                              <span className='text-sm'>2</span>
                        </p>
                  </div>
            </div>
      </div>
}