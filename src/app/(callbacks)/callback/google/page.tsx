"use client"
import { signInWithGoogleAction } from '@/actions/auth.actions'
import Dot from '@/components/LogoAnimation'
import { useRouter } from 'next/navigation'

// import { redirect } from 'next/navigation'
import { useEffect } from 'react'


const Page = ({ searchParams }: { searchParams: Promise<any> }) => {

      const { replace } = useRouter()

      useEffect(() => {
            (async () => {
                  try {
                        const { code } = await searchParams
                        await signInWithGoogleAction(code)
                        replace("/library?from=google_callback")
                  } catch (err) {
                        replace("/login?err=AuthFailed", { scroll: true })
                  }
            })()
      }, [])


      return <div className='h-screen w-full flex-center bg-[#F2F2F2]'>
            <div className='flex flex-col'>
                  <Dot />
            </div>
      </div>


}

export default Page

