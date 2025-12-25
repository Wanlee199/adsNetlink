/**
 * Asset Configuration File
 *
 * This file centralizes all asset paths for easy management and replacement.
 * To change any image or asset:
 * 1. Place your new file in the corresponding folder under src/assets/
 * 2. Update the path in this configuration file
 * 3. The change will automatically propagate throughout the application
 */

// Mobile-specific images
export const MOBILE_ASSETS = {
  logo: '/src/assets/images/mobile/logo.png',
  heroLogo: '/src/assets/images/mobile/ic_logo.png',
  heroScreen1: '/src/assets/images/mobile/hero-screen-1.png',
  heroScreen2: '/src/assets/images/mobile/hero-screen-2.png',
  partner1: '/src/assets/images/mobile/partner-1.png',
  partner2: '/src/assets/images/mobile/partner-2.png',
  partner3: '/src/assets/images/mobile/partner-3.png',
  avatar: '/src/assets/images/mobile/avatar.png',
  // Add more mobile-specific images here
} as const;

// Desktop-specific images
export const DESKTOP_ASSETS = {
  logo: '/src/assets/images/desktop/logo.png',
  heroLogo: '/src/assets/images/desktop/logo.png',
  heroScreen1: '/src/assets/images/desktop/hero-screen-1.png',
  heroScreen2: '/src/assets/images/desktop/hero-screen-2.png',
  partner1: '/src/assets/images/desktop/partner-1.png',
  partner2: '/src/assets/images/desktop/partner-2.png',
  partner3: '/src/assets/images/desktop/partner-3.png',
  avatar: '/src/assets/images/desktop/avatar.png',
  // Add more desktop-specific images here
} as const;

// Shared images (used on both mobile and desktop)
export const SHARED_ASSETS = {
  logo: '/src/assets/images/shared/logo.png',
  defaultAvatar: '/src/assets/images/shared/default-avatar.png',
  placeholder: '/src/assets/images/shared/placeholder.png',
  // Add more shared images here
} as const;

// Icons
export const ICONS = {
  menu: '/src/assets/icons/menu.svg',
  close: '/src/assets/icons/close.svg',
  search: '/src/assets/icons/search.svg',
  user: '/src/assets/icons/user.svg',
  // Add more icons here
} as const;

// Helper function to get the appropriate asset based on device type
export const getAssetForDevice = (
  assetKey: keyof typeof MOBILE_ASSETS,
  isMobile: boolean
): string => {
  return isMobile ? MOBILE_ASSETS[assetKey] : DESKTOP_ASSETS[assetKey];
};
