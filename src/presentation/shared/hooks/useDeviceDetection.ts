import { useState, useEffect } from 'react';

/**
 * Check if the browser is running on a desktop device based on User-Agent
 * Returns true for desktop browsers, false for mobile/tablet devices
 */
const isDesktopBrowser = (): boolean => {
  if (typeof window === 'undefined') return true;
  const userAgent = navigator.userAgent.toLowerCase();
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
    'tablet'
  ];

  return !mobileKeywords.some(keyword => userAgent.includes(keyword));
};

/**
 * Custom hook to detect device type (mobile or desktop)
 * Uses User-Agent to determine if on desktop browser - desktop stays desktop even when resized
 *
 * @param breakpoint - The pixel width to determine mobile vs desktop (default: 768px)
 * @returns Object containing device detection information
 */
export const useDeviceDetection = (breakpoint: number = 768) => {
  const [isDesktopDevice] = useState<boolean>(() => isDesktopBrowser());
  
  // Sử dụng matchMedia thay vì đo innerWidth liên tục
  const [isWidthBeyondBreakpoint, setIsWidthBeyondBreakpoint] = useState<boolean>(
    () => typeof window !== 'undefined' ? window.innerWidth >= breakpoint : true
  );

  useEffect(() => {
    // Tạo truy vấn media query
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);
    
    // Hàm callback chỉ chạy KHI breakpoint thay đổi (cực kỳ tiết kiệm hiệu năng)
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsWidthBeyondBreakpoint(e.matches);
    };

    // Lắng nghe sự kiện thay đổi
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [breakpoint]);

  const isDesktop = isDesktopDevice ? true : isWidthBeyondBreakpoint;
  const isMobile = !isDesktop;

  return {
    isMobile,
    isDesktop,
    deviceType: (isMobile ? 'mobile' : 'desktop') as 'mobile' | 'desktop',
  };
  // // Check User-Agent on initial load to determine if desktop browser
  // const [isDesktopDevice] = useState<boolean>(() => isDesktopBrowser());
  // // const [windowWidth, setWindowWidth] = useState<number>(0);
  // const [isWidthBeyondBreakpoint, setIsWidthBeyondBreakpoint] = useState<boolean>(
  //   () => typeof window !== 'undefined' ? window.innerWidth >= breakpoint : true
  // );

  // useEffect(() => {
  //   const handleResize = () => {
  //     setWindowWidth(window.innerWidth);
  //   };

  //   // Initial check
  //   handleResize();

  //   // Add event listener
  //   window.addEventListener('resize', handleResize);

  //   // Cleanup
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  // // If on desktop browser, always return desktop regardless of window size
  // // If on mobile device, use window width to determine
  // const isMobile = isDesktopDevice ? false : windowWidth < breakpoint;
  // const isDesktop = isDesktopDevice ? true : windowWidth >= breakpoint;

  // return {
  //   isMobile,
  //   isDesktop,
  //   windowWidth,
  //   deviceType: (isMobile ? 'mobile' : 'desktop') as 'mobile' | 'desktop',
  // };
};
