package com.example.ptitcinema.repository.impl;

import com.example.ptitcinema.model.Showtime;
import com.example.ptitcinema.model.Cinema;
import com.example.ptitcinema.repository.IShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Time;
import java.util.List;
import java.util.Optional;

@Repository
public class ShowtimeRepository implements IShowtimeRepository {
    private final JdbcTemplate sqlJdbcTemplate;

    @Autowired
    public ShowtimeRepository(final JdbcTemplate sqlJdbcTemplate) {
        this.sqlJdbcTemplate = sqlJdbcTemplate;
    }

    private final RowMapper<Showtime> showtimeRowMapper = (rs, rowNum) -> {
        Showtime st = new Showtime();
        st.setId(rs.getInt("Id"));
        st.setMovieId(rs.getInt("MovieId"));
        st.setRoomId(rs.getInt("RoomId"));
        st.setDate(rs.getObject("Date", java.time.LocalDate.class));
        st.setTime(rs.getObject("Time", java.time.LocalTime.class));
        st.setPrice(rs.getBigDecimal("Price"));
        return st;
    };

    private final RowMapper<Cinema> cinemaRowMapper = (rs, rowNum) -> {
        Cinema c = new Cinema();
        c.setId(rs.getInt("Id"));
        c.setCinemaName(rs.getString("CinemaName"));
        c.setLocation(rs.getString("Location"));
        return c;
    };

    @Override
    public List<Showtime> findShowtimesByMovieId(int movieId) {
        String sqlQuery = "SELECT * FROM Showtime WHERE MovieId = ? ORDER BY Date, Time";
        return sqlJdbcTemplate.query(sqlQuery, showtimeRowMapper, movieId);
    }

    @Override
    public Cinema findCinemaByRoomId(int roomId) {
        String sqlQuery = "SELECT c.Id, c.CinemaName, c.Location " +
                          "FROM Cinema c " +
                          "JOIN CinemaRoom cr ON c.Id = cr.CinemaId " +
                          "WHERE cr.Id = ?";
        try {
            return sqlJdbcTemplate.queryForObject(sqlQuery, cinemaRowMapper, roomId);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Optional<Showtime> findShowtimeById(int showtimeId) {
        String sqlQuery = "SELECT * FROM Showtime WHERE Id = ?";
        try {
            Showtime showtime = sqlJdbcTemplate.queryForObject(sqlQuery, showtimeRowMapper, showtimeId);
            return Optional.ofNullable(showtime);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public boolean checkRoomExists(int roomId) {
        String sql = "SELECT COUNT(*) FROM CinemaRoom WHERE Id = ?";
        Integer count = sqlJdbcTemplate.queryForObject(sql, Integer.class, roomId);
        return count != null && count > 0;
    }

    @Override
    public int saveShowtime(int movieId, int roomId, java.time.LocalDate date, java.time.LocalTime time, java.math.BigDecimal price) {
        String sql = "INSERT INTO Showtime (MovieId, RoomId, Date, Time, Price) VALUES (?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        sqlJdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, movieId);
            ps.setInt(2, roomId);
            ps.setDate(3, Date.valueOf(date));
            ps.setTime(4, Time.valueOf(time));
            ps.setBigDecimal(5, price);
            return ps;
        }, keyHolder);

        return keyHolder.getKey() != null ? keyHolder.getKey().intValue() : -1;
    }

    @Override
    public void updateShowtime(Showtime showtime) {
        String sql = "UPDATE Showtime SET MovieId = ?, RoomId = ?, Date = ?, Time = ?, Price = ? WHERE Id = ?";
        sqlJdbcTemplate.update(sql, 
            showtime.getMovieId(), 
            showtime.getRoomId(), 
            Date.valueOf(showtime.getDate()), 
            Time.valueOf(showtime.getTime()), 
            showtime.getPrice(), 
            showtime.getId()
        );
    }

    @Override
    public void deleteBookingDetailsByShowtimeId(int showtimeId) {
        String sql = "DELETE FROM BookingDetails WHERE BookingId IN (SELECT Id FROM Booking WHERE ShowtimeId = ?)";
        sqlJdbcTemplate.update(sql, showtimeId);
    }

    @Override
    public void deleteBookingsByShowtimeId(int showtimeId) {
        String sql = "DELETE FROM Booking WHERE ShowtimeId = ?";
        sqlJdbcTemplate.update(sql, showtimeId);
    }
    
    @Override
    public void deleteShowtimeById(int showtimeId) {
        String sql = "DELETE FROM Showtime WHERE Id = ?";
        sqlJdbcTemplate.update(sql, showtimeId);
    }
}