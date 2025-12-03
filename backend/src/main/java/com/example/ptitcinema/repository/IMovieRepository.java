package com.example.ptitcinema.repository;

import com.example.ptitcinema.model.Movie;
import java.util.List;
import java.util.Optional;

public interface IMovieRepository {
    List<Movie> findAll();
    Optional<Movie> findById(int id);
    String findGenresByMovieId(int id); // Tìm chuỗi thể loại
    List<String> findCastByMovieId(int id); // Tìm danh sách diễn viên


    Movie saveMovie(Movie movie);
    Optional<Integer> findGenreIdByName(String name);
    int saveGenre(String name); // Trả về ID tự tăng
    void saveMovieGenre(int movieId, int genreId);
    Optional<Integer> findCastingIdByName(String name);
    int saveCasting(String name); // Trả về ID tự tăng
    void saveMovieCasting(int movieId, int castingId);

    void updateMovie(Movie movie);
    void deleteMovieGenres(int movieId);
    void deleteMovieCastings(int movieId);

    void deleteMovieById(int movieId);
    void deleteShowtimesByMovieId(int movieId);
    
    List<Movie> searchMovies(String query);
}