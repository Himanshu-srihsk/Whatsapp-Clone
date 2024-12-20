import React, { useEffect, useRef, useState } from "react";
import { TbCircleDashed } from "react-icons/tb";
import { BiCommentDetail } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { ImAttachment } from "react-icons/im";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import SockJs from "sockjs-client/dist/sockjs";
import { over } from "stompjs";

import {
  BsEmojiSmile,
  BsFilter,
  BsMicFill,
  BsThreeDotsVertical,
} from "react-icons/bs";
import ChatCard from "./ChatCard/ChatCard";
import MessageCard from "./MessageCard/MessageCard";
import "./HomePage.css";
import { useNavigate } from "react-router";
import Profile from "./Profile/Profile";
import { Button } from "@mui/material";
import CreateGroup from "./Group/CreateGroup";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, logoutAction, searchUser } from "../State/Auth/Action";
import { store } from "../State/store";
import { CREATE_CHAT } from "../State/Chat/ActionType";
import { creatChat, getUsersChat } from "../State/Chat/Action";
import { creatMessage, getAllMessages } from "../State/Message/Action";

const HomePage = () => {
  const [querys, setQuerys] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [content, setContent] = useState(null);
  const [isProfile, setIsProfile] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth,chat,message } = useSelector((store) => store);
  const token = localStorage.getItem("jwt");
  const [lastMessages, setLastMessages] = useState({});

  

  const handleSearch = (keyword) => {
    dispatch(searchUser({ keyword, token }));
  };
  const handleClickOnChatCard = (userId) => {
     //setCurrentChat(true);
    console.log("user id", userId)
    dispatch(creatChat({token, data:{userId}}))
    setQuerys("")
  };
  const handleCreateNewMessage = () => {
    dispatch(creatMessage({token, data:{chatId: currentChat.id, content: content}}))
  };
  const handleNavigate = () => {
    console.log("Navigating to profile...");
    setIsProfile(true);
  };
  const handleCloseOpenProfile = () => {
    setIsProfile(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [isGroup, setIsGroup] = useState(false);
  const handleCreateGroup = () => {
    setIsGroup(true);
  };

  useEffect(() => {
    dispatch(currentUser(token));
  }, [token]);
  
  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/signin");
  };

  const handleCurrentChat = (item) => {
    console.log("item is ", item)
   setCurrentChat(item);
  }
  console.log("current chat", currentChat);

  useEffect(() => {
    if (!auth.reqUser) {
      navigate("/signup");
    }
  }, [auth.reqUser]);

  useEffect(()=>{
  dispatch(getUsersChat({token}))
  },[chat.createdChat, chat.createdgroup])
  
  // Effect to get all messages when the current chat changes
  useEffect(()=> {
    if(currentChat?.id){
      dispatch(getAllMessages({chatId: currentChat.id, token }))
    }
    
  },[currentChat, message.newMessage])
  
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);



   // Function to establish a WebSocket connection
   const connect = () => {
    const sock = new SockJs("http://localhost:5100/ws");
    const temp = over(sock);
   // console.log("temp value",temp)
    setStompClient(temp);
 
    const headers = {
      Authorization: `Bearer ${token}`,
      "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
      
    };
  
    temp.connect(headers, onConnect, (error) => {
      console.error("Connection error:", error); // Log the error
      onError(error);
  });
  
  };

  console.log("stompClient:", stompClient);
console.log("currentChat:", currentChat);

  // Function to get a specific cookie by name
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }

  // Callback for WebSocket connection error
  const onError = (error) => {
    console.log("moud on error ", error);
  };
  
  // Callback for successful WebSocket connection
  const onConnect = () => { 
    setIsConnected(true);
    console.log("Master");
  // console.log("WebSocket ready state: ", stompClient.ws.readyState);
  console.log("on connect stompClient ", stompClient, " moud currentChat ", currentChat);

    // Subscribe to the current chat messages based on the chat type
    if (stompClient && currentChat) {
      if (currentChat.isGroup) {
        // Subscribe to group chat messages
        console.log("Group chat messages subscribed to ", currentChat.id);
        stompClient.subscribe(`/group/${currentChat?.id}`, onMessageReceive);
      } else {
        // Subscribe to direct user messages
        console.log("Direct user messages subscribed to ", currentChat.id);
        stompClient.subscribe(`/user/${currentChat?.id}`, onMessageReceive);
      }
    }
  };

  // Callback to handle received messages from WebSocket
  // const onMessageReceive = (payload) => {
  //   try {
  //     console.log("Raw payload received:", payload);
  //     const receivedMessage = JSON.parse(payload.body);
  //     console.log("Parsed message:", receivedMessage);
  //     setMessages((prevMessages) => [...prevMessages, receivedMessage]);
  //   } catch (error) {
  //     console.error("Error parsing received message:", error);
  //   }
  // };

  const onMessageReceive = (payload) => {
    try {
      console.log("Raw payload received:", payload);
      const receivedMessage = JSON.parse(payload.body);
      console.log("Parsed message:", receivedMessage);
  
      // Only add the received message to the state
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    } catch (error) {
      console.error("Error parsing received message:", error);
    }
  };
  
  

// Effect to establish a WebSocket connection
useEffect(() => {
  connect();
}, []);

// Effect to subscribe to a chat when connected

useEffect(() => {
  if (isConnected && stompClient && currentChat && auth.reqUser) {
    const subscriptionPath = currentChat.isGroup
      ? `/group/${currentChat?.id}`
      : `/user/${currentChat?.id}`;

    const subscription = stompClient.subscribe(subscriptionPath, onMessageReceive);
    console.log("Subscribing to:", subscriptionPath);
    return () => {
      subscription.unsubscribe();
    };
  }
}, [isConnected, stompClient, currentChat]);


// Effect to handle sending a new message via WebSocket
// useEffect(() => {
//   // console.log("message new message :", message)
//   if (message.newMessage && stompClient) {
//     console.log("on message send", JSON.stringify(message.newMessage))
//     stompClient.send("/app/message", {}, JSON.stringify(message.newMessage));
//     setMessages([...messages, message.newMessage]);
//   }
// }, [message.newMessage, stompClient]);

useEffect(() => {
  if (message.newMessage && stompClient) {
    console.log("Sending message:", JSON.stringify(message.newMessage));
    
    // Send the message through WebSocket
    stompClient.send("/app/message", {}, JSON.stringify(message.newMessage));

    // Optionally, optimistically add the message to the UI (immediate feedback)
    setMessages((prevMessages) => [...prevMessages, message.newMessage]);
  }
}, [message.newMessage, stompClient]);



 // Effect to set the messages state from the store
 useEffect(() => {
  if (message.messages) {
    setMessages(message.messages);
  }
}, [message.messages]);

// Effect to update lastMessages when messages change
useEffect(() => {
  const prevLastMessages = { ...lastMessages };
  if (message.messages && message.messages.length > 0) {
    message.messages.forEach((msg) => {
      prevLastMessages[msg.chat.id] = msg;
    });

    setLastMessages(prevLastMessages);
  }
}, [message.messages]);



const messageContainerRef = useRef(null);

// const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom(); // Scrolls to the bottom when the component loads or messages update
//   }, [messages]);

useEffect(() => {
  // Scroll to bottom whenever messages change
  if (messageContainerRef.current) {
    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  }
}, [messages]);

  return (
    <div className="relative">
      <div className=" py-14 bg-green-400 w-full">
        <div className="flex bg-[#f0f2f5] h-[90vh] absolute top-[5vh] w-[96vw] left-[2vw]">
          <div className="left w-[30%] bg-[#e8e9ec] h-full">
            {isGroup && <CreateGroup setIsGroup= {setIsGroup}/>}
            {isProfile && (
              <div className="w-full h-full">
                <Profile handleCloseOpenProfile={handleCloseOpenProfile} />
              </div>
            )}
            {!isProfile && !isGroup && (
              <div className="w-full">
                {/* home */}

                <div className="flex justify-between items-center p-3">
                  <div
                    onClick={handleNavigate}
                    className="flex items-center space-x-3"
                  >
                    <img
                      className="rounded-full w-10 h-10 cursor-pointer"
                      src={auth.reqUser?.profile_picture || "https://cdn.pixabay.com/photo/2023/12/11/12/51/lynx-8443540_640.jpg"}
                      alt=""
                    />
                    <p>{auth.reqUser?.full_name}</p>
                  </div>
                  <div className="space-x-3 text-2xl flex">
                    <TbCircleDashed
                      className="cursor-pointer"
                      onClick={() => navigate("/status")}
                    />
                    <BiCommentDetail />
                    <div>
                      <BsThreeDotsVertical
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                      />

                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleCreateGroup}>
                          Create Group
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                      </Menu>
                    </div>
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
                    Array.isArray(auth.searchUser) &&
                    auth.searchUser.length > 0 && auth.searchUser?.map((item) => (
                      <div onClick={() =>handleClickOnChatCard(item.id)}>
                        {" "}
                        <hr/>
                        <ChatCard name={item.full_name}
                        userImg = {item.profile_picture || "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_640.png"}
                        lastMessage={{
                          content:
                            lastMessages[item.id]?.content || "Start your conversation",
                          timestamp: lastMessages[item.id]?.timestamp || "",
                        }}
                        /> {" "}
                      </div>
                    ))}
                  
                  {chat.chats.length>0 && !querys &&                
                    chat.chats?.map((item) => (
                      <div onClick={() =>handleCurrentChat(item)}>
                      
                      
                        <hr/>
                        {/* {console.log("item is hukr: ", item)} */}
                       {
                        
                        item.isGroup? (
                          <ChatCard 
                          name={item.chat_name}
                          userImg = {item.chat_image || "https://cdn.pixabay.com/photo/2020/03/06/11/14/black-4906807_640.jpg"}
                          lastMessage={{
                            content:
                              lastMessages[item.id]?.content || "Start your conversation",
                            timestamp: lastMessages[item.id]?.timestamp || "",
                          }}
                         />
                        ): (
                          <ChatCard 
                          isChat ={true}
                          name ={
                            auth.reqUser?.id !== item.users[0]?.id ? item.users[0].full_name : item.users[1].full_name
                          }
                          userImg={
                            auth.reqUser?.id!== item.users[0].id? item.users[0].profile_picture || "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_640.png"
                             : item.users[1].profile_picture || "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_640.png"
                          }
                          lastMessage={{
                            content:
                              lastMessages[item.id]?.content || "Start your conversation",
                            timestamp: lastMessages[item.id]?.timestamp || "",
                          }}
                          />
                        )
                       }
                        
                      </div>
                    ))}

                </div>
              </div>
            )}
          </div>
          {/* {console.log("currentChat =", currentChat)} */}
          {!currentChat && (
            <div className="w-[70%] flex flex-col items-center justify-center h-full">
              <div className="max-w-[40%] text-center">
                <img
                  src="https://static.whatsapp.net/rsrc.php/v3/y6/r/wa669aeJeom.png"
                  alt=""
                />
                <h1 className="text-4xl text-gray-600">Whatsapp web</h1>
                <p className="my-9">
                  Send and Recieve messages without keeping your phone online.
                  Use Whatsapp on up to 4 linked devices and 1 phone at the same
                  time
                </p>
              </div>
            </div>
          )}

          {/* message section */}
          {currentChat && (
            <div className="w-[70%] relative  bg-blue-200">
              <div className="header absolute top-0 w-full bg-[#f0f2f5]">
                <div className="flex justify-between">
                  <div className="py-3 space-x-4 flex items-center px-3">
                    <img
                      className="rounded-full w-10 h-10 cursor-pointer"
                      src={
                        currentChat.isGroup
                        ? currentChat.chat_image || "https://cdn.pixabay.com/photo/2020/03/06/11/14/black-4906807_640.jpg":
                        ( auth.reqUser?.id!== currentChat.users[0].id? currentChat.users[0].profile_picture || "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_640.png"
                          : currentChat.users[1].profile_picture || "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_640.png")
                      }
                      alt=""
                    />
                    <p className="">
                      {
                      currentChat.isGroup
                      ? currentChat.chat_name: auth.reqUser?.id == currentChat.users[0].id ? currentChat.users[1].full_name : currentChat.users[0].full_name
                      }
                      </p>
                  </div>
                  <div className="py-3 space-x-4 items-center px-3 flex">
                    <AiOutlineSearch />
                    <BsThreeDotsVertical />
                  </div>
                </div>
              </div>
              {/* message card */}

              <div className="px-10 h-[85vh] overflow-y-scroll p-10" ref={messageContainerRef}>
                <div className="space-y-1 flex flex-col justify-center  mt-20 py-2">
                  {messages.length > 0 && messages.map((item, i) => (
                    <MessageCard
                      isReqUserMessage={item.user.id  !==  auth.reqUser.id}
                      content={item.content}
                    />
                  ))}
                </div>
              </div>

              <div className="footer bg-[#f0f2f5] absolute bottom-0 w-full py-3 text-2xl">
                <div className="flex justify-between items-center px-5">
                  <BsEmojiSmile className="cursor-pointer" />
                  <ImAttachment />

                  <input
                    className="py-2 outline-none border-none bg-white pl-4 rounded-md w-[85%]"
                    type="text"
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type message"
                    value={content}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleCreateNewMessage();
                        setContent("");
                      }
                    }}
                  />
                  <BsMicFill />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
