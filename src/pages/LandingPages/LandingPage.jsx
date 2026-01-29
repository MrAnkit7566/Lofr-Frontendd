import React from 'react'

import Hero from './componants/Hero'
import Newlounch from './componants/Newlounch'
import Banner1 from './componants/Banner1'
import Winter from './componants/Winter'
// import SpacialArtical from './componants/SpacialArtical'



const LandingPage = () => {
  return (
    <div className='min-h-screen '>
        <Hero/>
        <Newlounch/>
        <Banner1/>
        {/* <Newlounch/> */}

        {/* <Winter/> */}
        {/* <SpacialArtical/> */}
        
    </div>
  )
}
export default LandingPage