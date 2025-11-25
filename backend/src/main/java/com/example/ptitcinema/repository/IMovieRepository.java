package com.example.ptitcinema.repository;

import com.example.ptitcinema.model.Movie;

import java.util.List;

public interface IMovieRepository {
    List<Movie> getMovies();
}
