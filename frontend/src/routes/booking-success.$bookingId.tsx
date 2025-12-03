import { createFileRoute, Link } from '@tanstack/react-router'
import { bookingService } from '../services/booking'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { CheckCircle2, Download, Home, Calendar, MapPin, Clock, Ticket } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/booking-success/$bookingId')({
  component: BookingSuccess,
})

function BookingSuccess() {
  const { bookingId } = Route.useParams()
  
  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingService.getBookingById(bookingId),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Booking Not Found</h1>
        <p className="text-muted-foreground mb-8">The booking you're looking for doesn't exist.</p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container px-4 md:px-8 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Booking Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Your tickets have been successfully booked
          </p>
        </div>

        {/* Booking Details Card */}
        <Card className="p-8 mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
          <div className="flex items-center justify-between mb-6 pb-6 border-b">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
              <p className="text-2xl font-bold font-mono">{booking.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/20 text-green-600">
                {booking.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Movie Info */}
            <div>
              <h2 className="text-2xl font-bold mb-4">{booking.movieTitle}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Cinema</p>
                    <p className="font-medium">{booking.cinemaName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{booking.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{booking.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Ticket className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Seats</p>
                    <p className="font-medium">{booking.seats.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-4 text-center">Scan this QR code at the cinema</p>
              <div className="flex justify-center">
                <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">🎬</div>
                      <p className="text-xs font-mono text-muted-foreground">{booking.qrCode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="pt-6 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Paid</span>
                <span className="text-3xl font-bold text-red-600">
                  {booking.totalPrice.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Button
            variant="outline"
            className="flex-1 h-12"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Ticket
          </Button>
          <Link to="/" className="flex-1">
            <Button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Info Message */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg animate-in fade-in duration-700 delay-500">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Important:</strong> Please arrive at least 15 minutes before the showtime. 
            Show this QR code or booking ID at the entrance to collect your tickets.
          </p>
        </div>
      </div>
    </div>
  )
}
