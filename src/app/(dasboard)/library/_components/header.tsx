import { Button } from '@/components/ui/button'
import React from 'react'
import { PiCaretDownBold } from "react-icons/pi";
const Header = () => {
      return (
            <div className='flex justify-between items-end w-full'>
                  <div className='space-y-1'>
                        <h1 className='font-extrabold text-muted-foreground'>My library</h1>
                        <h3 className='text-3xl font-[900]'>Videos</h3>
                  </div>
                  <div className='gap-2 flex font-bold'>
                        <Button className='font-bold text-sm rounded-xl' variant={"outline"}>New Folder</Button>
                        <Button className='font-bold text-sm rounded-xl'>
                              <span>New Video</span>
                              <span><PiCaretDownBold className='text-white text-xl font-bold' /></span>
                        </Button>
                  </div>
            </div>
      )
}

export default Header