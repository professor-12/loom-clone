import { getUser } from '@/actions/auth.actions'
import React, { FC } from 'react'
import { AuthProvider } from './AuthContext'

const AuthServer: FC<{ children: React.ReactNode }> = async ({ children }) => {
      const user = await getUser()
      const initialUser = user?.data ?? null;

      return (
            <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
      )
}

export default AuthServer