"use client"
import LoopVideoEngine from '@/components/loop-recorder-extension/LoopEngine'
import { Button } from '@/components/ui/button'
import DropDown from '@/components/ui/drop-down'
import useScreenRecord from '@/hooks/useScreenRecord'
import { Upload, Video } from 'lucide-react'
import React, { useState } from 'react'
import { PiCaretDownBold } from 'react-icons/pi'

const NewVideoButton = () => {
      const [state, setState] = useState(false)
      return (
            <div className=''>
                  <DropDown>
                        <DropDown.Trigger>
                              <Button className='font-bold text-sm rounded-xl'>
                                    <span>New Video</span>
                                    <span><PiCaretDownBold className='text-white text-xl font-bold' /></span>
                              </Button>
                        </DropDown.Trigger>
                        <DropDown.Body align='center' className='!rounded-2xl'>
                              <ul className='font-poppins'>
                                    <DropDown.Trigger>
                                          <li onClick={() => { setState(true) }} className='p-3 px-4 flex gap-2 hover:bg-slate-400/20 rounded-2xl cursor-pointer'><Video strokeWidth='1.4' />Record a video</li>
                                    </DropDown.Trigger>
                                    <li className='p-3 hover:bg-slate-400/20 rounded-2xl px-4 flex text-muted-foreground cursor-pointer gap-1 items-center'><Upload className='text-sm' strokeWidth={"1.4"} />Upload a video</li>
                              </ul>
                        </DropDown.Body>
                  </DropDown>
                  {
                        state && <LoopVideoEngine onClose={() => setState(false)} />
                  }
            </div>
      )
}

export default NewVideoButton