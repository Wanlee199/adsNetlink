-- PTIT Cinema - Sample Data Script
-- Run this after creating the database to add test data

USE PTIT_Cinema;
GO

PRINT 'Adding sample data to PTIT_Cinema database...';
GO

-- ============================================
-- 1. CINEMA & ROOMS
-- ============================================
PRINT 'Adding Cinema and Rooms...';

INSERT INTO Cinema (CinemaName, Location) 
VALUES (N'PTIT Cinema', N'96 ??nh Công, Hoàng Mai, Hà N?i');

DECLARE @CinemaId INT = SCOPE_IDENTITY();

INSERT INTO CinemaRoom (CinemaId, RoomName) 
VALUES 
    (@CinemaId, N'Phòng 1 - Standard'),
    (@CinemaId, N'Phòng 2 - VIP'),
    (@CinemaId, N'Phòng 3 - IMAX');

PRINT '  ? Added 1 cinema with 3 rooms';
GO

-- ============================================
-- 2. GENRES
-- ============================================
PRINT 'Adding Genres...';

INSERT INTO Genre (Name) 
VALUES 
    (N'Hành ??ng'),
    (N'Hài'),
    (N'Kinh d?'),
    (N'Tình c?m'),
    (N'Khoa h?c vi?n t??ng'),
    (N'Phiêu l?u'),
    (N'Ho?t hình'),
    (N'Tâm lý'),
    (N'Chi?n tranh'),
    (N'T?i ph?m');

PRINT '  ? Added 10 genres';
GO

-- ============================================
-- 3. CASTING (Actors/Actresses)
-- ============================================
PRINT 'Adding Casting...';

INSERT INTO Casting (CastName) 
VALUES 
    (N'Tom Cruise'),
    (N'Scarlett Johansson'),
    (N'Robert Downey Jr.'),
    (N'Chris Evans'),
    (N'Ngô Thanh Vân'),
    (N'Tr?n Thành'),
    (N'Ninh D??ng Lan Ng?c'),
    (N'Kaity Nguy?n'),
    (N'Leonardo DiCaprio'),
    (N'Brad Pitt');

PRINT '  ? Added 10 actors/actresses';
GO

-- ============================================
-- 4. ROLES
-- ============================================
PRINT 'Adding User Roles...';

INSERT INTO Role (RoleName, RoleDescription) 
VALUES 
    (N'ADMIN', N'Qu?n tr? viên h? th?ng - Toàn quy?n'),
    (N'MANAGER', N'Qu?n lý r?p - Qu?n lý phim, l?ch chi?u'),
    (N'CUSTOMER', N'Khách hàng - ??t vé xem phim');

PRINT '  ? Added 3 roles';
GO

-- ============================================
-- 5. USERS
-- ============================================
PRINT 'Adding Users...';

INSERT INTO [User] (UserName, Email, Password, FullName, Phone) 
VALUES 
    (N'admin', N'admin@ptit.edu.vn', N'admin123', N'Qu?n Tr? Viên', N'0123456789'),
    (N'manager', N'manager@ptit.edu.vn', N'manager123', N'Nguy?n V?n Qu?n Lý', N'0123456788'),
    (N'customer1', N'customer1@gmail.com', N'customer123', N'Nguy?n V?n A', N'0987654321'),
    (N'customer2', N'customer2@gmail.com', N'customer123', N'Tr?n Th? B', N'0987654322'),
    (N'phuoc', N'phuoc@gmail.com', N'phuoc123', N'Ph??c', N'0912345678');

PRINT '  ? Added 5 users';
GO

-- ============================================
-- 6. USER ROLES
-- ============================================
PRINT 'Assigning roles to users...';

INSERT INTO UserRole (UserId, RoleId, Status) 
VALUES 
    (1, 1, 1), -- admin has ADMIN role
    (2, 2, 1), -- manager has MANAGER role
    (3, 3, 1), -- customer1 has CUSTOMER role
    (4, 3, 1), -- customer2 has CUSTOMER role
    (5, 3, 1); -- phuoc has CUSTOMER role

PRINT '  ? Assigned roles to 5 users';
GO

-- ============================================
-- 7. MOVIES
-- ============================================
PRINT 'Adding Movies...';

-- Movie 1: Avengers Endgame
INSERT INTO Movie (Title, Rating, Poster, Backdrop, Duration, ReleaseDate, Synopsis, Director, TrailerUrl)
VALUES (
    N'Avengers: Endgame',
    8.4,
    N'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    N'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    '03:01:00',
    '2019-04-26',
    N'Sau s? ki?n tàn kh?c c?a Infinity War, v? tr? ?ang trong tình tr?ng h?n lo?n. Các Avengers còn l?i ph?i t?p h?p m?t l?n n?a ?? ??o ng??c hành ??ng c?a Thanos và khôi ph?c l?i tr?t t? v? tr?.',
    N'Anthony Russo, Joe Russo',
    N'https://www.youtube.com/watch?v=TcMBFSGVi1c'
);

DECLARE @Movie1Id INT = SCOPE_IDENTITY();

-- Movie 2: Mai
INSERT INTO Movie (Title, Rating, Poster, Backdrop, Duration, ReleaseDate, Synopsis, Director, TrailerUrl)
VALUES (
    N'Mai',
    7.8,
    N'https://image.tmdb.org/t/p/w500/vVv1ZYKg8k4KWJdYKh7pZzj1fP5.jpg',
    N'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    '02:11:00',
    '2024-02-10',
    N'Mai là câu chuy?n v? m?t cô gái có cu?c s?ng khó kh?n, ph?i v?t l?n v?i quá kh? và tìm ki?m hy v?ng cho t??ng lai. B? phim kh?c h?a chân th?c v? cu?c s?ng và tình yêu th??ng.',
    N'Tr?n Thành',
    N'https://www.youtube.com/watch?v=example'
);

DECLARE @Movie2Id INT = SCOPE_IDENTITY();

-- Movie 3: Inception
INSERT INTO Movie (Title, Rating, Poster, Backdrop, Duration, ReleaseDate, Synopsis, Director, TrailerUrl)
VALUES (
    N'Inception',
    8.8,
    N'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    N'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    '02:28:00',
    '2010-07-16',
    N'Dom Cobb là m?t tên tr?m lành ngh? nh?t trong ngh? thu?t trích xu?t: ?ánh c?p nh?ng bí m?t có giá tr? t? ti?m th?c trong lúc ng??i ta ?ang m?, khi tâm trí con ng??i d? b? t?n th??ng nh?t.',
    N'Christopher Nolan',
    N'https://www.youtube.com/watch?v=YoHD9XEInc0'
);

DECLARE @Movie3Id INT = SCOPE_IDENTITY();

-- Movie 4: Cô Dâu Hào Môn
INSERT INTO Movie (Title, Rating, Poster, Backdrop, Duration, ReleaseDate, Synopsis, Director, TrailerUrl)
VALUES (
    N'Cô Dâu Hào Môn',
    7.2,
    N'https://image.tmdb.org/t/p/w500/example.jpg',
    N'https://image.tmdb.org/t/p/original/example.jpg',
    '01:54:00',
    '2024-01-19',
    N'Uy?n Ân t? m?t cô gái nghèo b?ng nhiên tr? thành cô dâu hào môn. Nh?ng cu?c s?ng xa hoa ?ó l?i ?n ch?a nhi?u bí m?t ?en t?i.',
    N'V? Ng?c ?ãng',
    N'https://www.youtube.com/watch?v=example'
);

DECLARE @Movie4Id INT = SCOPE_IDENTITY();

-- Movie 5: Doraemon: Nobita và B?n Giao H??ng ??a C?u
INSERT INTO Movie (Title, Rating, Poster, Backdrop, Duration, ReleaseDate, Synopsis, Director, TrailerUrl)
VALUES (
    N'Doraemon: Nobita và B?n Giao H??ng ??a C?u',
    7.5,
    N'https://image.tmdb.org/t/p/w500/example2.jpg',
    N'https://image.tmdb.org/t/p/original/example2.jpg',
    '01:55:00',
    '2024-03-01',
    N'Nobita và nhóm b?n ph?i c?u Trái ??t kh?i m?t cu?c kh?ng ho?ng môi tr??ng toàn c?u v?i s? giúp ?? c?a Doraemon và nh?ng b?o b?i th?n k?.',
    N'Imai Kazuaki',
    N'https://www.youtube.com/watch?v=example'
);

DECLARE @Movie5Id INT = SCOPE_IDENTITY();

PRINT '  ? Added 5 movies';
GO

-- ============================================
-- 8. MOVIE GENRES
-- ============================================
PRINT 'Linking movies to genres...';

-- Avengers: Endgame - Action, Sci-Fi, Adventure
INSERT INTO MovieGenre (MovieId, GenreId) 
SELECT 
    (SELECT Id FROM Movie WHERE Title = N'Avengers: Endgame'),
    Id
FROM Genre 
WHERE Name IN (N'Hành ??ng', N'Khoa h?c vi?n t??ng', N'Phiêu l?u');

-- Mai - Drama, Romance
INSERT INTO MovieGenre (MovieId, GenreId) 
SELECT 
    (SELECT Id FROM Movie WHERE Title = N'Mai'),
    Id
FROM Genre 
WHERE Name IN (N'Tâm lý', N'Tình c?m');

-- Inception - Sci-Fi, Action, Thriller
INSERT INTO MovieGenre (MovieId, GenreId) 
SELECT 
    (SELECT Id FROM Movie WHERE Title = N'Inception'),
    Id
FROM Genre 
WHERE Name IN (N'Khoa h?c vi?n t??ng', N'Hành ??ng', N'Tâm lý');

-- Cô Dâu Hào Môn - Comedy, Drama
INSERT INTO MovieGenre (MovieId, GenreId) 
SELECT 
    (SELECT Id FROM Movie WHERE Title = N'Cô Dâu Hào Môn'),
    Id
FROM Genre 
WHERE Name IN (N'Hài', N'Tâm lý');

-- Doraemon - Animation, Adventure
INSERT INTO MovieGenre (MovieId, GenreId) 
SELECT 
    (SELECT Id FROM Movie WHERE Title LIKE N'Doraemon%'),
    Id
FROM Genre 
WHERE Name IN (N'Ho?t hình', N'Phiêu l?u');

PRINT '  ? Linked movies to genres';
GO

-- ============================================
-- 9. MOVIE CASTING
-- ============================================
PRINT 'Linking movies to actors...';

-- Avengers: Endgame
INSERT INTO MovieCasting (MovieId, CastingId)
SELECT 
    (SELECT Id FROM Movie WHERE Title = N'Avengers: Endgame'),
    Id
FROM Casting
WHERE CastName IN (N'Robert Downey Jr.', N'Chris Evans', N'Scarlett Johansson');

-- Mai
INSERT INTO MovieCasting (MovieId, CastingId)
SELECT 
    (SELECT Id FROM Movie WHERE Title = N'Mai'),
    Id
FROM Casting
WHERE CastName IN (N'Tr?n Thành', N'Ninh D??ng Lan Ng?c');

-- Inception
INSERT INTO MovieCasting (MovieId, CastingId)
SELECT 
    (SELECT Id FROM Movie WHERE Title = N'Inception'),
    Id
FROM Casting
WHERE CastName IN (N'Leonardo DiCaprio', N'Tom Cruise');

-- Cô Dâu Hào Môn
INSERT INTO MovieCasting (MovieId, CastingId)
SELECT 
    (SELECT Id FROM Movie WHERE Title = N'Cô Dâu Hào Môn'),
    Id
FROM Casting
WHERE CastName IN (N'Kaity Nguy?n', N'Ngô Thanh Vân');

PRINT '  ? Linked movies to actors';
GO

-- ============================================
-- 10. SHOWTIMES
-- ============================================
PRINT 'Adding Showtimes...';

DECLARE @Today DATE = CAST(GETDATE() AS DATE);
DECLARE @Tomorrow DATE = DATEADD(DAY, 1, @Today);
DECLARE @DayAfter DATE = DATEADD(DAY, 2, @Today);

-- Get room IDs
DECLARE @Room1 INT = (SELECT TOP 1 Id FROM CinemaRoom WHERE RoomName LIKE N'%1%');
DECLARE @Room2 INT = (SELECT TOP 1 Id FROM CinemaRoom WHERE RoomName LIKE N'%2%');
DECLARE @Room3 INT = (SELECT TOP 1 Id FROM CinemaRoom WHERE RoomName LIKE N'%3%');

-- Avengers Endgame - Multiple showtimes
INSERT INTO Showtime (MovieId, RoomId, Date, Time, Price)
SELECT 
    (SELECT Id FROM Movie WHERE Title = N'Avengers: Endgame'),
    @Room1,
    @Today,
    '09:00:00',
    80000
UNION ALL
SELECT 
    (SELECT Id FROM Movie WHERE Title = N'Avengers: Endgame'),
    @Room1,
    @Today,
    '14:00:00',
    100000
UNION ALL
SELECT 
    (SELECT Id FROM Movie WHERE Title = N'Avengers: Endgame'),
    @Room2,
    @Today,
    '19:00:00',
    120000;

-- Mai
INSERT INTO Showtime (MovieId, RoomId, Date, Time, Price)
SELECT 
    (SELECT Id FROM Movie WHERE Title = N'Mai'),
    @Room2,
    @Today,
    '10:30:00',
    75000
UNION ALL
SELECT 
    (SELECT Id FROM Movie WHERE Title = N'Mai'),
    @Room3,
    @Tomorrow,
    '15:00:00',
    90000;

-- Inception
INSERT INTO Showtime (MovieId, RoomId, Date, Time, Price)
SELECT 
    (SELECT Id FROM Movie WHERE Title = N'Inception'),
    @Room3,
    @Today,
    '20:00:00',
    110000
UNION ALL
SELECT 
    (SELECT Id FROM Movie WHERE Title = N'Inception'),
    @Room1,
    @Tomorrow,
    '16:30:00',
    100000;

-- Cô Dâu Hào Môn
INSERT INTO Showtime (MovieId, RoomId, Date, Time, Price)
SELECT 
    (SELECT Id FROM Movie WHERE Title = N'Cô Dâu Hào Môn'),
    @Room2,
    @Tomorrow,
    '11:00:00',
    70000;

-- Doraemon
INSERT INTO Showtime (MovieId, RoomId, Date, Time, Price)
SELECT 
    (SELECT Id FROM Movie WHERE Title LIKE N'Doraemon%'),
    @Room1,
    @DayAfter,
    '09:30:00',
    60000
UNION ALL
SELECT 
    (SELECT Id FROM Movie WHERE Title LIKE N'Doraemon%'),
    @Room3,
    @DayAfter,
    '13:00:00',
    65000;

PRINT '  ? Added showtimes for next 3 days';
GO

-- ============================================
-- SUMMARY
-- ============================================
PRINT '';
PRINT '========================================';
PRINT 'SAMPLE DATA ADDED SUCCESSFULLY!';
PRINT '========================================';
PRINT '';

-- Display summary
SELECT 'Cinema' AS [Table], COUNT(*) AS [Count] FROM Cinema
UNION ALL
SELECT 'CinemaRoom', COUNT(*) FROM CinemaRoom
UNION ALL
SELECT 'Genre', COUNT(*) FROM Genre
UNION ALL
SELECT 'Casting', COUNT(*) FROM Casting
UNION ALL
SELECT 'Role', COUNT(*) FROM Role
UNION ALL
SELECT 'User', COUNT(*) FROM [User]
UNION ALL
SELECT 'UserRole', COUNT(*) FROM UserRole
UNION ALL
SELECT 'Movie', COUNT(*) FROM Movie
UNION ALL
SELECT 'MovieGenre', COUNT(*) FROM MovieGenre
UNION ALL
SELECT 'MovieCasting', COUNT(*) FROM MovieCasting
UNION ALL
SELECT 'Showtime', COUNT(*) FROM Showtime;

PRINT '';
PRINT 'Test Users:';
PRINT '  admin / admin123 (ADMIN)';
PRINT '  manager / manager123 (MANAGER)';
PRINT '  customer1 / customer123 (CUSTOMER)';
PRINT '  phuoc / phuoc123 (CUSTOMER)';
PRINT '';
PRINT 'You can now start the backend and test the API!';
PRINT '';
GO
