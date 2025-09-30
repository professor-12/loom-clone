import { auth } from '@/actions/auth.actions'
import { redirect } from 'next/navigation'
import React, { FC } from 'react'


interface LayoutProps {
      children: React.ReactNode
}
const Layout: FC<LayoutProps> = async ({ children }) => {
      const { data, error, status } = await auth()
      if (!data) {
            redirect("/login");
      }
      return (
            <main>{children}</main>
      )
}

export default Layout