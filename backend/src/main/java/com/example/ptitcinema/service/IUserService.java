package com.example.ptitcinema.service;

import com.example.ptitcinema.model.User;
import com.example.ptitcinema.model.dto.UserDto;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    Optional<UserDto> getProfileByEmail(String email);
    User login(String usernameOrEmail, String password);
    User register(User user);
    
}
