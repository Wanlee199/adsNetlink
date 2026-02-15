import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import emailjs from '@emailjs/browser';
import { DesktopHeader } from './components/DesktopHeader';
import { DesktopFloatingCTA } from './components/DesktopFloatingCTA';
import './styles/desktop.css';
import customerReviews from '../../assets/jsons/customer_review.json';
import faqData from '../../assets/jsons/question_and_answer.json';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

/**
 * Desktop Application Component
 * 
 * Rebuilds the mobile experience for desktop with specific layout requirements:
 * - Header: Logo (Left) | Nav, Button (Right)
 * - Horizontal Padding: 100px
 * - Content: Grid-based adaptation of Mobile content
 */
export const DesktopApp: React.FC = () => {
  const navigate = useNavigate();

  // Helper function to render text with green uppercase words
  const renderTextWithGreenCaps = (text: string) => {
    const words = text.split(/(\s+)/);
    return words.map((word, index) => {
      if (!word) return null;
      if (/^\s+$/.test(word)) {
        return <React.Fragment key={index}>{word}</React.Fragment>;
      }
      const isUpperCase = word === word.toUpperCase() && word !== word.toLowerCase() && word.length >= 2;
      if (isUpperCase) {
        return (
          <React.Fragment key={index}>
            <span className="text-green">{word}</span>
          </React.Fragment>
        );
      }
      return (
        <React.Fragment key={index}>
          {word}
        </React.Fragment>
      );
    });
  };

  const solutionCards = [
    {
      icon: '/icons/ic_beauty.svg',
      category: 'NGÀNH HÀNG\nTHẨM MỸ - SPA',
      title: 'Tài khoản VERIFIED, CHUYÊN BIỆT cho ngành Health & Beauty',
      subtitle: 'Quy trình warm-up\nĐÚNG CHÍNH SÁCH',
      desc: 'Dễ dàng CHẠY XUYÊN SUỐT\ntăng lead đều đặn'
    },
    {
      icon: '/icons/ic_dropshipping.svg',
      category: 'NGÀNH HÀNG\nDROPSHIPPING',
      title: 'Hạn mức CAO, sẵn sàng test NHIỀU SẢN PHẨM cùng lúc',
      subtitle: 'Có quy trình WHITELIST\nnội dung & domain',
      desc: 'Duy trì phân phối ỔN ĐỊNH dù thay đổi nhiều mặt hàng'
    },
    {
      icon: '/icons/ic_skincare.svg',
      category: 'NGÀNH HÀNG\nTHỰC PHẨM CHỨC NĂNG',
      title: 'BM CHUYÊN BIỆT cho nhóm sản phẩm\nHealth & Supplement',
      subtitle: 'Hỗ trợ kiểm duyệt & tư vấn nội dung CHUẨN POLICY',
      desc: 'Có quy trình dự phòng & xử lý sự cố KỊP THỜI'
    },
  ];

  // Desktop Banners
  const banners = [
    '/images/desktop/img_banner_1_desktop.png',
    '/images/desktop/img_banner_2_desktop.png',
    '/images/desktop/img_banner_3_desktop.png',
    '/images/desktop/img_banner_4_desktop.png'
  ];

  const partnerLogos = [
    '/images/partner_logos/l1.png',
    '/images/partner_logos/l2.png',
    '/images/partner_logos/l3.png',
    '/images/partner_logos/l4.png',
    '/images/partner_logos/l5.png',
    '/images/partner_logos/l6.png',
    '/images/partner_logos/l7.png',
    '/images/partner_logos/l8.png',
    '/images/partner_logos/l9.png',
    '/images/partner_logos/l10.png',
    '/images/partner_logos/l11.png',
    '/images/partner_logos/l12.png',
    '/images/partner_logos/l13.png',
    '/images/partner_logos/l14.png',
    '/images/partner_logos/l15.png',
  ];

  const customerLogos = [
    '/images/customer_logos/lk1.png',
    '/images/customer_logos/lk2.png',
    '/images/customer_logos/lk3.png',
    '/images/customer_logos/lk4.png',
    '/images/customer_logos/lk5.png',
    '/images/customer_logos/lk6.png',
    '/images/customer_logos/lk7.png',
    '/images/customer_logos/lk8.png',
    '/images/customer_logos/lk9.png',
    '/images/customer_logos/lk10.png',
    '/images/customer_logos/lk11.png',
  ];

  // State for carousel infinite scrolling
  const [displayReviews, setDisplayReviews] = useState(() => [
    ...customerReviews,
    ...customerReviews,
    ...customerReviews
  ]);
  const [reviewOffset, setReviewOffset] = useState(customerReviews.length);

  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentReview, setCurrentReview] = useState(0);
  const registrationFormRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const solutionRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const partnersRef = useRef<HTMLElement>(null);

  // Registration form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    industries: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const industries = [
    'Mỹ phẩm', 'Thẩm mỹ', 'Spa', 'Thực phẩm chức năng', 'Gia dụng',
    'App', 'Sức khỏe', 'Fitness', 'Dropshipping', 'Thời trang', 'Khác'
  ];

  const toggleIndustry = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter(i => i !== industry)
        : [...prev.industries, industry]
    }));
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   setSubmitError('');

  //   try {
  //     const data = {
  //       name: formData.name,
  //       phone: formData.phone,
  //       categories: formData.industries.join(', ') || 'Không chọn'
  //     };

  //     await fetch('https://script.google.com/macros/s/AKfycbzyNE47n0w-6gh5s3wExk16JIG4qb8VpEylNul-HcJxXgxuynqsNUqDiO61Z2v_Bp5A/exec', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  //       body: JSON.stringify(data)
  //     });

  //     const serviceId = import.meta.env.EMAILJS_SERVICE_ID || '';
  //     const templateId = import.meta.env.EMAILJS_TEMPLATE_ID || '';
  //     const publicKey = import.meta.env.EMAILJS_PUBLIC_KEY || '';

  //     if (serviceId && templateId && publicKey) {
  //       await emailjs.send(
  //         serviceId,
  //         templateId,
  //         {
  //           from_name: formData.name,
  //           from_phone: formData.phone,
  //           industries: formData.industries.join(', ') || 'Không chọn',
  //           to_email: 'tra.nguyen@netlinkad.com'
  //         },
  //         publicKey
  //       );
  //     }

  //     setFormData({ name: '', phone: '', industries: [] });
  //     navigate('/thank-you');
  //   } catch (error) {
  //     console.error('Form submission error:', error);
  //     setSubmitError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
  //     setTimeout(() => setSubmitError(''), 5000);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset states
    setIsSubmitting(true);
    setSubmitError('');

    try {
      if (!executeRecaptcha) throw new Error('reCAPTCHA not ready');
      const token = await executeRecaptcha('submit');
      const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
      let recaptchaToken = token;
      if (!siteKey) {
        throw new Error('reCAPTCHA site key not configured');
      }

      // Load reCAPTCHA script if not present
      if (!(window as any).grecaptcha) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
          script.async = true;
          script.defer = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
          document.head.appendChild(script);
        });
      }

      const payload = {
        name: formData.name,
        phone: formData.phone,
        categories: formData.industries.join(', ') || 'Không chọn',
        recaptchaToken
      };

      const resp = await fetch('/api/sendContact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await resp.json();

      if (!resp.ok) {
        const msg = json?.error || json?.message || 'Lỗi khi gửi form';
        throw new Error(msg);
      }

      const formElement = document.getElementById('contact-form') as HTMLFormElement | null;
      const submitButton = document.getElementById('submit-button') as HTMLButtonElement | null;
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: 'form_submit_success',
        eventModel: {
          // Thông tin định danh (Yêu cầu của bạn)
          form_id: 'contact-form',
          form_name: 'form_submit_success',
          form_destination: window.location.href,

          // Dữ liệu nghiệp vụ từ payload
          industry_selected: payload.categories,
          user_name: payload.name,
          user_phone: payload.phone,

          // Bổ sung các trường bạn đã thắc mắc ở ảnh trước
          // Tự động đếm số lượng trường input/textarea trong form
          form_length: formElement ? formElement.querySelectorAll('input, textarea, select').length : 0,

          // Lấy nội dung text của nút submit (ví dụ: "Gửi ngay")
          form_submit_text: submitButton ? (submitButton.innerText || submitButton.value) : 'undefined',

          // ID Google Ads (Để GTM nhận diện chính xác kênh quảng cáo)
          send_to: "AW-17352267489"
        }
      });

      // success: reset form and navigate
      setFormData({ name: '', phone: '', industries: [] });
      navigate('/thank-you');
    } catch (err: any) {
      console.error('Form submission error:', err);
      setSubmitError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
      setTimeout(() => setSubmitError(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name.trim() !== '' && formData.phone.trim() !== '';

  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000); // 5s for desktop
    return () => clearInterval(bannerInterval);
  }, [banners.length]);

  // Handle infinite scroll by appending/prepending reviews
  useEffect(() => {
    const totalReviews = displayReviews.length;
    const currentIndex = reviewOffset + currentReview;

    // Near the end - append more reviews
    if (currentIndex >= totalReviews - customerReviews.length) {
      setDisplayReviews(prev => [...prev, ...customerReviews]);
    }

    // Near the beginning - prepend more reviews and adjust offset
    if (currentIndex < customerReviews.length) {
      setDisplayReviews(prev => [...customerReviews, ...prev]);
      setReviewOffset(prev => prev + customerReviews.length);
    }
  }, [currentReview, reviewOffset, customerReviews, displayReviews.length]);



  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNavClick = (section: string) => {
    const sectionMap: Record<string, React.RefObject<HTMLElement | null>> = {
      home: heroRef,
      solutions: solutionRef,
      services: servicesRef,
      process: processRef,
      partners: partnersRef,
      contact: registrationFormRef,
    };
    const targetRef = sectionMap[section];
    if (targetRef) {
      scrollToSection(targetRef);
    }
  };

  return (
    <div className="desktop-container">
      <DesktopHeader
        onLogoClick={() => scrollToSection(heroRef)}
        onNavClick={handleNavClick}
        onRegisterClick={() => scrollToSection(registrationFormRef)}
      />

      <main className="desktop-main">
        {/* Hero Section with Banner */}
        <section className="desktop-hero-wrapper" ref={heroRef} id="home">
          {/* Left Column: Banner */}
          <div className="desktop-hero-banner">
            <div className="desktop-banner-container">
              <div
                className="desktop-banner-track"
                style={{ transform: `translateX(-${currentBanner * 100}%)` }}
              >
                {banners.map((banner, index) => (
                  <div key={index} className="desktop-banner-slide">
                    <img src={banner} alt={`Banner ${index + 1}`} className="desktop-banner-image" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Text & CTA */}
          <div className="desktop-hero-content">
            <div className="desktop-hero-title">
              <span className="title-line-1-desktop">PERFORMANCE</span>
              <span className="title-line-1-desktop">MARKETING SOLUTIONS</span>
              <p className="hero-subtitle-text-desktop">Netlink Global - Invoice UK/VN</p>
            </div>
            <button className="header-cta-button hero-cta-button-desktop" onClick={() => scrollToSection(registrationFormRef)}>NHẬN TƯ VẤN</button>
          </div>
        </section>

        {/* Stats */}
        <section className="desktop-consultation">
          <div className="desktop-stats-grid">
            <div className="desktop-stat-item">
              <img src="/icons/ic_human_resource.svg" alt="Nhân sự" className="desktop-stat-icon" />
              <div className="desktop-stat-number">+30</div>
              <div className="desktop-stat-label">Nhân sự<br />kinh nghiệm</div>
            </div>
            <div className="desktop-stat-item">
              <img src="/icons/ic_collaboration.svg" alt="Khách hàng" className="desktop-stat-icon" />
              <div className="desktop-stat-number">+350</div>
              <div className="desktop-stat-label">Khách hàng<br />hợp tác</div>
            </div>
            <div className="desktop-stat-item">
              <img src="/icons/ic_success.svg" alt="Dự án" className="desktop-stat-icon" />
              <div className="desktop-stat-number">+500</div>
              <div className="desktop-stat-label">Dự án<br />thành công</div>
            </div>
            <div className="desktop-stat-item">
              <img src="/icons/ic_satisfy.svg" alt="Hài lòng" className="desktop-stat-icon" />
              <div className="desktop-stat-number">90%</div>
              <div className="desktop-stat-label">Khách hàng<br />hài lòng</div>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="desktop-solutions" ref={solutionRef} id="solutions">
          <h2 className="desktop-section-title">GIẢI PHÁP TOÀN DIỆN<br />CHO CÁC DOANH NGHIỆP</h2>

          {/* Solutions Grid */}
          <div className="desktop-solutions-grid">
            {solutionCards.map((card, index) => (
              <div key={index} className="desktop-solution-card">
                <div className="desktop-solution-icon-container">
                  <img src={card.icon} alt={card.title} className="desktop-solution-icon" />
                </div>
                <div className="desktop-solution-card-category">{renderTextWithGreenCaps(card.category)}</div>
                <img src="/images/mobile/img_solution_text_line.svg" alt="divider" className="desktop-solution-card-divider" />
                <div className="desktop-solution-card-title">{renderTextWithGreenCaps(card.title)}</div>
                <img src="/images/mobile/img_solution_text_line.svg" alt="divider" className="desktop-solution-card-divider" />
                <div className="desktop-solution-card-subtitle">{renderTextWithGreenCaps(card.subtitle)}</div>
                <img src="/images/mobile/img_solution_text_line.svg" alt="divider" className="desktop-solution-card-divider" />
                <div className="desktop-solution-card-desc">{renderTextWithGreenCaps(card.desc)}</div>
                <button className="desktop-solution-card-button" onClick={() => scrollToSection(registrationFormRef)}>NHẬN TƯ VẤN</button>
              </div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="desktop-services" ref={servicesRef} id="services">
          <h2 className="desktop-section-title">DỊCH VỤ CHÚNG TÔI CUNG CẤP</h2>

          {/* Hexagons Image */}
          <div className="desktop-hexagons-container">
            <img
              src="/images/desktop/img_desktop_hexegons.png"
              alt="Services Hexagons"
              className="desktop-hexagons-image"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onLoad={(e) => e.currentTarget.classList.add('loaded')}
            />
          </div>

          <p className="desktop-services-footer">
            Tài khoản whitelisted chính thức, nằm trong hệ thống đối tác uỷ quyền.
          </p>
        </section>

        {/* Service Request Section */}
        <section className="desktop-service-request" ref={processRef} id="process">
          <h2 className="desktop-section-title">
            QUY TRÌNH THUÊ TÀI KHOẢN TẠI NETLINK
          </h2>

          <div className="desktop-steps-container">
            <img
              src="/images/desktop/img_service_steps.png"
              alt="Service Steps"
              className="desktop-steps-image"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onLoad={(e) => e.currentTarget.classList.add('loaded')}
            />
          </div>
        </section>

        {/* Partner and Customer Section */}
        <section className="desktop-partners" ref={partnersRef} id="partners">
          <h2 className="desktop-section-title">ĐỐI TÁC</h2>
          <div className="desktop-logo-scroll-container">
            <div className="desktop-logo-scroll-track">
              {[...partnerLogos, ...partnerLogos].map((logo, index) => (
                <img key={index} src={logo} alt={`Partner ${index + 1}`} className="desktop-logo-item" />
              ))}
            </div>
          </div>

          <h2 className="desktop-section-title" style={{ paddingTop: '30px' }}>KHÁCH HÀNG</h2>
          <p className="desktop-customer-description">
            <span className="text-green">Netlink</span> luôn tự hào khi được đồng hành cùng khách hàng với vai trò là sự lựa chọn
            hàng đầu, nhờ vào chất lượng dịch vụ vượt trội, sự tận tâm trong từng giải pháp
            và cam kết đồng hành lâu dài.
          </p>
          <div className="desktop-logo-scroll-container">
            <div className="desktop-logo-scroll-track">
              {[...customerLogos, ...customerLogos].map((logo, index) => (
                <img key={index} src={logo} alt={`Customer ${index + 1}`} className="desktop-logo-item" />
              ))}
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="desktop-customer-reviews">
          <h2 className="desktop-section-title">KHÁCH HÀNG ĐÁNH GIÁ</h2>

          <div className="desktop-reviews-carousel">
            <button
              className="desktop-review-nav-btn desktop-review-nav-prev"
              onClick={() => setCurrentReview((prev) => prev - 1)}
              aria-label="Previous review"
            >
              <img src="/images/desktop/img_pre_btn.png" alt="Previous" />
            </button>

            <div className="desktop-reviews-container">
              <div
                className="desktop-reviews-track"
                style={{
                  transform: `translateX(calc(-${reviewOffset + currentReview} * (((56vw - 60px) / 4) + 20px)))`
                }}
              >
                {displayReviews.map((review, index) => (
                  <div key={`review-${index}`} className="desktop-review-card">
                    <div className="desktop-review-card-inner">
                      <div className="desktop-review-avatar-container">
                        <img src={review.asset} alt={review.name} className="desktop-review-avatar" />
                      </div>
                      <div className="desktop-review-name">{review.name}</div>
                      <div className="desktop-review-company">{review.company}</div>
                      <div className="desktop-review-location">{review.location}</div>
                      <div className="desktop-review-text">{review.testimonial}</div>
                      <div className="desktop-review-stars">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? "star star-filled" : "star star-empty"}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="desktop-review-nav-btn desktop-review-nav-next"
              onClick={() => setCurrentReview((prev) => prev + 1)}
              aria-label="Next review"
            >
              <img src="/images/desktop/img_next_btn.png" alt="Next" />
            </button>
          </div>
        </section>

        {/* Registration Section */}
        <section className="desktop-registration-section" ref={registrationFormRef} id="contact">
          <h2 className="desktop-registration-title">
            ĐĂNG KÝ NHẬN THÔNG TIN
          </h2>

          <div className="desktop-registration-container">
            {/* Left: Decorative Image */}
            <div className="desktop-registration-image-container">
              <img
                src="/images/desktop/img_registration_decor.png"
                alt="Registration Decor"
                className="desktop-registration-decor-image"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>

            {/* Right: Form */}
            <form id="contact-form" name="form_submit_success" className="desktop-registration-form" onSubmit={handleSubmit}>
              <div className="desktop-form-input-wrapper" data-placeholder="Họ và tên">
                <input
                  type="text"
                  maxLength="20"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="desktop-form-input"
                  required
                />
                {!formData.name && <span className="desktop-placeholder-with-asterisk">Họ và tên <span className="desktop-asterisk-green">*</span></span>}
              </div>

              <div className="desktop-form-input-wrapper" data-placeholder="Số điện thoại">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, phone: value });
                  }}
                  className="desktop-form-input"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                />
                {!formData.phone && <span className="desktop-placeholder-with-asterisk">Số điện thoại <span className="desktop-asterisk-green">*</span></span>}
              </div>

              <div className="desktop-industry-selector">
                <label className="desktop-industry-label">Ngành hàng</label>
                <div className="desktop-industry-tags">
                  {industries.map((industry) => (
                    <button
                      key={industry}
                      type="button"
                      className={`desktop-industry-tag ${formData.industries.includes(industry) ? 'active' : ''}`}
                      onClick={() => toggleIndustry(industry)}
                    >
                      {industry}
                      <span className="desktop-tag-icon">{formData.industries.includes(industry) ? '✓' : '+'}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="submit-button"
                type="submit"
                className={`desktop-submit-button ${isFormValid ? 'enabled' : ''}`}
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? 'ĐANG GỬI...' : 'ĐĂNG KÝ NGAY'}
              </button>

              {submitError && (
                <div className="desktop-form-message desktop-error-message">
                  ✗ {submitError}
                </div>
              )}
            </form>
          </div>
        </section>



        {/* FAQ Section */}
        <section className="desktop-faq-section">
          <h2 className="desktop-registration-title">
            CÂU HỎI THƯỜNG GẶP
          </h2>
          <div className="desktop-faq-container">
            {/* Left Column */}
            <div className="desktop-faq-column">
              {faqData.slice(0, Math.ceil(faqData.length / 2)).map((faq, index) => (
                <div key={index} className="desktop-faq-item">
                  <div className="desktop-faq-question">Q: {faq.Q}</div>
                  <div className="desktop-faq-answer">
                    A: {faq.A.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <br />}
                        {line}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="desktop-faq-column">
              {faqData.slice(Math.ceil(faqData.length / 2)).map((faq, index) => (
                <div key={index} className="desktop-faq-item">
                  <div className="desktop-faq-question">Q: {faq.Q}</div>
                  <div className="desktop-faq-answer">
                    A: {faq.A.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <br />}
                        {line}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="desktop-contact-info-section">
          <h2 className="desktop-contact-info-title">THÔNG TIN LIÊN HỆ</h2>

          <div className="desktop-contact-info-content">
            {/* Column 1: Vietnam & BVI */}
            <div className="desktop-contact-region">
              <h3 className="desktop-contact-region-title">Việt Nam</h3>

              <div className="desktop-contact-office">
                <div className="desktop-contact-office-name">Hà Nội</div>
                <div className="desktop-contact-office-address">Tầng 2, tòa Dolphin Plaza,</div>
                <div className="desktop-contact-office-address">6 Nguyễn Hoàng, Từ Liêm</div>
              </div>

              <div className="desktop-contact-office">
                <div className="desktop-contact-office-name">Hồ Chí Minh</div>
                <div className="desktop-contact-office-address">8-10 Tạ Hiện, Cát Lái</div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h3 className="desktop-contact-region-title">BVI Office</h3>
                <div className="desktop-contact-office-address">OMC Chambers, Wickham Cay 1,</div>
                <div className="desktop-contact-office-address">Road Town, Tortola,</div>
                <div className="desktop-contact-office-address">British Virgin Islands</div>
              </div>
            </div>

            {/* Column 2: HongKong & Singapore */}
            <div className="desktop-contact-region">
              <div>
                <h3 className="desktop-contact-region-title">HongKong</h3>
                <div className="desktop-contact-office-address">Unit 308, 3/F., Chevalier House,</div>
                <div className="desktop-contact-office-address">45-51 Chatham Rd South,</div>
                <div className="desktop-contact-office-address">Tsim Sha Tsui</div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h3 className="desktop-contact-region-title">Singapore</h3>
                <div className="desktop-contact-office-address">470 North Bridge Road,</div>
                <div className="desktop-contact-office-address">#05-12 Bugis Cube</div>
              </div>
            </div>

            {/* Column 3: Email & Button */}
            <div className="desktop-contact-email-section">
              <h3 className="desktop-contact-email-title">Email</h3>
              <a href="mailto:contact@netlinkad.com" className="desktop-contact-email-link">contact@netlinkad.com</a>

              <button
                className="desktop-contact-btn"
                onClick={() => window.location.href = 'mailto:contact@netlinkad.com'}
              >
                LIÊN HỆ NGAY
              </button>
            </div>

            <div className="desktop-contact-copyright">
              © 2025. All rights reserved.
            </div>
          </div>
        </section>

      </main>

      <DesktopFloatingCTA />
    </div>
  );
};
