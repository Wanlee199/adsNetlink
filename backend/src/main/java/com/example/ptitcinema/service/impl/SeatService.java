package com.example.ptitcinema.service.impl;

import com.example.ptitcinema.model.dto.SeatDto;
import com.example.ptitcinema.model.dto.SeatMapDto;
import com.example.ptitcinema.repository.ISeatRepository;
import com.example.ptitcinema.service.ISeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SeatService implements ISeatService {
    private final ISeatRepository seatRepository;

    @Autowired
    public SeatService(ISeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    @Override
    public Optional<SeatMapDto> getSeatMap(int roomId, int showtimeId) {
        // 1. Lấy thông tin cơ bản về phòng và giá
        int rows = seatRepository.getDefaultRows(roomId);
        int seatsPerRow = seatRepository.getDefaultSeatsPerRow(roomId);
        BigDecimal basePrice = seatRepository.findPriceByShowtimeId(showtimeId);
        
        if (basePrice.compareTo(BigDecimal.ZERO) == 0) {
            // Không tìm thấy suất chiếu hoặc giá, không thể tạo sơ đồ ghế
            return Optional.empty(); 
        }

        // 2. Lấy danh sách ghế đã đặt
        List<String> bookedSeats = seatRepository.findBookedSeats(showtimeId);
        Set<String> bookedSeatIds = new HashSet<>(bookedSeats);

        // 3. Tạo sơ đồ ghế hoàn chỉnh
        List<SeatDto> seatList = new ArrayList<>();
        char rowChar = 'A';

        for (int r = 0; r < rows; r++) {
            String rowName = String.valueOf((char) (rowChar + r));
            for (int n = 1; n <= seatsPerRow; n++) {
                String seatId = rowName + n;
                
                // Xác định trạng thái
                String status = bookedSeatIds.contains(seatId) ? "booked" : "available";
                
                // Giả định loại ghế và logic giá (vd: hàng cuối là VIP)
                String type = "standard";
                BigDecimal finalPrice = basePrice;
                
                if (rowName.equals("H")) { // Ví dụ: Hàng H là VIP
                    type = "vip";
                    finalPrice = basePrice.add(new BigDecimal("20000")); // Thêm 20k cho ghế VIP
                }

                SeatDto seat = new SeatDto(
                    seatId,
                    rowName,
                    n,
                    type,
                    status,
                    finalPrice
                );
                seatList.add(seat);
            }
        }

        // 4. Tạo DTO sơ đồ ghế
        SeatMapDto seatMap = new SeatMapDto();
        seatMap.setRoomId(roomId);
        seatMap.setRows(rows);
        seatMap.setSeatsPerRow(seatsPerRow);
        seatMap.setSeats(seatList);

        return Optional.of(seatMap);
    }
}