package com.example.ptitcinema.controller;

import com.example.ptitcinema.model.dto.BookingRequest;
import com.example.ptitcinema.model.dto.BookingResponse;
import com.example.ptitcinema.service.IBookingService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {
    
    private final IBookingService bookingService;

    @Autowired
    public BookingController(IBookingService bookingService) {
        this.bookingService = bookingService;
    }

    @Operation(summary = "Create Booking", 
               description = "Creates a new booking for the authenticated user. Status is set to pending/unpaid.")
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest request) {
        
        // 1. Lấy thông tin người dùng đã xác thực (Email/Principal)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail;

        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
        } else if (authentication != null && authentication.getPrincipal() instanceof String) {
            userEmail = (String) authentication.getPrincipal();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); 
        }

        // 2. Validate dữ liệu tối thiểu
        if (request.getShowtimeId() <= 0 || request.getSeats() == null || request.getSeats().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // 3. Gọi Service để tạo Booking
        Optional<BookingResponse> responseOptional = bookingService.createBooking(userEmail, request);
        
        // 4. Trả về kết quả
        return responseOptional.map(response -> new ResponseEntity<>(response, HttpStatus.CREATED))
                               .orElseGet(() -> ResponseEntity.status(HttpStatus.BAD_REQUEST).build()); // 400 Bad Request nếu Showtime hoặc User không hợp lệ
    }

    @Operation(summary = "Get User Bookings", 
               description = "Retrieves all bookings for the authenticated user.")
    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponse>> getMyBookings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail;

        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
        } else if (authentication != null && authentication.getPrincipal() instanceof String) {
            userEmail = (String) authentication.getPrincipal();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); 
        }

        List<BookingResponse> bookings = bookingService.getUserBookings(userEmail);
        return ResponseEntity.ok(bookings);
    }
}