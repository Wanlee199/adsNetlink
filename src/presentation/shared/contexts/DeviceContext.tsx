import React, { createContext, useContext, type ReactNode } from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface DeviceContextType {
  isMobile: boolean;
  isDesktop: boolean;
  deviceType: 'mobile' | 'desktop';
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

interface DeviceProviderProps {
  children: ReactNode;
  breakpoint?: number;
}

export const DeviceProvider: React.FC<DeviceProviderProps> = ({
  children,
  breakpoint = 768,
}) => {
  const deviceInfo = useDeviceDetection(breakpoint);

  return (
    <DeviceContext.Provider value={deviceInfo}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};
