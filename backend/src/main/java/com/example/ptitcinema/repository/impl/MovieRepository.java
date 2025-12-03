package com.example.ptitcinema.repository.impl;

import com.example.ptitcinema.model.Movie;
import com.example.ptitcinema.repository.IMovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.format.DateTimeFormatter;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Time;
import java.util.List;
import java.util.Optional;
import java.sql.Date;

import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

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

    @Override
    public Movie saveMovie(Movie movie) {
        String sql = "INSERT INTO Movie (Title, Rating, Poster, Backdrop, Duration, ReleaseDate, Synopsis, Director, TrailerUrl) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        sqlJdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, movie.getTitle());
            ps.setBigDecimal(2, movie.getRating());
            ps.setString(3, movie.getPoster());
            ps.setString(4, movie.getBackdrop());
            ps.setTime(5, Time.valueOf(movie.getDuration())); // Chuyển LocalTime sang Time SQL
            ps.setDate(6, Date.valueOf(movie.getReleaseDate())); // Chuyển LocalDate sang Date SQL
            ps.setString(7, movie.getSynopsis());
            ps.setString(8, movie.getDirector());
            ps.setString(9, movie.getTrailerUrl());
            return ps;
        }, keyHolder);

        // Lấy ID tự tăng và gán lại cho đối tượng
        int movieId = keyHolder.getKey() != null ? keyHolder.getKey().intValue() : -1;
        movie.setId(movieId);
        return movie;
    }

    // --- Logic cho Genre ---
    @Override
    public Optional<Integer> findGenreIdByName(String name) {
        String sql = "SELECT Id FROM Genre WHERE Name = ?";
        try {
            return Optional.of(sqlJdbcTemplate.queryForObject(sql, Integer.class, name));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    @Override
    public int saveGenre(String name) {
        String sql = "INSERT INTO Genre (Name) VALUES (?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        sqlJdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, name);
            return ps;
        }, keyHolder);
        return keyHolder.getKey() != null ? keyHolder.getKey().intValue() : -1;
    }
    
    @Override
    public void saveMovieGenre(int movieId, int genreId) {
        String sql = "INSERT INTO MovieGenre (MovieId, GenreId) VALUES (?, ?)";
        sqlJdbcTemplate.update(sql, movieId, genreId);
    }
    
    // --- Logic cho Casting ---
    @Override
    public Optional<Integer> findCastingIdByName(String name) {
        String sql = "SELECT Id FROM Casting WHERE CastName = ?";
        try {
            return Optional.of(sqlJdbcTemplate.queryForObject(sql, Integer.class, name));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    @Override
    public int saveCasting(String name) {
        String sql = "INSERT INTO Casting (CastName) VALUES (?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        sqlJdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, name);
            return ps;
        }, keyHolder);
        return keyHolder.getKey() != null ? keyHolder.getKey().intValue() : -1;
    }
    
    @Override
    public void saveMovieCasting(int movieId, int castingId) {
        String sql = "INSERT INTO MovieCasting (MovieId, CastingId) VALUES (?, ?)";
        sqlJdbcTemplate.update(sql, movieId, castingId);
    }

    @Override
    public void updateMovie(Movie movie) {
        String sql = "UPDATE Movie SET Title=?, Rating=?, Poster=?, Backdrop=?, Duration=?, ReleaseDate=?, Synopsis=?, Director=?, TrailerUrl=? " +
                     "WHERE Id=?";
        
        sqlJdbcTemplate.update(sql, 
            movie.getTitle(),
            movie.getRating(),
            movie.getPoster(),
            movie.getBackdrop(),
            java.sql.Time.valueOf(movie.getDuration()), // Chuyển LocalTime sang Time SQL
            java.sql.Date.valueOf(movie.getReleaseDate()), // Chuyển LocalDate sang Date SQL
            movie.getSynopsis(),
            movie.getDirector(),
            movie.getTrailerUrl(),
            movie.getId() // Điều kiện WHERE
        );
    }
    
    @Override
    public void deleteMovieGenres(int movieId) {
        String sql = "DELETE FROM MovieGenre WHERE MovieId = ?";
        sqlJdbcTemplate.update(sql, movieId);
    }

    @Override
    public void deleteMovieCastings(int movieId) {
        String sql = "DELETE FROM MovieCasting WHERE MovieId = ?";
        sqlJdbcTemplate.update(sql, movieId);
    }

    @Override
    public void deleteShowtimesByMovieId(int movieId) {
        String sql = "DELETE FROM Showtime WHERE MovieId = ?";
        sqlJdbcTemplate.update(sql, movieId);
    }
    
    @Override
    public void deleteMovieById(int movieId) {
        String sql = "DELETE FROM Movie WHERE Id = ?";
        sqlJdbcTemplate.update(sql, movieId);
    }

    @Override
    public List<Movie> searchMovies(String query) {
        String sql = "SELECT * FROM Movie WHERE Title LIKE ?";
        String searchPattern = "%" + query + "%";
        return sqlJdbcTemplate.query(sql, movieRowMapper, searchPattern);
    }
}