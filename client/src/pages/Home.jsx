import React from 'react'
import Header from '../components/Header'
import Services from '../components/Services'
import TopBarbers from '../components/TopBarbers'
import Testimonial from '../components/Testimonial' // Hindi Comment: Live opposite scrolling testimonials component import kiya
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div>
      <Header/>
      <Services/>
      <TopBarbers/>
      <Testimonial/>
      <Banner/>
    </div>
  )
}

export default Home
