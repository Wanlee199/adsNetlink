# Assets Guide - How to Add Your Images

This guide explains how to add and manage images for your website.

## Quick Start

1. **Prepare your images** with the exact filenames listed below
2. **Place them** in the `/src/assets/images/mobile/` folder
3. **Refresh your browser** - images will automatically appear!

## Required Mobile Images

### Logo
- **Filename:** `logo.png`
- **Location:** `/src/assets/images/mobile/logo.png`
- **Size:** 200x60px (or similar ratio)
- **Format:** PNG with transparent background
- **Used in:** Header navigation

### Hero Section Images
- **Filename:** `hero-screen-1.png`
- **Location:** `/src/assets/images/mobile/hero-screen-1.png`
- **Size:** 300x400px to 600x800px (for retina)
- **Format:** PNG or JPG
- **Description:** First dashboard/analytics screenshot shown in hero section

- **Filename:** `hero-screen-2.png`
- **Location:** `/src/assets/images/mobile/hero-screen-2.png`
- **Size:** 300x400px to 600x800px (for retina)
- **Format:** PNG or JPG
- **Description:** Second dashboard/analytics screenshot shown in hero section

### Partner Logos
- **Filenames:** `partner-1.png`, `partner-2.png`, `partner-3.png`
- **Location:** `/src/assets/images/mobile/`
- **Size:** 150x80px each
- **Format:** PNG with transparent background (preferred)
- **Description:** Your partner/client company logos

### Customer Avatar
- **Filename:** `avatar.png`
- **Location:** `/src/assets/images/mobile/avatar.png`
- **Size:** 100x100px to 200x200px
- **Format:** PNG or JPG
- **Description:** Customer photo for testimonial section (will be displayed as circle)

## Step-by-Step: Adding Your Images

### Method 1: Using File Manager (Easiest)
1. Open your project folder
2. Navigate to: `src/assets/images/mobile/`
3. Drag and drop your images with the correct filenames
4. Refresh your browser

### Method 2: Using Command Line
```bash
# Navigate to mobile images folder
cd src/assets/images/mobile/

# Copy your images here (replace paths with your actual image locations)
cp ~/Downloads/my-logo.png ./logo.png
cp ~/Downloads/screen1.png ./hero-screen-1.png
cp ~/Downloads/screen2.png ./hero-screen-2.png
```

## Image Optimization Tips

1. **Compress Images**
   - Use [TinyPNG](https://tinypng.com) or [Squoosh](https://squoosh.app)
   - Target: Under 500KB per image
   - Keep quality at 80-90%

2. **Use Correct Dimensions**
   - Don't use images larger than needed
   - Use 2x dimensions for retina displays
   - Example: For 200x60px display, use 400x120px image

3. **Choose Right Format**
   - **PNG**: For logos, icons, images needing transparency
   - **JPG**: For photos, screenshots without transparency
   - **WebP**: For best compression (modern browsers)

## Updating Content

### Changing Text Content
Edit the file: `/src/presentation/mobile/MobileApp.tsx`

Example - To change the hero title:
```tsx
// Find this in MobileApp.tsx (around line 39-44)
<h1 className="hero-title">
  <span className="title-line-1">GIẢI PHÁP</span>
  <span className="title-line-2">PERFORMANCE</span>
  <span className="title-line-3">MARKETING SOLUTIONS</span>
</h1>

// Change to your text:
<h1 className="hero-title">
  <span className="title-line-1">YOUR TEXT HERE</span>
  <span className="title-line-2">YOUR COMPANY NAME</span>
  <span className="title-line-3">YOUR TAGLINE</span>
</h1>
```

### Changing Colors
Edit the file: `/src/presentation/mobile/styles/mobile.css`

Find these lines at the top (around line 3-9):
```css
:root {
  --primary-green: #00ff00;     /* Main green color */
  --neon-green: #39ff14;        /* Bright neon green */
  --dark-bg: #0a0a0a;           /* Main background */
  --dark-card: #1a1a1a;         /* Card backgrounds */
  --text-white: #ffffff;        /* White text */
  --text-gray: #b0b0b0;         /* Gray text */
}
```

Change these hex color codes to your brand colors!

## Advanced: Adding More Images

If you need additional images not in the list above:

1. **Add the image** to `/src/assets/images/mobile/`

2. **Register it** in `/src/infrastructure/config/assets.config.ts`:
```typescript
export const MOBILE_ASSETS = {
  logo: '/src/assets/images/mobile/logo.png',
  // ... existing images ...
  myNewImage: '/src/assets/images/mobile/my-new-image.png', // Add this line
} as const;
```

3. **Use it** in your component:
```tsx
<img src="/src/assets/images/mobile/my-new-image.png" alt="Description" />
```

## Troubleshooting

### Images not showing?
1. Check filename spelling (case-sensitive!)
2. Verify file is in correct folder
3. Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
4. Check browser console for errors (F12)

### Images too large/small?
- Edit CSS in `/src/presentation/mobile/styles/mobile.css`
- Look for the relevant class name
- Adjust `width`, `height`, or `max-width` properties

### Need help?
- Check the main README.md
- Review the code comments in MobileApp.tsx
- All file paths use `/src/assets/` as the root

## Preview Your Changes

```bash
# Start the development server
npm run dev

# Open browser to: http://localhost:5173
# Resize browser to mobile width (375px) to see mobile design
```

---

**Remember:** All changes are instant with hot reload. Just save your files and the browser will update automatically!
