package com.example.ptitcinema.service;

import com.example.ptitcinema.model.dto.BookingRequest;
import com.example.ptitcinema.model.dto.BookingResponse;
import java.util.Optional;
import java.util.List;

public interface IBookingService {
    Optional<BookingResponse> createBooking(String userEmail, BookingRequest request);
    
    List<BookingResponse> getUserBookings(String userEmail);
}