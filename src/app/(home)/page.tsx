import HeroSection from '@/components/hero-section'
import SecondHero from '@/components/SecondHero'
import React from 'react'

const Home = async () => {

  return (
    <main className='w-full'>
      <HeroSection />
      <SecondHero />
    </main>
  )
}

export default Home