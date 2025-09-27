"use client"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {
      const { push } = useRouter()
      return (
            <div className='min-h-[100dvh] [--lns-color-primary:var(--primary)] space-y-12'>
                  <div className='w-full lg:px-12 max-md:px-4 h-[4rem] justify-between  flex items-center'>
                        <div className='text-2xl font-semibold flex-center'><div className='size-[2rem] rounded-md bg-gradient-to-bl from-primary to-secondary mr-2'></div> loop</div>
                        <Button onClick={() => push("/signup")} className='rounded-xl font-bold px-6'>Sign up for free</Button>
                  </div>
                  <div className='max-w-lg px-3 w-full mx-auto'>
                        <h1 className='text-center font-semibold text-4xl max-md:text-2xl'>Login to Loop</h1>
                        <div className='w-full pt-10 space-y-2 text-lg font-medium'>
                              <Button variant={"outline"} className='w-full rounded-3xl flex items-center h-15'>
                                    <img className='w-6 h-6' src="https://img.icons8.com/?size=1200&id=17949&format=png" alt="" />
                                    <span>
                                          Sign in with Google
                                    </span>

                              </Button>
                              <Button variant={"outline"} className='w-full rounded-3xl flex items-center h-15'>
                                    <img src="https://img.icons8.com/?size=1200&id=OXVeOEj6qZqX&format=png" alt="" className='w-6 h-6' />
                                    <span>

                                          Sign in with Slack
                                    </span>
                              </Button>
                              <Button variant={"outline"} className='w-full rounded-3xl flex items-center h-15'>
                                    <img src="https://img.icons8.com/?size=1200&id=16318&format=png" alt="" className='w-6 h-6' />
                                    <span>

                                          Sign in with Github
                                    </span>
                              </Button>
                        </div>
                  </div>
            </div>
      )
}

export default Page