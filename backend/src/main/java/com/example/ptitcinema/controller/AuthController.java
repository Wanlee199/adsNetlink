package com.example.ptitcinema.controller;

import com.example.ptitcinema.model.User;
import com.example.ptitcinema.model.dto.LoginRequest;
import com.example.ptitcinema.model.dto.LoginResponse;
import com.example.ptitcinema.model.dto.RegisterRequest;
import com.example.ptitcinema.model.dto.UserDto; 
import com.example.ptitcinema.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.ptitcinema.config.JwtUtil;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private IUserService userService;
    @Autowired
    public void setUserService(IUserService userService){this.userService = userService;}

    @Autowired
    private JwtUtil jwtUtil;

    @Operation(summary = "Login user", description = "Authenticates a user and returns access tokens")
    @GetMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        
        User user = userService.login(req.getUsername(), req.getPassword()); 
        
        if (user == null) {
            return new ResponseEntity("Invalid username or password", HttpStatus.UNAUTHORIZED);
        }

        String token = jwtUtil.generateToken(user.getEmail());

        UserDto userDto = new UserDto(user);
        
        LoginResponse res = new LoginResponse(token, userDto);
        
        return ResponseEntity.ok(res); 
    }

    @Operation(summary = "Register new user")
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        
        User user = new User();
        user.setUserName(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(req.getPassword());
        user.setFullName(req.getFullName());
        user.setPhone(req.getPhone());
        user.setRoles(Arrays.asList("CUSTOMER"));

        User savedUser = userService.register(user);

        if (savedUser == null) { 
            return new ResponseEntity("Registration failed", HttpStatus.BAD_REQUEST);
        }
        
        String token = jwtUtil.generateToken(savedUser.getEmail());

        UserDto userDto = new UserDto(savedUser);
        LoginResponse res = new LoginResponse(token, userDto);

        return new ResponseEntity<>(res, HttpStatus.CREATED); 
    }
}
