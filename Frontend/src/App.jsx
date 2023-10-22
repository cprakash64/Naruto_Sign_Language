import React from 'react'
import Header from "./components/header"
import S1 from './components/s1'
import './components/firstimage.css'
import S2 from './components/s2'
import S3 from './components/s3'


export default function App() {
  return (
    <div>
      <div className="first-image">
        <div className="mx-12 py-12">
          <Header />
          <S1 />
        </div>
      </div>

      <div className="mx-12 py-12">
        <S2 />
      </div>

      <div>
        <div className="mx-12 py-12">
          <S3 />
        </div>
      </div>



    </div>
  )
}