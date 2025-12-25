# React Website with Clean Architecture

A React + TypeScript frontend website built with Vite, featuring separate mobile and desktop designs following clean architecture principles.

## 🎯 Current Status

**Mobile UI**: ✅ Fully implemented based on your design
- Dark theme with vibrant green (#00ff00) accents
- Performance marketing solutions layout
- All sections implemented (Hero, Services, Features, Testimonials, Pricing, FAQ, Contact)
- Vietnamese language content ready for customization

**Desktop UI**: 📝 Template ready for your desktop design

## 📚 Quick Links

- **[ASSETS_GUIDE.md](./ASSETS_GUIDE.md)** - How to add/change images
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - How to deploy to Hostinger
- **[src/assets/README.md](./src/assets/README.md)** - Asset directory structure

## Features

- **Clean Architecture**: Organized codebase with clear separation of concerns
- **Responsive Design**: Separate UI implementations for mobile and desktop
- **Easy Asset Management**: Centralized configuration for all images and assets
- **TypeScript**: Full type safety throughout the application
- **Vite**: Fast development and optimized production builds
- **Dark Theme**: Professional dark design with neon green accents

## Project Structure

```
src/
├── core/                      # Business logic layer
│   ├── domain/               # Domain entities and use cases
│   │   ├── entities/        # Business entities
│   │   └── useCases/        # Business logic
│   └── data/                # Data layer
│       ├── repositories/    # Data repositories
│       └── dataSources/     # Data sources (API, local storage)
├── presentation/            # UI layer
│   ├── mobile/             # Mobile-specific components
│   │   ├── MobileApp.tsx
│   │   └── styles/
│   ├── desktop/            # Desktop-specific components
│   │   ├── DesktopApp.tsx
│   │   └── styles/
│   └── shared/             # Shared UI components
│       ├── components/     # Reusable components
│       ├── hooks/         # Custom React hooks
│       └── contexts/      # React contexts
├── infrastructure/         # Infrastructure layer
│   ├── config/           # Configuration files
│   └── utils/            # Utility functions
└── assets/               # Static assets
    ├── images/          # Images (mobile/desktop/shared)
    ├── icons/          # SVG icons
    └── fonts/          # Custom fonts
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to upload to Hostinger.

## How to Customize

### 1. Update Mobile/Desktop Designs

- **Mobile UI**: Edit `src/presentation/mobile/MobileApp.tsx`
- **Desktop UI**: Edit `src/presentation/desktop/DesktopApp.tsx`
- **Styles**: Modify CSS files in respective `styles/` directories

### 2. Change Images and Assets

See `src/assets/README.md` for detailed instructions.

Quick steps:
1. Place your images in `src/assets/images/mobile/`, `desktop/`, or `shared/`
2. Update paths in `src/infrastructure/config/assets.config.ts`
3. Images will automatically be used throughout the app

### 3. Adjust Responsive Breakpoint

Edit the breakpoint in `src/App.tsx`:

```typescript
<DeviceProvider breakpoint={768}> {/* Change 768 to your desired breakpoint */}
```

### 4. Add New Pages/Routes

Install React Router:
```bash
npm install react-router-dom
```

Then set up routing in your mobile and desktop apps separately.

## Deployment to Hostinger

1. Build the project:
```bash
npm run build
```

2. Upload the contents of the `dist/` folder to your Hostinger hosting:
   - Via FTP/SFTP
   - Or using Hostinger's File Manager

3. Make sure the uploaded files are in your public_html directory

4. Configure your web server to serve `index.html` for all routes (if using client-side routing)

## Technologies Used

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **CSS3**: Styling

## Development Tips

1. **Hot Module Replacement (HMR)**: Changes automatically refresh in the browser
2. **TypeScript**: Provides autocomplete and type checking
3. **Device Testing**: Resize your browser to test mobile/desktop views
4. **Asset Management**: All asset paths are centralized for easy updates

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if configured)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues or questions, please refer to the project documentation or create an issue in the repository.
# adsNetlink
