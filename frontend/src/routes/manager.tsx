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
import {MultiSelect} from "@/components/ui/multiSelect";


export const Route = createFileRoute('/manager')({
  component: ManagerPage,
})

function ManagerPage() {
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
  const GENRES = [
    { label: "Action", value: "Action" },
    { label: "Adventure", value: "Adventure" },
    { label: "Animation", value: "Animation" },
    { label: "Comedy", value: "Comedy" },
    { label: "Drama", value: "Drama" },
    { label: "Horror", value: "Horror" },
    { label: "Romance", value: "Romance" },
    { label: "Science Fiction", value: "Science Fiction" },
    { label: "Sci-Fi", value: "Sci-Fi" },
  ];
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
      {/* Movie management */}
      <Card>
        <CardHeader className="flex flex-col gap-2">
          <div className="w-full flex justify-between">
            <div>
              <CardTitle>Movie Management</CardTitle>
              <CardDescription>
                Manage movies that are currently available. You can add, edit, or delete movies.
              </CardDescription>
            </div>
            <div className="relative w-1/4">
              <Input
                type="search"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 h-9 bg-muted/50 border-none focus-visible:ring-2 "
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300"
              onClick={handleAddMovie}
            >
              Add Movie
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table columns={columnsMovie}
                 data={movies?.slice((page - 1) * pageSize, page * pageSize)}
                 page={page}
                 pageSize={pageSize}
                 total={movies.length}
                 onPageChange={(p) => setPage(p)}></Table>
        </CardContent>
      </Card>
      <DetailDialog
        open={showDetails}
        onOpenChange={setShowDetail}
        title="Movie Detail"
      >
        <div className="space-y-4">
          <div
            key={movie.id}
            className=" rounded-lg p-4 grid gap-6 md:grid-cols-[300px_1fr]"
          >
            {/* LEFT COLUMN — POSTER */}
            <div className="flex flex-col gap-3">

              {/* Poster Preview */}
              <div
                className="w-full h-full border rounded overflow-hidden flex items-center justify-center bg-muted">
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt="Poster preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">No poster</span>
                )}
              </div>

              {/* Upload button */}
              <button
                type="button"
                className="px-3 py-2 rounded bg-primary text-white text-sm hover:bg-primary/90"
                onClick={() => document.getElementById(`poster-upload-${movie.id}`)?.click()}
              >
                Upload Poster
              </button>

              {/* Hidden input */}
              <input
                id={`poster-upload-${movie.id}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const imageUrl = URL.createObjectURL(file);
                  handleChangeMovie(movie.id, "poster", imageUrl);
                }}
              />
            {/* Poster URL Input */}
             <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground">Poster URL</span>
                <Input
                  value={movie.poster || ''}
                  onChange={(e) => handleChangeMovie(movie.id, 'poster', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* RIGHT COLUMN — MOVIE FIELDS */}
            <div className="flex flex-col gap-4">

              {/* Movie title */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground">Movie title</span>
                <Input
                  value={movie.title}
                  onChange={(e) => handleChangeMovie(movie.id, 'title', e.target.value)}
                  placeholder="E.g., Dune 2"
                />
              </div>

              {/* Genre */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground">Genre</span>
                <MultiSelect
                  options={GENRES}
                  value={
                    Array.isArray(movie.genre)
                      ? movie.genre
                      : (movie.genre?.split(",").map(g => g.trim()) ?? [])
                  }
                  onChange={(vals) =>
                    handleChangeMovie(movie.id, "genre", vals.join(", "))
                  }
                  placeholder="Chọn thể loại phim"
                />
              </div>

              {/* Age rating */}
              <div className="flex flex-col gap-1">
                <span
                  className="text-xs font-semibold text-muted-foreground">Age rating / Score</span>
                <Input
                  type="number"
                  value={movie.rating}
                  onChange={(e) => handleChangeMovie(movie.id, 'rating', Number(e.target.value) || 0)}
                  placeholder="E.g., 13, 16, 18"
                />
              </div>

              {/* Duration */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground">Duration</span>
                <Input
                  value={movie.duration}
                  onChange={(e) => handleChangeMovie(movie.id, 'duration', e.target.value)}
                  placeholder="E.g., 2h 15m"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground">Release Date</span>
                <Input
                  type="date"
                  value={dayjs(movie.releaseDate).format('YYYY-MM-DD')}
                  onChange={(e) =>
                    handleChangeMovie(movie.id, 'releaseDate', e.target.value)
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground">Duration</span>
                <Input
                  value={movie.duration}
                  onChange={(e) => handleChangeMovie(movie.id, 'duration', e.target.value)}
                  placeholder="E.g., 2h 15m"
                />
              </div>


              {/* Description — full width */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground">Description</span>
                <Textarea
                  value={movie.synopsis || ''}
                  onChange={(e) => handleChangeMovie(movie.id, 'synopsis', e.target.value)}
                  placeholder="Short description of the movie"
                />
              </div>
              <div className="flex flex-col gap-1">

                {/* Hidden input */}
                <input
                  id={`backdrop-upload-${movie.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const imageUrl = URL.createObjectURL(file);
                    handleChangeMovie(movie.id, "backdrop", imageUrl);
                  }}
                />
                <div
                  className="w-full h-48 border rounded overflow-hidden flex items-center justify-center bg-muted">
                  {movie.backdrop ? (
                    <img
                      src={movie.backdrop}
                      alt="Poster preview"
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">No Backdrop</span>
                  )}

                </div>
                {/* Upload button */}
                <button
                  type="button"
                  className="w-full h-8 px-3 py-2 rounded bg-primary text-white text-sm hover:bg-primary/90"
                  onClick={() => document.getElementById(`backdrop-upload-${movie.id}`)?.click()}
                >
                  Upload Backdrop
                </button>

               {/* Backdrop URL Input */}
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-xs font-semibold text-muted-foreground">Backdrop URL</span>
                <Input
                  value={movie.backdrop || ''}
                  onChange={(e) => handleChangeMovie(movie.id, 'backdrop', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end gap-2 pt-4 border-t mt-2">
            <Button
              size="sm"
              className="bg-emerald-500 text-white hover:bg-emerald-600"
              onClick={handleSaveMovie}
            >
              Save changes
            </Button>
          </div>
        </div>

      </DetailDialog>
      {/*<Card>*/
      }
      {/*  <CardHeader className="flex flex-col gap-2">*/
      }
      {/*    <div>*/}
      {/*      <CardTitle>Movie Management</CardTitle>*/}
      {/*      <CardDescription>*/}
      {/*        Manage movies that are currently available. You can add, edit, or delete movies.*/}
      {/*      </CardDescription>*/}
      {/*    </div>*/}
      {/*  </CardHeader>*/}
      {/*  <CardContent className="space-y-4">*/}
      {/*    {movies.map((movie) => (*/}
      {/*      <div*/}
      {/*        key={movie.id}*/}
      {/*        className="border rounded-lg p-4 grid gap-3 md:grid-cols-2"*/}
      {/*      >*/}
      {/*        /!* Movie title *!/*/}
      {/*        <div className="flex flex-col gap-1">*/}
      {/*          <span className="text-xs font-semibold text-muted-foreground">*/}
      {/*            Movie title*/}
      {/*          </span>*/}
      {/*          <Input*/}
      {/*            value={movie.title}*/}
      {/*            onChange={(e) =>*/}
      {/*              handleChangeMovie(movie.id, 'title', e.target.value)*/}
      {/*            }*/}
      {/*            placeholder="E.g., Dune 2"*/}
      {/*          />*/}
      {/*        </div>*/}

      {/*        /!* Genre *!/*/}
      {/*        <div className="flex flex-col gap-1">*/}
      {/*          <span className="text-xs font-semibold text-muted-foreground">*/}
      {/*            Genre*/}
      {/*          </span>*/}
      {/*          <Input*/}
      {/*            value={movie.genre}*/}
      {/*            onChange={(e) =>*/}
      {/*              handleChangeMovie(movie.id, 'genre', e.target.value)*/}
      {/*            }*/}
      {/*            placeholder="E.g., Action, Comedy"*/}
      {/*          />*/}
      {/*        </div>*/}

      {/*        /!* Age rating / score *!/*/}
      {/*        <div className="flex flex-col gap-1">*/}
      {/*          <span className="text-xs font-semibold text-muted-foreground">*/}
      {/*            Age rating / Score*/}
      {/*          </span>*/}
      {/*          <Input*/}
      {/*            type="number"*/}
      {/*            value={movie.rating}*/}
      {/*            onChange={(e) =>*/}
      {/*              handleChangeMovie(*/}
      {/*                movie.id,*/}
      {/*                'rating',*/}
      {/*                Number(e.target.value) || 0,*/}
      {/*              )*/}
      {/*            }*/}
      {/*            placeholder="E.g., 13, 16, 18"*/}
      {/*          />*/}
      {/*        </div>*/}

      {/*        /!* Duration *!/*/}
      {/*        <div className="flex flex-col gap-1">*/}
      {/*          <span className="text-xs font-semibold text-muted-foreground">*/}
      {/*            Duration*/}
      {/*          </span>*/}
      {/*          <Input*/}
      {/*            value={movie.duration}*/}
      {/*            onChange={(e) =>*/}
      {/*              handleChangeMovie(movie.id, 'duration', e.target.value)*/}
      {/*            }*/}
      {/*            placeholder="E.g., 2h 15m"*/}
      {/*          />*/}
      {/*        </div>*/}

      {/*        /!* Poster URL *!/*/}
      {/*        <div className="flex flex-col gap-1">*/}
      {/*          <span className="text-xs font-semibold text-muted-foreground">*/}
      {/*            Poster URL*/}
      {/*          </span>*/}
      {/*          <Input*/}
      {/*            value={movie.poster || ''}*/}
      {/*            onChange={(e) =>*/}
      {/*              handleChangeMovie(movie.id, 'poster', e.target.value)*/}
      {/*            }*/}
      {/*            placeholder="https://example.com/poster.jpg"*/}
      {/*          />*/}
      {/*        </div>*/}

      {/*        /!* Description *!/*/}
      {/*        <div className="flex flex-col gap-1 md:col-span-2">*/}
      {/*          <span className="text-xs font-semibold text-muted-foreground">*/}
      {/*            Description*/}
      {/*          </span>*/}
      {/*          <Textarea*/}
      {/*            value={movie.synopsis || ''}*/}
      {/*            onChange={(e) =>*/}
      {/*              handleChangeMovie(movie.id, 'synopsis', e.target.value)*/}
      {/*            }*/}
      {/*            placeholder="Short description of the movie"*/}
      {/*          />*/}
      {/*        </div>*/}

      {/*        <div className="md:col-span-2 flex justify-end">*/}
      {/*          <Button*/}
      {/*            variant="destructive"*/}
      {/*            size="sm"*/}
      {/*            onClick={() => handleDeleteMovie(movie.id)}*/}
      {/*          >*/}
      {/*            Delete Movie*/}
      {/*          </Button>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    ))}*/}

      {/*    {movies.length === 0 && (*/}
      {/*      <p className="text-sm text-muted-foreground">*/}
      {/*        No movies yet. Click &quot;Add Movie&quot; to create one.*/}
      {/*      </p>*/}
      {/*    )}*/}

      {/*    /!* Buttons at the bottom *!/*/}
      {/*    <div className="flex justify-end gap-2 pt-4 border-t mt-2">*/}
      {/*      <Button*/}
      {/*        size="sm"*/}
      {/*        variant="outline"*/}
      {/*        className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300"*/}
      {/*        onClick={handleAddMovie}*/}
      {/*      >*/}
      {/*        Add Movie*/}
      {/*      </Button>*/}
      {/*      <Button*/}
      {/*        size="sm"*/}
      {/*        className="bg-emerald-500 text-white hover:bg-emerald-600"*/}
      {/*        onClick={handleSaveMovies}*/}
      {/*      >*/}
      {/*        Save changes*/}
      {/*      </Button>*/}
      {/*    </div>*/}
      {/*  </CardContent>*/}
      {/*</Card>*/}


    </div>
  )
}
