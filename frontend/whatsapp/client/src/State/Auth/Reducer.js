// import { LOGIN, REGISTER, REQ_USER, SEARCH_USER, UPDATE_USER } from "./ActionType"

// const initialState = {
//     signup: null,
//     signin: null,
//     reqUser: null,
//     searchUser: null,
//     updatedUser: null
    
// }
// export const authReducer = (state = initialState, {type, payload}) => {
//     switch (type) {
        
//         case REGISTER:
//             return { ...state, signup: payload }
//         case LOGIN:
//             return { ...state, signin: payload }
//         case REQ_USER:
//             return { ...state, reqUser: payload }    
//         case SEARCH_USER:
//             return { ...state, searchUser: payload }  
//         case UPDATE_USER:
//             return { ...state, updatedUser: payload }    

//         default:
//             return state;
//     }
// }

import { LOGIN, REGISTER, REQ_USER, SEARCH_USER, UPDATE_USER } from "./ActionType";

const initialState = {
    signup: null,
    signin: null, // Fixed typo (was "sigin")
    reqUser: null,
    searchUser: null,
    updatedUser: null,
    error: null // Add error property for better error handling
};

export const authReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case REGISTER:
            return { ...state, signup: payload };
        case LOGIN:
            return { ...state, signin: payload, error: payload?.error || null }; // Handle errors in LOGIN
        case REQ_USER:
            return { ...state, reqUser: payload };
        case SEARCH_USER:
            return { ...state, searchUser: payload };
        case UPDATE_USER:
            return { ...state, updatedUser: payload };
        default:
            return state;
    }
};
