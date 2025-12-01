import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {useAtomValue} from 'jotai'
import * as React from 'react'
import {toast} from 'sonner'

import {userAtom} from '../store/auth'
import { movieService } from '../services/movie'
import { CINEMAS } from '../data/movies'
import type { Movie, Showtime } from '../types/movie'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/ui/card'
import {Button} from '../components/ui/button'
import {Input} from '../components/ui/input'
import {Textarea} from '../components/ui/textarea'
import {Column, Table} from "@/components/ui/table";
import {DetailDialog} from "@/components/ui/command";
import dayjs from "dayjs";
export const Route = createFileRoute('/room-manager')({
  component: RouteComponent,
})

function RouteComponent() {
  const user = useAtomValue(userAtom)
  const navigate = useNavigate()

  const [movies, setMovies] = React.useState<Movie[]>([])
  const [movie, setMovie] = React.useState<Movie>({} as Movie)
  const [showtimes, setShowtimes] = React.useState<Showtime[]>([])
  const [showDetails, setShowDetail] = React.useState<boolean>(false)
  const [page, setPage] = React.useState<number>(1);
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = React.useState('')

  React.useEffect(() => {
    if (!user) {
      navigate({ to: '/login', search: { redirect: '/manager' } })
      return
    }
    if (!user.roles?.includes('MANAGER')) {
      navigate({ to: '/' })
      return
    }
    const fetchData = async () => {
      const m = await movieService.getMovies()
      setMovies(m)
      const s = await movieService.getShowtimes()
      setShowtimes(s)
    }
    fetchData()
  }, [user, navigate])

  // ----- Movies helpers -----
  const updateMovies = (updater: (prev: Movie[]) => Movie[]) => {
    setMovies((prev) => updater(prev))
  }
  const updateMovie = (updater: (prev: Movie) => Movie) => {
    setMovie((prev) => updater(prev))
  }

  const handleAddMovie = () => {
    const prevMovie =  {
      id: 0,
      title: 'New Movie',
      genre: '',
      rating: 0,
      poster: '',
      duration: '',
      synopsis: '',
      releaseDate: new Date().toISOString().split('T')[0],
      backdrop: '',
      director: '',
      cast: [],
      trailerUrl: ''
    } as Movie
    setMovie(prevMovie)
    setShowDetail(true)
  }

  const handleChangeMovie = (id: number, field: keyof Movie, value: any) => {
    updateMovie((prev) =>
      prev.id === id ? {...prev, [field]: value} : prev)
  }

  const handleDeleteMovie = async (id: number) => {
    await movieService.deleteMovie(id)
    const m = await movieService.getMovies()
    setMovies(m)
    toast.success('Movie deleted')
  }

  const handleSaveMovie = async () => {
    if (!movie) return;
    try {
      if (movie.id === 0 || !movies.find(m => m.id === movie.id)) {
        // Create
        // Remove id 0 to let backend/mock assign
        const { id, ...rest } = movie
        await movieService.createMovie(rest as Movie)
      } else {
        await movieService.updateMovie(movie.id, movie)
      }
      const m = await movieService.getMovies()
      setMovies(m)
      toast.success('Movie saved')
      setShowDetail(false)
    } catch (e) {
      toast.error('Failed to save movie')
    }
  };
  // ----- Showtimes helpers -----
  const updateShowtimes = (updater: (prev: Showtime[]) => Showtime[]) => {
    setShowtimes((prev) => updater(prev))
  }

  const handleAddShowtime = async (roomId?: number) => {
    const defaultRoomId = roomId ?? 1
    const defaultMovie = movies[0]
    const defaultCinema = CINEMAS[0]

    if (!defaultMovie || !defaultCinema) {
      toast.error('No base movie or cinema to create a showtime')
      return
    }

    const today = new Date().toISOString().slice(0, 10)

    try {
      await movieService.createShowtime({
        movieId: defaultMovie.id,
        cinemaId: defaultCinema.id,
        cinema: defaultCinema,
        date: today,
        times: ['09:00'],
        price: 100000,
        roomId: defaultRoomId,
      })
      const s = await movieService.getShowtimes()
      setShowtimes(s)
      toast.success('Showtime created')
    } catch (e) {
      toast.error('Failed to create showtime')
    }
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
          return {...st, movieId: Number(value) || st.movieId}
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
          return {...st, date: value as string}
        }

        if (field === 'times') {
          const arr = (value as string)
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
          return {...st, times: arr}
        }

        if (field === 'price') {
          return {...st, price: Number(value) || 0}
        }

        if (field === 'roomId') {
          const num = Number(value)
          return {...st, roomId: Number.isNaN(num) ? undefined : num}
        }

        return st
      }),
    )
  }

  const handleDeleteShowtime = async (id: number) => {
    await movieService.deleteShowtime(id)
    const s = await movieService.getShowtimes()
    setShowtimes(s)
    toast.success('Showtime deleted')
  }

  const handleSaveShowtimes = async () => {
    try {
      await Promise.all(showtimes.map(st => movieService.updateShowtime(st.id, st)))
      toast.success('Showtimes saved')
      const s = await movieService.getShowtimes()
      setShowtimes(s)
    } catch (e) {
      toast.error('Failed to save showtimes')
    }
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
        .map(([roomId, items]) => ({roomId, items}))
    },
    [showtimes],
  )

  const getMovieTitle = (movieId: number) => {
    const movie = movies.find((m) => m.id === movieId)
    return movie?.title ?? `Movie #${movieId}`
  }

  if (!user || !user.roles?.includes('MANAGER')) {
    return null
  }

  function viewDetail(data: Movie) {
    console.log(data)
    setMovie(data);
    setShowDetail(true); // mở modal nếu cần
  }

  async function handleSearch(searchValue = "") {
    setSearchQuery(searchValue);
    const query = searchValue.toLowerCase();

    // Re-fetch all to filter (simple approach)
    const allMovies = await movieService.getMovies();

    if (!query) {
      setMovies(allMovies);
      return;
    }

    const searchResults = allMovies.filter(movie => {
      return (
        movie.title.toLowerCase().includes(query) ||
        movie.genre.toLowerCase().includes(query) ||
        (movie.synopsis && movie.synopsis.toLowerCase().includes(query))
      );
    });

    setMovies(searchResults);
  }

  const columnsMovie: Column<any>[] = [
    {title: "Movie title", dataIndex: "title", width: "30%"},
    {title: "Genre", dataIndex: "genre"},
    {title: "Rating", dataIndex: "rating"},
    {title: "Release Date", dataIndex: "releaseDate"},
    {
      title: "Action",
      width: "10%",
      render: (_, row) => (
        <div>
          <span className="text-primary underline cursor-pointer mx-1"
                onClick={() => viewDetail(row)}>
        {'Detail'}
        </span>
          <span className="text-red-600 underline cursor-pointer mx-1"
                onClick={() => handleDeleteMovie(row.id)}>
        {'Delete'}
        </span>
        </div>
      ),
    },
  ];

  function closeDetail() {
    setShowDetail(false);
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Showtimes by room (CRUD) */}
  <Card>
    <CardHeader>
      <CardTitle>Showtimes by Room</CardTitle>
      <CardDescription>
        View and manage which showtimes each room currently has (based on editable showtime
        data).
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {roomShowtimes.map((room) => (
        <div key={room.roomId} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base">Room #{room.roomId}</h3>
            <Button
              size="sm"
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
                <Button
                  variant="destructive"
                  size="sm"
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
