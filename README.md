# PTIT Cinema Webapp

## 1. Tổng quan (Overview)

**Phiên bản:** 1.1 (Single Cinema - Pay at Counter)
**Mục tiêu:** Xây dựng hệ thống đặt vé xem phim online cho một rạp duy nhất.
**Trạng thái:** MVP (Minimum Viable Product).

Hệ thống phục vụ cho một rạp chiếu phim duy nhất. Khách hàng xem lịch chiếu và đặt vé online.
**Cơ chế thanh toán:** Hệ thống mặc định phương thức **"Thanh toán tại quầy"**. Khách hàng đặt vé thành công sẽ nhận được mã vé, sau đó đến quầy thanh toán tiền mặt để nhận vé vào rạp.

---

## 2. Yêu cầu hệ thống (Prerequisites)

*   **Java Development Kit (JDK):** 17 hoặc mới hơn.
*   **Node.js:** 18 hoặc mới hơn.
*   **SQL Server:** 2019 hoặc mới hơn (Express hoặc Developer edition).
*   **Maven:** (Optional, dự án có sẵn `mvnw`).

---

## 3. Cài đặt & Chạy (Installation & Run)

### Bước 1: Cài đặt Database (SQL Server)

1.  Mở **SQL Server Management Studio (SSMS)**.
2.  Kết nối vào Server (thường là `localhost` hoặc `localhost\SQLEXPRESS`).
3.  Mở file script tạo database: `db/PTIT-Cinema-Initial_Scripts.sql`.
4.  Chạy script (**Execute** hoặc **F5**) để tạo database `PTIT_Cinema` và các bảng.
5.  (Tùy chọn) Mở và chạy file `db/sample-data.sql` để thêm dữ liệu mẫu (phim, lịch chiếu, user).

### Bước 2: Cấu hình Backend (Spring Boot)

1.  Mở file `backend/src/main/resources/application.properties`.
2.  Kiểm tra cấu hình kết nối Database.
    *   Nếu dùng **Windows Authentication** (mặc định):
        ```properties
        spring.datasource.url=jdbc:sqlserver://localhost;databaseName=PTIT_Cinema;encrypt=true;trustServerCertificate=true;integratedSecurity=true
        # spring.datasource.username=sa
        # spring.datasource.password=your_password
        ```
    *   Nếu dùng **SQL Server Authentication** (sa):
        ```properties
        spring.datasource.url=jdbc:sqlserver://localhost;databaseName=PTIT_Cinema;encrypt=true;trustServerCertificate=true
        spring.datasource.username=sa
        spring.datasource.password=your_password
        ```

### Bước 3: Chạy Backend

Mở terminal tại thư mục `backend`:

```bash
# Windows
./mvnw spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080` (hoặc port được cấu hình).
Swagger UI: `http://localhost:8080/swagger-ui.html`

### Bước 4: Chạy Frontend (React/Vite)

Mở terminal mới tại thư mục `frontend`:

```bash
# Cài đặt dependencies
npm install
# hoặc
pnpm install

# Chạy development server
npm run dev
# hoặc
pnpm dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

## 4. Tài khoản Test (Test Accounts)

Nếu đã chạy script `sample-data.sql`, bạn có thể sử dụng các tài khoản sau:

| Username | Password | Role | Mô tả |
|----------|----------|------|-------|
| **admin** | `admin123` | **ADMIN/MANAGER** | Quản trị viên, có quyền truy cập trang Manager |
| **manager** | `manager123` | **MANAGER** | Quản lý phim và lịch chiếu |
| **customer1** | `customer123` | **CUSTOMER** | Khách hàng đặt vé |

---

## 5. Các tính năng chính

*   **Trang chủ:** Xem danh sách phim đang chiếu, sắp chiếu.
*   **Chi tiết phim:** Xem thông tin phim, trailer.
*   **Đặt vé:** Chọn suất chiếu, chọn ghế, đặt vé (thanh toán tại quầy).
*   **Tìm kiếm:** Tìm kiếm phim theo tên.
*   **Đăng nhập/Đăng ký:** Tài khoản thành viên.
*   **Lịch sử đặt vé:** Xem lại các vé đã đặt.
*   **Trang quản lý (Manager):** (Dành cho Admin/Manager)
    *   Quản lý danh sách phim (Thêm/Sửa/Xóa).
    *   Quản lý lịch chiếu (Thêm/Sửa/Xóa).