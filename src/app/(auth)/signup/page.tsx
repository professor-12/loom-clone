import { Button } from '@/components/ui/button'
import { githubOAUTHLINK } from '@/lib/utils'
import { Infinity } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Page = () => {

      return (
            <div className='min-h-[100dvh] px-4 relative [--lns-color-primary:var(--primary)] overflow-hidden  space-y-12'>
                  <div className='absolute max-md:hidden md:bg-gradient-to-bl from-[#b2b3f1] -right-[30%] to-violet-200/10 h-[34rem] -z-10 w-[66rem] blur-[50px]'></div>
                  <div className='absolute -bottom-[12%] md:bg-gradient-to-tr from-[#b2b3f1] -left-[30%] to-violet-200/10 h-[14rem] -z-10 w-[66rem] blur-[50px]'></div>
                  <div className='w-full lg:px-12 max-md:px-4 h-[4rem] justify-between  flex items-center'>
                        <Link href={"/"}>
                              <div className='text-2xl font-semibold flex-center'><Infinity className='text-primary w-12 h-12' />loop</div>
                        </Link>
                  </div>
                  <div className=''>
                        <div className='max-w-lg px-3 pt-12 gap-12 w-full mx-auto bg-white shadow-[0_0_20px] shadow-black/10 p-4 flex-center rounded-3xl flex-col'>
                              <h1 className='text-3xl max-w-[80%] max-md:text-2xl font-medium text-center'>Record your first Loop video in seconds</h1>
                              <div className='w-full space-y-3 flex flex-col gap-1'>
                                    <Link className='w-full' href={`https://accounts.google.com/o/oauth2/auth?scope=email%20profile openid&response_type=code&access_type=offline&&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL}&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}`}>
                                          <Button variant={"outline"} className='w-full font-bold rounded-3xl flex items-center h-15'>
                                                <img className='w-6 h-6' src="/google.png" alt="" />
                                                <span>
                                                      Sign up with Google
                                                </span>

                                          </Button>
                                    </Link>
                                    <Link className='w-full' href={githubOAUTHLINK}>
                                          <Button variant={"outline"} className='w-full font-bold rounded-3xl flex items-center h-15'>
                                                <img className='w-6 h-6' src="/github.png" alt="" />
                                                <span>
                                                      Sign up with Github
                                                </span>

                                          </Button>
                                    </Link>
                              </div>
                        </div>
                        <p className='text-center text-black/70 block pt-2 text-sm font-medium'>
                              Already have an account?
                              <Link href={"/login"} className='ml-1 hover:text-blue-500 hover:underline'>
                                    Login
                              </Link>
                        </p>
                  </div>
            </div >
      )
}

export default Page