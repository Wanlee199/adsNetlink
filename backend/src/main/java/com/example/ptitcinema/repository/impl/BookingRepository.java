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

    @Override
    public List<com.example.ptitcinema.model.dto.BookingResponse> findBookingsByUserId(int userId) {
        // Corrected SQL Query with proper table and column names
        String sql = "SELECT b.Id, b.UserId, b.ShowtimeId, b.Status, b.CreatedAt, " +
                     "m.Id as MovieId, m.Title as MovieTitle, " +
                     "c.CinemaName, " +
                     "s.Date as ShowDate, s.Time as StartTime, s.Price, " +
                     "bd.SeatNumber " +
                     "FROM Booking b " +
                     "JOIN Showtime s ON b.ShowtimeId = s.Id " +
                     "JOIN Movie m ON s.MovieId = m.Id " +
                     "JOIN CinemaRoom r ON s.RoomId = r.Id " +
                     "JOIN Cinema c ON r.CinemaId = c.Id " +
                     "LEFT JOIN BookingDetails bd ON b.Id = bd.BookingId " +
                     "WHERE b.UserId = ? " +
                     "ORDER BY b.CreatedAt DESC";

        return sqlJdbcTemplate.query(sql, new Object[]{userId}, rs -> {
            java.util.Map<Integer, com.example.ptitcinema.model.dto.BookingResponse> map = new java.util.LinkedHashMap<>();
            
            while (rs.next()) {
                int bookingId = rs.getInt("Id");
                com.example.ptitcinema.model.dto.BookingResponse response = map.get(bookingId);
                
                if (response == null) {
                    response = new com.example.ptitcinema.model.dto.BookingResponse();
                    response.setId("BK" + bookingId);
                    response.setUserId(rs.getInt("UserId"));
                    response.setMovieId(rs.getInt("MovieId"));
                    response.setShowtimeId(rs.getInt("ShowtimeId"));
                    response.setCinemaName(rs.getString("CinemaName"));
                    response.setMovieTitle(rs.getString("MovieTitle"));
                    
                    // Format Date/Time
                    java.sql.Date showDate = rs.getDate("ShowDate");
                    java.sql.Time startTime = rs.getTime("StartTime");
                    response.setDate(showDate != null ? showDate.toString() : "");
                    response.setTime(startTime != null ? startTime.toString().substring(0, 5) : "");
                    
                    response.setStatus(rs.getInt("Status") == 0 ? "pending" : "confirmed");
                    
                    Timestamp createdAt = rs.getTimestamp("CreatedAt");
                    response.setCreatedAt(createdAt != null ? createdAt.toLocalDateTime() : null);
                    response.setQrCode("PTIT_CINEMA_BK" + bookingId);
                    
                    response.setSeats(new java.util.ArrayList<>());
                    response.setTotalPrice(java.math.BigDecimal.ZERO); 
                    
                    map.put(bookingId, response);
                }
                
                String seatNumber = rs.getString("SeatNumber");
                if (seatNumber != null) {
                    response.getSeats().add(seatNumber);
                    // Calculate price: seats * price
                    java.math.BigDecimal price = rs.getBigDecimal("Price");
                    if (price != null) {
                        response.setTotalPrice(price.multiply(new java.math.BigDecimal(response.getSeats().size())));
                    }
                }
            }
            return new java.util.ArrayList<>(map.values());
        });
    }
}