import React, { useState } from "react";
import { TbCircleDashed } from "react-icons/tb";
import { BiCommentDetail } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { ImAttachment } from "react-icons/im";
import { BsEmojiSmile, BsFilter, BsMicFill, BsThreeDotsVertical } from "react-icons/bs";
import ChatCard from "./ChatCard/ChatCard";
import MessageCard from "./MessageCard/MessageCard";
const HomePage = () => {
  const [querys, setQuerys] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [content, setContent] = useState(null);

  const handleSearch = () => {};
  const handleClickOnChatCard = () => {
    setCurrentChat(true);
  };
  const handleCreateNewMessage = ()=> {

  }


  return (
    <div className="relative">
      <div className=" py-14 bg-green-400 w-full">
        <div className="flex bg-[#f0f2f5] h-[90vh] absolute top-[5vh] w-[96vw] left-[2vw]">
          <div className="left w-[30%] bg-[#e8e9ec] h-full">
            <div className="w-full">
              <div className="flex justify-between items-center p-3">
                <div className="flex items-center space-x-3">
                  <img
                    className="rounded-full w-10 h-10 cursor-pointer"
                    src="https://cdn.pixabay.com/photo/2023/12/11/12/51/lynx-8443540_640.jpg"
                    alt=""
                  />
                  <p>username</p>
                </div>
                <div className="space-x-3 text-2xl flex">
                  <TbCircleDashed />
                  <BiCommentDetail />
                </div>
              </div>

              <div className="relative flex justify-center items-center bg-white py-4 px-3">
                <input
                  className="border-none outline-none bg-slate-200 rounded-md w-[93%] pl-9 py-2"
                  type="text"
                  placeholder="Search or Start new Chat"
                  onChange={(e) => {
                    setQuerys(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  value={querys}
                />
                <AiOutlineSearch className="left-5 top-7 absolute" />
                <div>
                  <BsFilter className="ml-4 text-3xl" />
                </div>
              </div>
              <div className="bg-white overflow-y-scroll h-[70vh] px-3">
                {querys &&
                  [1, 1, 1, 1, 1, 1].map((item) => (
                    <div onClick={handleClickOnChatCard}>
                      <hr />
                      <ChatCard />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {
            !currentChat && <div className="w-[70%] flex flex-col items-center justify-center h-full">
            <div className="max-w-[40%] text-center">
              <img
                src="https://static.whatsapp.net/rsrc.php/v3/y6/r/wa669aeJeom.png"
                alt=""
              />
              <h1 className="text-4xl text-gray-600">Whatsapp web</h1>
              <p className="my-9">
                Send and Recieve messages without keeping your phone online. Use
                Whatsapp on up to 4 linked devices and 1 phone at the same time
              </p>
            </div>
          </div>
          }

{/* message section */}
{
  currentChat && (
    <div className="w-[70%] relative  bg-blue-200">
      <div className="header absolute top-0 w-full bg-[#f0f2f5]">
      <div className="flex justify-between">
        <div className="py-3 space-x-4 flex items-center px-3">
          <img
            className="rounded-full w-10 h-10 cursor-pointer"
            src="https://cdn.pixabay.com/photo/2023/12/11/12/51/lynx-8443540_640.jpg"
            alt=""
          />
          <p className="">username</p>
        </div>
        <div className="py-3 space-x-4 items-center px-3 flex">
        <AiOutlineSearch/>
        <BsThreeDotsVertical/>
        </div>
      </div>
    </div>
    {/* message card */}

    <div className="px-10 h-[85vh] overflow-y-scroll">
      <div className="space-y-1 flex flex-col justify-center  mt-20 py-2">
        {
          [1,1,1,1,1,1,1,1].map((item, i) => <MessageCard isReqUserMessage ={i%2===0} content={"message"}/>)
        }
      </div>
    </div>

    <div className="footer bg-[#f0f2f5] absolute bottom-0 w-full py-3 text-2xl">
      <div className="flex justify-between items-center px-5">
    
          <BsEmojiSmile className="cursor-pointer"/>
          <ImAttachment/>

        <input className="py-2 outline-none border-none bg-white pl-4 rounded-md w-[85%]"
        type="text" onChange={(e) => setContent(e.target.value)} 
        placeholder="Type message"
        value={content}
        onKeyPress={(e)=>{
          if(e.key === "Enter"){
            handleCreateNewMessage();
            setContent("");
          }
        }}
        />
        <BsMicFill/>
      </div>
        
    </div>
    </div>
  )
}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
