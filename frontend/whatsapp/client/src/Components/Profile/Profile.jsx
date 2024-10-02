import React, { useState } from "react";
import { BsArrowLeft, BsCheck2, BsPencil } from "react-icons/bs";
import { useNavigate } from "react-router";

const Profile = ({handleCloseOpenProfile}) => {
  const navigate = useNavigate();
  const [flag, setFlag] = useState(false);
  const [userName, setUserName] = useState(null);
  const handleback = () => {};

  const handleFlag = () => {
    setFlag(true)
  }
  const handleCheckClick = () => {
    setFlag(false)
  }
  const handleChange = (e) =>{
   setUserName(e.target.value)
   console.log(e.target.value)
  }

  return (
    <div className="w-full h-full">
      <div className="flex items-center space-x-10 bg-[#008069] pt-16 pb-5 text-white">
        <BsArrowLeft
          className="cursor-pointer text-2xl font-bold"
          onClick={handleCloseOpenProfile}
        />
        <p className="cursor-pointer font-semibold">Profile </p>
      </div>

      <div className="flex items-center my-12 justify-center flex-col ">
        <label htmlFor="imageInput">
          <img
            className="rounded-full w-[15vw] h-[15vw] cursor-pointer"
            src="https://cdn.pixabay.com/photo/2023/03/04/20/07/coffee-7830087_640.jpg"
            alt=""
          />
        </label>
        <input type="file" id="imageInput" className="hidden" />
      </div>

      <div className="bg-white px-3">
        <p className="py-3">Your Name</p>

        {
          !flag && <div className="w-full flex justify-between items-center">
          <p className="py-3">
            {userName || "UserName"}
          </p>
          <BsPencil onClick={handleFlag} className="cursor-pointer" />
        </div>
        }
        {
          flag && <div className="w-full flex justify-between items-center py-2">
            <input onChange={handleChange} className="w-[80%] outline-none border-b-2" type="text" placeholder="Enter your name"/>
            <BsCheck2 onClick={handleCheckClick} className="cursor-pointer text-2xl "/>
          </div>
        }

      </div>

      <div className="px-3 my-5">
        <p className="py-10">
          This is not your usename, this name will be visible to your whataspp contacts</p>
      </div>
    </div>
  );
};

export default Profile;
