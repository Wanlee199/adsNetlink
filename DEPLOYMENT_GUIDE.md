# Deployment Guide - Upload to Hostinger

This guide will help you deploy your React website to Hostinger hosting.

## Prerequisites

- Hostinger hosting account
- FTP/SFTP credentials from Hostinger
- Your images ready (see ASSETS_GUIDE.md)

## Step 1: Add Your Images

Before deploying, add your images to the project:

1. Navigate to `src/assets/images/mobile/`
2. Add these files:
   - `logo.png`
   - `hero-screen-1.png`
   - `hero-screen-2.png`
   - `partner-1.png`
   - `partner-2.png`
   - `partner-3.png`
   - `avatar.png`

See `ASSETS_GUIDE.md` for detailed instructions.

## Step 2: Customize Your Content

Edit `/src/presentation/mobile/MobileApp.tsx` to update:
- Company name and tagline
- Service descriptions
- Contact information
- Pricing information
- FAQ content

## Step 3: Build for Production

Run the build command:

```bash
npm run build
```

This creates a `dist/` folder with optimized files ready for deployment.

## Step 4: Upload to Hostinger

### Method A: Using Hostinger File Manager

1. Log in to your Hostinger account
2. Go to **Files** > **File Manager**
3. Navigate to `public_html/` folder
4. Delete any existing files (if this is a new site)
5. Upload all files from your `dist/` folder:
   - Click **Upload**
   - Select all files from `dist/` folder
   - Wait for upload to complete

### Method B: Using FTP Client (Recommended)

1. **Download an FTP Client:**
   - [FileZilla](https://filezilla-project.org/) (Windows/Mac/Linux)
   - [Cyberduck](https://cyberduck.io/) (Mac/Windows)

2. **Get FTP Credentials from Hostinger:**
   - Go to Hostinger panel
   - **Files** > **FTP Accounts**
   - Note: Hostname, Username, Password, Port

3. **Connect via FTP:**
   - Open your FTP client
   - Enter your Hostinger FTP credentials
   - Connect to server

4. **Upload Files:**
   - Navigate to `public_html/` on server (remote)
   - Navigate to your project's `dist/` folder (local)
   - Select all files in `dist/` folder
   - Upload to `public_html/`

### Method C: Using Command Line (Advanced)

```bash
# Build the project
npm run build

# Upload via SFTP (replace with your credentials)
sftp username@your-domain.com
cd public_html
put -r dist/* .
exit
```

## Step 5: Configure Web Server

For proper routing (if you add React Router later):

1. Create `.htaccess` file in `public_html/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

2. This ensures all routes work correctly

## Step 6: Test Your Website

1. Open your domain in a browser
2. Test on mobile device (or resize browser to mobile width)
3. Check that all images load correctly
4. Test all buttons and links
5. Verify contact information is correct

## Updating Your Website

When you make changes:

1. Edit your code locally
2. Test with `npm run dev`
3. Build: `npm run build`
4. Upload new `dist/` folder contents to Hostinger
5. Clear browser cache and test

## Troubleshooting

### Images Not Loading
- Check file paths in browser console (F12)
- Verify images were uploaded to correct location
- Check file permissions (should be 644)

### Website Shows Blank Page
- Check browser console for errors (F12)
- Verify all files from `dist/` were uploaded
- Check `.htaccess` configuration

### Styles Not Applied
- Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
- Verify CSS file was uploaded
- Check file permissions

### Mobile Version Not Showing
- The site automatically detects device width
- Test by resizing browser to < 768px width
- Or test on actual mobile device

## Performance Optimization

### Enable Gzip Compression

Add to `.htaccess`:

```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

### Enable Browser Caching

Add to `.htaccess`:

```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

## Checklist Before Going Live

- [ ] All images added and optimized
- [ ] Content updated (company info, services, pricing)
- [ ] Contact information correct
- [ ] Build runs without errors (`npm run build`)
- [ ] All files uploaded to Hostinger
- [ ] Website tested on desktop
- [ ] Website tested on mobile
- [ ] Links and buttons work correctly
- [ ] Performance optimizations enabled

## Support

- Hostinger Support: https://www.hostinger.com/tutorials
- Project README: See `README.md` in project root
- Assets Guide: See `ASSETS_GUIDE.md`

## Quick Reference

**Build Command:**
```bash
npm run build
```

**Files to Upload:**
Everything inside the `dist/` folder (not the folder itself, just its contents)

**Upload Location:**
`public_html/` on your Hostinger hosting

**Important Files:**
- `index.html` - Main HTML file
- `assets/` folder - Contains CSS, JS, and images
- `.htaccess` - Server configuration (create manually)

---

Good luck with your deployment! 🚀
