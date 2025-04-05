import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

function SearchBar({data}) {

  const navigate = useNavigate()
  const [inpute, setInpute] = useState(data?data:'');


  const onSearchHeandler = (e) => {
      e.preventDefault();
      navigate('/course-list/'+ inpute)
  }
  return (

    <form onSubmit={onSearchHeandler} className='max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded'>
      <img src={assets.search_icon} alt="search" className='md:w-auto w-10 px-3' />
      <input type="text" value={inpute} onChange={(e)=>setInpute(e.target.value)} placeholder='Search for courses' className='w-full h-full outline-none text-gray-500' />
      <button className='bg-blue-600 rounded text-white md:px-10 px-7 md-py-3 py-2 mx-1'>Search</button>
    </form>

  )
}

export default SearchBar