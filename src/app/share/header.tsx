import { auth } from '@/actions/auth.actions';
import Logo from '@/components/Logo';
import ProfileButton from '@/components/profile-button';
import React from 'react'
import { IoIosMenu, IoIosMore } from "react-icons/io";
import { RiLinkM, RiUserAddLine } from 'react-icons/ri';
import { TfiMoreAlt } from "react-icons/tfi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { RiUser6Fill } from "react-icons/ri";
import { User, Video } from '@prisma/client';
import CopyButton from './components/CopyButton';

interface HeaderDetailProps {
      data: Video & { user: User }
}

const HeaderDetail = async ({ data }: HeaderDetailProps) => {
      const { data: _data } = await auth();

      const { user } = data
      return (
            <div className='bg-white  border-b  p-6  flex items-center justify-between'>
                  <div className='flex items-center gap-6'>
                        <IoIosMenu className='w-8 h-12' />
                        <Logo />
                        <div>
                              <h1 className='font-semibold text-3xl max-w-[200px] truncate'>{data.title}</h1>
                              <p className='text-gray-500'>{user.name}</p>
                        </div>
                  </div>
                  <div className='flex gap-6 items-center'>
                        <div className='font-semibold flex items-center gap-2'>
                              <RiUser6Fill />
                              123,456 views
                        </div>
                        <div className='flex gap-[1px] font-semibold'>
                              <div className='bg-[#1558BC] cursor-pointer flex items-center gap-2 text-white px-4 p-2 rounded-l-2xl'>
                                    <RiUserAddLine className='h-6 w-6' />Share
                              </div>
                              <CopyButton />

                        </div>
                        <CiSearch className='h-8 w-8 stroke-[0.3]' />
                        <IoIosNotificationsOutline className='h-8 w-8' />
                        <IoIosMore className='h-8 w-8 stroke-[0.3]' />
                        <ProfileButton data={{ ..._data } as any} />
                  </div>
            </div>
      )
}

export default HeaderDetail