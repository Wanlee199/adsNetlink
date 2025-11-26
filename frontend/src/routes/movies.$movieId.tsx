import { createFileRoute, Link } from '@tanstack/react-router'
import { getMovieById, getShowtimesByMovieId } from '../data/movies'
import { Button } from '../components/ui/button'
import { Play, Star, Clock, Calendar, MapPin } from 'lucide-react'
import { Badge } from '../components/ui/badge'

export const Route = createFileRoute('/movies/$movieId')({
  component: MovieDetails,
})

function MovieDetails() {
  const { movieId } = Route.useParams()
  const movie = getMovieById(Number(movieId))
  const showtimes = getShowtimesByMovieId(Number(movieId))

  if (!movie) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Movie Not Found</h1>
        <p className="text-muted-foreground">The movie you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Backdrop */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-end">
        <div className="absolute inset-0 z-0">
          <img 
            src={movie.backdrop || movie.poster} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-background/20" />
        </div>
        
        <div className="container relative z-10 pb-12 px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            {/* Poster */}
            <div className="w-48 md:w-64 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl">
              <img 
                src={movie.poster} 
                alt={movie.title}
                className="w-full h-auto"
              />
            </div>
            
            {/* Movie Info */}
            <div className="flex-1 text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-semibold">{movie.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{movie.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{movie.releaseDate}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre.split(', ').map((g) => (
                  <Badge key={g} variant="secondary" className="text-sm">
                    {g}
                  </Badge>
                ))}
              </div>
              {movie.trailerUrl && (
                <Link to={Route.path} params={{ movieId }} hash="trailer">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white gap-2">
                  <Play className="w-5 h-5 fill-current" /> Watch Trailer
                </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 container px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {movie.synopsis}
              </p>
            </div>

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Cast</h2>
                <div className="flex flex-wrap gap-3">
                  {movie.cast.map((actor) => (
                    <Badge key={actor} variant="outline" className="text-base py-2 px-4">
                      {actor}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Director */}
            {movie.director && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Director</h2>
                <p className="text-muted-foreground text-lg">{movie.director}</p>
              </div>
            )}

            {/* Trailer */}
            {movie.trailerUrl && (
              <div id='trailer'>
                <h2 className="text-2xl font-bold mb-4">Trailer</h2>
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={movie.trailerUrl}
                    title={`${movie.title} Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Showtimes */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <h2 className="text-2xl font-bold mb-6">Showtimes</h2>
              
              {showtimes.length === 0 ? (
                <div className="text-center py-12 border rounded-xl">
                  <p className="text-muted-foreground">No showtimes available</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {showtimes.map((showtime) => (
                    <div key={showtime.id} className="border rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-3 mb-4">
                        <MapPin className="w-5 h-5 text-red-600 mt-1" />
                        <div>
                          <h3 className="font-bold text-lg">{showtime.cinema.name}</h3>
                          <p className="text-sm text-muted-foreground">{showtime.cinema.location}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">Available Times</p>
                        <div className="grid grid-cols-2 gap-2">
                          {showtime.times.map((time) => (
                            <Link 
                              key={time}
                              to="/booking/$showtimeId" 
                              params={{ showtimeId: String(showtime.id) }}
                            >
                              <Button 
                                variant="outline" 
                                className="w-full hover:bg-red-600 hover:text-white hover:border-red-600"
                              >
                                {time}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Price</span>
                          <span className="text-xl font-bold text-red-600">
                            {showtime.price.toLocaleString('vi-VN')} ₫
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
