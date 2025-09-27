import HeroSection from '@/components/hero-section'
import NavBar from '@/components/nav-bar'
import SecondHero from '@/components/SecondHero'
import React from 'react'

const Home = () => {
  return (
    <main className='w-full'>
      <HeroSection />
      <SecondHero />
    </main>
  )
}

export default Home