import { useState, useEffect } from 'react';

// const isDesktopBrowser = (): boolean => {
//   if (typeof window === 'undefined') return true;
//   const userAgent = navigator.userAgent.toLowerCase();
//   const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone', 'opera mini', 'mobile', 'tablet'];
//   return !mobileKeywords.some(keyword => userAgent.includes(keyword));
// };

export const useDeviceDetection = (breakpoint: number = 768) => {
  // const [isActualDesktopBrowser] = useState<boolean>(() => isDesktopBrowser());
  
  const [isWidthBeyondBreakpoint, setIsWidthBeyondBreakpoint] = useState<boolean>(
    () => typeof window !== 'undefined' ? window.innerWidth >= breakpoint : true
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsWidthBeyondBreakpoint(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [breakpoint]);

  const isDesktop = isWidthBeyondBreakpoint;
  const isMobile = !isWidthBeyondBreakpoint;

  return {
    isMobile,
    isDesktop,
    deviceType: (isMobile ? 'mobile' : 'desktop') as 'mobile' | 'desktop',
  };
};