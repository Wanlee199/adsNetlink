import React, { type ReactNode } from 'react';
import { useDevice } from '../contexts/DeviceContext';

interface ResponsiveLayoutProps {
  mobileComponent: ReactNode;
  desktopComponent: ReactNode;
}

/**
 * ResponsiveLayout component that renders different layouts based on device type
 *
 * Usage:
 * <ResponsiveLayout
 *   mobileComponent={<MobileView />}
 *   desktopComponent={<DesktopView />}
 * />
 */
export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  mobileComponent,
  desktopComponent,
}) => {
  const { isMobile } = useDevice();

  return <>{isMobile ? mobileComponent : desktopComponent}</>;
};
