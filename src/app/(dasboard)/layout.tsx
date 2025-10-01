import { auth } from '@/actions/auth.actions'
import NavDashBoard from '@/components/nav-dashboard'
import SideBar from '@/components/side-bar'
import { redirect } from 'next/navigation'
import React, { FC } from 'react'


interface LayoutProps {
      children: React.ReactNode
}
const Layout: FC<LayoutProps> = async ({ children }) => {
      const { data } = await auth()
      if (!data) {
            redirect("/login");
      }
      return (
            <main className='flex h-[100dvh] max-h-[100dvh] [--h:60px]'>
                  <SideBar />
                  <div className='relative flex-1 max-h-[calc(100dvh-var(--h)] h-screen overflow-y-auto'>
                        <NavDashBoard />
                        <main className='px-5 '>
                              {children}
                        </main>
                  </div>
            </main>
      )
}

export default Layout