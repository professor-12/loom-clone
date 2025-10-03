"use client"
import { Button } from '@/components/ui/button'
import DropDown from '@/components/ui/drop-down';
import { Upload, Video } from 'lucide-react';
import React from 'react'
import { PiCaretDownBold } from "react-icons/pi";
import NewVideoButton from './NewVideoButton';
import useScreenRecord from '@/hooks/useScreenRecord';
const Header = () => {

      return (
            <div className='flex justify-between items-end w-full'>
                  <div className='space-y-1'>
                        <h1 className='font-extrabold text-muted-foreground'>My library</h1>
                        <h3 className='text-3xl font-[900]'>Videos</h3>
                  </div>
                  <div className='gap-2 flex font-bold'>
                        <Button className='font-bold text-sm rounded-xl' variant={"outline"}>New Folder</Button>
                        <NewVideoButton />
                  </div>
            </div >
      )
}

export default Header