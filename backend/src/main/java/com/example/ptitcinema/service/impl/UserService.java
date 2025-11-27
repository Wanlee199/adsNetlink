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
    public User login(String usernameOrEmail, String password) {
        User user = userRepo.findByUsername(usernameOrEmail);
        if(user == null){
            user = userRepo.findByEmail(usernameOrEmail);
            if(user == null) return null;
        }
        if (!user.getPassword().equals(password)) return null;
        return user;
    }


    @Override
    public User register( User user){
        String returnValue ="";
        if(userRepo.findByEmail(user.getEmail()) != null) returnValue += "Email exists. \n";
        if(userRepo.findByUsername(user.getUsername()) != null) returnValue += "Username exists. \n";
        if(!returnValue.isEmpty()) return returnValue;

        return userRepo.saveRegister(user);
    }

    @Override
    public Optional<UserDto> getProfileByEmail(String email) {
        // Sử dụng phương thức repository đã có
        User user = userRepo.findByEmail(email);

        if (user == null) {
            return Optional.empty();
        }
        
        // **Lưu ý quan trọng**: Bạn cần đảm bảo Repository có logic 
        // để lấy danh sách Roles cho User này.
        // Tôi giả định logic này nằm trong findByEmail hoặc được gọi riêng 
        // trong UserRepository (nếu chưa có, bạn cần tự bổ sung).
        
        // Chuyển đổi từ Entity sang DTO
        UserDto userDto = new UserDto(user);
        return Optional.of(userDto);
    }

}
