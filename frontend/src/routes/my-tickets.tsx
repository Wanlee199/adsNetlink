import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { bookingService } from '../services/booking'
import { Booking } from '../types/booking'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Calendar, Clock, MapPin, Ticket, QrCode, ChevronRight } from 'lucide-react'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { userAtom } from '../store/auth'

export const Route = createFileRoute('/my-tickets')({
  component: MyTickets,
})

type FilterType = 'all' | 'upcoming' | 'past'

function MyTickets() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [user] = useAtom(userAtom)
  const navigate = useNavigate()
  const [hydrated, setHydrated] = useState(false)

  // Wait for hydration
  useEffect(() => {
    setHydrated(true)
  }, [])

  // Auth check
  useEffect(() => {
    if (hydrated && !user) {
      navigate({ to: '/login', search: { redirect: '/my-tickets' } })
    }
  }, [hydrated, user, navigate])

  const { data: allBookings = [], isLoading } = useQuery({
    queryKey: ['my-bookings', user?.id],
    queryFn: () => bookingService.getUserBookings(user?.id || 0),
    enabled: !!user, // Only fetch if user exists
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null // Will redirect

  const now = new Date()
  
  // Calculate counts for each filter
  const upcomingCount = allBookings.filter(b => new Date(b.date) >= now).length
  const pastCount = allBookings.filter(b => new Date(b.date) < now).length
  
  const filteredBookings = allBookings.filter(booking => {
    const bookingDate = new Date(booking.date)
    
    if (filter === 'upcoming') {
      return bookingDate >= now
    } else if (filter === 'past') {
      return bookingDate < now
    }
    return true
  })

  const filters: { id: FilterType; label: string; count?: number }[] = [
    { id: 'all', label: 'All Tickets', count: allBookings.length },
    { id: 'upcoming', label: 'Upcoming', count: upcomingCount },
    { id: 'past', label: 'Past', count: pastCount }
  ]

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container px-4 md:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-bold mb-2">My Tickets</h1>
          <p className="text-muted-foreground">View and manage your movie bookings</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
          {filters.map(f => (
            <Button
              key={f.id}
              variant={filter === f.id ? 'default' : 'outline'}
              onClick={() => setFilter(f.id)}
              className={cn(
                'whitespace-nowrap gap-2',
                filter === f.id && 'bg-red-600 hover:bg-red-700 text-white'
              )}
            >
              {f.label}
              {f.count !== undefined && f.count > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                  {f.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Tickets List */}
        {filteredBookings.length === 0 ? (
          <Card className="p-12 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
              <Ticket className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No tickets found</h3>
            <p className="text-muted-foreground mb-6">
              {filter === 'upcoming' && "You don't have any upcoming bookings."}
              {filter === 'past' && "You don't have any past bookings."}
              {filter === 'all' && "You haven't booked any tickets yet."}
            </p>
            <Link to="/">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Browse Movies
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking, index) => (
              <div 
                key={booking.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <TicketCard booking={booking} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TicketCard({ booking }: { booking: Booking }) {
  const [showQR, setShowQR] = useState(false)
  const bookingDate = new Date(booking.date)
  const isPast = bookingDate < new Date()

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
      <div className="flex flex-col md:flex-row">
        {/* Left side - Status indicator */}
        <div className={cn(
          'w-full md:w-2 flex-shrink-0 transition-all duration-300',
          isPast ? 'bg-gray-400' : 'bg-gradient-to-b from-red-500 to-orange-500'
        )} />

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-2xl font-bold">{booking.movieTitle}</h3>
                <Badge 
                  variant={isPast ? 'secondary' : 'default'}
                  className={cn(
                    'ml-2',
                    !isPast && 'bg-green-100 dark:bg-green-900/20 text-green-600 border-green-600'
                  )}
                >
                  {isPast ? 'Past' : 'Upcoming'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-mono mb-4">
                Booking ID: {booking.id}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>{booking.cinemaName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-red-600" />
                  <span>{booking.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-red-600" />
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Ticket className="w-4 h-4 text-red-600" />
                  <span>{booking.seats.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
              <p className="text-2xl font-bold text-red-600">
                {booking.totalPrice.toLocaleString('vi-VN')} ₫
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {!isPast && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQR(!showQR)}
                className="gap-2 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-600 hover:text-red-600"
              >
                <QrCode className="w-4 h-4" />
                {showQR ? 'Hide' : 'Show'} QR Code
              </Button>
            )}
            <Link to="/booking-success/$bookingId" params={{ bookingId: booking.id }} className="ml-auto">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600"
              >
                View Details
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* QR Code */}
          {showQR && !isPast && (
            <div className="mt-4 pt-4 border-t animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex justify-center">
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-dashed">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-1">🎬</div>
                      <p className="text-[8px] font-mono text-muted-foreground">
                        {booking.qrCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
