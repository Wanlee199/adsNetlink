package com.example.ptitcinema.controller;

import com.example.ptitcinema.model.dto.MovieDetailDto;
import com.example.ptitcinema.model.dto.MovieListItemDto;
import com.example.ptitcinema.model.dto.MovieRequest;
import com.example.ptitcinema.service.IMovieService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/movies")
public class MovieController {
    
    private final IMovieService movieService;

    @Autowired
    public MovieController(IMovieService movieService) {
        this.movieService = movieService;
    }

    @Operation(summary = "Get All Movies", description = "Retrieves a list of all movies with summary details.")
    @GetMapping
    public ResponseEntity<List<MovieListItemDto>> getAllMovies() {
        List<MovieListItemDto> movies = movieService.getAllMovies();
        return ResponseEntity.ok(movies);
    }

    @Operation(summary = "Search Movies", description = "Searches for movies by title.")
    @GetMapping("/search")
    public ResponseEntity<List<MovieListItemDto>> searchMovies(@RequestParam String q) {
        List<MovieListItemDto> movies = movieService.searchMovies(q);
        return ResponseEntity.ok(movies);
    }

    @Operation(summary = "Get Movie Details", description = "Retrieves detailed information about a specific movie.")
    @GetMapping("/{id}")
    public ResponseEntity<MovieDetailDto> getMovieDetail(@PathVariable int id) {
        Optional<MovieDetailDto> movieDetail = movieService.getMovieDetail(id);

        return movieDetail.map(ResponseEntity::ok)
                          .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create Movie (MANAGER/ADMIN)", description = "Creates a new movie and related casting/genre entries.")
    @PostMapping
    public ResponseEntity<MovieDetailDto> createMovie(@RequestBody MovieRequest request) {

        Optional<MovieDetailDto> createdMovie = movieService.createMovie(request);
        
        return createdMovie.map(movie -> new ResponseEntity<>(movie, HttpStatus.CREATED))
                           .orElseGet(() -> ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
    }

    @Operation(summary = "Update Movie (MANAGER/ADMIN)", description = "Updates an existing movie by ID, including its genre and cast relationships.")
    @PutMapping("/{id}")
    public ResponseEntity<MovieDetailDto> updateMovie(
            @PathVariable int id, 
            @RequestBody MovieRequest request) {
        
        // **Lưu ý**: Cần cấu hình Spring Security để kiểm tra Role MANAGER/ADMIN

        Optional<MovieDetailDto> updatedMovie = movieService.updateMovie(id, request);
        
        // Trả về 200 OK nếu cập nhật thành công, 404 Not Found nếu không tìm thấy phim
        return updatedMovie.map(ResponseEntity::ok)
                           .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete Movie (MANAGER/ADMIN)", description = "Deletes a movie by ID, along with all associated showtimes, genres, and cast links.")
    @DeleteMapping("/{id}")
    // Cần cấu hình Spring Security để kiểm tra Role MANAGER/ADMIN
    public ResponseEntity<Void> deleteMovie(@PathVariable int id) {
        
        boolean deleted = movieService.deleteMovie(id);
        
        if (deleted) {
            // 204 No Content: Xóa thành công
            return ResponseEntity.noContent().build();
        } else {
            // 404 Not Found: Không tìm thấy hoặc xóa thất bại
            return ResponseEntity.notFound().build(); 
        }
    }
}