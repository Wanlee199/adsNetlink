package com.example.ptitcinema.repository.impl;

import com.example.ptitcinema.model.Movie;
import com.example.ptitcinema.repository.IMovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class MovieRepository  implements IMovieRepository {
    private final JdbcTemplate sqlJdbcTemplate;

    @Autowired
    public MovieRepository(final JdbcTemplate sqlJdbcTemplate) {
        this.sqlJdbcTemplate = sqlJdbcTemplate;
    }

    @Override
    public List<Movie> getMovies(){
        String sqlQuery = "SELECT Title FROM dbo.Movie";
        List<Movie> movies = sqlJdbcTemplate.query(sqlQuery, new MovieRowMapper());

        return movies;
        //return List.of(new Movie("Inception"), new Movie("Interstellar"));
    }

    /**
     * RowMapper to map result set to Movie object
     */
    private static class MovieRowMapper implements RowMapper<Movie> {
        @Override
        public Movie mapRow(ResultSet rs, int rowNum) throws SQLException {
            Movie movie = new Movie();

            // Map columns from result set to Timesheet object
            // Adjust column names based on your actual stored procedure result set
            movie.setTitle(rs.getString("Title"));

            return movie;
        }
    }
}
