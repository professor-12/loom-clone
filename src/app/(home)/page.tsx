import Features from '@/components/features'
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
      {/* <Features /> */}
    </main>
  )
}

export default Home