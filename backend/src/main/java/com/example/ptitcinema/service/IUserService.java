package com.example.ptitcinema.service;

import com.example.ptitcinema.model.User;

import java.util.List;

public interface IUserService {
    Optional<UserDto> getProfileByEmail(String email);
    User login(String usernameOrEmail, String password);
    User register(User user);
    
}
