import Link from 'next/link'
import React from 'react'

const NavItems = () => {
      return (
            <ul className='flex-center gap-8'>
                  <li className='flex-center gap-1.5'>Products <Triangle /></li>
                  <li className='flex-center gap-1.5'>Solutions <Triangle /></li>
                  <li className='flex-center gap-1.5'>Resurces <Triangle /> </li>
                  <li className='flex-center gap-1.5'>Enterprise</li>
                  <li className='flex-center gap-1.5'>Pricing</li>
                  <Link href={"/login"} prefetch="unstable_forceStale">
                        <li className='flex-center gap-1.5'>Sign In</li>
                  </Link>
            </ul>
      )
}

export default NavItems




const Triangle = () => {
      return <div className='triangle mt-1 rotate-180'></div>
}