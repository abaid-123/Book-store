import React from 'react'
import { useLoaderData } from 'react-router-dom'
const Singlebook = () => {
  const {_id,title,imgURL}=useLoaderData()
  return (
    <div className='mt-28 px-4 lg:px-24'> 
    <img src={imgURL} alt=''  className='h-96'/>
    <h2>{title}</h2>

    </div>
  )
}

export default Singlebook