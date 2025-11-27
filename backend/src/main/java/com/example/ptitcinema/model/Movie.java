package com.example.ptitcinema.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.math.BigDecimal;

public class Movie {
    private int id;
    private String title;
    private BigDecimal rating;
    private String poster;
    private String backdrop;
    private LocalTime duration;
    private LocalDate releaseDate;
    private String synopsis;
    private String director;
    private String trailerUrl;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public String getPoster() { return poster; }
    public void setPoster(String poster) { this.poster = poster; }

    public String getBackdrop() { return backdrop; }
    public void setBackdrop(String backdrop) { this.backdrop = backdrop; }

    public LocalTime getDuration() { return duration; }
    public void setDuration(LocalTime duration) { this.duration = duration; }

    public LocalDate getReleaseDate() { return releaseDate; }
    public void setReleaseDate(LocalDate releaseDate) { this.releaseDate = releaseDate; }

    public String getSynopsis() { return synopsis; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }

    public String getTrailerUrl() { return trailerUrl; }
    public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }
}