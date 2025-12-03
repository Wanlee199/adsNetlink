import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { movieService } from '@/services/movie';
import { format, parseISO, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Showtime } from '@/types/movie';

interface MovieShowtimesProps {
  movieId: number;
}

export function MovieShowtimes({ movieId }: MovieShowtimesProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');

  const { data: showtimes, isLoading } = useQuery({
    queryKey: ['showtimes', movieId],
    queryFn: () => movieService.getShowtimes(movieId),
  });

  const { data: cinemas } = useQuery({
    queryKey: ['cinemas'],
    queryFn: () => movieService.getCinemas(),
  });

  // Get unique dates and sort them
  const availableDates = showtimes 
    ? [...new Set(showtimes.map(st => st.date))].sort()
    : [];

  // Set initial selected date when data loads
  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!showtimes || showtimes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Chưa có lịch chiếu</p>
      </div>
    );
  }

  // Get the single cinema
  const cinema = cinemas?.[0];

  // Filter showtimes by selected date
  const selectedShowtimes = showtimes.filter(st => st.date === selectedDate);

  // Group by room
  const showtimesByRoom = selectedShowtimes.reduce((acc, st) => {
    const roomKey = st.roomId || 'default';
    if (!acc[roomKey]) acc[roomKey] = [];
    acc[roomKey].push(st);
    return acc;
  }, {} as Record<string | number, Showtime[]>);

  return (
    <div className="space-y-6">
      {/* Cinema Info - Static Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🎬</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">
              {cinema?.name || 'PTIT Cinema'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <span>📍</span>
              {cinema?.location || '96 Định Công, Hoàng Mai, Hà Nội'}
            </p>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Chọn ngày chiếu</h4>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {availableDates.map(date => {
            try {
              const dateObj = parseISO(date);
              if (!isValid(dateObj)) return null;
              
              const isSelected = date === selectedDate;
              const isToday = format(new Date(), 'yyyy-MM-dd') === date;
              
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    flex flex-col items-center min-w-[90px] p-4 rounded-xl border-2 transition-all
                    ${isSelected 
                      ? 'border-primary bg-primary text-primary-foreground shadow-lg scale-105' 
                      : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                    }
                  `}
                >
                  <span className="text-xs uppercase font-medium opacity-80">
                    {format(dateObj, 'EEE', { locale: vi })}
                  </span>
                  <span className="text-3xl font-bold my-1">
                    {format(dateObj, 'd')}
                  </span>
                  <span className="text-xs opacity-80">
                    Tháng {format(dateObj, 'M')}
                  </span>
                  {isToday && (
                    <span className="text-xs mt-1 px-2 py-0.5 bg-primary/20 rounded-full">
                      Hôm nay
                    </span>
                  )}
                </button>
              );
            } catch (error) {
              console.error('Invalid date:', date, error);
              return null;
            }
          })}
        </div>
      </div>

      {/* Showtimes */}
      <div>
        {selectedDate && (() => {
          try {
            const dateObj = parseISO(selectedDate);
            if (!isValid(dateObj)) return null;
            
            return (
              <>
                <h4 className="text-lg font-semibold mb-4">
                  Giờ chiếu - {format(dateObj, 'dd/MM/yyyy')}
                </h4>
                
                {selectedShowtimes.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Không có suất chiếu cho ngày này
                  </p>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(showtimesByRoom).map(([roomKey, roomShowtimes]) => (
                      <div key={roomKey} className="space-y-3">
                        {/* Room Label */}
                        {roomKey !== 'default' && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            <span className="font-medium">Phòng {roomKey}</span>
                          </div>
                        )}
                        
                        {/* Time Slots */}
                        {roomShowtimes.map(showtime => (
                          <div key={showtime.id} className="space-y-3">
                            <div className="flex flex-wrap gap-3">
                              {showtime.times.map(time => (
                                <button
                                  key={time}
                                  onClick={() => handleBooking(showtime.id, time)}
                                  className="
                                    group relative px-8 py-4 rounded-lg 
                                    border-2 border-primary 
                                    hover:bg-primary hover:text-primary-foreground 
                                    transition-all duration-200
                                    font-semibold text-lg
                                    hover:shadow-lg hover:scale-105
                                    active:scale-95
                                  "
                                >
                                  <span className="relative z-10">{time}</span>
                                  <div className="
                                    absolute inset-0 rounded-lg 
                                    bg-gradient-to-r from-primary/0 to-primary/0
                                    group-hover:from-primary/10 group-hover:to-primary/5
                                    transition-all duration-200
                                  "></div>
                                </button>
                              ))}
                            </div>
                            
                            {/* Price Info */}
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">Giá vé:</span>
                              <span className="font-bold text-primary text-base">
                                {showtime.price.toLocaleString('vi-VN')} VNĐ
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </>
            );
          } catch (error) {
            console.error('Error rendering showtimes:', error);
            return (
              <p className="text-center text-muted-foreground py-8">
                Có lỗi xảy ra khi hiển thị lịch chiếu
              </p>
            );
          }
        })()}
      </div>

      {/* Info Footer */}
      <div className="bg-secondary/30 rounded-lg p-4 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <span>ℹ️</span>
          <span>Vui lòng đến trước giờ chiếu 15 phút để làm thủ tục</span>
        </p>
      </div>
    </div>
  );
}

function handleBooking(showtimeId: number, time: string) {
  // Navigate to booking page with showtime and time
  const url = `/booking/${showtimeId}?time=${encodeURIComponent(time)}`;
  window.location.href = url;
}
