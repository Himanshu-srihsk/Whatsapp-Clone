package com.fun.controller;

import com.fun.exception.ChatException;
import com.fun.exception.MessageException;
import com.fun.exception.UserException;
import com.fun.model.Message;
import com.fun.model.User;
import com.fun.request.SendMessageRequest;
import com.fun.response.ApiResponse;
import com.fun.service.MessageService;
import com.fun.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    @Autowired
    private MessageService messageService;
    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<Message> sendMessageHandler(@RequestBody SendMessageRequest request,
                                                      @RequestHeader("Authorization") String jwt) throws ChatException, UserException {
        User user = userService.findUserByProfile(jwt);
        request.setUserId(user.getId());
        Message message = messageService.sendMessage(request);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    @GetMapping("/chat/{chatId}")
    public ResponseEntity<List<Message>> getChatsMessageHandler(
            @PathVariable Integer chatId,
                                                      @RequestHeader("Authorization") String jwt) throws ChatException, UserException {
        User user = userService.findUserByProfile(jwt);
        List<Message> messages = messageService.getChatsMessages(chatId, user);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResponse> deleteMessageHandler(
            @PathVariable Integer messageId,
            @RequestHeader("Authorization") String jwt) throws ChatException, UserException, MessageException {
        User user = userService.findUserByProfile(jwt);
        messageService.deleteMessage(messageId, user);
        ApiResponse apiResponse = new ApiResponse("Message deleted Successfully", false);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
