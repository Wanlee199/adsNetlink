import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import * as React from 'react'
import { toast } from 'sonner'

import { userAtom } from '../store/auth'
import { MOVIES, SHOWTIMES, CINEMAS } from '../data/movies'
import type { Movie, Showtime } from '../types/movie'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'

const MANAGER_MOVIES_KEY = 'manager_movies'
const MANAGER_SHOWTIMES_KEY = 'manager_showtimes'

function loadManagerMovies(): Movie[] {
  if (typeof window === 'undefined') return MOVIES
  const raw = localStorage.getItem(MANAGER_MOVIES_KEY)
  if (!raw) return MOVIES
  try {
    return JSON.parse(raw) as Movie[]
  } catch {
    return MOVIES
  }
}

function saveManagerMovies(movies: Movie[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(MANAGER_MOVIES_KEY, JSON.stringify(movies))
}

function loadManagerShowtimes(): Showtime[] {
  if (typeof window === 'undefined') return SHOWTIMES
  const raw = localStorage.getItem(MANAGER_SHOWTIMES_KEY)
  if (!raw) return SHOWTIMES
  try {
    return JSON.parse(raw) as Showtime[]
  } catch {
    return SHOWTIMES
  }
}

function saveManagerShowtimes(showtimes: Showtime[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(MANAGER_SHOWTIMES_KEY, JSON.stringify(showtimes))
}

export const Route = createFileRoute('/manager')({
  component: ManagerPage,
})

function ManagerPage() {
  const user = useAtomValue(userAtom)
  const navigate = useNavigate()

  const [movies, setMovies] = React.useState<Movie[]>([])
  const [showtimes, setShowtimes] = React.useState<Showtime[]>([])

  React.useEffect(() => {
    if (!user) {
      navigate({ to: '/login', search: { redirect: '/manager' } })
      return
    }
    if (!user.roles?.includes('MANAGER')) {
      navigate({ to: '/' })
      return
    }
    setMovies(loadManagerMovies())
    setShowtimes(loadManagerShowtimes())
  }, [user, navigate])

  // ----- Movies helpers -----
  const updateMovies = (updater: (prev: Movie[]) => Movie[]) => {
    setMovies((prev) => updater(prev))
  }

  const handleAddMovie = () => {
    updateMovies((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: 'New Movie',
        genre: '',
        rating: 0,
        poster: '',
        duration: '',
        synopsis: '',
      },
    ])
  }

  const handleChangeMovie = (id: number, field: keyof Movie, value: any) => {
    updateMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    )
  }

  const handleDeleteMovie = (id: number) => {
    updateMovies((prev) => prev.filter((m) => m.id !== id))
  }

  const handleSaveMovies = () => {
    saveManagerMovies(movies)
    toast.success('Movies have been saved')
  }

  // ----- Showtimes helpers -----
  const updateShowtimes = (updater: (prev: Showtime[]) => Showtime[]) => {
    setShowtimes((prev) => updater(prev))
  }

  const handleAddShowtime = (roomId?: number) => {
    const defaultRoomId = roomId ?? 1
    const defaultMovie = movies[0] ?? MOVIES[0]
    const defaultCinema = CINEMAS[0]

    if (!defaultMovie || !defaultCinema) {
      toast.error('No base movie or cinema to create a showtime')
      return
    }

    const today = new Date().toISOString().slice(0, 10)

    updateShowtimes((prev) => [
      ...prev,
      {
        id: Date.now(),
        movieId: defaultMovie.id,
        cinemaId: defaultCinema.id,
        cinema: defaultCinema,
        date: today,
        times: ['09:00'],
        price: 100000,
        roomId: defaultRoomId,
      },
    ])
  }

  const handleChangeShowtime = (
    id: number,
    field: 'movieId' | 'cinemaId' | 'date' | 'times' | 'price' | 'roomId',
    value: any,
  ) => {
    updateShowtimes((prev) =>
      prev.map((st) => {
        if (st.id !== id) return st

        if (field === 'movieId') {
          return { ...st, movieId: Number(value) || st.movieId }
        }

        if (field === 'cinemaId') {
          const cinema = CINEMAS.find((c) => c.id === Number(value))
          return {
            ...st,
            cinemaId: Number(value) || st.cinemaId,
            cinema: cinema ?? st.cinema,
          }
        }

        if (field === 'date') {
          return { ...st, date: value as string }
        }

        if (field === 'times') {
          const arr = (value as string)
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
          return { ...st, times: arr }
        }

        if (field === 'price') {
          return { ...st, price: Number(value) || 0 }
        }

        if (field === 'roomId') {
          const num = Number(value)
          return { ...st, roomId: Number.isNaN(num) ? undefined : num }
        }

        return st
      }),
    )
  }

  const handleDeleteShowtime = (id: number) => {
    updateShowtimes((prev) => prev.filter((st) => st.id !== id))
  }

  const handleSaveShowtimes = () => {
    saveManagerShowtimes(showtimes)
    toast.success('Showtimes have been saved')
  }

  // Group showtimes by room
  const roomShowtimes = React.useMemo(
    () => {
      const map = new Map<number, Showtime[]>()

      showtimes.forEach((st) => {
        if (!st.roomId) return
        const list = map.get(st.roomId) ?? []
        list.push(st)
        map.set(st.roomId, list)
      })

      return Array.from(map.entries())
        .sort(([a], [b]) => a - b)
        .map(([roomId, items]) => ({ roomId, items }))
    },
    [showtimes],
  )

  const getMovieTitle = (movieId: number) => {
    const movie =
      movies.find((m) => m.id === movieId) ||
      MOVIES.find((m) => m.id === movieId)
    return movie?.title ?? `Movie #${movieId}`
  }

  if (!user || !user.roles?.includes('MANAGER')) {
    return null
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Movie management */}
      <Card>
        <CardHeader className="flex flex-col gap-2">
          <div>
            <CardTitle>Movie Management</CardTitle>
            <CardDescription>
              Manage movies that are currently available. You can add, edit, or delete movies.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="border rounded-lg p-4 grid gap-3 md:grid-cols-2"
            >
              {/* Movie title */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground">
                  Movie title
                </span>
                <Input
                  value={movie.title}
                  onChange={(e) =>
                    handleChangeMovie(movie.id, 'title', e.target.value)
                  }
                  placeholder="E.g., Dune 2"
                />
              </div>

              {/* Genre */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground">
                  Genre
                </span>
                <Input
                  value={movie.genre}
                  onChange={(e) =>
                    handleChangeMovie(movie.id, 'genre', e.target.value)
                  }
                  placeholder="E.g., Action, Comedy"
                />
              </div>

              {/* Age rating / score */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground">
                  Age rating / Score
                </span>
                <Input
                  type="number"
                  value={movie.rating}
                  onChange={(e) =>
                    handleChangeMovie(
                      movie.id,
                      'rating',
                      Number(e.target.value) || 0,
                    )
                  }
                  placeholder="E.g., 13, 16, 18"
                />
              </div>

              {/* Duration */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground">
                  Duration
                </span>
                <Input
                  value={movie.duration}
                  onChange={(e) =>
                    handleChangeMovie(movie.id, 'duration', e.target.value)
                  }
                  placeholder="E.g., 2h 15m"
                />
              </div>

              {/* Poster URL */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground">
                  Poster URL
                </span>
                <Input
                  value={movie.poster || ''}
                  onChange={(e) =>
                    handleChangeMovie(movie.id, 'poster', e.target.value)
                  }
                  placeholder="https://example.com/poster.jpg"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  Description
                </span>
                <Textarea
                  value={movie.synopsis || ''}
                  onChange={(e) =>
                    handleChangeMovie(movie.id, 'synopsis', e.target.value)
                  }
                  placeholder="Short description of the movie"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteMovie(movie.id)}
                >
                  Delete Movie
                </Button>
              </div>
            </div>
          ))}

          {movies.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No movies yet. Click &quot;Add Movie&quot; to create one.
            </p>
          )}

          {/* Buttons at the bottom */}
          <div className="flex justify-end gap-2 pt-4 border-t mt-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300"
              onClick={handleAddMovie}
            >
              Add Movie
            </Button>
            <Button
              size="sm"
              className="bg-emerald-500 text-white hover:bg-emerald-600"
              onClick={handleSaveMovies}
            >
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Showtimes by room (CRUD) */}
      <Card>
        <CardHeader>
          <CardTitle>Showtimes by Room</CardTitle>
          <CardDescription>
            View and manage which showtimes each room currently has (based on editable showtime data).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {roomShowtimes.map((room) => (
            <div key={room.roomId} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base">Room #{room.roomId}</h3>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => handleAddShowtime(room.roomId)}
                >
                  Add showtime for this room
                </Button>
              </div>

              {room.items.map((st) => (
                <div
                  key={st.id}
                  className="grid gap-3 md:grid-cols-6 border-t pt-3 mt-3"
                >
                  {/* Movie */}
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Movie
                    </span>
                    <select
                      className="border rounded-md px-2 py-1 text-sm bg-background"
                      value={st.movieId}
                      onChange={(e) =>
                        handleChangeShowtime(
                          st.id,
                          'movieId',
                          Number(e.target.value),
                        )
                      }
                    >
                      {movies.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cinema */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Cinema
                    </span>
                    <select
                      className="border rounded-md px-2 py-1 text-sm bg-background"
                      value={st.cinemaId}
                      onChange={(e) =>
                        handleChangeShowtime(
                          st.id,
                          'cinemaId',
                          Number(e.target.value),
                        )
                      }
                    >
                      {CINEMAS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Date
                    </span>
                    <Input
                      type="date"
                      value={st.date}
                      onChange={(e) =>
                        handleChangeShowtime(st.id, 'date', e.target.value)
                      }
                    />
                  </div>

                  {/* Times */}
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Showtimes (comma separated)
                    </span>
                    <Input
                      value={st.times.join(', ')}
                      onChange={(e) =>
                        handleChangeShowtime(st.id, 'times', e.target.value)
                      }
                      placeholder="10:00, 13:30, 17:00"
                    />
                  </div>

                  {/* Price + Room + Delete */}
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Price (VND)
                      </span>
                      <Input
                        type="number"
                        value={st.price}
                        onChange={(e) =>
                          handleChangeShowtime(
                            st.id,
                            'price',
                            Number(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Room
                      </span>
                      <Input
                        type="number"
                        value={st.roomId ?? ''}
                        onChange={(e) =>
                          handleChangeShowtime(
                            st.id,
                            'roomId',
                            Number(e.target.value),
                          )
                        }
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="xs"
                      className="mt-1"
                      onClick={() => handleDeleteShowtime(st.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {roomShowtimes.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No showtime data yet (SHOWTIMES is empty or has no roomId).
            </p>
          )}

          {/* Global add & save for showtimes */}
          <div className="flex justify-end gap-2 pt-4 border-t mt-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300"
              onClick={() => handleAddShowtime()}
            >
              Add Showtime
            </Button>
            <Button
              size="sm"
              className="bg-emerald-500 text-white hover:bg-emerald-600"
              onClick={handleSaveShowtimes}
            >
              Save showtimes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
