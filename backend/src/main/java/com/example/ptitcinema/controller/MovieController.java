package com.example.ptitcinema.controller;

import com.example.ptitcinema.model.Movie;
import com.example.ptitcinema.service.IMovieService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MovieController {
    private IMovieService movieServ;


    @Autowired
    public void setMovieServ(IMovieService movieServ){this.movieServ = movieServ;}

    @Operation(summary = "Get all movies", description = "Returns list of movies")
    @GetMapping("/movies")
    public List<Movie> getMovies() {
       return movieServ.getMovies();
    }
}
