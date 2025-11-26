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
                user.setId(re.getInt("id"));
                user.setEmail(re.getString("email"));
                user.setPassword(re.getString("password"));
                user.setFullName(re.getString("full_name"));
                return user;
            }, email);
        }
        catch (Exeption e){
            return null;
        }
        
    }

    @Override
    public User findByUsername(String username){
        String sqlQuery = "SELECT * FROM [User] WHERE username = ?";
        try{
            return sqlJdbcTemplate.queryForObject(sqlQuery, (re, rowNum) -> {
                User user = new User();
                user.setId(re.getInt("id"));
                user.setUsername(re.getString("username"));
                user.setEmail(re.getString("email"));
                user.setPassword(re.getString("password"));
                user.setFullName(re.getString("full_name"));
                user.setPhone(re.getString("phone"));
                return user;
            }, username);
        }
        catch (Exception e){
            return null;
        }
    }
    @Override
    public User save(User user){
        String sql = "INSERT INTO [User] (Username, Email, Password, FullName, Phone) VALUES (?, ?, ?, ?, ?)";
        sqlJdbcTemplate.update(sql, user.getUsername(), user.getEmail(), user.getPassword(), user.getFullName(), user.getPhone());
        return findByEmail(user.getEmail());
    }

}
