package com.example.ptitcinema.controller;

import com.example.ptitcinema.model.User;
import com.example.ptitcinema.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private IUserService userServ;
    @Autowired
    public void setMovieServ(IUserService userServ){this.userServ = userServ;}

    @Autowired
    private JwtUtil jwtUtil;

    @Operation(summary = "Login user", description = "Authenticates a user and returns access tokens")
    @GetMapping("/login")
    public Object login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        User user = userService.login(email, password);

        if (user == null) return Map.of("error", "Invalid email or password");

        String token = jwtUtil.generateToken(email);

        Map<String, Object> res = new HashMap<>();
        res.put("accessToken", token);
        res.put("user", user);
        return res;
    }

    @Operation(summary = "Register new user")
    @PostMapping("/register")
    public Object register(@RequestBody Map<String, String> body) {
        String userName = body.get("username");
        String email = body.get("email");
        String password = body.get("password");
        String fullName = body.get("fullName");
        String phone = body.get("phone");

        User user = new User();
        user.setUserName(userName);
        user.setEmail(email);
        user.setPassword(password);
        user.setFullName(fullName);
        user.setPhone(phone);
        user.setRoles(Arrays.asList("CUSTOMER"));

        User savedUser = userService.register(user);
        if (savedUser instanceof String) return Map.of("error", savedUser);

        String token = jwtUtil.generateToken(savedUser.getEmail());

        Map<String, Object> res = new HashMap<>();
        res.put("accessToken", token);
        res.put("user", savedUser);
        return res;
    }
}
