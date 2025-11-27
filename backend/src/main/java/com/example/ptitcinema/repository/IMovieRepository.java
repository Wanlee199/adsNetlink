package com.example.ptitcinema.repository;

import com.example.ptitcinema.model.Movie;
import java.util.List;
import java.util.Optional;

public interface IMovieRepository {
    List<Movie> findAll();
    Optional<Movie> findById(int id);
    String findGenresByMovieId(int id); // Tìm chuỗi thể loại
    List<String> findCastByMovieId(int id); // Tìm danh sách diễn viên
}