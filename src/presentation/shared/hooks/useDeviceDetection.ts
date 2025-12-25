import { useState, useEffect } from 'react';

/**
 * Check if the browser is running on a desktop device based on User-Agent
 * Returns true for desktop browsers, false for mobile/tablet devices
 */
const isDesktopBrowser = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();

  // Check for mobile/tablet indicators in User-Agent
  const mobileKeywords = [
    'android',
    'webos',
    'iphone',
    'ipad',
    'ipod',
    'blackberry',
    'windows phone',
    'opera mini',
    'mobile',
    'tablet',
  ];

  const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword));

  return !isMobileDevice;
};

/**
 * Custom hook to detect device type (mobile or desktop)
 * Uses User-Agent to determine if on desktop browser - desktop stays desktop even when resized
 *
 * @param breakpoint - The pixel width to determine mobile vs desktop (default: 768px)
 * @returns Object containing device detection information
 */
export const useDeviceDetection = (breakpoint: number = 768) => {
  // Check User-Agent on initial load to determine if desktop browser
  const [isDesktopDevice] = useState<boolean>(() => isDesktopBrowser());
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If on desktop browser, always return desktop regardless of window size
  // If on mobile device, use window width to determine
  const isMobile = isDesktopDevice ? false : windowWidth < breakpoint;
  const isDesktop = isDesktopDevice ? true : windowWidth >= breakpoint;

  return {
    isMobile,
    isDesktop,
    windowWidth,
    deviceType: (isMobile ? 'mobile' : 'desktop') as 'mobile' | 'desktop',
  };
};
