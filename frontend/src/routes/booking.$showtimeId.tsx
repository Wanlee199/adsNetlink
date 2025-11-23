import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { userAtom } from '../store/auth'
import { getShowtimeById, getMovieById } from '../data/movies'
import { getSeatMapByRoomId } from '../data/seats'
import { Seat, SeatStatus, SeatType } from '../types/movie'
import { Button } from '../components/ui/button'
import { ArrowLeft, Check } from 'lucide-react'
import { cn } from '../lib/utils'

export const Route = createFileRoute('/booking/$showtimeId')({
  component: SeatSelection,
})

function SeatSelection() {
  const { showtimeId } = Route.useParams()
  const navigate = useNavigate()
  const [user] = useAtom(userAtom)
  
  useEffect(() => {
    if (!user) {
      navigate({ 
        to: '/login', 
        search: { 
          redirect: `/booking/${showtimeId}` 
        } 
      })
    }
  }, [user, navigate, showtimeId])

  const showtime = getShowtimeById(Number(showtimeId))
  const movie = showtime ? getMovieById(showtime.movieId) : undefined
  const seatMap = showtime?.roomId ? getSeatMapByRoomId(showtime.roomId) : undefined

  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set())

  if (!showtime || !movie || !seatMap) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Booking Not Found</h1>
        <p className="text-muted-foreground">The showtime you're looking for doesn't exist.</p>
      </div>
    )
  }

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === SeatStatus.OCCUPIED) return

    const newSelected = new Set(selectedSeats)
    if (newSelected.has(seat.id)) {
      newSelected.delete(seat.id)
    } else {
      // Limit to 8 seats max
      if (newSelected.size >= 8) {
        return
      }
      newSelected.add(seat.id)
    }
    setSelectedSeats(newSelected)
  }

  const getSeatClassName = (seat: Seat) => {
    const isSelected = selectedSeats.has(seat.id)
    const baseClasses = 'relative w-9 h-10 md:w-11 md:h-12 rounded-t-xl cursor-pointer transition-all duration-300 flex items-center justify-center text-[10px] md:text-xs font-semibold border-2'
    
    if (seat.status === SeatStatus.OCCUPIED) {
      return cn(baseClasses, 'bg-gray-300 dark:bg-gray-700 border-gray-400 dark:border-gray-600 cursor-not-allowed opacity-40 text-gray-500')
    }
    
    if (isSelected) {
      return cn(baseClasses, 'bg-red-600 border-red-700 text-white scale-110 shadow-xl shadow-red-500/50 ring-2 ring-red-400')
    }
    
    switch (seat.type) {
      case SeatType.VIP:
        return cn(baseClasses, 'bg-gradient-to-b from-amber-400 to-amber-500 border-amber-600 hover:from-amber-500 hover:to-amber-600 text-white hover:scale-105 hover:shadow-lg')
      case SeatType.COUPLE:
        return cn(baseClasses, 'bg-gradient-to-b from-pink-400 to-pink-500 border-pink-600 hover:from-pink-500 hover:to-pink-600 text-white hover:scale-105 hover:shadow-lg')
      default:
        return cn(baseClasses, 'bg-gradient-to-b from-blue-400 to-blue-500 border-blue-600 hover:from-blue-500 hover:to-blue-600 text-white hover:scale-105 hover:shadow-lg')
    }
  }

  const selectedSeatObjects = seatMap.seats.filter(seat => selectedSeats.has(seat.id))
  const totalPrice = selectedSeatObjects.reduce((sum, seat) => sum + seat.price, 0)

  // Group seats by row for display
  const seatsByRow: Record<string, Seat[]> = {}
  seatMap.seats.forEach(seat => {
    if (!seatsByRow[seat.row]) {
      seatsByRow[seat.row] = []
    }
    seatsByRow[seat.row].push(seat)
  })

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container px-4 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/movies/$movieId', params: { movieId: String(movie.id) } })}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Movie
          </Button>
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="text-muted-foreground">
            {showtime.cinema.name} • {showtime.date} • Room {showtime.roomId}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-3">
            {/* Screen */}
            <div className="mb-16">
              <div className="w-full max-w-4xl mx-auto perspective-1000">
                <div className="relative">
                  <div className="h-3 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 dark:from-gray-600 dark:via-gray-700 dark:to-gray-800 rounded-b-3xl shadow-2xl transform -rotate-x-12" 
                       style={{ transformStyle: 'preserve-3d' }} />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-b-3xl" />
                </div>
                <p className="text-center text-sm font-semibold text-muted-foreground mt-4 tracking-wider">SCREEN</p>
              </div>
            </div>

            {/* Seats */}
            <div className="max-w-4xl mx-auto">
              <div className="space-y-2 md:space-y-3">
                {Object.entries(seatsByRow).map(([row, seats]) => (
                  <div key={row} className="flex items-center justify-center gap-1 md:gap-2">
                    <span className="w-8 text-center font-bold text-sm text-muted-foreground">{row}</span>
                    <div className="flex gap-1 md:gap-2">
                      {seats.map((seat, index) => (
                        <div key={seat.id} className="flex">
                          {/* Add gap in the middle for aisle */}
                          {index === Math.floor(seats.length / 2) && (
                            <div className="w-6 md:w-10" />
                          )}
                          <button
                            onClick={() => handleSeatClick(seat)}
                            className={getSeatClassName(seat)}
                            disabled={seat.status === SeatStatus.OCCUPIED}
                            title={`${seat.id} - ${seat.type} - ${seat.price.toLocaleString('vi-VN')}₫`}
                          >
                            {selectedSeats.has(seat.id) ? (
                              <Check className="w-4 h-4 md:w-5 md:h-5" />
                            ) : (
                              <span className="opacity-70">{seat.number}</span>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                    <span className="w-8 text-center font-bold text-sm text-muted-foreground">{row}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-16 p-6 bg-muted/30 rounded-xl">
              <p className="text-sm font-semibold mb-4 text-center">Seat Types</p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-10 rounded-t-xl bg-gradient-to-b from-blue-400 to-blue-500 border-2 border-blue-600 shadow-md" />
                  <span className="text-sm font-medium">Standard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-10 rounded-t-xl bg-gradient-to-b from-amber-400 to-amber-500 border-2 border-amber-600 shadow-md" />
                  <span className="text-sm font-medium">VIP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-10 rounded-t-xl bg-gradient-to-b from-pink-400 to-pink-500 border-2 border-pink-600 shadow-md" />
                  <span className="text-sm font-medium">Couple</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-10 rounded-t-xl bg-red-600 border-2 border-red-700 shadow-md" />
                  <span className="text-sm font-medium">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-10 rounded-t-xl bg-gray-300 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-600 opacity-40" />
                  <span className="text-sm font-medium">Occupied</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 border rounded-xl p-6 bg-card">
              <h2 className="text-xl font-bold mb-6">Booking Summary</h2>
              
              {selectedSeats.size === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Select your seats to continue
                </p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Selected Seats</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSeatObjects.map(seat => (
                          <div
                            key={seat.id}
                            className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-sm font-medium"
                          >
                            {seat.id}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      {selectedSeatObjects.map(seat => (
                        <div key={seat.id} className="flex justify-between text-sm">
                          <span>{seat.id} ({seat.type})</span>
                          <span>{seat.price.toLocaleString('vi-VN')} ₫</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Total</span>
                        <span className="text-2xl font-bold text-red-600">
                          {totalPrice.toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {selectedSeats.size} seat{selectedSeats.size > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/payment"
                    search={{
                      showtimeId: showtime.id,
                      movieId: movie.id,
                      movieTitle: movie.title,
                      cinemaName: showtime.cinema.name,
                      date: showtime.date,
                      time: '10:00', // In real app, this would be selected time
                      seats: Array.from(selectedSeats),
                      totalPrice
                    }}
                    className="block"
                  >
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      size="lg"
                    >
                      Continue to Payment
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
