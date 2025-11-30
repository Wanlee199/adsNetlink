package com.example.ptitcinema.service;

import com.example.ptitcinema.model.dto.SeatMapDto;
import java.util.Optional;

public interface ISeatService {
    Optional<SeatMapDto> getSeatMap(int roomId, int showtimeId); 
}