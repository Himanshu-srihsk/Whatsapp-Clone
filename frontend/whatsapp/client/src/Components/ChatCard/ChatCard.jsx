import React from 'react'

const ChatCard = ({userImg,name, lastMessage}) => {
  // Function to format a timestamp to a readable date
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(timestamp).toLocaleDateString(undefined, options);
  };
  return (
    <div className='flex items-center justify-center py-2 group cursor-pointer'>
       <div className='w-[20%]'>
         <img className='h-14 w-14 rounded-full'
         src={ userImg} alt='' />
       </div>
       <div className='pl-5 w-[80%]'>
         <div className='flex justify-between items-center'>
            <p className='text-lg'>{name}</p>
            <p className='text-sm'>
              
                {lastMessage ? formatTimestamp(lastMessage.timestamp) : ""}
              
            </p>
         </div>

         <div className='flex justify-between items-center'>
             <p className="text-gray-600 truncate">
             {lastMessage ? lastMessage.content : ""}
             </p>
             <div className='flex space-x-2 items-center'>
                <p className='text-xs py-1 px-2 text-white bg-green-500 rounded-full'>5</p>
             </div>
         </div>
       </div>
    </div>
  )
}

export default ChatCard