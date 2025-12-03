import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { movieService } from '../services/movie'
import { Movie } from '../types/movie'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { MovieCard } from '../components/MovieCard'

export const Route = createFileRoute('/search')({
  component: SearchResults,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      q: String(search.q || '')
    }
  }
})

function SearchResults() {
  const { q } = Route.useSearch()
  const [searchResults, setSearchResults] = useState<Movie[]>([])

  useEffect(() => {
    const fetchMovies = async () => {
      if (!q.trim()) {
        setSearchResults([])
        return
      }
      const results = await movieService.searchMovies(q)
      setSearchResults(results)
    }
    fetchMovies()
  }, [q])

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container px-4 md:px-8">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-bold mb-2">
            Search Results
            {q && <span className="text-muted-foreground"> for "{q}"</span>}
          </h1>
          <p className="text-muted-foreground">
            {searchResults.length} {searchResults.length === 1 ? 'movie' : 'movies'} found
          </p>
        </div>

        {/* Results */}
        {searchResults.length === 0 ? (
          <Card className="p-12 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No movies found</h3>
            <p className="text-muted-foreground mb-6">
              Try searching with different keywords or browse all movies
            </p>
            <Link to="/">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Browse All Movies
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
