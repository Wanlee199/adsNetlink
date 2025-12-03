export interface Movie {
  id: number
  title: string
  genre: string
  rating: number
  poster: string
  duration: string
  releaseDate?: string
  backdrop?: string
  synopsis?: string
  director?: string
  cast?: string[]
  trailerUrl?: string
}

export interface Cinema {
  id: number
  name: string
  location: string
}

export interface Showtime {
  id: number
  movieId: number
  cinemaId: number
  cinema: Cinema
  date: string
  times?: string[]  // Optional since API might not always include this
  price: number
  roomId?: number
}

export enum SeatStatus {
  AVAILABLE = 'available',
  SELECTED = 'selected',
  OCCUPIED = 'occupied'
}

export enum SeatType {
  STANDARD = 'standard',
  VIP = 'vip',
  COUPLE = 'couple'
}

export interface Seat {
  id: string
  row: string
  number: number
  type: SeatType
  status: SeatStatus
  price: number
}

export interface SeatMap {
  roomId: number
  rows: number
  seatsPerRow: number
  seats: Seat[]
}
