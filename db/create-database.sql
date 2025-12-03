-- =============================================
-- PTIT Cinema - Database Creation Script
-- Simplified version without hardcoded paths
-- =============================================

USE [master]
GO

-- Drop database if exists
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'PTIT_Cinema')
BEGIN
    ALTER DATABASE [PTIT_Cinema] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [PTIT_Cinema];
    PRINT 'Dropped existing PTIT_Cinema database';
END
GO

-- Create database (SQL Server will use default paths)
CREATE DATABASE [PTIT_Cinema]
GO

USE [PTIT_Cinema]
GO

PRINT 'Creating tables...';
GO

-- =============================================
-- Table: Booking
-- =============================================
CREATE TABLE [dbo].[Booking](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[ShowtimeId] [int] NOT NULL,
	[Status] [int] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
 CONSTRAINT [PK_Booking] PRIMARY KEY CLUSTERED ([Id] ASC)
)
GO

-- =============================================
-- Table: BookingDetails
-- =============================================
CREATE TABLE [dbo].[BookingDetails](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[BookingId] [int] NOT NULL,
	[SeatNumber] [nvarchar](50) NULL,
 CONSTRAINT [PK_BookingDetails] PRIMARY KEY CLUSTERED ([Id] ASC)
)
GO

-- =============================================
-- Table: Casting
-- =============================================
CREATE TABLE [dbo].[Casting](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CastName] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Casting] PRIMARY KEY CLUSTERED ([Id] ASC)
)
GO

-- =============================================
-- Table: Cinema
-- =============================================
CREATE TABLE [dbo].[Cinema](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CinemaName] [nvarchar](50) NOT NULL,
	[Location] [nvarchar](50) NULL,
 CONSTRAINT [PK_Cinema] PRIMARY KEY CLUSTERED ([Id] ASC)
)
GO

-- =============================================
-- Table: CinemaRoom
-- =============================================
CREATE TABLE [dbo].[CinemaRoom](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CinemaId] [int] NOT NULL,
	[RoomName] [nvarchar](50) NULL,
 CONSTRAINT [PK_CinemaRoom] PRIMARY KEY CLUSTERED ([Id] ASC)
)
GO

-- =============================================
-- Table: Genre
-- =============================================
CREATE TABLE [dbo].[Genre](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_Genre] PRIMARY KEY CLUSTERED ([Id] ASC)
)
GO

-- =============================================
-- Table: Movie
-- =============================================
CREATE TABLE [dbo].[Movie](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](max) NOT NULL,
	[Rating] [decimal](18, 1) NULL,
	[Poster] [nvarchar](max) NULL,
	[Backdrop] [nvarchar](max) NULL,
	[Duration] [time](7) NOT NULL,
	[ReleaseDate] [date] NOT NULL,
	[Synopsis] [nvarchar](max) NULL,
	[Director] [nvarchar](max) NULL,
	[TrailerUrl] [nvarchar](max) NULL,
 CONSTRAINT [PK_Movie] PRIMARY KEY CLUSTERED ([Id] ASC)
)
GO

-- =============================================
-- Table: MovieCasting
-- =============================================
CREATE TABLE [dbo].[MovieCasting](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MovieId] [int] NOT NULL,
	[CastingId] [int] NOT NULL,
 CONSTRAINT [PK_MovieCasting] PRIMARY KEY CLUSTERED ([Id] ASC)
)
GO

-- =============================================
-- Table: MovieGenre
-- =============================================
CREATE TABLE [dbo].[MovieGenre](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MovieId] [int] NOT NULL,
	[GenreId] [int] NOT NULL,
 CONSTRAINT [PK_MovieGenre] PRIMARY KEY CLUSTERED ([Id] ASC)
)
GO

-- =============================================
-- Table: Role
-- =============================================
CREATE TABLE [dbo].[Role](
	[RoleId] [int] IDENTITY(1,1) NOT NULL,
	[RoleName] [nvarchar](50) NOT NULL,
	[RoleDescription] [nvarchar](max) NULL,
 CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED ([RoleId] ASC)
)
GO

-- =============================================
-- Table: Showtime
-- =============================================
CREATE TABLE [dbo].[Showtime](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MovieId] [int] NOT NULL,
	[RoomId] [int] NOT NULL,
	[Date] [date] NOT NULL,
	[Time] [time](7) NOT NULL,
	[Price] [decimal](18, 0) NOT NULL,
 CONSTRAINT [PK_Showtime] PRIMARY KEY CLUSTERED ([Id] ASC)
)
GO

-- =============================================
-- Table: User
-- =============================================
CREATE TABLE [dbo].[User](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [nvarchar](50) NOT NULL,
	[Email] [nvarchar](50) NOT NULL,
	[Password] [nvarchar](50) NOT NULL,
	[FullName] [nvarchar](200) NOT NULL,
	[Phone] [nvarchar](50) NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([UserId] ASC)
)
GO

-- =============================================
-- Table: UserRole
-- =============================================
CREATE TABLE [dbo].[UserRole](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[RoleId] [int] NOT NULL,
	[Status] [bit] NOT NULL,
 CONSTRAINT [PK_UserRole] PRIMARY KEY CLUSTERED ([Id] ASC)
)
GO

PRINT 'Tables created successfully!';
PRINT 'Adding foreign key constraints...';
GO

-- =============================================
-- Foreign Key Constraints
-- =============================================

-- Booking -> Showtime
ALTER TABLE [dbo].[Booking] WITH CHECK 
ADD CONSTRAINT [FK_Booking_Showtime] FOREIGN KEY([ShowtimeId])
REFERENCES [dbo].[Showtime] ([Id])
GO

-- Booking -> User
ALTER TABLE [dbo].[Booking] WITH CHECK 
ADD CONSTRAINT [FK_Booking_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([UserId])
GO

-- BookingDetails -> Booking
ALTER TABLE [dbo].[BookingDetails] WITH CHECK 
ADD CONSTRAINT [FK_BookingDetails_Booking] FOREIGN KEY([BookingId])
REFERENCES [dbo].[Booking] ([Id])
GO

-- CinemaRoom -> Cinema
ALTER TABLE [dbo].[CinemaRoom] WITH CHECK 
ADD CONSTRAINT [FK_CinemaRoom_Cinema] FOREIGN KEY([CinemaId])
REFERENCES [dbo].[Cinema] ([Id])
GO

-- MovieCasting -> Casting
ALTER TABLE [dbo].[MovieCasting] WITH CHECK 
ADD CONSTRAINT [FK_MovieCasting_Casting] FOREIGN KEY([CastingId])
REFERENCES [dbo].[Casting] ([Id])
GO

-- MovieCasting -> Movie
ALTER TABLE [dbo].[MovieCasting] WITH CHECK 
ADD CONSTRAINT [FK_MovieCasting_Movie] FOREIGN KEY([MovieId])
REFERENCES [dbo].[Movie] ([Id])
GO

-- MovieGenre -> Genre
ALTER TABLE [dbo].[MovieGenre] WITH CHECK 
ADD CONSTRAINT [FK_MovieGenre_Genre] FOREIGN KEY([GenreId])
REFERENCES [dbo].[Genre] ([Id])
GO

-- MovieGenre -> Movie
ALTER TABLE [dbo].[MovieGenre] WITH CHECK 
ADD CONSTRAINT [FK_MovieGenre_Movie] FOREIGN KEY([MovieId])
REFERENCES [dbo].[Movie] ([Id])
GO

-- Showtime -> CinemaRoom
ALTER TABLE [dbo].[Showtime] WITH CHECK 
ADD CONSTRAINT [FK_Showtime_CinemaRoom] FOREIGN KEY([RoomId])
REFERENCES [dbo].[CinemaRoom] ([Id])
GO

-- Showtime -> Movie
ALTER TABLE [dbo].[Showtime] WITH CHECK 
ADD CONSTRAINT [FK_Showtime_Movie] FOREIGN KEY([MovieId])
REFERENCES [dbo].[Movie] ([Id])
GO

-- UserRole -> Role
ALTER TABLE [dbo].[UserRole] WITH CHECK 
ADD CONSTRAINT [FK_UserRole_Role] FOREIGN KEY([RoleId])
REFERENCES [dbo].[Role] ([RoleId])
GO

-- UserRole -> User
ALTER TABLE [dbo].[UserRole] WITH CHECK 
ADD CONSTRAINT [FK_UserRole_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([UserId])
GO

PRINT 'Foreign key constraints added successfully!';
GO

-- =============================================
-- Verification
-- =============================================
PRINT '';
PRINT '========================================';
PRINT 'DATABASE CREATED SUCCESSFULLY!';
PRINT '========================================';
PRINT '';

SELECT 
    'Tables Created' AS [Status],
    COUNT(*) AS [Count]
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'
UNION ALL
SELECT 
    'Foreign Keys',
    COUNT(*)
FROM sys.foreign_keys;

PRINT '';
PRINT 'Expected: 13 tables, 10 foreign keys';
PRINT 'Next step: Run sample-data.sql to add test data';
PRINT '';
GO
