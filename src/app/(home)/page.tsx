import HeroSection from '@/components/hero-section'
import SecondHero from '@/components/SecondHero'
import SectionThree from '@/components/SectionThree'
import React from 'react'

const Home = async () => {

  return (
    <main className='w-full'>
      <HeroSection />
      <SecondHero />
      <SectionThree />
    </main>
  )
}

export default Home