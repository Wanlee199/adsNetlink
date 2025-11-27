package com.example.ptitcinema.model.dto;

public class LoginResponse {
    private String accessToken;
    private UserDto user;

    public LoginResponse(String accessToken, UserDto user) {
        this.accessToken = accessToken;
        this.user = user;
    }

    public String getAccessToken() { return accessToken; }
    public UserDto getUser() { return user; }
}