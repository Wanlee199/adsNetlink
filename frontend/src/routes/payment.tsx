import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { userAtom } from '../store/auth'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { PaymentMethod } from '../types/booking'
import { bookingService } from '../services/booking'
import { CreditCard, Wallet, Building2, ArrowLeft, Check } from 'lucide-react'
import { cn } from '../lib/utils'
import { toast } from 'sonner'

export const Route = createFileRoute('/payment')({
  component: PaymentPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      showtimeId: Number(search.showtimeId),
      movieId: Number(search.movieId),
      movieTitle: String(search.movieTitle || ''),
      cinemaName: String(search.cinemaName || ''),
      date: String(search.date || ''),
      time: String(search.time || ''),
      seats: Array.isArray(search.seats) ? search.seats as string[] : [],
      totalPrice: Number(search.totalPrice || 0)
    }
  }
})

function PaymentPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const searchParams = Route.useSearch()
  const [user] = useAtom(userAtom)

  useEffect(() => {
    if (!user) {
      navigate({ 
        to: '/login', 
        search: { 
          redirect: '/payment' // Note: This might lose search params if not handled carefully, but for now simple redirect. 
          // Ideally we should preserve search params too, but payment page depends on them heavily.
          // If user is not logged in at payment page, it's weird because they should have come from booking page which checks auth.
          // So this is a fallback.
        } 
      })
    }
  }, [user, navigate])
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD)
  const [isProcessing, setIsProcessing] = useState(false)

  const paymentMethods = [
    { id: PaymentMethod.CREDIT_CARD, name: 'Credit Card', icon: CreditCard },
    { id: PaymentMethod.E_WALLET, name: 'E-Wallet', icon: Wallet },
    { id: PaymentMethod.BANK_TRANSFER, name: 'Bank Transfer', icon: Building2 }
  ]

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Create booking
    const booking = await bookingService.createBooking({
      movieId: searchParams.movieId,
      showtimeId: searchParams.showtimeId,
      cinemaName: searchParams.cinemaName,
      movieTitle: searchParams.movieTitle,
      date: searchParams.date,
      time: searchParams.time,
      seats: searchParams.seats,
      totalPrice: searchParams.totalPrice,
      status: 'confirmed'
    })

    toast.success('Payment successful!')
    
    // Navigate to success page
    navigate({ 
      to: '/booking-success/$bookingId', 
      params: { bookingId: booking.id }
    })
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container px-4 md:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Payment</h1>
          <p className="text-muted-foreground">Complete your booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePayment} className="space-y-6">
              {/* Payment Method Selection */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedMethod(method.id)}
                        className={cn(
                          'relative p-6 rounded-xl border-2 transition-all duration-200',
                          'flex flex-col items-center gap-3 hover:border-red-600',
                          selectedMethod === method.id
                            ? 'border-red-600 bg-red-50 dark:bg-red-950/20'
                            : 'border-border'
                        )}
                      >
                        {selectedMethod === method.id && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <Icon className={cn(
                          'w-8 h-8',
                          selectedMethod === method.id ? 'text-red-600' : 'text-muted-foreground'
                        )} />
                        <span className="font-medium text-sm">{method.name}</span>
                      </button>
                    )
                  })}
                </div>
              </Card>

              {/* Payment Details */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Payment Details</h2>
                
                {selectedMethod === PaymentMethod.CREDIT_CARD && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardHolder">Card Holder Name</Label>
                      <Input
                        id="cardHolder"
                        placeholder="JOHN DOE"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          maxLength={3}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === PaymentMethod.E_WALLET && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="0123456789"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        You will receive a payment request on your registered e-wallet app.
                      </p>
                    </div>
                  </div>
                )}

                {selectedMethod === PaymentMethod.BANK_TRANSFER && (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <p className="font-semibold">Bank Account Details:</p>
                      <p className="text-sm">Bank: PTIT Bank</p>
                      <p className="text-sm">Account: 1234567890</p>
                      <p className="text-sm">Account Name: PTIT Cinema</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Please complete the transfer and upload proof of payment.
                      </p>
                    </div>
                  </div>
                )}
              </Card>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-lg"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Pay ${searchParams.totalPrice.toLocaleString('vi-VN')} ₫`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Movie</p>
                  <p className="font-semibold">{searchParams.movieTitle}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Cinema</p>
                  <p className="font-medium">{searchParams.cinemaName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{searchParams.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{searchParams.time}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Seats</p>
                  <div className="flex flex-wrap gap-2">
                    {searchParams.seats.map(seat => (
                      <div
                        key={seat}
                        className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-sm font-medium"
                      >
                        {seat}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-red-600">
                      {searchParams.totalPrice.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {searchParams.seats.length} seat{searchParams.seats.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
