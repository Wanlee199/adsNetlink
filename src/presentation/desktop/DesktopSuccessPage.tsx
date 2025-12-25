import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DesktopHeader } from './components/DesktopHeader';
import { DesktopFloatingCTA } from './components/DesktopFloatingCTA';
import './styles/desktop-success.css';

export const DesktopSuccessPage: React.FC = () => {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToRegistration = () => {
        navigate('/');
        setTimeout(() => {
            const registrationSection = document.getElementById('contact');
            registrationSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleNavClick = (section: string) => {
        if (section === 'home') {
            handleBackToHome();
        } else if (section === 'contact') {
            scrollToRegistration();
        } else {
            handleBackToHome();
        }
    };

    return (
        <div className="desktop-success-container">
            <DesktopHeader
                onLogoClick={handleBackToHome}
                onNavClick={handleNavClick}
                onRegisterClick={scrollToRegistration}
            />

            {/* Main Success Content */}
            <main className="desktop-success-main">
                <div className="desktop-success-content">
                    <h1 className="desktop-success-title">
                        CẢM ƠN BẠN<br />
                        ĐÃ ĐỂ LẠI THÔNG TIN
                    </h1>
                    <p className="desktop-success-description">
                        <span className="netlink-highlight">Netlink</span> sẽ sớm liên hệ với bạn để xác nhận thông tin.<br />
                        Hãy chú ý điện thoại để không bỏ lỡ cuộc gọi từ <span className="netlink-highlight">Netlink</span> nhé!
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="desktop-success-footer">
                <div className="desktop-success-footer-copyright">
                    © 2025. All rights reserved.
                </div>
            </footer>

            <DesktopFloatingCTA />
        </div>
    );
};
