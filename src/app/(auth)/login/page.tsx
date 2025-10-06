// "use client"
import { Button } from '@/components/ui/button'
import { githubOAUTHLINK } from '@/lib/utils'
import { Infinity } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
// import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {
      // const { push, replace } = useRouter()
      return (
            <div className='min-h-[100dvh] px-3 [--lns-color-primary:var(--primary)] space-y-12'>
                  <div className='w-full lg:px-12 max-md:px-4 h-[4rem] justify-between  flex items-center'>
                        <Link href={"/"}>
                              <div className='text-2xl font-semibold flex-center'><Infinity className='text-primary w-12 h-12' />loop</div>
                        </Link>
                        <Link href={"/signup"}>
                              <Button className='rounded-xl font-bold px-4'>Sign up for free</Button>
                        </Link>
                  </div>
                  <div className='max-w-lg px-3 w-full mx-auto'>
                        <h1 className='text-center font-semibold text-4xl max-md:text-2xl'>Login to Loop</h1>
                        <div className='w-full pt-10 flex flex-col space-y-2 text-lg *:font-bold'>
                              <Link href={`https://accounts.google.com/o/oauth2/auth?scope=email%20profile openid&response_type=code&access_type=offline&&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL}&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}`} className='block font-bold w-full'>
                                    <Button variant={"outline"} className='w-full rounded-3xl flex items-center h-15'>
                                          <Image width={200} height={200} className='w-6 h-6' src="/google.png" alt="" />
                                          <span className='font-bold'>
                                                Sign in with Google
                                          </span>

                                    </Button>
                              </Link>
                              <Link href={githubOAUTHLINK} className='block font-bold w-full'>
                                    <Button variant={"outline"} className='w-full rounded-3xl flex items-center h-15'>
                                          <Image width={200} height={200} className='w-6 h-6' src="/github.png" alt="" />
                                          <span className='font-bold'>
                                                Sign in with Github
                                          </span>

                                    </Button>
                              </Link>
                              <Link href="" className='block'>
                                    <Button variant={"outline"} className='w-full rounded-3xl flex items-center h-15'>
                                          <Image width={200} height={200} src="/slack.png" alt="" className='w-5 h-5' />
                                          <span className='font-bold'>
                                                Sign in with Slack
                                          </span>
                                    </Button>
                              </Link>
                        </div>
                  </div>
            </div >
      )
}

export default Page