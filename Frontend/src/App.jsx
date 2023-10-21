import React,  { useState } from 'react'
import Header from "./components/header"
import S1 from './components/s1'
import CameraFeed from './components/CameraFeed';

export default function App() {

  
  const [showCamera, setShowCamera] = useState(false);
  return (
    

    <div className=''>
      <div className="m-12">
        <Header />

        <h1>Camera Feed</h1>
        <S1 showCamera={showCamera} setShowCamera={setShowCamera} />
        {showCamera && <CameraFeed />}
      </div>



    </div>
  )
}