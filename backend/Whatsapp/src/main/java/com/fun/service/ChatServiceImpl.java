package com.fun.service;

import com.fun.exception.ChatException;
import com.fun.exception.UserException;
import com.fun.model.Chat;
import com.fun.model.User;
import com.fun.repository.ChatRepo;
import com.fun.request.GroupChatRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChatServiceImpl implements ChatService{

    @Autowired
    private ChatRepo chatRepo;
    @Autowired
    private UserService userService;
    @Override
    public Chat createChat(User reqUser, Integer userId2) throws UserException {
        User user = userService.findUserById(userId2);
        Chat isChatExist = chatRepo.findSingleChatByUserIds(user, reqUser);
        if(isChatExist != null){
            return isChatExist;
        }
        Chat chat = new Chat();
        chat.setCreatedBy(reqUser);
        chat.getUsers().add(user);
        chat.getUsers().add(reqUser);
       // chat.setIsGroup(false);
        return chat;
    }

    @Override
    public Chat findChatById(Integer chatId) throws ChatException {
        Optional<Chat> chat = chatRepo.findById(chatId);
        if(chat.isPresent()){
            return chat.get();
        }
        throw new ChatException("Chat not found with id " + chatId);

    }

    @Override
    public List<Chat> findAllChatByUserId(Integer userId) throws UserException {
        User user = userService.findUserById(userId);
        List<Chat> chats = chatRepo.findChatByUserid(user.getId());
        return chats;
    }

    @Override
    public Chat createGroup(GroupChatRequest request, User reqUser) throws UserException {
        Chat group = new Chat();
        group.setIsGroup(true);
        group.setChat_image(request.getChat_image());
        group.setChat_name(request.getChat_name());
        group.setCreatedBy(reqUser);
        for(Integer userId: request.getUserIds()){
            User user = userService.findUserById(userId);
            group.getUsers().add(user);
        }
        return group;
    }

    @Override
    public Chat addUserToGroup(Integer userId, Integer chatId, User reqUser) throws UserException, ChatException {
//        Chat chat = findChatById(chatId);
        Optional<Chat> optionalChat = chatRepo.findById(chatId);

        User user = userService.findUserById(userId);
        if(optionalChat.isPresent()){
            Chat chat = optionalChat.get();
            if(chat.getAdmins().contains(reqUser)){
                chat.getUsers().add(user);
                return chatRepo.save(chat);
            }else{
                throw new UserException("Only admin can add user to group");
            }

        }
        throw new ChatException("Chat not found with id"+chatId);
    }

    @Override
    public Chat renameGroup(Integer chatId, String groupName, User reqUser) throws UserException, ChatException {
        Optional<Chat> optionalChat = chatRepo.findById(chatId);
        if(optionalChat.isPresent()){
           Chat chat = optionalChat.get();
           if(chat.getUsers().contains(reqUser)){
               chat.setChat_name(groupName);
               return chatRepo.save(chat);
           }
           throw new UserException("you are not the member of this group");
        }
        return null;
    }

    @Override
    public Chat removeFromGroup(Integer chatId, Integer userId, User reqUser) throws UserException, ChatException {
        Optional<Chat> optionalChat = chatRepo.findById(chatId);

        User user = userService.findUserById(userId);
        if(optionalChat.isPresent()){
            Chat chat = optionalChat.get();
            if(chat.getAdmins().contains(reqUser)){
                chat.getUsers().remove(user);
                return chatRepo.save(chat);
            } else if (chat.getUsers().contains(reqUser)){
                if(user.getId().equals(reqUser.getId())){
                    chat.getUsers().remove(user);
                    return chatRepo.save(chat);
                }
            }
            throw new UserException("You cannot remove another user");
        }
        throw new ChatException("Chat not found with id"+chatId);
    }

    @Override
    public void deleteChat(Integer chatId, Integer userId) throws UserException, ChatException {
        Optional<Chat> optionalChat = chatRepo.findById(chatId);
        if(optionalChat.isPresent()){
            Chat chat = optionalChat.get();
            chatRepo.deleteById(chat.getId());
        }
    }
}
