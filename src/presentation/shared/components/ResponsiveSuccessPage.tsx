import React from 'react';
import { SuccessPage } from '../../mobile/SuccessPage';
import { DesktopSuccessPage } from '../../desktop/DesktopSuccessPage';
import { useDevice } from '../contexts/DeviceContext';

export const ResponsiveSuccessPage: React.FC = () => {
    const { isMobile } = useDevice();

    return isMobile ? <SuccessPage /> : <DesktopSuccessPage />;
};
