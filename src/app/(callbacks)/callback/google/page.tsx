"use client"
import { signInWithGoogleAction } from '@/actions/auth.actions'
import { useRouter } from 'next/navigation'

// import { redirect } from 'next/navigation'
import { useEffect } from 'react'


const Page = ({ searchParams }: { searchParams: Promise<any> }) => {

      const { replace } = useRouter()

      useEffect(() => {
            (async () => {
                  try {
                        const { code } = await searchParams
                        console.log(code)
                        await signInWithGoogleAction(code)
                        replace("/dashboard?from=google_callback")
                  } catch (err) {
                        replace("/login?err=AuthFailed", { scroll: true })
                  }
            })()
      }, [])


      return <>dd</>


}

export default Page

