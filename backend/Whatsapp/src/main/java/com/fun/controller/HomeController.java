package com.fun.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/")
    public ResponseEntity<String> HoomeController(){
        return new ResponseEntity<>("Welcome tp WhatsApp application", HttpStatus.OK);
    }
}
