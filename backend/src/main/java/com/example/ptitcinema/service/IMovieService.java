package com.example.ptitcinema.service;

import com.example.ptitcinema.model.dto.MovieListItemDto;
import com.example.ptitcinema.model.dto.MovieDetailDto;

import java.util.List;
import java.util.Optional;

public interface IMovieService {
    List<MovieListItemDto> getAllMovies();
    Optional<MovieDetailDto> getMovieDetail(int id);
}