package com.example.ptitcinema.controller;

import com.example.ptitcinema.model.dto.UserDto;
import com.example.ptitcinema.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; 
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {
    
    private final IUserService userService;

    @Autowired
    public UserController(IUserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Get Current User Profile", description = "Retrieves the profile of the currently authenticated user based on the JWT.")
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUserProfile() {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String principalEmail;
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            principalEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
        } else if (authentication != null && authentication.getPrincipal() instanceof String) {
            principalEmail = (String) authentication.getPrincipal();
        } else {
            return ResponseEntity.status(401).build(); 
        }
        
        Optional<UserDto> userProfile = userService.getProfileByEmail(principalEmail);

        return userProfile.map(ResponseEntity::ok) 
                          .orElseGet(() -> ResponseEntity.status(404).build()); 
    }
}