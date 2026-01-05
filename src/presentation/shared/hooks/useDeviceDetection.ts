import { useState, useEffect } from 'react';

// Giữ nguyên logic User-Agent nếu bạn muốn ưu tiên định danh thiết bị
const isDesktopBrowser = (): boolean => {
  if (typeof window === 'undefined') return true;
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone', 'opera mini', 'mobile', 'tablet'];
  return !mobileKeywords.some(keyword => userAgent.includes(keyword));
};

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
};