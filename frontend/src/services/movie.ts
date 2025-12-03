import { httpClient } from '../lib/http';
import { Movie, Showtime, Cinema, SeatMap } from '../types/movie';
import { MOVIES, SHOWTIMES, CINEMAS } from '../data/movies';
import { getSeatMapByRoomId } from '../data/seats';

const MANAGER_MOVIES_KEY = 'manager_movies';
const MANAGER_SHOWTIMES_KEY = 'manager_showtimes';

// Helper to get local data (simulating DB)
const getLocalMovies = (): Movie[] => {
  try {
    const raw = localStorage.getItem(MANAGER_MOVIES_KEY);
    return raw ? JSON.parse(raw) : MOVIES;
  } catch {
    return MOVIES;
  }
};

const saveLocalMovies = (movies: Movie[]) => {
  localStorage.setItem(MANAGER_MOVIES_KEY, JSON.stringify(movies));
};

const getLocalShowtimes = (): Showtime[] => {
  try {
    const raw = localStorage.getItem(MANAGER_SHOWTIMES_KEY);
    return raw ? JSON.parse(raw) : SHOWTIMES;
  } catch {
    return SHOWTIMES;
  }
};

const saveLocalShowtimes = (showtimes: Showtime[]) => {
  localStorage.setItem(MANAGER_SHOWTIMES_KEY, JSON.stringify(showtimes));
};

export const movieService = {
  // --- Public APIs ---
  getMovies: async (): Promise<Movie[]> => {
    try {
      return await httpClient.get<Movie[]>('/movies');
    } catch (error) {
      console.warn('API getMovies failed, using mock:', error);
      return getLocalMovies();
    }
  },

  searchMovies: async (query: string): Promise<Movie[]> => {
    try {
      return await httpClient.get<Movie[]>('/movies/search', { params: { q: query } });
    } catch (error) {
      console.warn('API searchMovies failed, using mock:', error);
      const allMovies = getLocalMovies();
      const lowerQuery = query.toLowerCase();
      return allMovies.filter(movie => 
        movie.title.toLowerCase().includes(lowerQuery) ||
        movie.genre.toLowerCase().includes(lowerQuery) ||
        (movie.synopsis && movie.synopsis.toLowerCase().includes(lowerQuery))
      );
    }
  },

  getMovieById: async (id: number): Promise<Movie | undefined> => {
    try {
      return await httpClient.get<Movie>(`/movies/${id}`);
    } catch (error) {
      console.warn(`API getMovieById(${id}) failed, using mock:`, error);
      return getLocalMovies().find(m => m.id === id);
    }
  },

  getShowtimes: async (movieId?: number, roomId?: number): Promise<Showtime[]> => {
    try {
      const params: Record<string, string> = {};
      if (movieId) params.movieId = movieId.toString();
      if (roomId) params.roomId = roomId.toString();
      return await httpClient.get<Showtime[]>('/showtimes', { params });
    } catch (error) {
      console.warn('API getShowtimes failed, using mock:', error);
      let data = getLocalShowtimes();
      if (movieId) data = data.filter(s => s.movieId === movieId);
      if (roomId) data = data.filter(s => s.roomId === roomId);
      return data;
    }
  },

  getShowtimeById: async (id: number): Promise<Showtime | undefined> => {
    try {
      return await httpClient.get<Showtime>(`/showtimes/${id}`);
    } catch (error) {
      console.warn(`API getShowtimeById(${id}) failed, using mock:`, error);
      return getLocalShowtimes().find(s => s.id === id);
    }
  },

  getCinemas: async (): Promise<Cinema[]> => {
    // We removed /cinemas endpoint from docs as user requested hardcode, 
    // but for service consistency we can keep it or just return mock.
    // User said "hardcode frontend", so maybe just return mock is fine or try API if it existed.
    // Let's try API just in case backend implements it later, fallback to const.
    try {
        // return await httpClient.get<Cinema[]>('/cinemas');
        // Actually user explicitly said no API for cinemas.
        return CINEMAS;
    } catch (error) {
      return CINEMAS;
    }
  },

  getSeatMap: async (roomId: number): Promise<SeatMap | undefined> => {
    try {
      return await httpClient.get<SeatMap>(`/rooms/${roomId}/seats`);
    } catch (error) {
      console.warn(`API getSeatMap(${roomId}) failed, using mock:`, error);
      return getSeatMapByRoomId(roomId);
    }
  },

  getRooms: async (): Promise<{id: number, name: string, cinemaId: number}[]> => {
      try {
          return await httpClient.get<{id: number, name: string, cinemaId: number}[]>('/rooms');
      } catch (error) {
          console.warn('API getRooms failed, using mock');
          // Mock rooms based on mock showtimes or just hardcode some
          return [
              { id: 1, name: "Room 1", cinemaId: 1 },
              { id: 2, name: "Room 2", cinemaId: 2 },
              { id: 3, name: "Room 3", cinemaId: 1 }
          ];
      }
  },

  // --- Manager APIs ---
  createMovie: async (movie: Omit<Movie, 'id'>): Promise<Movie> => {
    try {
      return await httpClient.post<Movie>('/movies', movie);
    } catch (error) {
      console.warn('API createMovie failed, using mock:', error);
      const newMovie = { ...movie, id: Date.now() } as Movie;
      const movies = getLocalMovies();
      movies.push(newMovie);
      saveLocalMovies(movies);
      return newMovie;
    }
  },

  updateMovie: async (id: number, movie: Partial<Movie>): Promise<Movie> => {
    try {
      return await httpClient.put<Movie>(`/movies/${id}`, movie);
    } catch (error) {
      console.warn(`API updateMovie(${id}) failed, using mock:`, error);
      const movies = getLocalMovies();
      const index = movies.findIndex(m => m.id === id);
      if (index !== -1) {
        movies[index] = { ...movies[index], ...movie };
        saveLocalMovies(movies);
        return movies[index];
      }
      throw new Error('Movie not found');
    }
  },

  deleteMovie: async (id: number): Promise<void> => {
    try {
      await httpClient.delete(`/movies/${id}`);
    } catch (error) {
      console.warn(`API deleteMovie(${id}) failed, using mock:`, error);
      const movies = getLocalMovies();
      const newMovies = movies.filter(m => m.id !== id);
      saveLocalMovies(newMovies);
    }
  },

  createShowtime: async (showtime: Omit<Showtime, 'id'>): Promise<Showtime> => {
    try {
      return await httpClient.post<Showtime>('/showtimes', showtime);
    } catch (error) {
      console.warn('API createShowtime failed, using mock:', error);
      const newShowtime = { ...showtime, id: Date.now() } as Showtime;
      const showtimes = getLocalShowtimes();
      showtimes.push(newShowtime);
      saveLocalShowtimes(showtimes);
      return newShowtime;
    }
  },

  updateShowtime: async (id: number, showtime: Partial<Showtime>): Promise<Showtime> => {
    try {
      return await httpClient.put<Showtime>(`/showtimes/${id}`, showtime);
    } catch (error) {
      console.warn(`API updateShowtime(${id}) failed, using mock:`, error);
      const showtimes = getLocalShowtimes();
      const index = showtimes.findIndex(s => s.id === id);
      if (index !== -1) {
        showtimes[index] = { ...showtimes[index], ...showtime };
        saveLocalShowtimes(showtimes);
        return showtimes[index];
      }
      throw new Error('Showtime not found');
    }
  },

  deleteShowtime: async (id: number): Promise<void> => {
    try {
      await httpClient.delete(`/showtimes/${id}`);
    } catch (error) {
      console.warn(`API deleteShowtime(${id}) failed, using mock:`, error);
      const showtimes = getLocalShowtimes();
      const newShowtimes = showtimes.filter(s => s.id !== id);
      saveLocalShowtimes(newShowtimes);
    }
  },
  
  getStats: async (): Promise<{totalRevenue: number, totalBookings: number, totalMovies: number}> => {
      try {
          return await httpClient.get('/reports/stats');
      } catch (error) {
          console.warn('API getStats failed, using mock');
          return {
              totalRevenue: 15000000,
              totalBookings: 120,
              totalMovies: getLocalMovies().length
          };
      }
  }
};
