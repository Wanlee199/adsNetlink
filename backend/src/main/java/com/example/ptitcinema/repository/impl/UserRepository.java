package com.example.ptitcinema.repository.impl;

import com.example.ptitcinema.model.User;
import com.example.ptitcinema.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import java.util.Arrays;

@Repository
public class UserRepository  implements IUserRepository {
    private final JdbcTemplate sqlJdbcTemplate;

    @Autowired
    public UserRepository(final JdbcTemplate sqlJdbcTemplate) {
        this.sqlJdbcTemplate = sqlJdbcTemplate;
    }

    @Override
    public User findByEmail(String email){
        String sqlQuery = "SELECT * FROM [User] WHERE email = ?";
        try{
            return sqlJdbcTemplate.queryForObject(sqlQuery, (re, rowNum) -> {
                User user = new User();
                user.setId(re.getInt("userid"));
                user.setEmail(re.getString("email"));
                user.setPassword(re.getString("password"));
                user.setFullName(re.getString("fullname"));
                return user;
            }, email);
        }
        catch (Exception e){
            return null;
        }
        
    }

    @Override
    public User findByUsername(String username){
        String sqlQuery = "SELECT * FROM [User] WHERE username = ?";
        try{
            return sqlJdbcTemplate.queryForObject(sqlQuery, (re, rowNum) -> {
                User user = new User();
                user.setId(re.getInt("userid"));
                user.setUserName(re.getString("username"));
                user.setEmail(re.getString("email"));
                user.setPassword(re.getString("password"));
                user.setFullName(re.getString("fullname"));
                user.setPhone(re.getString("phone"));
                return user;
            }, username);
        }
        catch (Exception e){
            return null;
        }
    }
    @Override
    public User saveRegister(User user){
        String sql = "INSERT INTO [User] (Username, Email, Password, FullName, Phone) VALUES (?, ?, ?, ?, ?)";
        sqlJdbcTemplate.update(sql, user.getUserName(), user.getEmail(), user.getPassword(), user.getFullName(), user.getPhone());
        User userSaved = findByEmail(user.getEmail());
        int userId = userSaved.getId();
        
        String sqlRoles = "INSERT INTO [UserRole] (UserId, RoleId, Status) VALUES (?, 1, 1)";
        sqlJdbcTemplate.update(sqlRoles, userId);
        return userSaved;
    }

}
