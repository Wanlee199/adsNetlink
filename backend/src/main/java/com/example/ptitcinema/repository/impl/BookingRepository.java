package com.example.ptitcinema.repository.impl;

import com.example.ptitcinema.model.Booking;
import com.example.ptitcinema.model.dto.BookingRequest;
import com.example.ptitcinema.repository.IBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class BookingRepository implements IBookingRepository {
    private final JdbcTemplate sqlJdbcTemplate;

    @Autowired
    public BookingRepository(final JdbcTemplate sqlJdbcTemplate) {
        this.sqlJdbcTemplate = sqlJdbcTemplate;
    }

    @Override
    public Optional<Integer> findUserIdByEmail(String email) {
        String sqlQuery = "SELECT UserId FROM [User] WHERE Email = ?";
        try {
            return Optional.of(sqlJdbcTemplate.queryForObject(sqlQuery, Integer.class, email));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    @Override
    public Optional<Integer> findMovieIdByShowtimeId(int showtimeId) {
        String sqlQuery = "SELECT MovieId FROM Showtime WHERE Id = ?";
        try {
            return Optional.of(sqlJdbcTemplate.queryForObject(sqlQuery, Integer.class, showtimeId));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Booking saveBooking(int userId, BookingRequest request) {
        // Status = 0: pending/chưa thanh toán; Status = 1: confirmed/đã thanh toán
        String sql = "INSERT INTO Booking (UserId, ShowtimeId, Status, CreatedAt) VALUES (?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        LocalDateTime now = LocalDateTime.now();
        int status = 1; 

        sqlJdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, userId);
            ps.setInt(2, request.getShowtimeId());
            ps.setInt(3, status);
            ps.setTimestamp(4, Timestamp.valueOf(now));
            return ps;
        }, keyHolder);

        // Lấy ID tự tăng vừa tạo
        int bookingId = keyHolder.getKey() != null ? keyHolder.getKey().intValue() : -1;
        
        Booking booking = new Booking();
        booking.setId(bookingId);
        booking.setUserId(userId);
        booking.setShowtimeId(request.getShowtimeId());
        booking.setStatus(status); 
        booking.setCreatedAt(now);
        return booking;
    }

    @Override
    public void saveBookingDetails(int bookingId, List<String> seatNumbers) {
        String sql = "INSERT INTO BookingDetails (BookingId, SeatNumber) VALUES (?, ?)";
        
        List<Object[]> batchArgs = seatNumbers.stream()
            .map(seat -> new Object[]{bookingId, seat})
            .collect(java.util.stream.Collectors.toList());
            
        sqlJdbcTemplate.batchUpdate(sql, batchArgs);
    }
}