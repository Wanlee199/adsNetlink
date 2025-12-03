package com.example.ptitcinema.service.impl;

import com.example.ptitcinema.model.Showtime;
import com.example.ptitcinema.model.Cinema;
import com.example.ptitcinema.model.dto.CinemaDto;
import com.example.ptitcinema.model.dto.ShowtimeDetailDto;
import com.example.ptitcinema.model.dto.ShowtimeDto;
import com.example.ptitcinema.model.dto.ShowtimeRequest;
import com.example.ptitcinema.repository.IMovieRepository;
import com.example.ptitcinema.repository.IShowtimeRepository;
import com.example.ptitcinema.service.IShowtimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Service
public class ShowtimeService implements IShowtimeService {
    private final IMovieRepository movieRepository;
    private final IShowtimeRepository showtimeRepository;
    private final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

    @Autowired
    public ShowtimeService(IShowtimeRepository showtimeRepository, IMovieRepository movieRepository) {
        this.showtimeRepository = showtimeRepository;
        this.movieRepository = movieRepository;
    }

    @Override
    public List<ShowtimeDto> getShowtimesByMovie(int movieId) {
        List<Showtime> allShowtimes = showtimeRepository.findShowtimesByMovieId(movieId);

        if (allShowtimes.isEmpty()) {
            return Collections.emptyList();
        }

        Map<String, List<Showtime>> groupedShowtimes = allShowtimes.stream()
                .collect(Collectors.groupingBy(
                        showtime -> showtime.getDate().toString() + "_" + 
                                    showtime.getRoomId() + "_" + 
                                    showtime.getPrice().toString()
                ));

        List<ShowtimeDto> result = new ArrayList<>();
        
        Map<Integer, CinemaDto> cinemaCache = new HashMap<>(); 

        for (List<Showtime> group : groupedShowtimes.values()) {
            Showtime firstShowtime = group.get(0);
            
            CinemaDto cinemaDto = cinemaCache.computeIfAbsent(firstShowtime.getRoomId(), roomId -> {
                Cinema cinema = showtimeRepository.findCinemaByRoomId(roomId);
                return cinema != null ? new CinemaDto(cinema) : null; 
            });

            if (cinemaDto == null) continue; 

            List<String> times = group.stream()
                    .map(st -> st.getTime().format(timeFormatter))
                    .collect(Collectors.toList());

            ShowtimeDto dto = new ShowtimeDto();
            dto.setId(firstShowtime.getId());
            dto.setMovieId(firstShowtime.getMovieId());
            dto.setCinemaId(cinemaDto.getId());
            dto.setCinema(cinemaDto);
            dto.setDate(firstShowtime.getDate());
            dto.setTimes(times);
            dto.setPrice(firstShowtime.getPrice());
            dto.setRoomId(firstShowtime.getRoomId());
            
            result.add(dto);
        }

        return result;
    }

    @Override
    public Optional<ShowtimeDetailDto> getShowtimeDetail(int showtimeId) {
        // 1. Lấy thông tin Showtime
        Optional<Showtime> showtimeOptional = showtimeRepository.findShowtimeById(showtimeId);
        
        if (showtimeOptional.isEmpty()) {
            return Optional.empty();
        }

        Showtime showtime = showtimeOptional.get();
        
        // 2. Lấy thông tin Cinema (Rạp chiếu) dựa trên RoomId
        Cinema cinema = showtimeRepository.findCinemaByRoomId(showtime.getRoomId());
        
        // 3. Chuyển đổi sang DTO chi tiết
        ShowtimeDetailDto dto = new ShowtimeDetailDto(showtime, cinema);
        
        return Optional.of(dto);
    }

    @Transactional
    @Override
    public List<Integer> createShowtimes(ShowtimeRequest request) {
        
        // 1. Validation cơ bản: Kiểm tra tồn tại Movie và Room
        if (movieRepository.findById(request.getMovieId()).isEmpty()) {
            return List.of(); // Movie không tồn tại
        }
        if (!showtimeRepository.checkRoomExists(request.getRoomId())) {
            return List.of(); // Room không tồn tại
        }

        LocalDate date;
        try {
            date = LocalDate.parse(request.getDate());
        } catch (DateTimeParseException e) {
            return List.of(); // Định dạng ngày không hợp lệ
        }

        List<Integer> createdIds = new ArrayList<>();
        
        // 2. Lặp qua danh sách giờ chiếu và lưu từng suất chiếu
        for (String timeStr : request.getTimes()) {
            try {
                LocalTime time = LocalTime.parse(timeStr, timeFormatter);
                
                int newId = showtimeRepository.saveShowtime(
                    request.getMovieId(),
                    request.getRoomId(),
                    date,
                    time,
                    request.getPrice()
                );

                if (newId > 0) {
                    createdIds.add(newId);
                }
            } catch (DateTimeParseException e) {
                // Bỏ qua giờ chiếu không hợp lệ và tiếp tục
            }
        }
        
        // Trả về danh sách ID của các suất chiếu đã tạo
        return createdIds; 
    }

    @Transactional
    @Override
    public boolean updateShowtime(int id, ShowtimeRequest request) {
        // 1. Kiểm tra tồn tại Showtime
        Optional<Showtime> showtimeOptional = showtimeRepository.findShowtimeById(id);
        if (showtimeOptional.isEmpty()) {
            return false;
        }
        Showtime showtime = showtimeOptional.get();

        // 2. Validation
        if (movieRepository.findById(request.getMovieId()).isEmpty()) {
            return false; // Movie không tồn tại
        }
        if (!showtimeRepository.checkRoomExists(request.getRoomId())) {
            return false; // Room không tồn tại
        }

        try {
            LocalDate date = LocalDate.parse(request.getDate());
            // Lấy giờ đầu tiên trong danh sách (vì update thường chỉ update 1 suất chiếu cụ thể)
            if (request.getTimes() == null || request.getTimes().isEmpty()) {
                return false;
            }
            LocalTime time = LocalTime.parse(request.getTimes().get(0), timeFormatter);

            // 3. Cập nhật thông tin
            showtime.setMovieId(request.getMovieId());
            showtime.setRoomId(request.getRoomId());
            showtime.setDate(date);
            showtime.setTime(time);
            showtime.setPrice(request.getPrice());

            // 4. Lưu xuống DB
            showtimeRepository.updateShowtime(showtime);
            return true;

        } catch (DateTimeParseException e) {
            return false;
        }
    }

    @Transactional
    @Override
    public boolean deleteShowtime(int id) {
        // 1. Kiểm tra tồn tại
        if (showtimeRepository.findShowtimeById(id).isEmpty()) {
            return false; // Không tìm thấy
        }

        // 2. Xóa các bản ghi phụ thuộc theo thứ tự:
        // a. Xóa BookingDetails
        showtimeRepository.deleteBookingDetailsByShowtimeId(id);
        
        // b. Xóa Booking
        showtimeRepository.deleteBookingsByShowtimeId(id);

        // c. Xóa Showtime chính
        showtimeRepository.deleteShowtimeById(id);
        
        // Kiểm tra lại sau khi xóa
        return showtimeRepository.findShowtimeById(id).isEmpty();
    }
}