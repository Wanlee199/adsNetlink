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
    // No specific API for single booking by ID in docs yet (except maybe admin?), 
    // but usually it's useful. Let's assume /bookings/{id} or just use local for now if not needed.
    // Actually docs say /bookings/my-bookings returns list.
    // Let's try to find in local first or implement if needed.
    // For now, let's keep it simple and use local or generic get.
    try {
        // If we had an endpoint: return await httpClient.get<Booking>(`/bookings/${id}`);
        // But since we don't have it in docs explicitly as "Get Booking Details" for user (only list),
        // let's just use the list or mock.
        // Actually, let's just use the mock logic for now as it's safe.
        const bookings = bookingService.getLocalBookings();
        return bookings.find(b => b.id === id);
    } catch (error) {
        return undefined;
    }
  },
  
  getUserBookings: async (userId: number): Promise<Booking[]> => {
    try {
      return await httpClient.get<Booking[]>('/bookings/my-bookings');
    } catch (error) {
      console.warn('API getUserBookings failed, using mock:', error);
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
