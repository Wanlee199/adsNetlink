package com.example.ptitcinema.service.impl;

import com.example.ptitcinema.model.Movie;
import com.example.ptitcinema.model.dto.MovieDetailDto;
import com.example.ptitcinema.model.dto.MovieListItemDto;
import com.example.ptitcinema.repository.IMovieRepository;
import com.example.ptitcinema.service.IMovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class MovieService implements IMovieService {
    private final IMovieRepository movieRepository;

    @Autowired
    public MovieService(IMovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    // Hàm tiện ích để format LocalTime (Duration) sang chuỗi "Xh Ym"
    private String formatDuration(java.time.LocalTime duration) {
        if (duration == null) return "N/A";
        long totalSeconds = duration.toSecondOfDay();
        long hours = TimeUnit.SECONDS.toHours(totalSeconds);
        long minutes = TimeUnit.SECONDS.toMinutes(totalSeconds) - TimeUnit.HOURS.toMinutes(hours);
        
        StringBuilder sb = new StringBuilder();
        if (hours > 0) {
            sb.append(hours).append("h");
        }
        if (minutes > 0 || hours == 0) {
            if (hours > 0) sb.append(" ");
            sb.append(minutes).append("m");
        }
        return sb.toString().trim();
    }

    @Override
    public List<MovieListItemDto> getAllMovies() {
        List<Movie> movies = movieRepository.findAll();
        
        return movies.stream()
                .map(movie -> {
                    String genre = movieRepository.findGenresByMovieId(movie.getId());
                    String durationStr = formatDuration(movie.getDuration());
                    return new MovieListItemDto(movie, genre, durationStr);
                })
                .collect(Collectors.toList());
    }

    @Override
    public Optional<MovieDetailDto> getMovieDetail(int id) {
        Optional<Movie> movieOptional = movieRepository.findById(id);

        if (movieOptional.isEmpty()) {
            return Optional.empty();
        }

        Movie movie = movieOptional.get();
        String genre = movieRepository.findGenresByMovieId(id);
        List<String> cast = movieRepository.findCastByMovieId(id);
        String durationStr = formatDuration(movie.getDuration());
        
        MovieDetailDto dto = new MovieDetailDto(movie, genre, durationStr, cast);
        return Optional.of(dto);
    }
}