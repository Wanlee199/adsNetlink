import { Routes, Route } from 'react-router-dom';
// import { MobileApp } from './presentation/mobile/MobileApp';
import './App.css';
import { DeviceProvider } from './presentation/shared/contexts/DeviceContext';
import { ResponsiveLayout } from './presentation/shared/components/ResponsiveLayout';
import { ResponsiveSuccessPage } from './presentation/shared/components/ResponsiveSuccessPage';
// import { DesktopApp } from './presentation/desktop/DesktopApp';
import React, { Suspense, lazy } from 'react';

/**
 * Main Application Component
 *
 * Currently showing Mobile UI only.
 * To enable responsive design, uncomment the code below and comment out <MobileApp />
 */
const DesktopApp = lazy(() => 
  import('./presentation/desktop/DesktopApp').then(module => ({ default: module.DesktopApp })));
const MobileApp = lazy(() => 
  import('./presentation/mobile/MobileApp').then(module => ({ default: module.MobileApp })));

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DeviceProvider breakpoint={768}>
            <Suspense fallback={<div>Loading...</div>}>
              <ResponsiveLayout
                mobileComponent={<MobileApp />}
                desktopComponent={<DesktopApp />}
              />
            </Suspense>
          </DeviceProvider>
        }
      />
      <Route
        path="/thank-you"
        element={
          <DeviceProvider breakpoint={768}>
            <ResponsiveSuccessPage />
          </DeviceProvider>
        }
      />
    </Routes>
  );
}

export default App;
