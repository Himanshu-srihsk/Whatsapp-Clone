package com.fun.service;

import com.fun.exception.UserException;
import com.fun.model.User;
import com.fun.request.UpdateUserRequest;

import java.util.List;

public interface UserService {
    public User findUserById(Integer id) throws UserException;
    public User findUserByProfile(String jwt) throws UserException;
    public User updateUser(Integer userId, UpdateUserRequest req) throws UserException;
    public List<User> searchUser(String query);
}
