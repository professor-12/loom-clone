// import { getUser, signOut } from '@/actions/auth.actions'
// import { useAuth } from '@/context/AuthContext'
// import { getUser } from '@/services/auth.service'
// import { redirect } from 'next/navigation'
// import React from 'react'

import { auth } from "@/actions/auth.actions"

const Page = async () => {
      const { data } = await auth()

      // const { error, status } = await getUser()
      // if (status == 401) {
      //       redirect("/login?from=dashboard")
      // }
      return (
            <div>{data?.email}</ div>
      )
}

export default Page