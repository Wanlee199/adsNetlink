package com.example.ptitcinema.model.dto;

import java.math.BigDecimal;

public class SeatDto {
    private String id;        
    private String row;       
    private int number;       
    private String type;      
    private String status;    
    private BigDecimal price; 

    public SeatDto(String id, String row, int number, String type, String status, BigDecimal price) {
        this.id = id;
        this.row = row;
        this.number = number;
        this.type = type;
        this.status = status;
        this.price = price;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRow() { return row; }
    public void setRow(String row) { this.row = row; }

    public int getNumber() { return number; }
    public void setNumber(int number) { this.number = number; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}