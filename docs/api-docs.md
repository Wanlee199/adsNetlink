# PTIT Cinema API Documentation

This document outlines the API endpoints used in the PTIT Cinema Web Application.

## Base URL
`http://localhost:8080/api/v1` (Example)

## Authentication

### Login
*   **Endpoint:** `/auth/login`
*   **Method:** `POST`
*   **Description:** Authenticates a user and returns access tokens.
*   **Request Body:**
    ```json
    {
      "usernameOrEmail": "user123",
      "password": "password123"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "user": {
        "id": 1,
        "username": "user123",
        "email": "user@example.com",
        "fullName": "John Doe",
        "phone": "0123456789",
        "roles": ["CUSTOMER"]
      }
    }
    ```

### Register
*   **Endpoint:** `/auth/register`
*   **Method:** `POST`
*   **Description:** Registers a new user.
*   **Request Body:**
    ```json
    {
      "username": "newuser",
      "email": "new@example.com",
      "password": "password123",
      "fullName": "New User",
      "phone": "0987654321"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "user": {
        "id": 2,
        "username": "newuser",
        "email": "new@example.com",
        "fullName": "New User",
        "phone": "0987654321",
        "roles": ["CUSTOMER"]
      }
    }
    ```

### Get Current User Profile
*   **Endpoint:** `/users/me`
*   **Method:** `GET`
*   **Description:** Retrieves the profile of the currently authenticated user.
*   **Headers:** `Authorization: Bearer <accessToken>`
*   **Response (200 OK):**
    ```json
    {
      "id": 1,
      "username": "user123",
      "email": "user@example.com",
      "fullName": "John Doe",
      "phone": "0123456789",
      "roles": ["CUSTOMER"]
    }
    ```

## Movies

### Get All Movies
*   **Endpoint:** `/movies`
*   **Method:** `GET`
*   **Description:** Retrieves a list of all movies.
*   **Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "title": "Dune: Part Two",
        "genre": "Sci-Fi, Adventure",
        "rating": 8.8,
        "poster": "https://image.tmdb.org/t/p/w500/...",
        "duration": "2h 46m",
        "releaseDate": "March 1, 2024"
      },
      // ...
    ]
    ```

### Get Movie Details
*   **Endpoint:** `/movies/{id}`
*   **Method:** `GET`
*   **Description:** Retrieves detailed information about a specific movie.
*   **Response (200 OK):**
    ```json
    {
      "id": 1,
      "title": "Dune: Part Two",
      "genre": "Sci-Fi, Adventure",
      "rating": 8.8,
      "poster": "https://image.tmdb.org/t/p/w500/...",
      "backdrop": "https://image.tmdb.org/t/p/original/...",
      "duration": "2h 46m",
      "releaseDate": "March 1, 2024",
      "synopsis": "Paul Atreides unites with Chani...",
      "director": "Denis Villeneuve",
      "cast": ["Timothée Chalamet", "Zendaya"],
      "trailerUrl": "https://www.youtube.com/embed/..."
    }
    ```

## Cinemas & Showtimes

### Get Showtimes by Movie
*   **Endpoint:** `/showtimes`
*   **Method:** `GET`
*   **Query Parameters:** `movieId={id}`
*   **Description:** Retrieves showtimes for a specific movie.
*   **Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "movieId": 1,
        "cinemaId": 1,
        "cinema": {
          "id": 1,
          "name": "PTIT Cinema Central",
          "location": "Hanoi Center"
        },
        "date": "2024-11-23",
        "times": ["10:00", "13:30", "17:00", "20:30"],
        "price": 120000,
        "roomId": 1
      }
    ]
    ```

### Get Seat Map
*   **Endpoint:** `/rooms/{roomId}/seats`
*   **Method:** `GET`
*   **Description:** Retrieves the seat map for a specific room.
*   **Response (200 OK):**
    ```json
    {
      "roomId": 1,
      "rows": 8,
      "seatsPerRow": 12,
      "seats": [
        {
          "id": "A1",
          "row": "A",
          "number": 1,
          "type": "standard", // optional
          "status": "available",
          "price": 100000
        },
        // ...
      ]
    }
    ```

## Bookings

### Create Booking
*   **Endpoint:** `/bookings`
*   **Method:** `POST`
*   **Description:** Creates a new booking.
*   **Headers:** `Authorization: Bearer <accessToken>`
*   **Request Body:**
    ```json
    {
      "movieId": 1,
      "showtimeId": 1,
      "cinemaName": "PTIT Cinema Central",
      "movieTitle": "Dune: Part Two",
      "date": "2024-11-23",
      "time": "10:00",
      "seats": ["A1", "A2"],
      "totalPrice": 200000,
      "status": "confirmed"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "id": "BK1716...",
      "userId": 1,
      "movieId": 1,
      "showtimeId": 1,
      "cinemaName": "PTIT Cinema Central",
      "movieTitle": "Dune: Part Two",
      "date": "2024-11-23",
      "time": "10:00",
      "seats": ["A1", "A2"],
      "totalPrice": 200000,
      "status": "confirmed",
      "createdAt": "2024-11-23T10:00:00Z",
      "qrCode": "PTIT_CINEMA_BK1716..."
    }
    ```

### Get User Bookings
*   **Endpoint:** `/bookings/my-bookings`
*   **Method:** `GET`
*   **Description:** Retrieves all bookings for the authenticated user.
*   **Headers:** `Authorization: Bearer <accessToken>`
*   **Response (200 OK):**
    ```json
    [
      {
        "id": "BK1716...",
        "userId": 1,
        "movieId": 1,
        "showtimeId": 1,
        "cinemaName": "PTIT Cinema Central",
        "movieTitle": "Dune: Part Two",
        "date": "2024-11-23",
        "time": "10:00",
        "seats": ["A1", "A2"],
        "totalPrice": 200000,
        "status": "confirmed",
        "createdAt": "2024-11-23T10:00:00Z",
        "qrCode": "PTIT_CINEMA_BK1716..."
      }
    ]
    ```
