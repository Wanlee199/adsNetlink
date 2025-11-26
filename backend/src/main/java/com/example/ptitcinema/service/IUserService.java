package com.example.ptitcinema.service;

import com.example.ptitcinema.model.User;

import java.util.List;

public interface IUserService {
    User login(String email, String password);
    User register(User user);
    
}
