package com.example.ptitcinema.repository.impl;

import com.example.ptitcinema.model.Movie;
import com.example.ptitcinema.repository.IMovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.format.DateTimeFormatter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class MovieRepository implements IMovieRepository {
    private final JdbcTemplate sqlJdbcTemplate;

    @Autowired
    public MovieRepository(final JdbcTemplate sqlJdbcTemplate) {
        this.sqlJdbcTemplate = sqlJdbcTemplate;
    }

    // RowMapper để ánh xạ kết quả SQL sang Movie Entity
    private final RowMapper<Movie> movieRowMapper = (rs, rowNum) -> {
        Movie movie = new Movie();
        movie.setId(rs.getInt("Id"));
        movie.setTitle(rs.getString("Title"));
        movie.setRating(rs.getBigDecimal("Rating"));
        movie.setPoster(rs.getString("Poster"));
        movie.setBackdrop(rs.getString("Backdrop"));
        // SQL Server TIME được ánh xạ thành java.sql.Time, dùng getObject và ép kiểu sang LocalTime
        movie.setDuration(rs.getObject("Duration", java.time.LocalTime.class)); 
        // SQL Server DATE được ánh xạ thành java.sql.Date, dùng getObject và ép kiểu sang LocalDate
        movie.setReleaseDate(rs.getObject("ReleaseDate", java.time.LocalDate.class)); 
        movie.setSynopsis(rs.getString("Synopsis"));
        movie.setDirector(rs.getString("Director"));
        movie.setTrailerUrl(rs.getString("TrailerUrl"));
        return movie;
    };

    @Override
    public List<Movie> findAll() {
        String sqlQuery = "SELECT * FROM Movie";
        return sqlJdbcTemplate.query(sqlQuery, movieRowMapper);
    }

    @Override
    public Optional<Movie> findById(int id) {
        String sqlQuery = "SELECT * FROM Movie WHERE Id = ?";
        try {
            Movie movie = sqlJdbcTemplate.queryForObject(sqlQuery, movieRowMapper, id);
            return Optional.ofNullable(movie);
        } catch (Exception e) {
            // Xử lý khi không tìm thấy đối tượng (EmptyResultDataAccessException)
            return Optional.empty();
        }
    }

    @Override
    public String findGenresByMovieId(int id) {
        // Sử dụng COALESCE để nối chuỗi (GROUP_CONCAT trong MySQL, STRING_AGG trong SQL Server 2017+)
        // Giả sử bạn đang dùng SQL Server version mới hỗ trợ STRING_AGG
        // Nếu dùng phiên bản cũ hơn, bạn có thể phải dùng thủ thuật FOR XML PATH
        String sqlQuery = "SELECT STRING_AGG(g.Name, ', ') " +
                          "FROM MovieGenre mg " +
                          "JOIN Genre g ON mg.GenreId = g.Id " +
                          "WHERE mg.MovieId = ?";
        try {
            return sqlJdbcTemplate.queryForObject(sqlQuery, String.class, id);
        } catch (Exception e) {
            return "";
        }
    }

    @Override
    public List<String> findCastByMovieId(int id) {
        String sqlQuery = "SELECT c.CastName " +
                          "FROM MovieCasting mc " +
                          "JOIN Casting c ON mc.CastingId = c.Id " +
                          "WHERE mc.MovieId = ?";
        return sqlJdbcTemplate.queryForList(sqlQuery, String.class, id);
    }
}