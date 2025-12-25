import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/success.css';

export const SuccessPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="success-page-container">
      <div className="success-page-content">
        {/* Logo */}
        <div className="success-logo">
          <img src="/icons/ic_logo.png" alt="Netlink Global" className="logo-image" />
        </div>

        {/* Success Icon */}
        <div className="success-icon-container">
          <img src="/icons/ic_heart.png" alt="Success" className="success-heart-icon" />
        </div>

        {/* Success Message */}
        <h1 className="success-title">
          Cảm ơn bạn<br />
          đã để lại thông tin
        </h1>

        {/* Description */}
        <p className="success-description">
          <span className="brand-name">Netlink</span> sẽ sớm liên hệ với bạn<br />
          để xác nhận thông tin. Hãy chú ý<br />
          điện thoại để không bỏ lỡ cuộc<br />
          gọi từ <span className="brand-name-green">Netlink</span> nhé!
        </p>

        {/* Back to Home Button */}
        <button className="back-to-home-button" onClick={handleBackToHome}>
          TRỞ LẠI TRANG CHỦ
        </button>
      </div>
    </div>
  );
};
