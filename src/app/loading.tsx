import Dot from '@/components/LogoAnimation'
import React from 'react'

const Loading = () => {
      return (
            <div className='h-screen w-full flex-center bg-[#F2F2F2]'>
                  <div className='flex flex-col'>
                        <Dot />
                  </div>
            </div>
      )
}

export default Loading