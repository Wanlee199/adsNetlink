# PROJECT SPECIFICATION: SINGLE CINEMA MANAGEMENT SYSTEM

**Phiên bản:** 1.1 (Single Cinema - Pay at Counter)
**Mục tiêu:** Xây dựng hệ thống đặt vé xem phim online cho một rạp duy nhất.
**Trạng thái:** MVP (Minimum Viable Product).

---

## 1. TỔNG QUAN (OVERVIEW)

Hệ thống phục vụ cho một rạp chiếu phim duy nhất. Khách hàng xem lịch chiếu và đặt vé online.
**Cơ chế thanh toán:** Hệ thống mặc định phương thức **"Thanh toán tại quầy"**. Khách hàng đặt vé thành công sẽ nhận được mã vé, sau đó đến quầy thanh toán tiền mặt để nhận vé vào rạp.

### 1.1. Các Actor (Người dùng)
1.  **Guest (Khách vãng lai):** Xem phim, xem lịch, đăng ký/đăng nhập.
2.  **Customer (Khách thành viên):** Đặt vé (giữ chỗ), xem lịch sử đặt vé.
3.  **Manager (Quản lý):** Quản lý phim, phòng, suất chiếu, xem báo cáo.

---

## 2. DATABASE SCHEMA (ENTITY RELATIONSHIP)

| Entity | Mô tả & Các trường chính |
| :--- | :--- |
| **User** | `id`, `email`, `password` (hash), `full_name`, `phone`, `role` (ADMIN/CUSTOMER). |
| **Room** | `id`, `name` (VD: Phòng 1, Phòng IMAX), `total_seats`. |
| **Seat** | `id`, `room_id`, `row_name` (A,B..), `col_index` (1,2..), `type` (VIP/Normal). |
| **Movie** | `id`, `title`, `description`, `duration` (minutes), `release_date`, `poster_url`, `status` (SHOWING/COMING). // có thể nhiều field hơn |
| **Showtime** | `id`, `movie_id`, `room_id`, `start_time`, `end_time`, `price`. |
| **Booking** | `id`, `user_id`, `showtime_id`, `booking_time`, `total_price`, `qr_code`.<br>**Note:** Mặc định `payment_method` = "COUNTER". |
| **Ticket** | `id`, `booking_id`, `seat_id`. |

---

## 3. FUNCTIONAL REQUIREMENTS (CHI TIẾT CHỨC NĂNG)

### Module 1: Authentication (Xác thực)
* **AUTH-01:** Đăng ký/Đăng nhập/Phân quyền (Admin/Customer).

### Module 2: Quản lý Phòng & Phim (Dành cho Manager)
* **MOV-01:** CRUD Phim (Thêm/Sửa/Xóa phim).
* **ROM-01:** Quản lý danh sách Phòng chiếu (Tên phòng, số ghế).
* **ROM-02:** Thiết lập sơ đồ ghế cho phòng (Matrix hàng/cột).

### Module 3: Quản lý Lịch chiếu (Showtime)
* **SCH-01:** Tạo suất chiếu (Chọn Phim + Phòng + Thời gian).
* **SCH-02: Check trùng lịch.**
    * *Rule:* Không được xếp 2 suất chiếu chồng giờ nhau trong cùng 1 phòng.

### Module 4: Booking (Đặt vé - Pay at Counter)
Đây là luồng chính.

#### 4.1. Luồng nghiệp vụ
1.  **Search:** Khách chọn Phim -> Chọn Ngày -> Ra danh sách Suất chiếu. **.
2.  **Select Seat:**
    * Hiển thị Sơ đồ ghế.
    * Ghế đã bán/đã giữ: Disable.
    * Ghế trống: Cho phép chọn.
3.  **Confirm:**
    * Khách bấm "Đặt vé".
    * Hệ thống hiển thị Modal xác nhận: **"Bạn chọn thanh toán tại quầy. Vui lòng đến trước giờ chiếu 15 phút để lấy vé."**
    * Khách bấm "Đồng ý" -> Lưu Booking.
4.  **Result:**
    * Hiển thị Mã vé (QR Code) và trạng thái **"Chờ thanh toán"**.

#### 4.2. Validation
* **Race Condition:** Chặn trường hợp 2 người cùng chọn 1 ghế.

### Module 5: User Profile
* **USR-01:** Xem lịch sử. Các vé sẽ có trạng thái "Pay at Counter".

---

## 4. API SPECIFICATION (Gợi ý cho Dev)

### 4.1. Public APIs
* `GET /api/movies?search=...`: Lấy danh sách phim đang chiếu.
* `GET /api/showtimes?date=...`: Lấy lịch chiếu theo ngày.
* `GET /api/showtimes/{id}/seats`: Lấy sơ đồ ghế.

### 4.2. Protected APIs (Cần Token)
* `POST /api/bookings`: Đặt vé.
* `GET /api/my-bookings`: Lấy lịch sử vé.

### 4.3. Admin APIs
* `POST /api/movies`: Thêm phim.
* `POST /api/rooms`: Thêm phòng.
* `POST /api/showtimes`: Tạo lịch chiếu.

// api có thể nhiều hơn
---

## 5. UI/UX GUIDELINE

### Màn hình 1: Trang chủ
* List phim đang chiếu. Bấm vào phim -> Nhảy sang trang chi tiết & chọn suất luôn.

### Màn hình 2: Đặt vé (Booking Flow)
* **Bước 1: Chọn suất.** Chỉ cần filter theo Ngày.
* **Bước 2: Chọn ghế.**
    * Grid ghế.
    * Tổng tiền tạm tính.
* **Bước 3: Xác nhận.**
    * Button action: **"Đặt vé (Trả sau tại quầy)"**.

---


## 6. GHI CHÚ KỸ THUẬT

* **Format tiền tệ:** VNĐ (Ví dụ: 80.000 đ), có dấu chấm phân cách hàng nghìn.
* **Format ngày giờ:** `dd/MM/yyyy HH:mm`.