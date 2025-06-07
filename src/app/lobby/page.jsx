import React from 'react'
import Navbar from "../components/Navbar";

function Lobby() {
  return (
    <div>
        <section className='flex justify-center  flex-col gap-5 w-7/10 mx-auto'>
    <div className='mt-20 bg-neutral-900 p-8 rounded-md'>
        <h1 className='ml-5'>Room Creation</h1>
    </div>

    <div className='grid grid-cols-10 gap-5 '>
        <div className='col-span-3 border-1 rounded-sm p-6 h-48'>
            <p>name</p>
            <p>name</p>
            <p>name</p>
            <p>name</p>
            <p>name</p>
            
        </div>
        <div className='col-span-7 border-1 rounded-sm h-48'>
           
        </div>
    </div>
</section>

        
    </div>
  )
}

export default Lobby