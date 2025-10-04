import { Infinity } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Logo = (props: React.HTMLAttributes<SVGElement>) => {
      return (
            <Link href={"/"}>
                  <div className='text-2xl font-bold tracking-tighter gap-1 flex-center'><Infinity className='text-primary w-12 h-12' />Loopify</div>
            </Link>
      )
}

export default Logo