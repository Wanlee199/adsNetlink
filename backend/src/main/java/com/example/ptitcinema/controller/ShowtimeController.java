package com.example.ptitcinema.controller;

import com.example.ptitcinema.model.dto.ShowtimeDetailDto;
import com.example.ptitcinema.model.dto.ShowtimeDto;
import com.example.ptitcinema.model.dto.ShowtimeRequest;
import com.example.ptitcinema.service.IShowtimeService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/showtimes")
public class ShowtimeController {
    
    private final IShowtimeService showtimeService;

    @Autowired
    public ShowtimeController(IShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    @Operation(summary = "Get Showtimes by Movie", description = "Retrieves grouped showtimes for a specific movie ID.")
    @GetMapping
    public ResponseEntity<List<ShowtimeDto>> getShowtimesByMovie(
            @RequestParam(name = "movieId") Integer movieId) {
        
        // Kiểm tra tham số đầu vào
        if (movieId == null || movieId <= 0) {
            return ResponseEntity.badRequest().build(); 
        }

        List<ShowtimeDto> showtimes = showtimeService.getShowtimesByMovie(movieId);
        
        return ResponseEntity.ok(showtimes);
    }

    @Operation(summary = "Get Showtime Details", description = "Retrieves detailed information about a specific showtime by its ID.")
    @GetMapping("/{id}")
    public ResponseEntity<ShowtimeDetailDto> getShowtimeDetail(@PathVariable("id") int showtimeId) {
        
        Optional<ShowtimeDetailDto> detail = showtimeService.getShowtimeDetail(showtimeId);
        
        // Trả về 200 OK nếu tìm thấy, ngược lại là 404 Not Found
        return detail.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create Showtime (MANAGER/ADMIN)", description = "Creates one or more new showtimes for a specific movie, date, room, and price.")
    @PostMapping
    public ResponseEntity<List<Integer>> createShowtimes(@RequestBody ShowtimeRequest request) {
        
        // 1. Validation cơ bản
        if (request.getMovieId() <= 0 || request.getRoomId() <= 0 || request.getTimes() == null || request.getTimes().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // 2. Gọi Service
        List<Integer> createdIds = showtimeService.createShowtimes(request);
        
        if (createdIds.isEmpty()) {
            // Trả về 400 nếu không có suất chiếu nào được tạo (do Movie/Room không tồn tại hoặc lỗi khác)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        
        // 3. Trả về 201 Created với danh sách các ID đã tạo
        return new ResponseEntity<>(createdIds, HttpStatus.CREATED);
    }

    @Operation(summary = "Update Showtime (MANAGER/ADMIN)", description = "Updates an existing showtime by ID.")
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateShowtime(@PathVariable int id, @RequestBody ShowtimeRequest request) {
        boolean updated = showtimeService.updateShowtime(id, request);
        
        if (updated) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Delete Showtime (MANAGER/ADMIN)", description = "Deletes a showtime by ID, including all associated bookings and booking details.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShowtime(@PathVariable int id) {
        
        boolean deleted = showtimeService.deleteShowtime(id);
        
        if (deleted) {
            // 204 No Content: Xóa thành công
            return ResponseEntity.noContent().build();
        } else {
            // 404 Not Found: Không tìm thấy hoặc xóa thất bại
            return ResponseEntity.notFound().build(); 
        }
    }
}