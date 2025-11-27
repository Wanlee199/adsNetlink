package com.example.ptitcinema.model.dto;

import com.example.ptitcinema.model.Movie;
import java.util.List;

public class MovieDetailDto {
    private int id;
    private String title;
    private String genre;
    private double rating;
    private String poster;
    private String backdrop;
    private String duration;
    private String releaseDate;
    private String synopsis;
    private String director;
    private List<String> cast; 
    private String trailerUrl;

    public MovieDetailDto(Movie movie, String genre, String durationStr, List<String> cast) {
        this.id = movie.getId();
        this.title = movie.getTitle();
        this.genre = genre;
        this.rating = movie.getRating() != null ? movie.getRating().doubleValue() : 0.0;
        this.poster = movie.getPoster();
        this.backdrop = movie.getBackdrop();
        this.duration = durationStr;
        this.releaseDate = movie.getReleaseDate() != null ? movie.getReleaseDate().toString() : "";
        this.synopsis = movie.getSynopsis();
        this.director = movie.getDirector();
        this.cast = cast;
        this.trailerUrl = movie.getTrailerUrl();
    }

    public int getId() { return id; }
    public String getTitle() { return title; }
    public String getGenre() { return genre; }
    public double getRating() { return rating; }
    public String getPoster() { return poster; }
    public String getBackdrop() { return backdrop; }
    public String getDuration() { return duration; }
    public String getReleaseDate() { return releaseDate; }
    public String getSynopsis() { return synopsis; }
    public String getDirector() { return director; }
    public List<String> getCast() { return cast; }
    public String getTrailerUrl() { return trailerUrl; }
}