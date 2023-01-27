import React from 'react'

export default function Navbar() {
  return (
    <div className="w-ful border-b-4  flex justify-between flex-row items-center py-4 px-10">
      <div className="flex items-center">
        <img src="https://raw.githubusercontent.com/Carlos-Bolano/carlos-bolano-porfolio/master/images/yo1.jpg" alt="foto carlos bolaño" className='w-14 rounded-full object-cover ring-1 ring-black ' />
        <div className="ml-2">
        <h6 className='text-xl mb-0 font-medium'>Carlos Bolaño</h6>
        <p className='text-sm -mt-2 font-normal'>Front-end Developer</p>
        </div>
      </div>
      <div className="">
        githud
      </div>
      <div className="flex flex-row gap-4">
        <button className='py-2 px-8 rounded-lg font-semibold bg-white ring-1 ring-black' >Task</button>
        <button className='py-2 px-8 rounded-lg font-semibold text-white bg-black  ring-1 ring-black'>Add Task</button>
      </div>
    </div>
  )
}
