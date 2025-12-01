import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '../components/ui/button'
import { Play, Star, Calendar } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel'
import { MovieCard } from '../components/MovieCard'
import { useState, useEffect } from 'react'
import { movieService } from '../services/movie'
import { Movie } from '../types/movie'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await movieService.getMovies()
      setMovies(data)
    }
    fetchMovies()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
        </div>

        <div className="container relative z-10 px-4 md:px-8 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            Experience the Magic of <span className="text-red-600">Cinema</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
            Immerse yourself in the latest blockbusters with state-of-the-art sound and visuals. Book your tickets now for an unforgettable experience.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white gap-2 transition-transform hover:scale-105"
              onClick={() => document.getElementById('now-showing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Play className="w-5 h-5 fill-current" /> Book Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white hover:text-black transition-all hover:scale-105"
              onClick={() => document.getElementById('now-showing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Schedule
            </Button>
          </div>
        </div>
      </section>




      {/* Now Showing Section */}
      <section id="now-showing" className="py-16 container px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight border-l-4 border-red-600 pl-4">Now Showing</h2>
          <Link to="/" className="text-primary hover:underline font-medium flex items-center gap-1">
            View All <Play className="w-3 h-3" />
          </Link>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {movies.map((movie, index) => (
              <CarouselItem key={movie.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                <MovieCard movie={movie} index={index} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      </section>
      {/* Coming Soon Section */}
      <section id="coming-soon" className="py-16 container px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight border-l-4 border-red-600 pl-4">Coming Soon</h2>
          <Link to="/" className="text-primary hover:underline font-medium flex items-center gap-1">
            View All <Play className="w-3 h-3" />
          </Link>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {movies.map((movie, index) => (
              <CarouselItem key={movie.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                <MovieCard movie={movie} index={index} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      </section>\
      {/* Top Rated Section */}
      <section id="coming-soon" className="py-16 container px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight border-l-4 border-red-600 pl-4">Top Rated</h2>
          <Link to="/" className="text-primary hover:underline font-medium flex items-center gap-1">
            View All <Play className="w-3 h-3" />
          </Link>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {movies.map((movie, index) => (
              <CarouselItem key={movie.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                <MovieCard movie={movie} index={index} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      </section>
      {/* Features Section */}
      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4 md:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight mb-4">The Ultimate Cinema Experience</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">We combine cutting-edge technology with premium comfort to bring you the best movie-going experience possible.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group p-8 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="w-14 h-14 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 fill-current" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">4K Laser Projection</h3>
                    <p className="text-muted-foreground leading-relaxed">Experience movies like never before with our state-of-the-art 4K laser projectors, delivering crystal clear images and vibrant colors.</p>
                </div>
                <div className="group p-8 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="w-14 h-14 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Star className="w-7 h-7 fill-current" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Dolby Atmos Sound</h3>
                    <p className="text-muted-foreground leading-relaxed">Immerse yourself in the action with Dolby Atmos sound technology that moves around you with breathtaking realism.</p>
                </div>
                <div className="group p-8 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="w-14 h-14 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Calendar className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Premium Comfort</h3>
                    <p className="text-muted-foreground leading-relaxed">Relax in our premium reclining seats with ample legroom, designed for maximum comfort during your movie experience.</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  )
}
