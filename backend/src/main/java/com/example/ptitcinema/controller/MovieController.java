package com.example.ptitcinema.controller;

import com.example.ptitcinema.model.dto.MovieDetailDto;
import com.example.ptitcinema.model.dto.MovieListItemDto;
import com.example.ptitcinema.service.IMovieService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Operation(summary = "Get Movie Details", description = "Retrieves detailed information about a specific movie.")
    @GetMapping("/{id}")
    public ResponseEntity<MovieDetailDto> getMovieDetail(@PathVariable int id) {
        Optional<MovieDetailDto> movieDetail = movieService.getMovieDetail(id);

        return movieDetail.map(ResponseEntity::ok)
                          .orElseGet(() -> ResponseEntity.notFound().build());
    }
}