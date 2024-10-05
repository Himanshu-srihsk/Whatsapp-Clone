import React, { useState } from "react";
import { BsArrowLeft, BsCheck2, BsPencil } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { updateUser } from "../../State/Auth/Action";

const Profile = ({handleCloseOpenProfile}) => {
  const navigate = useNavigate();
  const [flag, setFlag] = useState(false);
  const [userName, setUserName] = useState(null);
  const [tempPicture, setTempPicture] = useState(null);
  const { auth,chat,message } = useSelector((store) => store);
  const dispatch = useDispatch();
  const handleback = () => {};

  const handleFlag = () => {
    setFlag(true)
  }
  const handleCheckClick = (e) => {
    setFlag(false)
    const data = {
      id: auth.reqUser.id,
      token: localStorage.getItem("jwt"),
      data: { full_name: userName },
    };
    dispatch(updateUser(data))
  }
  const handleChange = (e) =>{
   setUserName(e.target.value)
   console.log(e.target.value)
  }
  const handleUpdateName = (e) => {
    const data = {
      id: auth.reqUser.id,
      token: localStorage.getItem("jwt"),
      data: { full_name: userName },
    };
     if(e.target.key === "Enter"){
      dispatch(updateUser(data))
     }
  }

const uploadToCloudnary = async(pics) =>{
  const data = new FormData();
  data.append("file", pics)
  data.append("upload_preset","twitter")
  data.append("cloud_name","dgbbltbil")

  try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dgbbltbil/image/upload",
        {
          method: "POST",
          body: data,
        }
      )
      .then((res)=> res.json())
      .then((data) => {
        setTempPicture(data.url.toString());
        console.log("imgUrl: " + data.url.toString());
        const dataa = {
          id: auth.reqUser.id,
          token: localStorage.getItem("jwt"),
          data: {profile_picture: data.url.toString()},

        };
        dispatch(updateUser(dataa))
      })
      
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
    }
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
            src={auth.reqUser?.profile_picture || tempPicture || "https://cdn.pixabay.com/photo/2023/03/15/20/34/chat-gpt-7855379_640.jpg"}
            alt=""
          />
        </label>
        <input onChange={(e) => uploadToCloudnary(e.target.files[0])}
        type="file" id="imageInput" className="hidden" />
      </div>

      <div className="bg-white px-3">
        <p className="py-3">Your Name</p>

        {
          !flag && <div className="w-full flex justify-between items-center">
          <p className="py-3">
            {auth.reqUser.full_name || "UserName"}
          </p>
          <BsPencil onClick={handleFlag} className="cursor-pointer" />
        </div>
        }
        {
          flag && <div className="w-full flex justify-between items-center py-2">
            <input onKeyPress={handleUpdateName} onChange={handleChange} className="w-[80%] outline-none border-b-2" type="text" placeholder="Enter your name"/>
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
