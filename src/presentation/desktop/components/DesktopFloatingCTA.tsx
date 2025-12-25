import React from 'react';
import './DesktopFloatingCTA.css';

export const DesktopFloatingCTA: React.FC = () => {
    return (
        <div className="desktop-floating-cta">
            <a href="tel:0393529682">
                <img src="/images/desktop/ic_call_desktop.png" alt="Call" className="desktop-cta-icon" />
            </a>
            <a href="http://m.me/477906138739476" target="_blank" rel="noopener noreferrer">
                <img src="/images/desktop/ic_mess_desktop.png" alt="Message" className="desktop-cta-icon" />
            </a>
        </div>
    );
};
