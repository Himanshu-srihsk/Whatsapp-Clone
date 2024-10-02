import React from 'react'
import StatusUserCard from './StatusUserCard'
import { AiOutlineClose } from 'react-icons/ai'
import { useNavigate } from 'react-router';


const Status = () => {
    const navigate = useNavigate();
    const handleNavigate = () =>{
        navigate(-1)
    }
  return (
    <div>
        <div className='flex items-center px-[14vw] py-[7vh]'>
            <div className='left h-[85vh] bg-[#1e262c] lg:w-[30%] w-[50%] px-5'>
                <div className='pt-5 h-[13%]'>
                   <StatusUserCard/>
                </div>
                <hr/>
                <div className='overflow-y-scroll h-[80%] pt-2'>
                    {
                        [1,1,1,1,1,1,1,1,1,1,1,1,1,1].map((item) => <StatusUserCard />)
                    }
                </div>
            </div>

            <div className='right relative h-[85vh] lg:w-[70%] w-[50%] bg-[#0b141a]'>
           <AiOutlineClose onClick={handleNavigate}
           className="text-white absolute top-5 text-xl cursor-pointer right-10"/>
            </div>
        </div>
    </div>
  )
}

export default Status