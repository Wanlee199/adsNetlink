package com.example.ptitcinema.service.impl;

import com.example.ptitcinema.model.Movie;
import com.example.ptitcinema.repository.IMovieRepository;
import com.example.ptitcinema.service.IMovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService implements IMovieService {
    private final IMovieRepository movieRepo;

    @Autowired
    public MovieService(final IMovieRepository movieRepo){this.movieRepo = movieRepo;}

    @Override
    public List<Movie> getMovies(){
        return movieRepo.getMovies();
    }

}
