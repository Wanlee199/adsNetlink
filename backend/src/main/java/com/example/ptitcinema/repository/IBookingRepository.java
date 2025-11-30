package com.example.ptitcinema.repository;

import com.example.ptitcinema.model.dto.BookingRequest;
import com.example.ptitcinema.model.Booking;
import java.util.List;
import java.util.Optional;

public interface IBookingRepository {
    Optional<Integer> findUserIdByEmail(String email);
    Optional<Integer> findMovieIdByShowtimeId(int showtimeId);
    
    // Lưu Booking và trả về đối tượng Booking đã có ID (Tự tăng)
    Booking saveBooking(int userId, BookingRequest request); 
    
    // Lưu BookingDetails
    void saveBookingDetails(int bookingId, List<String> seatNumbers);
}