package com.example.ptitcinema.model.dto;

import com.example.ptitcinema.model.Movie;

public class MovieListItemDto {
    private int id;
    private String title;
    private String genre;
    private double rating;
    private String poster;
    private String duration;
    private String releaseDate;

    public MovieListItemDto(Movie movie, String genre, String durationStr) {
        this.id = movie.getId();
        this.title = movie.getTitle();
        this.genre = genre;
        this.rating = movie.getRating() != null ? movie.getRating().doubleValue() : 0.0;
        this.poster = movie.getPoster();
        this.duration = durationStr;
        this.releaseDate = movie.getReleaseDate() != null ? movie.getReleaseDate().toString() : ""; // Có thể format lại
    }

    public int getId() { return id; }
    public String getTitle() { return title; }
    public String getGenre() { return genre; }
    public double getRating() { return rating; }
    public String getPoster() { return poster; }
    public String getDuration() { return duration; }
    public String getReleaseDate() { return releaseDate; }
}