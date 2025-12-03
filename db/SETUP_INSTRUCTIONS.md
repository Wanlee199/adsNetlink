# 🚀 HƯỚNG DẪN SETUP DATABASE - PTIT CINEMA

## ✅ Bạn đang dùng Windows Authentication - Rất tốt!

### **Bước 1: Mở SQL Server Management Studio (SSMS)**

1. Tìm và mở **SQL Server Management Studio**
2. Trong cửa sổ Connect to Server:
   - **Server type:** Database Engine
   - **Server name:** `localhost` hoặc `localhost\SQLEXPRESS` hoặc `(local)`
   - **Authentication:** Windows Authentication
   - Click **Connect**

---

### **Bước 2: Tạo Database**

#### **Option A: Chạy từ file (Khuyến nghị)**

1. Trong SSMS, click menu **File** → **Open** → **File...**
2. Duyệt đến: `d:\Ptit\ptit-cinema-webapp\db\PTIT-Cinema-Initial_Scripts.sql`
3. Click **Open**
4. Click nút **Execute** (hoặc nhấn **F5**)
5. Đợi script chạy xong (khoảng 5-10 giây)

#### **Option B: Copy & Paste**

1. Mở file `PTIT-Cinema-Initial_Scripts.sql` bằng Notepad
2. Copy toàn bộ nội dung (Ctrl+A, Ctrl+C)
3. Quay lại SSMS, paste vào Query Window (Ctrl+V)
4. Click **Execute** (F5)

---

### **Bước 3: Thêm dữ liệu mẫu (Optional nhưng khuyến nghị)**

1. Trong SSMS, click **File** → **Open** → **File...**
2. Chọn file: `d:\Ptit\ptit-cinema-webapp\db\sample-data.sql`
3. Click **Execute** (F5)

Dữ liệu mẫu bao gồm:
- ✅ 1 rạp chiếu với 3 phòng
- ✅ 5 phim (Avengers, Mai, Inception, Cô Dâu Hào Môn, Doraemon)
- ✅ 10 thể loại phim
- ✅ 10 diễn viên
- ✅ 5 users test (admin, manager, customer...)
- ✅ Lịch chiếu cho 3 ngày tới

---

### **Bước 4: Xác nhận Database đã được tạo**

Chạy query này trong SSMS:

```sql
USE PTIT_Cinema;
GO

-- Kiểm tra các tables
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- Kiểm tra dữ liệu mẫu
SELECT 'Movies' AS [Table], COUNT(*) AS [Count] FROM Movie
UNION ALL
SELECT 'Users', COUNT(*) FROM [User]
UNION ALL
SELECT 'Showtimes', COUNT(*) FROM Showtime
UNION ALL
SELECT 'Cinema', COUNT(*) FROM Cinema;
```

**Kết quả mong đợi:**
- 13 tables
- 5 movies (nếu đã chạy sample-data.sql)
- 5 users (nếu đã chạy sample-data.sql)

---

### **Bước 5: Cấu hình Backend để kết nối**

Vì bạn dùng Windows Authentication, cần sửa file cấu hình backend:

**File:** `backend/src/main/resources/application.properties`

**Thay đổi từ:**
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=PTIT_Cinema;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=@Dmin_B_72025
```

**Thành:**
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=PTIT_Cinema;encrypt=true;trustServerCertificate=true;integratedSecurity=true
# Comment out username and password for Windows Authentication
# spring.datasource.username=sa
# spring.datasource.password=@Dmin_B_72025
```

**Hoặc nếu dùng SQL Server Express:**
```properties
spring.datasource.url=jdbc:sqlserver://localhost\\SQLEXPRESS:1433;databaseName=PTIT_Cinema;encrypt=true;trustServerCertificate=true;integratedSecurity=true
```

---

### **Bước 6: Chạy Backend**

```bash
cd backend
./mvnw spring-boot:run
```

Hoặc trên Windows:
```bash
mvnw.cmd spring-boot:run
```

---

## 🧪 **Test Users (sau khi chạy sample-data.sql)**

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| manager | manager123 | MANAGER |
| customer1 | customer123 | CUSTOMER |
| phuoc | phuoc123 | CUSTOMER |

---

## 🎯 **Truy cập ứng dụng**

- **API Base:** `http://localhost:8091/PTITCinema`
- **Swagger UI:** `http://localhost:8091/PTITCinema/swagger-ui.html`
- **API Docs:** `http://localhost:8091/PTITCinema/api-docs`

---

## ❓ **Troubleshooting**

### **Lỗi: Database already exists**

Nếu database đã tồn tại, chạy query này trước:

```sql
USE master;
GO

DROP DATABASE IF EXISTS PTIT_Cinema;
GO
```

Sau đó chạy lại script tạo database.

### **Lỗi: Cannot connect to database**

Kiểm tra:
1. SQL Server service đang chạy (Services → SQL Server)
2. Server name đúng (localhost hoặc localhost\SQLEXPRESS)
3. Windows Authentication được chọn

---

**Chúc bạn setup thành công! 🎉**
