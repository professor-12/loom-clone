import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"



const VideoSkeletons = ({ count = 10 }: { count?: number }) => {
      return (
            <div className='grid py-12 gap-4 xl:grid-cols-4  sm:grid-cols-2 lg:grid-cols-3 grid-cols-1'>
                  {
                        [...(Array(count).fill(null))].map((_, index) => {
                              return <VideoSkeleton key={index} />
                        })
                  }
            </div>
      )
}

export default VideoSkeletons


const VideoSkeleton = () => {
      return (
            <div className='overflow-hidden group cursor-pointer rounded-2xl  border-border border'>
                  <Skeleton className="h-[14rem] w-full rounded-b-none" />
                  <div className='p-2 pb-4'>
                        <div className='flex-1 gap-2 py-1 flex'>
                              <div>
                                    <Skeleton className="h-8 w-8 rounded-full" />
                              </div>
                              <div className='flex-1 space-y-1'>
                                    <Skeleton className="h-5 w-[80%]" />
                                    <Skeleton className="h-3 w-[20%]" />
                              </div>
                        </div>
                        <div className='my-3'>
                              <Skeleton className="h-5 w-[60%]" />
                        </div>
                        <div className='flex  text-muted-foreground font-light items-center gap-4'>
                              <Skeleton className="h-5 w-[60%]" />
                        </div>
                  </div>
            </div>
      )
}

