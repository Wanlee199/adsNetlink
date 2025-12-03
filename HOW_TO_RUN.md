# 🔧 HƯỚNG DẪN CHẠY DỰ ÁN - PTIT CINEMA

## ❌ **Vấn đề gặp phải:**

Backend không thể kết nối đến SQL Server vì:
1. SQL Server Express cần instance name: `localhost\SQLEXPRESS`
2. Windows Authentication cần file `sqljdbc_auth.dll`

---

## ✅ **GIẢI PHÁP 1: Dùng SQL Authentication (Khuyến nghị - Đơn giản nhất)**

### **Bước 1: Enable SQL Authentication trong SQL Server**

1. Mở **SQL Server Management Studio**
2. Kết nối với Windows Authentication
3. Click phải vào **Server name** (ở Object Explorer) → **Properties**
4. Chọn **Security** (bên trái)
5. Chọn **SQL Server and Windows Authentication mode**
6. Click **OK**
7. **Restart SQL Server service:**
   - Win + R → `services.msc`
   - Tìm **SQL Server (SQLEXPRESS)**
   - Click phải → **Restart**

### **Bước 2: Enable user 'sa'**

Chạy query này trong SSMS:

```sql
USE master;
GO

-- Enable sa account
ALTER LOGIN sa ENABLE;
GO

-- Set password
ALTER LOGIN sa WITH PASSWORD = '@Dmin_B_72025';
GO

-- Grant sysadmin role
ALTER SERVER ROLE sysadmin ADD MEMBER sa;
GO

PRINT 'SA account enabled successfully!';
```

### **Bước 3: Sửa application.properties**

File: `backend/src/main/resources/application.properties`

Thay đổi từ:
```properties
spring.datasource.url=jdbc:sqlserver://localhost\\SQLEXPRESS;databaseName=PTIT_Cinema;encrypt=true;trustServerCertificate=true;integratedSecurity=true
#spring.datasource.username=sa
#spring.datasource.password=@Dmin_B_72025
```

Thành:
```properties
spring.datasource.url=jdbc:sqlserver://localhost\\SQLEXPRESS;databaseName=PTIT_Cinema;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=@Dmin_B_72025
```

### **Bước 4: Chạy backend**

```bash
cd backend
mvnw.cmd spring-boot:run
```

---

## ✅ **GIẢI PHÁP 2: Dùng Windows Authentication (Phức tạp hơn)**

### **Yêu cầu:**
- Cần download và cài đặt `sqljdbc_auth.dll`

### **Bước 1: Download Microsoft JDBC Driver**

1. Truy cập: https://learn.microsoft.com/en-us/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server
2. Download **Microsoft JDBC Driver 12.x for SQL Server**
3. Giải nén file

### **Bước 2: Copy sqljdbc_auth.dll**

Từ thư mục giải nén, copy file:
- `sqljdbc_12.x\enu\auth\x64\sqljdbc_auth.dll` (nếu Windows 64-bit)

Đến một trong các vị trí:
- `C:\Windows\System32\`
- Hoặc thêm vào PATH environment variable

### **Bước 3: Restart máy**

Restart máy tính để load DLL

### **Bước 4: Chạy backend**

```bash
cd backend
mvnw.cmd spring-boot:run
```

---

## 🎯 **KHUYẾN NGHỊ**

**Dùng GIẢI PHÁP 1 (SQL Authentication)** vì:
- ✅ Đơn giản hơn
- ✅ Không cần download thêm file
- ✅ Không cần restart máy
- ✅ Dễ debug hơn

---

## 🚀 **SAU KHI CHẠY THÀNH CÔNG**

### **1. Kiểm tra backend đã chạy:**

Xem log, tìm dòng:
```
Tomcat started on port 8091 (http)
Started PtitCinemaApplication in X.XXX seconds
```

### **2. Truy cập Swagger UI:**

Mở trình duyệt: `http://localhost:8091/PTITCinema/swagger-ui.html`

### **3. Test API Login:**

1. Trong Swagger, tìm endpoint: `POST /auth/login`
2. Click **Try it out**
3. Nhập:
```json
{
  "username": "admin",
  "password": "admin123"
}
```
4. Click **Execute**
5. Nhận JWT token trong response

### **4. Test Protected Endpoints:**

1. Copy JWT token từ response
2. Click nút **Authorize** (ở đầu trang Swagger)
3. Nhập: `Bearer <your-token>`
4. Click **Authorize**
5. Bây giờ có thể test các protected endpoints

---

## 📊 **Test Users** (từ sample-data.sql)

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| manager | manager123 | MANAGER |
| customer1 | customer123 | CUSTOMER |
| phuoc | phuoc123 | CUSTOMER |

---

## ❓ **Troubleshooting**

### **Lỗi: Login failed for user 'sa'**

- Kiểm tra đã enable SQL Authentication chưa
- Kiểm tra đã restart SQL Server service chưa
- Kiểm tra password đúng chưa

### **Lỗi: TCP/IP connection failed**

- Kiểm tra SQL Server đang chạy
- Kiểm tra instance name: `localhost\SQLEXPRESS`
- Enable TCP/IP trong SQL Server Configuration Manager

### **Lỗi: Database does not exist**

- Chạy lại `create-database.sql` trong SSMS

---

**Chúc bạn chạy thành công! 🎉**
