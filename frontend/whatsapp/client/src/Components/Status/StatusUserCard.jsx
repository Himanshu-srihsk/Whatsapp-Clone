import React from 'react'
import { useNavigate } from 'react-router';

const StatusUserCard = () => {
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate(`/status/{userCard}`)
    }
  return (
    <div  onClick={handleNavigate} className='flex items-center p-3 cursor-pointer'>
        <div>
            <img className='h-7 w-7 lg:w-10 lg:h-10 rounded-full'
            src="https://cdn.pixabay.com/photo/2021/11/05/11/06/pumpkins-6771028_640.jpg" alt=''/>
        </div>
        <div className='ml-2 text-white'>
            <p>Random User</p>
        </div>
    </div>
  )
}

export default StatusUserCard