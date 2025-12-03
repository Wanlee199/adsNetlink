import { httpClient } from '../lib/http';
import { Booking } from '../types/booking';

const BOOKINGS_KEY = 'cinema_bookings';

export const bookingService = {
  createBooking: async (booking: Omit<Booking, 'id' | 'createdAt' | 'qrCode'>): Promise<Booking> => {
    try {
      return await httpClient.post<Booking>('/bookings', booking);
    } catch (error) {
      console.warn('API createBooking failed, using mock:', error);
      
      const id = `BK${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const createdAt = new Date().toISOString();
      const qrCode = `PTIT_CINEMA_${id}`; // Simple mock QR
      
      const newBooking: Booking = {
        ...booking,
        id,
        createdAt,
        qrCode,
        status: 'confirmed'
      };
      
      // Save to localStorage
      const bookings = bookingService.getLocalBookings();
      bookings.push(newBooking);
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
      
      return newBooking;
    }
  },
  
  getBookingById: async (id: string): Promise<Booking | undefined> => {
    try {
      // Since we don't have a specific GET /bookings/:id endpoint yet,
      // we'll fetch all user bookings and find the one we need.
      // This works because the user just created the booking, so it should be in their list.
      const bookings = await bookingService.getUserBookings();
      return bookings.find(b => b.id === id);
    } catch (error) {
      console.error('Error fetching booking by ID:', error);
      return undefined;
    }
  },
  
  getUserBookings: async (userId?: number): Promise<Booking[]> => {
    try {
      return await httpClient.get<Booking[]>('/bookings/my-bookings');
    } catch (error) {
      console.warn('API getUserBookings failed, using mock:', error);
      if (!userId) return [];
      return bookingService.getLocalBookings().filter(b => b.userId === userId);
    }
  },
  
  // Helper for mock data
  getLocalBookings(): Booking[] {
    try {
        const data = localStorage.getItem(BOOKINGS_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
  },

  getBookedSeats: async (showtimeId: number): Promise<string[]> => {
    try {
        // In a real app, this would be an API call like:
        // return await httpClient.get<string[]>(`/bookings/occupied-seats?showtimeId=${showtimeId}`);
        
        // Mock implementation using local storage
        const bookings = bookingService.getLocalBookings();
        const showtimeBookings = bookings.filter(b => Number(b.showtimeId) === showtimeId && b.status === 'confirmed');
        
        // Flatten all seats from all bookings for this showtime
        const occupiedSeats = showtimeBookings.flatMap(b => b.seats);
        return occupiedSeats;
    } catch (error) {
        console.error('Error fetching booked seats:', error);
        return [];
    }
  }
};
