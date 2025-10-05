import React from 'react'
import Search from './Search'
import ProfileButton from './profile-button'
import { auth, getUser } from '@/actions/auth.actions'
import { Button } from './ui/button'
import { LuMenu } from 'react-icons/lu'
import SideBar from './side-bar'
import MobileSideBar from './mobile-sidebar'

const NavDashBoard = async () => {
      const { data } = await auth()
      // const user = await getUser()
      return (
            <div className='[--h:60px] sticky top-0 z-10'>
                  <div className='h-[var(--h)] gap-4 flex justify-between items-center px-5  border-b absolute z-200 bg-white top-0 w-full'>
                        <MobileSideBar />
                        <Search />
                        <div className='flex items-center gap-4'>
                              <Button className='font-bold max-md:hidden text-primary border-primary hover:bg-primary/20 hover:text-primary rounded-xl' variant={"outline"}>
                                    <p className='text-sm'>
                                          6/50 Videos
                                    </p>
                                    <div className='w-full bg-red-400 h-2'>
                                          <div className='bg-white'></div>
                                    </div>
                              </Button>
                              <Button className='font-bold max-md:hidden rounded-xl'>Upgrade</Button>
                              <ProfileButton data={data} />
                        </div>
                  </div>
                  <div className='h-[var(--h)] z-0'>
                  </div>
            </div>
      )
}

export default NavDashBoard