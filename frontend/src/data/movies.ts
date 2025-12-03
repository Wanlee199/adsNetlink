import type { Movie, Showtime, Cinema } from '../types/movie'

export const MOVIES: Movie[] = [
  {
    id: 1,
    title: "Dune: Part Two",
    genre: "Sci-Fi, Adventure",
    rating: 8.8,
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    duration: "2h 46m",
    releaseDate: "March 1, 2024",
    synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Josh Brolin", "Austin Butler"],
    trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w"
  },
  {
    id: 2,
    title: "Kung Fu Panda 4",
    genre: "Animation, Action",
    rating: 7.6,
    poster: "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/feSiISwgEpVzR1v3zv2n2AU4ANJ.jpg",
    duration: "1h 34m",
    releaseDate: "March 8, 2024",
    synopsis: "Po must train a new warrior when he's chosen to become the spiritual leader of the Valley of Peace. However, when a powerful shape-shifting sorceress sets her eyes on his Staff of Wisdom, he suddenly realizes he's going to need some help.",
    director: "Mike Mitchell",
    cast: ["Jack Black", "Awkwafina", "Viola Davis", "Dustin Hoffman", "Bryan Cranston"],
    trailerUrl: "https://www.youtube.com/embed/_inKs4eeHiI"
  },
  {
    id: 3,
    title: "Godzilla x Kong: The New Empire",
    genre: "Action, Sci-Fi",
    rating: 7.2,
    poster: "https://image.tmdb.org/t/p/w500/tMefBSflR6PGQLv7WvFPpKLZkyk.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/bz66a19bR6BKsbY8gSZCM4etJiK.jpg",
    duration: "1h 55m",
    releaseDate: "March 29, 2024",
    synopsis: "Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and connection to Skull Island's mysteries.",
    director: "Adam Wingard",
    cast: ["Rebecca Hall", "Brian Tyree Henry", "Dan Stevens", "Kaylee Hottle", "Alex Ferns"],
    trailerUrl: "https://www.youtube.com/embed/lV1OOlGwExM"
  },
  {
    id: 4,
    title: "Civil War",
    genre: "Action, Thriller",
    rating: 7.4,
    poster: "https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/z121dSTR7PY9KxKuvwiIFSYW8cf.jpg",
    duration: "1h 49m",
    releaseDate: "April 12, 2024",
    synopsis: "In the near future, a team of journalists travel across the United States during a rapidly escalating civil war that has engulfed the entire nation.",
    director: "Alex Garland",
    cast: ["Kirsten Dunst", "Wagner Moura", "Cailee Spaeny", "Stephen McKinley Henderson", "Nick Offerman"],
    trailerUrl: "https://www.youtube.com/embed/aDyQxtg0V2w"
  }
]

export const CINEMAS: Cinema[] = [
  { id: 1, name: "PTIT Cinema", location: "96 Định Công, Hoàng Mai, Hà Nội" }
]

export const SHOWTIMES: Showtime[] = [
  {
    id: 1,
    movieId: 1,
    cinemaId: 1,
    cinema: CINEMAS[0],
    date: "2024-11-23",
    times: ["10:00", "13:30", "17:00", "20:30"],
    price: 120000,
    roomId: 1
  },
  {
    id: 2,
    movieId: 1,
    cinemaId: 1,
    cinema: CINEMAS[0],
    date: "2024-11-24",
    times: ["11:00", "14:00", "18:30", "21:00"],
    price: 120000,
    roomId: 2
  },
  {
    id: 3,
    movieId: 2,
    cinemaId: 1,
    cinema: CINEMAS[0],
    date: "2024-11-23",
    times: ["09:00", "12:00", "15:00", "18:00"],
    price: 100000,
    roomId: 1
  }
]

export function getMovieById(id: number): Movie | undefined {
  return MOVIES.find(movie => movie.id === id)
}

export function getShowtimesByMovieId(movieId: number): Showtime[] {
  return SHOWTIMES.filter(showtime => showtime.movieId === movieId)
}

export function getShowtimeById(id: number): Showtime | undefined {
  return SHOWTIMES.find(showtime => showtime.id === id)
}
