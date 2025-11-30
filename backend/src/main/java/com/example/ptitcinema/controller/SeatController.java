package com.example.ptitcinema.controller;

import com.example.ptitcinema.model.dto.SeatMapDto;
import com.example.ptitcinema.service.ISeatService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/rooms")
public class SeatController {
    
    private final ISeatService seatService;

    @Autowired
    public SeatController(ISeatService seatService) {
        this.seatService = seatService;
    }

    @Operation(summary = "Get Seat Map", 
               description = "Retrieves the seat map and booking status for a specific room and showtime.")
    @GetMapping("/{roomId}/seats")
    public ResponseEntity<SeatMapDto> getSeatMap(
            @PathVariable int roomId,
            // Thêm Query Parameter showtimeId để lấy giá và trạng thái ghế đã đặt
            @RequestParam(name = "showtimeId") int showtimeId) {
        
        // Kiểm tra đầu vào cơ bản
        if (roomId <= 0 || showtimeId <= 0) {
            return ResponseEntity.badRequest().build();
        }

        Optional<SeatMapDto> seatMap = seatService.getSeatMap(roomId, showtimeId);
        
        // Trả về 200 OK nếu tìm thấy, ngược lại là 404 Not Found
        return seatMap.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }
}