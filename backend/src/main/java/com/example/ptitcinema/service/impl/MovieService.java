package com.example.ptitcinema.service.impl;

import com.example.ptitcinema.model.Movie;
import com.example.ptitcinema.model.dto.MovieDetailDto;
import com.example.ptitcinema.model.dto.MovieListItemDto;
import com.example.ptitcinema.model.dto.MovieRequest;
import com.example.ptitcinema.repository.IMovieRepository;
import com.example.ptitcinema.service.IMovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
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

    // Hàm tiện ích để parse chuỗi Duration sang LocalTime
    private LocalTime parseDuration(String durationStr) {
        if (durationStr == null || durationStr.trim().isEmpty()) {
            return null;
        }
        
        try {
            long hours = 0;
            long minutes = 0;
            
            String[] parts = durationStr.split("[hm]");
            int partIndex = 0;
            
            if (durationStr.contains("h") && partIndex < parts.length) {
                hours = Long.parseLong(parts[partIndex].trim());
                partIndex++;
            }
            
            if (durationStr.contains("m") && partIndex < parts.length) {
                minutes = Long.parseLong(parts[partIndex].trim());
            }
            
            long totalSeconds = hours * 3600 + minutes * 60;
            return LocalTime.ofSecondOfDay(totalSeconds);
        } catch (Exception e) {
            return null;
        }
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

    private void processMovieRelations(int movieId, MovieRequest request) {
        // --- 1. Xử lý Genre ---
        // Xóa liên kết cũ (vì ta không biết cái nào đã bị xóa)
        movieRepository.deleteMovieGenres(movieId); 
        
        if (request.getGenre() != null && !request.getGenre().trim().isEmpty()) {
            String[] genres = request.getGenre().split(",");
            for (String genreName : genres) {
                String name = genreName.trim();
                if (name.isEmpty()) continue;
                
                int genreId = movieRepository.findGenreIdByName(name)
                    .orElseGet(() -> movieRepository.saveGenre(name));
                
                if (genreId > 0) {
                    movieRepository.saveMovieGenre(movieId, genreId);
                }
            }
        }

        // --- 2. Xử lý Casting ---
        // Xóa liên kết cũ
        movieRepository.deleteMovieCastings(movieId); 

        if (request.getCast() != null) {
            for (String castName : request.getCast()) {
                String name = castName.trim();
                if (name.isEmpty()) continue;

                int castingId = movieRepository.findCastingIdByName(name)
                    .orElseGet(() -> movieRepository.saveCasting(name));

                if (castingId > 0) {
                    movieRepository.saveMovieCasting(movieId, castingId);
                }
            }
        }
    }

    @Transactional
    @Override
    public Optional<MovieDetailDto> updateMovie(int id, MovieRequest request) {
        
        // 1. Kiểm tra phim có tồn tại không
        Optional<Movie> existingMovieOptional = movieRepository.findById(id);
        if (existingMovieOptional.isEmpty()) {
            return Optional.empty(); // 404 Not Found
        }
        
        Movie existingMovie = existingMovieOptional.get();

        // 2. Cập nhật các trường từ Request DTO vào Entity
        existingMovie.setTitle(request.getTitle());
        existingMovie.setRating(request.getRating());
        existingMovie.setPoster(request.getPoster());
        existingMovie.setBackdrop(request.getBackdrop());
        existingMovie.setSynopsis(request.getSynopsis());
        existingMovie.setDirector(request.getDirector());
        existingMovie.setTrailerUrl(request.getTrailerUrl());
        
        existingMovie.setDuration(parseDuration(request.getDuration()));
        
        try {
            existingMovie.setReleaseDate(LocalDate.parse(request.getReleaseDate()));
        } catch (DateTimeParseException e) {
            // Có thể giữ nguyên ngày cũ nếu parse thất bại hoặc báo lỗi
        }
        
        // 3. Cập nhật bảng Movie chính
        movieRepository.updateMovie(existingMovie);

        // 4. Xử lý cập nhật các mối quan hệ (Genre, Cast)
        processMovieRelations(id, request);

        // 5. Trả về thông tin chi tiết phim đã cập nhật
        return getMovieDetail(id); 
    }
}