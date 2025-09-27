import React from 'react'
import Logo from './Logo'
import NavItems from './nav-items'
import { Button } from './ui/button'

const NavBar = () => {
      return (
            <div className='[--size:90px]'>
                  <header className='w-full z-50 shadow-[0_3px_20px_1000px_var(--tw-shadow-color)] bg-white fixed top-0 h-[var(--size)]'>
                        <div className='h-full  flex-between  mx-auto px-5'>
                              <Logo className='pl-4' />
                              <div className='flex-center gap-8'>
                                    <NavItems />
                                    {/* <div></div> */}
                                    <div className='flex items-center gap-4'>
                                          <Button size={"xl"} className='rounded-full text-[14px] h-[3.5rem] border-4 border-light-foreground hover:translate-0.5 hover:-translate-y-0.5 hover:scale-105 p-4  shadow-primary hover:shadow-[10rem] bg-[#565ADD]  duration-100 text-white'> Get Loom For Free</Button>
                                          <Button variant={"secondary"} size={"sm"} className='rounded-full text-[15px] px-4 h-12 py-5'>Contact Sales</Button>
                                    </div>
                              </div>
                        </div>
                  </header >
                  <div className='pt-[var(--size)]' />
            </div >
      )
}

export default NavBar