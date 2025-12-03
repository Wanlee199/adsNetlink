package com.example.ptitcinema.service.impl;

import com.example.ptitcinema.model.Booking;
import com.example.ptitcinema.model.dto.BookingRequest;
import com.example.ptitcinema.model.dto.BookingResponse;
import com.example.ptitcinema.repository.IBookingRepository;
import com.example.ptitcinema.service.IBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.List;
import java.util.Collections;

@Service
public class BookingService implements IBookingService {
    private final IBookingRepository bookingRepository;

    @Autowired
    public BookingService(IBookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    
    @Transactional
    @Override
    public Optional<BookingResponse> createBooking(String userEmail, BookingRequest request) {
        Optional<Integer> userIdOptional = bookingRepository.findUserIdByEmail(userEmail);
        if (userIdOptional.isEmpty()) {
            return Optional.empty(); 
        }
        int userId = userIdOptional.get();

        Optional<Integer> movieIdOptional = bookingRepository.findMovieIdByShowtimeId(request.getShowtimeId());
        if (movieIdOptional.isEmpty()) {
            return Optional.empty(); 
        }
        int movieId = movieIdOptional.get();

        Booking savedBooking = bookingRepository.saveBooking(userId, request);
        int bookingId = savedBooking.getId();

        if (bookingId == -1) return Optional.empty();

        bookingRepository.saveBookingDetails(bookingId, request.getSeats());

        BookingResponse response = new BookingResponse();
        response.setId("BK" + bookingId); 
        response.setUserId(userId);
        response.setMovieId(movieId);
        response.setShowtimeId(request.getShowtimeId());
        response.setCinemaName(request.getCinemaName());
        response.setMovieTitle(request.getMovieTitle());
        response.setDate(request.getDate());
        response.setTime(request.getTime());
        response.setSeats(request.getSeats());
        response.setTotalPrice(request.getTotalPrice());
        response.setStatus(savedBooking.getStatus() == 0 ? "pending" : "confirmed"); 
        response.setCreatedAt(savedBooking.getCreatedAt());
        response.setQrCode("PTIT_CINEMA_BK" + bookingId); 
        
        return Optional.of(response);
    }

    @Override
    public List<BookingResponse> getUserBookings(String userEmail) {
        Optional<Integer> userIdOptional = bookingRepository.findUserIdByEmail(userEmail);
        if (userIdOptional.isEmpty()) {
            return Collections.emptyList();
        }
        return bookingRepository.findBookingsByUserId(userIdOptional.get());
    }
}