import { CREATE_CHAT, CREATE_GROUP, GET_USERS_CHAT } from "./ActionType"

const initialState = {
    chats: [],
    createdgroup: null,
    createdChat: null
}
export const chatReducer = (store = initialState, {type, payload}) =>{
    switch (type) {
        case CREATE_CHAT:
            return {
               ...store,
                createdChat: payload
            }
        case CREATE_GROUP:
            return {
                ...store,
                createdgroup: payload
            }   
            case GET_USERS_CHAT:
                return {
                    ...store,
                    chats: payload
                }       
        default:
            return store
    }
}