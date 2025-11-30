package com.example.ptitcinema.repository.impl;

import com.example.ptitcinema.repository.ISeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

@Repository
public class SeatRepository implements ISeatRepository {
    private final JdbcTemplate sqlJdbcTemplate;

    @Autowired
    public SeatRepository(final JdbcTemplate sqlJdbcTemplate) {
        this.sqlJdbcTemplate = sqlJdbcTemplate;
    }

    @Override
    public int getDefaultRows(int roomId) {
        // Đây chỉ là giá trị cố định. Trong thực tế, cần truy vấn bảng RoomLayout.
        return 8; 
    }

    @Override
    public int getDefaultSeatsPerRow(int roomId) {
        // Đây chỉ là giá trị cố định.
        return 12; 
    }
    // ----------------------------------------------------------------

    @Override
    public List<String> findBookedSeats(int showtimeId) {
        String sqlQuery = "SELECT DISTINCT bd.SeatNumber " +
                          "FROM BookingDetails bd " +
                          "JOIN Booking b ON bd.BookingId = b.Id " +
                          "WHERE b.ShowtimeId = ? AND b.Status = 1"; 
        try {
            return sqlJdbcTemplate.queryForList(sqlQuery, String.class, showtimeId);
        } catch (EmptyResultDataAccessException e) {
            return Collections.emptyList();
        }
    }
    
    @Override
    public BigDecimal findPriceByShowtimeId(int showtimeId) {
        String sqlQuery = "SELECT Price FROM Showtime WHERE Id = ?";
        try {
            return sqlJdbcTemplate.queryForObject(sqlQuery, BigDecimal.class, showtimeId);
        } catch (EmptyResultDataAccessException e) {
            // Giá mặc định hoặc ném exception nếu không tìm thấy suất chiếu
            return BigDecimal.ZERO; 
        }
    }
}