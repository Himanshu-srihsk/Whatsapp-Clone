package com.fun.controller;

import com.fun.exception.ChatException;
import com.fun.exception.UserException;
import com.fun.model.Chat;
import com.fun.model.User;
import com.fun.request.GroupChatRequest;
import com.fun.request.SingleChatRequest;
import com.fun.response.ApiResponse;
import com.fun.service.ChatService;
import com.fun.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
public class ChatController {
    @Autowired
    private ChatService chatService;
    @Autowired
    private UserService userService;

    @PostMapping("/single")
    public ResponseEntity<Chat> createChatHandler(@RequestBody SingleChatRequest singleChatRequest,
                                                  @RequestHeader("Authorization") String jwt) throws UserException {
        User reqUser = userService.findUserByProfile(jwt);
        Chat chat = chatService.createChat(reqUser, singleChatRequest.getUserId());
        return new ResponseEntity<>(chat, HttpStatus.OK);
    }

    @PostMapping("/group")
    public ResponseEntity<Chat> createGroupHandler(@RequestBody GroupChatRequest groupChatRequest,
                                                  @RequestHeader("Authorization") String jwt) throws UserException {
        User reqUser = userService.findUserByProfile(jwt);
        Chat chat = chatService.createGroup(groupChatRequest, reqUser);
        return new ResponseEntity<>(chat, HttpStatus.OK);
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<Chat> findChatByIdHandler(@PathVariable Integer chatId,
                                                   @RequestHeader("Authorization") String jwt) throws UserException, ChatException {
        Chat chat = chatService.findChatById(chatId);
        return new ResponseEntity<>(chat, HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Chat>> findAllChatByUserIdHandler(
                                                   @RequestHeader("Authorization") String jwt) throws UserException {
        User reqUser = userService.findUserByProfile(jwt);
        List<Chat> chats = chatService.findAllChatByUserId(reqUser.getId());
        return new ResponseEntity<>(chats, HttpStatus.OK);
    }

    @PutMapping("/{chatId}/add/{userId}")
    public ResponseEntity<Chat> addUserToGroupHandler(
            @PathVariable Integer chatId,
            @PathVariable Integer userId,
            @RequestHeader("Authorization") String jwt) throws UserException, ChatException {
        User reqUser = userService.findUserByProfile(jwt);
        Chat chat = chatService.addUserToGroup(userId, chatId, reqUser);
        return new ResponseEntity<>(chat, HttpStatus.OK);
    }

    @PutMapping("/{chatId}/remove/{userId}")
    public ResponseEntity<Chat> removeUserToGroupHandler(
            @PathVariable Integer chatId,
            @PathVariable Integer userId,
            @RequestHeader("Authorization") String jwt) throws UserException, ChatException {
        User reqUser = userService.findUserByProfile(jwt);
        Chat chat = chatService.removeFromGroup(chatId, userId, reqUser);
        return new ResponseEntity<>(chat, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{chatId}")
    public ResponseEntity<ApiResponse> deleteChatHandler(
            @PathVariable Integer chatId,
            @PathVariable Integer userId,
            @RequestHeader("Authorization") String jwt) throws UserException, ChatException {
        User reqUser = userService.findUserByProfile(jwt);
        chatService.deleteChat(chatId, reqUser.getId());
        ApiResponse response = new ApiResponse("Chat deleted successfully", false);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
