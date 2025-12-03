# 🎬 PTIT CINEMA - Setup Database

## 📋 Tóm tắt

Bạn đang dùng **Windows Authentication** - Backend đã được cấu hình sẵn để kết nối.

---

## 🚀 HƯỚNG DẪN NHANH

### **Bước 1: Mở SQL Server Management Studio (SSMS)**

1. Mở **SQL Server Management Studio**
2. Kết nối với:
   - **Server name:** `localhost` hoặc `localhost\SQLEXPRESS`
   - **Authentication:** **Windows Authentication**
   - Click **Connect**

### **Bước 2: Tạo Database**

1. Click **File** → **Open** → **File...**
2. Chọn file: **`PTIT-Cinema-Initial_Scripts.sql`** (trong thư mục này)
3. Click **Execute** (F5)
4. Đợi script chạy xong

### **Bước 3: Thêm dữ liệu mẫu (Khuyến nghị)**

1. Click **File** → **Open** → **File...**
2. Chọn file: **`sample-data.sql`** (trong thư mục này)
3. Click **Execute** (F5)

### **Bước 4: Xác nhận**

Chạy query này để kiểm tra:

```sql
USE PTIT_Cinema;
GO

-- Kiểm tra tables
SELECT COUNT(*) AS TotalTables 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';
-- Expected: 13

-- Kiểm tra dữ liệu
SELECT 'Movies' AS [Table], COUNT(*) AS [Count] FROM Movie
UNION ALL
SELECT 'Users', COUNT(*) FROM [User]
UNION ALL
SELECT 'Showtimes', COUNT(*) FROM Showtime;
```

---

## ✅ **Hoàn tất!**

Backend đã được cấu hình để dùng Windows Authentication.

**Chạy backend:**
```bash
cd ..\backend
mvnw.cmd spring-boot:run
```

**Truy cập:**
- Swagger UI: http://localhost:8091/PTITCinema/swagger-ui.html

---

## 🧪 **Test Users** (sau khi chạy sample-data.sql)

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| manager | manager123 | MANAGER |
| customer1 | customer123 | CUSTOMER |
| phuoc | phuoc123 | CUSTOMER |

---

Xem **SETUP_INSTRUCTIONS.md** để biết thêm chi tiết!
