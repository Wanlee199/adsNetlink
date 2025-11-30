package com.example.ptitcinema.service;

import com.example.ptitcinema.model.dto.BookingRequest;
import com.example.ptitcinema.model.dto.BookingResponse;
import java.util.Optional;

public interface IBookingService {
    Optional<BookingResponse> createBooking(String userEmail, BookingRequest request);
}