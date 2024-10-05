package com.fun.service;

import com.fun.config.JwtProvider;
import com.fun.exception.UserException;
import com.fun.model.User;
import com.fun.repository.UserRepo;
import com.fun.request.UpdateUserRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public User findUserById(Integer id) throws UserException {
        Optional<User>optionalUser = userRepo.findById(id);
        if(optionalUser.isPresent()){
            return optionalUser.get();
        }
        throw new UserException("User not found with id " + id);
    }

    @Override
    public User findUserByProfile(String jwt) throws UserException {
        String email = jwtProvider.getEmailFromToken(jwt);
        if(email==null){
           throw new BadCredentialsException("received Invalid token");
        }
        User user = userRepo.findByEmail(email);
        if(user==null){
            throw new UserException("User not found with email " + email);
        }
        return user;
    }

    @Override
    public User updateUser(Integer userId, UpdateUserRequest req) throws UserException {

        User user = findUserById(userId);
        if(req.getFull_name()!=null){
            user.setFull_name(req.getFull_name());
        }
        if(req.getProfile_picture()!=null){
            user.setProfile_picture(req.getProfile_picture());
        }
        return userRepo.save(user);
    }

    @Override
    public List<User> searchUser(String query) {
        List<User> users = userRepo.searchUser(query);
        return users;
    }
}
