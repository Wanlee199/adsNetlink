import React from 'react';
import './DesktopHeader.css';

interface DesktopHeaderProps {
    onLogoClick: () => void;
    onNavClick: (section: string) => void;
    onRegisterClick: () => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
    onLogoClick,
    onNavClick,
    onRegisterClick,
}) => {
    return (
        <header className="desktop-header">
            <div className="desktop-logo-container" onClick={onLogoClick}>
                <img src="/icons/ic_logo.png" alt="Netlink Global" className="desktop-logo" />
            </div>
            <div className="desktop-nav-area">
                <nav className="desktop-nav">
                    <ul>
                        <li>
                            <a
                                href="#home"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onNavClick('home');
                                }}
                            >
                                Trang chủ
                            </a>
                        </li>
                        <li>
                            <a
                                href="#solutions"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onNavClick('solutions');
                                }}
                            >
                                Giải pháp
                            </a>
                        </li>
                        <li>
                            <a
                                href="#services"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onNavClick('services');
                                }}
                            >
                                Dịch vụ
                            </a>
                        </li>
                        <li>
                            <a
                                href="#process"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onNavClick('process');
                                }}
                            >
                                QUY TRÌNH
                            </a>
                        </li>
                        <li>
                            <a
                                href="#partners"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onNavClick('partners');
                                }}
                            >
                                ĐỐI TÁC
                            </a>
                        </li>
                        <li>
                            <a
                                href="#contact"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onNavClick('contact');
                                }}
                            >
                                Liên hệ
                            </a>
                        </li>
                    </ul>
                </nav>
                <button className="header-cta-button" onClick={onRegisterClick}>
                    ĐĂNG KÝ
                </button>
            </div>
        </header>
    );
};
