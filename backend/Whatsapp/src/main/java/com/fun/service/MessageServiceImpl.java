package com.fun.service;

import com.fun.exception.ChatException;
import com.fun.exception.MessageException;
import com.fun.exception.UserException;
import com.fun.model.Chat;
import com.fun.model.Message;
import com.fun.model.User;
import com.fun.repository.MessageRepo;
import com.fun.request.SendMessageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MessageServiceImpl implements MessageService{
    @Autowired
    private MessageRepo messageRepo;
    @Autowired
    private UserService userService;
    @Autowired
    private ChatService chatService;

    @Override
    public Message sendMessage(SendMessageRequest request) throws UserException, ChatException {
        User user = userService.findUserById(request.getUserId());
        Chat chat = chatService.findChatById(request.getChatId());
        Message message = new Message();
        message.setChat(chat);
        message.setUser(user);
        message.setContent(request.getContent());
        message.setTimestamp(LocalDateTime.now());
        return messageRepo.save(message);
    }

    @Override
    public List<Message> getChatsMessages(Integer chatId, User reqUser) throws ChatException, UserException {
        Chat chat = chatService.findChatById(chatId);
        if(!chat.getUsers().contains(reqUser)){
            throw new UserException("you are not related to chatr"+chat.getId());
        }
        List<Message> messages = messageRepo.findByChatId(chat.getId());
        return messages;
    }

    @Override
    public Message findMessageById(Integer messageId) throws MessageException {
        Optional<Message> optionalMessage = messageRepo.findById(messageId);
        if(optionalMessage.isPresent()){
            return optionalMessage.get();
        }
        throw new MessageException("Message not found with id ="+messageId);
    }

    @Override
    public void deleteMessage(Integer messageId, User reqUser) throws MessageException, UserException {
       Message message = findMessageById(messageId);
       if(message.getUser().getId().equals(reqUser.getId())){
           messageRepo.delete(message);
           return;
       }
       throw new UserException("you can not delete another's user message "+reqUser.getFull_name());
    }
}
