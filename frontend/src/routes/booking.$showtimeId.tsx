import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { userAtom } from '../store/auth'
import { movieService } from '../services/movie'
import { bookingService } from '../services/booking'
import { Movie, Showtime } from '../types/movie'
import { Button } from '../components/ui/button'
import { ArrowLeft, Check } from 'lucide-react'
import { cn } from '../lib/utils'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const Route = createFileRoute('/booking/$showtimeId')({
  component: SeatSelection,
})

function SeatSelection() {
  const { showtimeId } = Route.useParams()
  const navigate = useNavigate()
  const [user] = useAtom(userAtom)
  const [hydrated, setHydrated] = useState(false)
  
  // Wait for atoms to hydrate from localStorage
  useEffect(() => {
    setHydrated(true)
  }, [])
  
  // Only check auth after hydration
  useEffect(() => {
    if (hydrated && !user) {
      navigate({ 
        to: '/login', 
        search: { 
          redirect: `/booking/${showtimeId}` 
        } 
      })
    }
  }, [hydrated, user, navigate, showtimeId])

  const [showtime, setShowtime] = useState<Showtime | undefined>(undefined)
  const [movie, setMovie] = useState<Movie | undefined>(undefined)
  const [bookedSeats, setBookedSeats] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  // Generate static seat map (10 rows A-J, 10 seats 1-10)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  const seatsPerRow = 10

  useEffect(() => {
    const fetchData = async () => {
      try {
        const s = await movieService.getShowtimeById(Number(showtimeId))
        setShowtime(s)
        if (s) {
          const m = await movieService.getMovieById(s.movieId)
          setMovie(m)
          
          // Fetch booked seats
          const booked = await bookingService.getBookedSeats(s.id)
          setBookedSeats(new Set(booked))
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [showtimeId])

  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set())

  // Booking mutation
  const createBookingMutation = useMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: (booking) => {
      toast.success('Đặt vé thành công!')
      navigate({ 
        to: '/booking-success/$bookingId', 
        params: { bookingId: booking.id } 
      })
    },
    onError: (error: any) => {
      toast.error('Đặt vé thất bại: ' + (error.message || 'Vui lòng thử lại'))
    }
  })

  const handleConfirmBooking = () => {
    if (!showtime || !movie || !user) return

    if (selectedSeats.size === 0) {
      toast.error('Vui lòng chọn ghế')
      return
    }

    // Confirm before booking
    if (!window.confirm(`Xác nhận đặt ${selectedSeats.size} ghế với tổng tiền ${totalPrice.toLocaleString('vi-VN')} VNĐ?`)) {
      return
    }

    createBookingMutation.mutate({
      userId: user.id,
      movieId: movie.id,
      showtimeId: showtime.id,
      cinemaName: showtime.cinema?.name || 'PTIT Cinema',
      movieTitle: movie.title,
      date: showtime.date,
      time: showtime.times?.[0] || '10:00', // Safe access with optional chaining
      seats: Array.from(selectedSeats),
      totalPrice: totalPrice,
      status: 'confirmed'
    })
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!showtime || !movie) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Booking Not Found</h1>
        <p className="text-muted-foreground">The showtime you're looking for doesn't exist.</p>
      </div>
    )
  }

  const handleSeatClick = (seatId: string) => {
    if (bookedSeats.has(seatId)) return

    const newSelected = new Set(selectedSeats)
    if (newSelected.has(seatId)) {
      newSelected.delete(seatId)
    } else {
      // Limit to 8 seats max
      if (newSelected.size >= 8) {
        return
      }
      newSelected.add(seatId)
    }
    setSelectedSeats(newSelected)
  }

  const getSeatClassName = (seatId: string) => {
    const isSelected = selectedSeats.has(seatId)
    const isBooked = bookedSeats.has(seatId)
    const baseClasses = 'relative w-9 h-10 md:w-11 md:h-12 rounded-t-xl cursor-pointer transition-all duration-300 flex items-center justify-center text-[10px] md:text-xs font-semibold border-2'
    
    if (isBooked) {
      return cn(baseClasses, 'bg-gray-300 dark:bg-gray-700 border-gray-400 dark:border-gray-600 cursor-not-allowed opacity-40 text-gray-500')
    }
    
    if (isSelected) {
      return cn(baseClasses, 'bg-red-600 border-red-700 text-white scale-110 shadow-xl shadow-red-500/50 ring-2 ring-red-400')
    }
    
    // Standard available seat
    return cn(baseClasses, 'bg-gradient-to-b from-blue-400 to-blue-500 border-blue-600 hover:from-blue-500 hover:to-blue-600 text-white hover:scale-105 hover:shadow-lg')
  }

  const selectedSeatCount = selectedSeats.size
  const totalPrice = selectedSeatCount * showtime.price

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
                {rows.map((row) => (
                  <div key={row} className="flex items-center justify-center gap-1 md:gap-2">
                    <span className="w-8 text-center font-bold text-sm text-muted-foreground">{row}</span>
                    <div className="flex gap-1 md:gap-2">
                      {Array.from({ length: seatsPerRow }, (_, i) => i + 1).map((num, index) => {
                        const seatId = `${row}${num}`
                        const isBooked = bookedSeats.has(seatId)
                        return (
                          <div key={seatId} className="flex">
                            {/* Add gap in the middle for aisle */}
                            {index === seatsPerRow / 2 && (
                              <div className="w-6 md:w-10" />
                            )}
                            <button
                              onClick={() => handleSeatClick(seatId)}
                              className={getSeatClassName(seatId)}
                              disabled={isBooked}
                              title={`${seatId} - ${showtime.price.toLocaleString('vi-VN')}₫`}
                            >
                              {selectedSeats.has(seatId) ? (
                                <Check className="w-4 h-4 md:w-5 md:h-5" />
                              ) : (
                                <span className="opacity-70">{num}</span>
                              )}
                            </button>
                          </div>
                        )
                      })}
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
                  <span className="text-sm font-medium">Available</span>
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
                        {Array.from(selectedSeats).sort().map(seatId => (
                          <div
                            key={seatId}
                            className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-sm font-medium"
                          >
                            {seatId}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      {Array.from(selectedSeats).sort().map(seatId => (
                        <div key={seatId} className="flex justify-between text-sm">
                          <span>{seatId}</span>
                          <span>{showtime.price.toLocaleString('vi-VN')} ₫</span>
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

                  <Button 
                    onClick={handleConfirmBooking}
                    disabled={createBookingMutation.isPending}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    size="lg"
                  >
                    {createBookingMutation.isPending ? 'Đang xử lý...' : 'Xác nhận đặt vé'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
