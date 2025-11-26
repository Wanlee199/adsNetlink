package com.example.ptitcinema.repository;

import com.example.ptitcinema.model.User;


public interface IUserRepository {
    User findByEmail(String email);
    User findByUsername(String username);
    User save(User user);
    
}