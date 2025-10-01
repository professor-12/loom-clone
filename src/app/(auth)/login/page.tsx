"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
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
                        <div className='w-full pt-10 space-y-2 text-lg *:font-bold'>
                              <Link href={`https://accounts.google.com/o/oauth2/auth?scope=email%20profile openid&response_type=code&access_type=offline&&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL}&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}`} className='block font-bold'>
                                    <Button variant={"outline"} className='w-full rounded-3xl flex items-center h-15'>
                                          <Image width={200} height={200} className='w-6 h-6' src="https://img.icons8.com/?size=1200&id=17949&format=png" alt="" />
                                          <span>
                                                Sign in with Google
                                          </span>

                                    </Button>
                              </Link>
                              <Button variant={"outline"} className='w-full rounded-3xl flex items-center h-15'>
                                    <Image width={200} height={200} src="https://img.icons8.com/?size=1200&id=OXVeOEj6qZqX&format=png" alt="" className='w-6 h-6' />
                                    <span>
                                          Sign in with Slack
                                    </span>
                              </Button>
                              <Button variant={"outline"} className='w-full rounded-3xl flex items-center h-15'>
                                    <Image width={200} height={200} src="https://img.icons8.com/?size=1200&id=16318&format=png" alt="" className='w-6 h-6' />
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