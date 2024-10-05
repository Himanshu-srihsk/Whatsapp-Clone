import { Alert, Button, Snackbar } from "@mui/material";
import { green } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { currentUser, register } from "../../State/Auth/Action";
import { store } from "../../State/store";

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {auth} = useSelector(store => store)
    const token = localStorage.getItem('jwt')
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", inputData);
    dispatch(register(inputData))
    setOpenSnackbar(true); //
  };
  const [inputData, setInputData] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  console.log("current user", auth.reqUser)

  const handleChange = (e) => {
    const {name, value} = e.target;
    setInputData((values) => ({...values, [name]: value }));
    
  };

  const [openSnackBar, setOpenSnackbar] = React.useState(false);

  //   const handleClickSnackBar = () => {
  //     setOpenSnackbar(false);
  //   };

  const handleCloseSnackBar = () => {
    setOpenSnackbar(false);
  };
 
//   console.log("token is", token)
  useEffect(()=>{
    //console.log("Inside useEffect, token is:", token);  
   if(token){
    dispatch(currentUser(token))
   }
  },[token])

  useEffect(()=>{
   if(auth.reqUser?.full_name){
    navigate("/")
   }
  },[auth.reqUser])

  return (
    <div>
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white w-[30%] p-10 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <p className="mb-2">User Name</p>
              <input
                type="text"
                placeholder="Enter username"
                className="py-2 px-3 outline outline-green-600 w-full rounded-md border"
                name="full_name"
                onChange={(e) => handleChange(e)}
                value={inputData.full_name}
              />
            </div>

            <div>
              <p className="mb-2">Email</p>
              <input
                type="email"
                placeholder="Enter your email address"
                className="py-2 px-3 outline outline-green-600 w-full rounded-md border"
                onChange={(e) => handleChange(e)}
                value={inputData.email}
                name="email"
              />
            </div>
            <div>
              <p className="mb-2">Password</p>
              <input
                type="password"
                placeholder="Enter your Password"
                className="py-2 px-3 outline outline-green-600 w-full rounded-md border"
                onChange={(e) => handleChange(e)}
                value={inputData.password}
                name="password"
              />
            </div>

            <div>
              <Button
                type="submit"
                sx={{ bgcolor: green[700], padding: ".5rem 0rem" }}
                className="w-full  bg-green-600"
                variant="contained"
              >
                Signup
              </Button>
            </div>

           
          </form>

          <div className="flex space-x-3 items-center mt-5">
                <p className="">Already have Account?</p>
                <p onClick={()=> navigate("/signin")}
                    className="text-blue-500 hover:text-blue-800 cursor-pointer"
                    >Signin</p>
            </div>
        </div>
      </div>

      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
       
      >
        <Alert onClose={handleCloseSnackBar} severity="success" sx={{ width: "100%" }}>
          You acccount created successfully.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Signup;
