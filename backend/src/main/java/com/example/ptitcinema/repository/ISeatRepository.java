package com.example.ptitcinema.repository;

import java.math.BigDecimal;
import java.util.List;

public interface ISeatRepository {
    int getDefaultRows(int roomId);
    int getDefaultSeatsPerRow(int roomId);
    
    // Lấy danh sách các số ghế đã được đặt
    List<String> findBookedSeats(int showtimeId);
    
    // Lấy giá vé cho suất chiếu
    BigDecimal findPriceByShowtimeId(int showtimeId);
}