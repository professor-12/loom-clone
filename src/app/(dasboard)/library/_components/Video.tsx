"use client"
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'

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
            </div>
      )
}

export default Video