package com.fun.controller;

import com.fun.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RealTimeChat {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

//    @MessageMapping("/message")
//    @SendTo("/group/public")
//    public Message recieveMessage(@Payload Message message) {
//        System.out.println("message: " + message);
//        simpMessagingTemplate.convertAndSend("/group/" + message.getChat().getId().toString(), message);
//        return message;
//    }

    @MessageMapping("/message")
    public void receiveMessage(@Payload Message message) {
        if (message.getChat().getIsGroup()) {
            // Send message to the group
            simpMessagingTemplate.convertAndSend("/group/" + message.getChat().getId(), message);
        } else {
            // Send message to a specific user
            simpMessagingTemplate.convertAndSend("/user/" + message.getChat().getId(), message);
        }
    }
}
