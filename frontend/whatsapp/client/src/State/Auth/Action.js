import { BASE_API_URL } from "../../config/api";
import { LOGIN, LOGOUT, REGISTER, REQ_USER, SEARCH_USER, UPDATE_USER } from "./ActionType";

// export const register = (data) => async(dispatch) => {
//     try {
//         const res = await fetch(`${BASE_API_URL}/auth/signup`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         })
//         const resData = await res.json();
//         console.log(resData)
//         if(resData.jwt){
//             localStorage.setItem('jwt', resData.jwt);
//         }
//         dispatch({type:REGISTER,payload:resData})
//         console.log("REGISTER_SUCCESS ", resData)
//     } catch (error) {
//         console.log("Register ERROR :", error)
//     }
// }

export const register = (data) => async (dispatch) => {
    try {
      const res = await fetch(`${BASE_API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const resData = await res.json();
  
      if (!res.ok) {
        // If the response is not OK, throw an error with the server message
        throw new Error(resData.error || "Failed to register");
      }
  
      if (resData.jwt) {
        localStorage.setItem("jwt", resData.jwt);
      }
  
      dispatch({ type: REGISTER, payload: resData });
      console.log("REGISTER_SUCCESS", resData);
  
      return resData; // Return success data (optional, for chaining if needed)
    } catch (error) {
      console.error("Register ERROR:", error.message);
  
      // Reject the promise with an error to be handled by the component
      throw { error: error.message };
    }
  };

  
export const login = (data) => async(dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const resData = await res.json();
        // if(resData.jwt){
        //     localStorage.setItem('jwt', resData.jwt);
        // }
        
        // dispatch({type:LOGIN,payload:resData})
        // console.log("Login_SUCCESS ", resData)


        if (resData.jwt) {
            localStorage.setItem('jwt', resData.jwt);
            dispatch({ type: LOGIN, payload: { ...resData, error: null } });
            console.log("Login_SUCCESS", resData);
        } else {
            dispatch({ type: LOGIN, payload: { ...resData, error: "Invalid email or password" } });
            console.log("Login_FAILED", resData);
        }

    } catch (error) {
        console.log("Login ERROR :", error);
        dispatch({ type: LOGIN, payload: { jwt: null, error: "Something went wrong. Please try again later." } });
    }
}

export const currentUser = (token) => async(dispatch) => {
    console.log("token in Action", token)
    try {
        const res = await fetch(`${BASE_API_URL}/api/users/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` 
            },
           
        })
        const resData = await res.json();
        dispatch({type:REQ_USER,payload:resData})
        console.log("REQ_USER_SUCCESS ", resData)
    } catch (error) {
        console.log("REQ_USER ERROR :", error)
    }
}

export const searchUser = (data) => async(dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/api/users/${data.keyword}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${data.token}` 
            },
            
        })
        const resData = await res.json();
        dispatch({type:SEARCH_USER,payload:resData})
        console.log("SEARCH_USER_SUCCESS ", resData)
    } catch (error) {
        console.log("SEARCH_USER ERROR :", error)
    }
}

export const updateUser = (data) => async(dispatch) => {

    try {
        const res = await fetch(`${BASE_API_URL}/api/users/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${data.token}` 
            },
            body: JSON.stringify(data.data)
        })
        const resData = await res.json();
        dispatch({type:UPDATE_USER,payload:resData})
        console.log("UPDATE_USER_SUCCESS ", resData)
    } catch (error) {
        console.log("UPDATE_USER ERROR :", error)
    }
}

export const logoutAction = () => async(dispatch) =>{
    localStorage.removeItem('jwt');
    dispatch({type: LOGOUT, payload: null})
    dispatch({type: REQ_USER, payload:null})
    console.log("LOGOUT_SUCCESS")
}