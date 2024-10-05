import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

const SelectedMember = ({handleRemoveMember, member}) => {
  return (
    <div className='flex items-center  bg-slate-300 rounded-full'>
      <img className='w-7 h-7 rounded-full' 
      src= {member.profile_picture || "https://media.istockphoto.com/id/1305448692/photo/shot-of-a-cute-vintage-teapot-in-a-campsite-near-to-lake.webp?b=1&s=612x612&w=0&k=20&c=o8B5RnXH9ii_KXhSkkef5RsEOWsPBZmF1OsG_dPnWM8="}
      alt=''/>
     <p className='px-2'>{member?.full_name}</p>
     <AiOutlineClose onClick={handleRemoveMember} className='pr-1 cursor-pointer'/>
    </div>
  )
}

export default SelectedMember