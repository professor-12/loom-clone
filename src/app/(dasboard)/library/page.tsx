import React from 'react'
import Header from './_components/header'
import { Metadata } from 'next'
import Tab from './_components/tab'
import Video from './_components/Video'

export const metadata: Metadata = {
      title: "Video | Library | Loop"
}

const Page = async () => {
      await Promise.resolve()
      return (
            <div className='pt-15'>
                  <div className='space-y-12'>
                        <Header />
                        <div className='flex border-b w-full justify-between'>
                              <Tab />
                              <div className='text-sm font-medium text-muted-foreground/60'>
                                    <p className=''>6 videos</p>
                              </div>
                        </div>
                        <div>
                              <Video />
                        </div>
                  </div>
            </div>
      )
}

export default Page