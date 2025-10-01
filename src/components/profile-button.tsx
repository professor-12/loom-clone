"use client"
import { JWTPayload, signOut } from '@/actions/auth.actions'
import { LogOut, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'


const ProfileButton = ({ data }: { data: JWTPayload & { avatar_url: string } | null }) => {
      const { email, avatar_url } = data || {}
      console.log(data)

      return (
            <div className='relative'>
                  <div className='h-[35px] overflow-hidden relative cursor-pointer text-xl capitalize text-white aspect-square rounded-full bg-rd-800 items-center justify-center '>
                        {
                              avatar_url ?
                                    <Image className='object-contain' src={avatar_url} fill alt='Profile_image' /> :
                                    <p className='text-xl font-bold'>
                                          {email?.substring(0, 1)}
                                    </p>
                        }
                  </div>
                  <div className=' z-12 shadow right-0 w-[280px] absolute top-[160%] rounded-3xl bg-white border-border border p-4'>
                        <div className='flex w-full justify-end'>
                              <div className='ring-2 h-8 w-8 flex items-center justify-center ring-primary/80 ring-offset-2 rounded-lg cursor-pointer'>
                                    <X className='' />
                              </div>
                        </div>
                        <div className='flex  w-full flex-col items-center'>
                              <Image src={avatar_url!} width={200} className='w-12 h-12 rounded-full' height={200} alt="Profile image" />
                              <h1 className='font-semibold'>Pro Silver</h1>
                              {/* <Button className='text-xs font-semibold p-2 h-auto rounded-xl' variant={"outline"}>View or edit profile</Button> */}
                              <HR />
                              <div className='py-3'>
                                    <button onClick={async () => { await signOut() }} className='gap-1 text-black/80 text-sm flex items-center cursor-pointer font-poppins'><LogOut className='text-sm h-4' /> Sign out</button>
                              </div>
                        </div>
                  </div>
            </div>
      )
}

export default ProfileButton


const HR = (props: React.HTMLAttributes<HTMLDivElement>) => {
      const { className, ...rest } = props
      return (
            <div {...rest} className={`w-full h-0.5 border-t border-0.5 border-border`} />
      )
}