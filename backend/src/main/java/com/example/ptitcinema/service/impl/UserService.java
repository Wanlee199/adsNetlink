package com.example.ptitcinema.service.impl;

import com.example.ptitcinema.model.User;
import com.example.ptitcinema.repository.IUserRepository;
import com.example.ptitcinema.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements IUserService {
    private final IUserRepository userRepo;

    @Autowired
    public UserService(final IUserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public User login(String username, String password) {
        User user = userRepo.findByUsername(username);
        if (user == null) return null;
        if (!user.getPassword().equals(password)) return null;
        return user;
    }


    @Override
    public User register( User user){
        String returnValue ="";
        if(userRepo.findByEmail(user.getEmail()) != null) returnValue += "Email exists. \n";
        if(userRepo.findByUsername(user.getUsername()) != null) returnValue += "Username exists. \n";
        if(!returnValue.isEmpty()) return returnValue;

        return userRepo.save(user);
    }

}
