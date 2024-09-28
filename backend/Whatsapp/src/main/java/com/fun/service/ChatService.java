package com.fun.service;

import com.fun.exception.ChatException;
import com.fun.exception.UserException;
import com.fun.model.Chat;
import com.fun.model.User;
import com.fun.request.GroupChatRequest;

import java.util.List;

public interface ChatService {
    public Chat createChat(User reqUser, Integer userId2) throws UserException;
    public Chat findChatById(Integer chatId) throws ChatException;
    public List<Chat> findAllChatByUserId(Integer userId) throws UserException;
    public Chat createGroup(GroupChatRequest request, User reqUser) throws UserException;
    public Chat renameGroup(Integer chatId, String groupName, User reqUser) throws UserException, ChatException;
    public Chat addUserToGroup(Integer userId, Integer chatId, User reqUser) throws UserException, ChatException;
    public Chat removeFromGroup(Integer chatId, Integer userId, User reqUser) throws UserException, ChatException;
    public void deleteChat(Integer chatId, Integer userId) throws UserException, ChatException;
}
