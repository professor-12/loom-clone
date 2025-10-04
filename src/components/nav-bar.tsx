"use client"
import React, { useState } from 'react'
import Logo from './Logo'
import NavItems from './nav-items'
import { Button } from './ui/button'
import Link from 'next/link'
import { ArrowBigDown, Menu } from 'lucide-react'
import { BiCaretDown } from 'react-icons/bi'
import { RxCaretDown } from 'react-icons/rx'

const NavBar = () => {
      const [isShow, setIsShow] = useState(false)
      return (
            <div className='[--size:90px]'>
                  <header className='w-full z-50 shadow-[0_3px_20px_1000px_var(--tw-shadow-color)] bg-white fixed top-0 h-[var(--size)]'>
                        <div className='h-full  flex-between  mx-auto px-5'>
                              <Logo className='pl-4' />
                              <div className='flex-center max-lg:hidden gap-8'>
                                    <NavItems />
                                    {/* <div></div> */}
                                    <div className='flex items-center gap-4'>
                                          <Link href={"/signup"}>
                                                <Button size={"xl"} className='rounded-full text-[14px] h-[3.5rem] border-4 border-light-foreground hover:translate-0.5 hover:-translate-y-0.5 hover:scale-105 p-4  shadow-primary hover:shadow-[10rem] bg-[#565ADD]  duration-100 text-white'> Get Loop For Free</Button>
                                          </Link>
                                          <Button variant={"secondary"} size={"sm"} className='rounded-full text-[15px] px-4 h-12 py-5'>Contact Sales</Button>
                                    </div>
                              </div>
                              {/* Mobile */}

                              <div className='lg:hidden'>
                                    <div onClick={() => { setIsShow(!isShow) }} className='flex-center cursor-pointer size-14 bg-secondary rounded-full'>
                                          <Menu stroke='#716DF6' />
                                    </div>
                                    {
                                          isShow &&
                                          <div className='fixed max-h-[calc(100dvh-90px)] overflow-y-auto inset-0 top-[var(--size)] bg-white'>
                                                <ul className='w-full'>
                                                      {["Apps", "Solutions", "Resources", "Enterprise", "Pricing"].
                                                            map(e => {
                                                                  return <li key={e} className='p-6 border-b flex items-center justify-between text-lg'>
                                                                        <span>{e}</span>
                                                                        <RxCaretDown />

                                                                  </li>
                                                            })}
                                                </ul>
                                                <div className='flex justify-center  py-4 items-center gap-4'>
                                                      <Link href={"/login"} prefetch="unstable_forceStale">
                                                            <li className='flex-center gap-1.5'>Sign In</li>
                                                      </Link>
                                                      <Link href={"/signup"}>
                                                            <Button size={"xl"} className='px-8 rounded-full text-[14px] h-[3.5rem] border-4 border-light-foreground hover:translate-0.5 hover:-translate-y-0.5 hover:scale-105 p-4  shadow-primary hover:shadow-[10rem] bg-[#565ADD]  duration-100 text-white'>Try Loop For Free</Button>
                                                      </Link>
                                                </div>

                                          </div>
                                    }

                              </div>
                        </div>
                  </header >
                  <div className='pt-[var(--size)]' />
            </div >
      )
}

export default NavBar