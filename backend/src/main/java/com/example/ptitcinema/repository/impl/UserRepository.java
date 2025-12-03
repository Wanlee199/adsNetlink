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

    private List<String> getRolesByUserId(int userId) {
        String sql = "SELECT r.Name FROM Role r JOIN UserRole ur ON r.Id = ur.RoleId WHERE ur.UserId = ?";
        try {
            return sqlJdbcTemplate.queryForList(sql, String.class, userId);
        } catch (Exception e) {
            return new java.util.ArrayList<>();
        }
    }

    @Override
    public User findByEmail(String email){
        String sqlQuery = "SELECT * FROM [User] WHERE email = ?";
        try{
            User user = sqlJdbcTemplate.queryForObject(sqlQuery, (re, rowNum) -> {
                User u = new User();
                u.setId(re.getInt("userid"));
                u.setEmail(re.getString("email"));
                u.setPassword(re.getString("password"));
                u.setFullName(re.getString("fullname"));
                return u;
            }, email);
            
            if (user != null) {
                user.setRoles(getRolesByUserId(user.getId()));
            }
            return user;
        }
        catch (Exception e){
            return null;
        }
        
    }

    @Override
    public User findByUsername(String username){
        String sqlQuery = "SELECT * FROM [User] WHERE username = ?";
        try{
            User user = sqlJdbcTemplate.queryForObject(sqlQuery, (re, rowNum) -> {
                User u = new User();
                u.setId(re.getInt("userid"));
                u.setUserName(re.getString("username"));
                u.setEmail(re.getString("email"));
                u.setPassword(re.getString("password"));
                u.setFullName(re.getString("fullname"));
                u.setPhone(re.getString("phone"));
                return u;
            }, username);

            if (user != null) {
                user.setRoles(getRolesByUserId(user.getId()));
            }
            return user;
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
