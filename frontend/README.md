# 🎬 PTIT Cinema - Modern Cinema Booking System

A full-featured cinema booking web application built with modern web technologies, offering a seamless movie booking experience from browsing to ticket confirmation.

![PTIT Cinema](https://img.shields.io/badge/PTIT-Cinema-red?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TanStack](https://img.shields.io/badge/TanStack-FF4154?style=for-the-badge&logo=react&logoColor=white)

## ✨ Features

### 🎯 Core Features
- **🔐 Authentication System**
  - User registration and login
  - JWT-based authentication
  - Persistent sessions with Jotai state management
  - Protected routes

- **🎥 Movie Browsing**
  - Beautiful home page with hero section
  - Now Showing carousel with smooth animations
  - Detailed movie information pages
  - Movie trailers and synopsis
  - Rating and genre information

- **🔍 Search & Discovery**
  - Real-time movie search
  - Search by title, genre, or synopsis
  - Responsive search results grid
  - Empty state handling

- **🎟️ Booking Flow**
  - Interactive seat selection with 3 seat types (Regular, VIP, Couple)
  - Real-time seat availability
  - Multiple payment methods (Credit Card, E-Wallet, Bank Transfer)
  - Booking confirmation with QR code
  - Ticket download functionality

- **📱 My Tickets**
  - Booking history with filters (All, Upcoming, Past)
  - Ticket details with QR codes
  - View and manage bookings
  - Responsive ticket cards

### 🎨 UI/UX Highlights
- **Modern Design**: Clean, professional interface with gradient accents
- **Smooth Animations**: Staggered animations, hover effects, and transitions
- **Responsive**: Mobile-first design, works on all devices
- **Dark Mode**: Full dark mode support
- **Accessibility**: ARIA labels and semantic HTML

## 🛠️ Tech Stack

### Frontend Framework
- **[TanStack Start](https://tanstack.com/start)** - Full-stack React framework
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### Routing & Data Fetching
- **[TanStack Router](https://tanstack.com/router)** - Type-safe routing
- **[TanStack Query](https://tanstack.com/query)** - Server state management

### State Management
- **[Jotai](https://jotai.org/)** - Atomic state management
- **localStorage** - Persistent storage

### UI Components
- **[shadcn/ui](https://ui.shadcn.com/)** - Reusable components
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Lucide Icons](https://lucide.dev/)** - Icon library
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Deployment
- **[Cloudflare Pages](https://pages.cloudflare.com/)** - Edge deployment
- **[Wrangler](https://developers.cloudflare.com/workers/wrangler/)** - Deployment CLI

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── MovieCard.tsx   # Movie card component
│   │   └── ...
│   ├── routes/             # File-based routing
│   │   ├── __root.tsx      # Root layout with Header/Footer
│   │   ├── index.tsx       # Home page
│   │   ├── login.tsx       # Login page
│   │   ├── register.tsx    # Register page
│   │   ├── search.tsx      # Search results
│   │   ├── my-tickets.tsx  # Booking history
│   │   ├── movies.$movieId.tsx           # Movie details
│   │   ├── booking.$showtimeId.tsx       # Seat selection
│   │   ├── payment.tsx                   # Payment page
│   │   └── booking-success.$bookingId.tsx # Confirmation
│   ├── data/               # Mock data
│   ├── services/           # API services
│   ├── store/              # Jotai atoms
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript types
│   ├── lib/                # Utilities
│   └── styles/             # Global styles
├── public/                 # Static assets
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ptit-cinema-webapp/frontend
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Start development server**
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
pnpm build
```

### Deploy to Cloudflare Pages

```bash
pnpm deploy
```

## 📱 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with movie carousel |
| `/login` | User login |
| `/register` | User registration |
| `/search?q=query` | Search results |
| `/movies/:id` | Movie details |
| `/booking/:showtimeId` | Seat selection |
| `/payment` | Payment processing |
| `/booking-success/:bookingId` | Booking confirmation |
| `/my-tickets` | User's booking history |

## 🎨 Design System

### Colors
- **Primary**: Red-Orange gradient (`#dc2626` → `#f97316`)
- **Background**: Dynamic (light/dark mode)
- **Muted**: Subtle backgrounds and borders

### Typography
- **Headings**: Bold, tracking-tight
- **Body**: Regular weight, comfortable line-height

### Components
All UI components follow shadcn/ui conventions with Tailwind CSS styling.

## 🔧 Key Features Implementation

### Authentication
- JWT tokens stored in localStorage
- Automatic token refresh
- Protected routes with redirect
- User profile management

### Booking System
- Mock data for movies and showtimes
- localStorage-based booking persistence
- QR code generation for tickets
- Multiple payment method support

### Search
- Client-side filtering (can be replaced with API)
- Fuzzy search across title, genre, synopsis
- Instant results

## 📝 Mock Data

The application uses mock data for demonstration:
- **Movies**: 6 sample movies with details
- **Showtimes**: Generated showtime data
- **Seats**: 3 types (Regular, VIP, Couple)
- **Bookings**: Stored in localStorage

## 🚧 Future Enhancements

- [ ] Backend API integration
- [ ] Real-time seat availability
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Movie recommendations
- [ ] User reviews and ratings
- [ ] Social sharing
- [ ] Multi-language support

## 👨‍💻 Development

### Code Style
- TypeScript strict mode
- ESLint for linting
- Prettier for formatting
- Component-based architecture

### Best Practices
- Type-safe routing and data fetching
- Reusable components
- Responsive design
- Accessibility considerations
- Performance optimizations

## 📄 License

This project is developed for educational purposes at PTIT (Posts and Telecommunications Institute of Technology).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ by PTIT Students**
