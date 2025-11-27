package com.example.ptitcinema.model.dto;

import com.example.ptitcinema.model.User;
import java.util.List;

public class UserDto {
    private int id;
    private String userName;
    private String email;
    private String fullName;
    private String phone;
    private List<String> roles;
    
    public UserDto(User user) {
        this.Id = user.getId();
        this.userName = user.getUserName();
        this.email = user.getEmail();
        this.fullName = user.getFullName();
        this.phone = user.getPhone();
        this.roles = user.getRoles();
    }

    public int getId() { return id; }
    public String getUsername() { return userName; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public String getPhone() { return phone; }
    public List<String> getRoles() { return roles; }
}