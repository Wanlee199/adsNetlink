package com.example.ptitcinema.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Booking {
    private int id;
    private int userId;
    private int showtimeId;
    private int status; // 1: confirmed, 2: pending, 3: cancelled
    private LocalDateTime createdAt;
    private BigDecimal totalPrice; 

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public int getShowtimeId() { return showtimeId; }
    public void setShowtimeId(int showtimeId) { this.showtimeId = showtimeId; }

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
}