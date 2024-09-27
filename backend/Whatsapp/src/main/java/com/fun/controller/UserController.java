package com.fun.controller;

import com.fun.exception.UserException;
import com.fun.model.User;
import com.fun.request.UpdateUserRequest;
import com.fun.response.ApiResponse;
import com.fun.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfileHandler(@RequestHeader("Authorization") String jwt) throws UserException {
          User user = userService.findUserByProfile(jwt);
          return new ResponseEntity<User>(user, HttpStatus.ACCEPTED);
    }
    @GetMapping("/{query}")
    public ResponseEntity<List<User>> searchUserHandler(@PathVariable("query") String query){
         List<User> users = userService.searchUser(query);
         return new ResponseEntity<List<User>>(users, HttpStatus.OK);
    }
    @PutMapping("/update")
    public ResponseEntity<ApiResponse> UpdateUserHandler(@RequestBody UpdateUserRequest request,
                                                         @RequestHeader("Authorization") String jwt
    ) throws UserException {
        User user = userService.findUserByProfile(jwt);
        userService.updateUser(user.getId(), request);
        ApiResponse apiResponse = new ApiResponse("user updated successfully", true);
        return new ResponseEntity<ApiResponse>(apiResponse, HttpStatus.ACCEPTED);
    }

}
