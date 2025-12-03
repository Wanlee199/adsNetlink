package com.example.ptitcinema.service;

import com.example.ptitcinema.model.dto.ShowtimeDetailDto;
import com.example.ptitcinema.model.dto.ShowtimeDto;
import com.example.ptitcinema.model.dto.ShowtimeRequest;

import java.util.List;
import java.util.Optional;

public interface IShowtimeService {
    List<ShowtimeDto> getShowtimesByMovie(int movieId);
    Optional<ShowtimeDetailDto> getShowtimeDetail(int showtimeId);
    List<Integer> createShowtimes(ShowtimeRequest request);
    boolean updateShowtime(int id, ShowtimeRequest request);
    boolean deleteShowtime(int id);
}