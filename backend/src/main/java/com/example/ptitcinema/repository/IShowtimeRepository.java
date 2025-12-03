package com.example.ptitcinema.repository;

import com.example.ptitcinema.model.Showtime;
import com.example.ptitcinema.model.Cinema;

import java.util.List;
import java.util.Optional;

public interface IShowtimeRepository {
    Optional<Showtime> findShowtimeById(int showtimeId);
    List<Showtime> findShowtimesByMovieId(int movieId);

    Cinema findCinemaByRoomId(int roomId);

    int saveShowtime(int movieId, int roomId, java.time.LocalDate date, java.time.LocalTime time, java.math.BigDecimal price); 
    void updateShowtime(Showtime showtime);
    boolean checkRoomExists(int roomId);

    void deleteBookingDetailsByShowtimeId(int showtimeId);
    void deleteBookingsByShowtimeId(int showtimeId);
    void deleteShowtimeById(int showtimeId);
}