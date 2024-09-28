package com.fun.service;

import com.fun.exception.ChatException;
import com.fun.exception.MessageException;
import com.fun.exception.UserException;
import com.fun.model.Message;
import com.fun.model.User;
import com.fun.request.SendMessageRequest;

import java.util.List;

public interface MessageService {
    public Message sendMessage(SendMessageRequest request) throws UserException, ChatException;
    public List<Message> getChatsMessages(Integer chatId, User reqUser) throws ChatException, UserException;
    public Message findMessageById(Integer messageId) throws MessageException;
    public void deleteMessage(Integer messageId, User reqUser) throws MessageException, UserException;
}
