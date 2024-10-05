import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE } from "./ActionType";

const initialState ={
    messages: [],
    newMessage: null
}
export const messageReducer = (store = initialState, {type, payload}) => {
    switch(type){
        case CREATE_NEW_MESSAGE:
            return {
                ...store,
                newMessage: payload
            }
        case GET_ALL_MESSAGE:
            return {
                ...store,
                messages: payload
            }
        default:
            return store;
    }
 
}