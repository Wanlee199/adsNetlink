import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import emailjs from '@emailjs/browser';
import './styles/mobile.css';
import customerReviews from '../../assets/jsons/customer_review.json';
import faqData from '../../assets/jsons/question_and_answer.json';
import funcWindow from '../../components/sendContact';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
const { executeRecaptcha } = useGoogleReCaptcha();
if (!executeRecaptcha) throw new Error('reCAPTCHA not ready');
const token = await executeRecaptcha('submit');
/**
 * Mobile Application Component
 *
 * Based on the marketing solutions website design with dark theme and green accents
 */
export const MobileApp: React.FC = () => {
  const navigate = useNavigate();

  // Helper function to render text with green uppercase words
  const renderTextWithGreenCaps = (text: string) => {
    // Split by spaces and newlines to process word by word
    const words = text.split(/(\s+)/);
    return words.map((word, index) => {
      // Skip empty strings
      if (!word) return null;

      // Preserve whitespace (spaces, newlines, etc.)
      if (/^\s+$/.test(word)) {
        return <React.Fragment key={index}>{word}</React.Fragment>;
      }

      // Check if word is all uppercase (including Vietnamese characters)
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

  // Solution cards data - customize these as needed
  const solutionCards = [
    {
      icon: '/icons/ic_beauty.svg',
      category: 'NGÀNH HÀNG\nTHẨM MỸ - SPA',
      title: 'Tài khoản VERIFIED, CHUYÊN BIỆT cho ngành Health & Beauty',
      subtitle: 'Quy trình warm-up ĐÚNG CHÍNH SÁCH',
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

  const banners = [
    '/images/mobile/img_banner_1.png',
    '/images/mobile/img_banner_2.png',
    '/images/mobile/img_banner_3.png',
    '/images/mobile/img_banner_4.png',
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

  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentSolution, setCurrentSolution] = useState(Math.floor(solutionCards.length / 2));
  const [currentReview, setCurrentReview] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [solutionTouchStart, setSolutionTouchStart] = useState(0);
  const [solutionTouchEnd, setSolutionTouchEnd] = useState(0);
  const [reviewTouchStart, setReviewTouchStart] = useState(0);
  const [reviewTouchEnd, setReviewTouchEnd] = useState(0);
  const reviewTextRefs = useRef<(HTMLDivElement | null)[]>([]);
  const registrationFormRef = useRef<HTMLElement>(null);

  // Registration form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    industries: [] as string[]
  });

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // FAQ expand/collapse state
  const [expandedFaq, setExpandedFaq] = useState<number[]>([]);
  const [showAllFaq, setShowAllFaq] = useState(false);

  const industries = [
    'Mỹ phẩm',
    'Thẩm mỹ',
    'Spa',
    'Thực phẩm chức năng',
    'Gia dụng',
    'App',
    'Sức khỏe',
    'Fitness',
    'Dropshipping',
    'Thời trang',
    'Khác'
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

  //   // Reset states
  //   setIsSubmitting(true);
  //   setSubmitError('');

  //   try {
  //     // Also send to Google Sheets (optional - keep existing functionality)
  //     const data = {
  //       name: formData.name,
  //       phone: formData.phone,
  //       categories: formData.industries.join(', ') || 'Không chọn'
  //     };

  //     await fetch('https://script.google.com/macros/s/AKfycbzyNE47n0w-6gh5s3wExk16JIG4qb8VpEylNul-HcJxXgxuynqsNUqDiO61Z2v_Bp5A/exec', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'text/plain;charset=utf-8'
  //       },
  //       body: JSON.stringify(data)
  //     });

  //     console.log('Form submitted successfully');

  //     // EmailJS configuration - Replace these with your actual EmailJS credentials
  //     // const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
  //     // const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
  //     // const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

  //     // // Prepare template parameters for EmailJS
  //     // const templateParams = {
  //     //   from_name: formData.name,
  //     //   from_phone: formData.phone,
  //     //   industries: formData.industries.join(', ') || 'Không chọn',
  //     //   // to_email: 'contact@netlinkad.com', // Your receiving email
  //     //   to_email: 'tra.nguyen@netlinkad.com'
  //     // };

  //     // // Send email using EmailJS
  //     // await emailjs.send(
  //     //   serviceId,
  //     //   templateId,
  //     //   templateParams,
  //     //   publicKey
  //     // );

  //     // Reset form after successful submission
  //     setFormData({
  //       name: '',
  //       phone: '',
  //       industries: []
  //     });

  //     // Navigate to thank you page
  //     navigate('/thank-you');
  //   } catch (error) {
  //     console.error('Form submission error:', error);
  //     setSubmitError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');

  //     // Hide error message after 5 seconds
  //     setTimeout(() => {
  //       setSubmitError('');
  //     }, 5000);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset states
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
      let recaptchaToken = '';
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

      recaptchaToken = token;

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

      // success: reset form and navigate
      setFormData({ name: '', phone: '', industries: [] });
      navigate('/thank-you');
    } catch (err: any) {
      console.error('Form submission error:', err);
      setSubmitError(err?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
      setTimeout(() => setSubmitError(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name.trim() !== '' && formData.phone.trim() !== '';

  const toggleFaq = (index: number) => {
    setExpandedFaq(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  useEffect(() => {
    // Adjust font size for testimonials that are too long
    const adjustTextSize = () => {
      reviewTextRefs.current.forEach((textEl) => {
        if (textEl) {
          let fontSize = 15; // Starting font size
          textEl.style.fontSize = `${fontSize}px`;

          // Reduce font size if text overflows
          while (textEl.scrollHeight > textEl.clientHeight && fontSize > 11) {
            fontSize -= 0.5;
            textEl.style.fontSize = `${fontSize}px`;
          }
        }
      });
    };

    // Run after component mounts
    const timer = setTimeout(adjustTextSize, 100);
    window.addEventListener('resize', adjustTextSize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', adjustTextSize);
    };
  }, []);

  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);

    const solutionInterval = setInterval(() => {
      setCurrentSolution((prev) => (prev + 1) % solutionCards.length);
    }, 4000);

    return () => {
      clearInterval(bannerInterval);
      clearInterval(solutionInterval);
    };
  }, [banners.length, solutionCards.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }
    if (touchStart - touchEnd < -50) {
      setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
    }
  };

  const handleSolutionTouchStart = (e: React.TouchEvent) => {
    setSolutionTouchStart(e.targetTouches[0].clientX);
  };

  const handleSolutionTouchMove = (e: React.TouchEvent) => {
    setSolutionTouchEnd(e.targetTouches[0].clientX);
  };

  const handleSolutionTouchEnd = () => {
    if (solutionTouchStart - solutionTouchEnd > 50) {
      setCurrentSolution((prev) => (prev + 1) % solutionCards.length);
    }
    if (solutionTouchStart - solutionTouchEnd < -50) {
      setCurrentSolution((prev) => (prev - 1 + solutionCards.length) % solutionCards.length);
    }
  };

  const handleReviewTouchStart = (e: React.TouchEvent) => {
    setReviewTouchStart(e.targetTouches[0].clientX);
  };

  const handleReviewTouchMove = (e: React.TouchEvent) => {
    setReviewTouchEnd(e.targetTouches[0].clientX);
  };

  const handleReviewTouchEnd = () => {
    if (reviewTouchStart - reviewTouchEnd > 50) {
      setCurrentReview((prev) => (prev + 1) % customerReviews.length);
    }
    if (reviewTouchStart - reviewTouchEnd < -50) {
      setCurrentReview((prev) => (prev - 1 + customerReviews.length) % customerReviews.length);
    }
  };

  const scrollToRegistrationForm = () => {
    registrationFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="mobile-container">
      <main className="mobile-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-subtitle-logo">
            <img src="/icons/ic_logo.png" alt="Netlink Global" className="subtitle-logo" />
          </div>
          <h1 className="hero-title">
            <span className="title-line-1">PERFORMANCE</span>
            <span className="title-line-2">MARKETING SOLUTIONS</span>
          </h1>
          <p className="hero-subtitle-text">Netlink Global - Invoice UK/VN</p>
        </section>

        {/* Auto-scrolling Banner Carousel */}
        <section className="banner-carousel">
          <div
            className="banner-container"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="banner-track"
              style={{ transform: `translateX(-${currentBanner * 100}%)` }}
            >
              {banners.map((banner, index) => (
                <div key={index} className="banner-slide">
                  <img src={banner} alt={`Banner ${index + 1}`} className="banner-image" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Consultation Section */}
        <section className="consultation-section">
          <button className="consultation-button" onClick={scrollToRegistrationForm}>NHẬN TƯ VẤN</button>

          <div className="stats-grid">
            <div className="stat-item">
              <img src="/icons/ic_human_resource.svg" alt="Nhân sự" className="stat-icon" />
              <div className="stat-number">+30</div>
              <div className="stat-label">Nhân sự<br />kinh nghiệm</div>
            </div>

            <div className="stat-item">
              <img src="/icons/ic_collaboration.svg" alt="Khách hàng" className="stat-icon" />
              <div className="stat-number">+350</div>
              <div className="stat-label">Khách hàng<br />hợp tác</div>
            </div>

            <div className="stat-item">
              <img src="/icons/ic_success.svg" alt="Dự án" className="stat-icon" />
              <div className="stat-number">+500</div>
              <div className="stat-label">Dự án<br />thành công</div>
            </div>

            <div className="stat-item">
              <img src="/icons/ic_satisfy.svg" alt="Hài lòng" className="stat-icon" />
              <div className="stat-number">90%</div>
              <div className="stat-label">Khách hàng<br />hài lòng</div>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="solutions-section">
          <h2 className="solutions-title">GIẢI PHÁP TOÀN DIỆN</h2>
          <h2 className="solutions-title">CHO CÁC DOANH NGHIỆP</h2>

          {/* Solutions Carousel */}
          <div className="solutions-carousel">
            <div
              className="solutions-carousel-container"
              onTouchStart={handleSolutionTouchStart}
              onTouchMove={handleSolutionTouchMove}
              onTouchEnd={handleSolutionTouchEnd}
            >
              <div
                className="solutions-carousel-track"
                style={{ transform: `translateX(calc(-${currentSolution * 70}vw - ${currentSolution * 20}px))` }}
              >
                {solutionCards.map((card, index) => (
                  <div key={index} className={`solution-card ${index === currentSolution ? 'active' : ''}`}>
                    <div className="solution-card-icon-container">
                      <img src={card.icon} alt={card.title} className="solution-card-icon" />
                    </div>
                    <div className="solution-card-category">{renderTextWithGreenCaps(card.category)}</div>
                    <img src="/images/mobile/img_solution_text_line.svg" alt="divider" className="solution-card-divider" />
                    <div className="solution-card-title">{renderTextWithGreenCaps(card.title)}</div>
                    <img src="/images/mobile/img_solution_text_line.svg" alt="divider" className="solution-card-divider" />
                    <div className="solution-card-subtitle">{renderTextWithGreenCaps(card.subtitle)}</div>
                    <img src="/images/mobile/img_solution_text_line.svg" alt="divider" className="solution-card-divider" />
                    <div className="solution-card-desc">{renderTextWithGreenCaps(card.desc)}</div>
                    <button className="solution-card-button" onClick={scrollToRegistrationForm}>NHẬN TƯ VẤN</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="solutions-indicators">
              {solutionCards.map((_, index) => (
                <span
                  key={index}
                  className={`indicator ${index === currentSolution ? 'active' : ''}`}
                  onClick={() => setCurrentSolution(index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-hexagon-section">
          <h2 className="services-hexagon-title">DỊCH VỤ CHÚNG TÔI</h2>
          <h2 className="services-hexagon-title">CUNG CẤP</h2>
          <p className="services-hexagon-subtitle">
            Hỗ trợ trên nhiều hệ sinh thái như:<br />
            Google Ads, Facebook Ads,<br />
            TikTok Ads, Apple Ads.
          </p>

          <div className="hexagon-row">
            <img src="/images/mobile/img_decoration_hexegon.png" alt="Hexagon" className="hexagon-image" />
            <div className="hexagon-wrapper">
              <img src="/images/mobile/img_glow_hexegon.png" alt="Hexagon Glow" className="hexagon-image" />
              <div className="hexagon-content">
                <img src="/icons/ic_google.png" alt="Google" className="hexagon-icon" />
                <div className="hexagon-title">MCC mạnh</div>
                <div className="hexagon-subtitle">Lịch sử sạch</div>
              </div>
            </div>
            <img src="/images/mobile/img_decoration_hexegon.png" alt="Hexagon" className="hexagon-image" />
          </div>

          <div className="hexagon-row hexagon-row-no-gap">
            <div className="hexagon-wrapper">
              <img src="/images/mobile/img_glow_hexegon.png" alt="Hexagon Glow" className="hexagon-image" />
              <div className="hexagon-content">
                <img src="/icons/ic_fb.png" alt="Facebook" className="hexagon-icon" />
                <div className="hexagon-title">No Limit</div>
                <div className="hexagon-subtitle">
                  BM10000<br />
                  vít ngân sách<br />
                  thoải mái
                </div>
              </div>
            </div>
            <div className="hexagon-wrapper">
              <img src="/images/mobile/img_glow_hexegon.png" alt="Hexagon Glow" className="hexagon-image" />
              <div className="hexagon-content">
                <img src="/icons/ic_tiktok.png" alt="Facebook" className="hexagon-icon" />
                <div className="hexagon-title">Siêu khoẻ</div>
                <div className="hexagon-subtitle">
                  Bao trâu, bao<br />
                  ổn định
                </div>
              </div>
            </div>
          </div>

          <div className="hexagon-row hexagon-row-third">
            <img src="/images/mobile/img_decoration_hexegon.png" alt="Hexagon" className="hexagon-image" />
            <div className="hexagon-wrapper">
              <img src="/images/mobile/img_glow_hexegon.png" alt="Hexagon Glow" className="hexagon-image" />
              <div className="hexagon-content">
                <img src="/icons/ic_apple.png" alt="Google" className="hexagon-icon" />
                <div className="hexagon-title">Tăng trưởng</div>
                <div className="hexagon-subtitle">Tối ưu Apple Store, tăng chuyển đổi</div>
              </div>
            </div>
            <img src="/images/mobile/img_decoration_hexegon.png" alt="Hexagon" className="hexagon-image" />
          </div>

          <p className="services-hexagon-footer">
            Tài khoản whitelisted chính thức,<br />
            nằm trong hệ thống đối tác uỷ quyền.
          </p>

          <div className="pricing-badge-container">
            <img src="/images/mobile/img_green_placeholder.svg" alt="Pricing Badge" className="pricing-badge-image" />
            <div className="pricing-badge-text">
              <div className="pricing-badge-title">PHÍ THUÊ SIÊU ƯU ĐÃI</div>
              <div className="pricing-badge-percentage">CHỈ TỪ 2%</div>
            </div>
          </div>

        </section>

        {/* Service Request Section */}
        <section className="service-request-section">
          <h2 className="service-request-title">
            QUY TRÌNH<br />
            THUÊ TÀI KHOẢN<br />
            TẠI NETLINK
          </h2>

          <div className="steps-container">
            {/* Step 1 - Left */}
            <div className="step-item step-left">
              <img src="/images/mobile/img_step_left.png" alt="Step 1" className="step-bg-image" />
              <div className="step-content">
                <div className="step-hexagon">
                  <img src="/icons/ic_step_1.svg" alt="Step 1 Icon" className="step-icon" />
                </div>
                <div className="step-title">{"Gửi URL\nkiểm duyệt"}</div>
                <div className="step-number">01</div>
              </div>
            </div>

            {/* Step 2 - Right */}
            <div className="step-item step-right">
              <img src="/images/mobile/img_step_right.png" alt="Step 2" className="step-bg-image" />
              <div className="step-content">
                <div className="step-number">02</div>
                <div className="step-title">{"Bổ sung asset\n(nếu cần)"}</div>
                <div className="step-hexagon">
                  <img src="/icons/ic_step_2.svg" alt="Step 2 Icon" className="step-icon" />
                </div>
              </div>
            </div>

            {/* Step 3 - Left */}
            <div className="step-item step-left">
              <img src="/images/mobile/img_step_left.png" alt="Step 3" className="step-bg-image" />
              <div className="step-content">
                <div className="step-hexagon">
                  <img src="/icons/ic_step_3.svg" alt="Step 3 Icon" className="step-icon" />
                </div>
                <div className="step-title">{"Cung cấp\nthông tin hợp đồng"}</div>
                <div className="step-number">03</div>
              </div>
            </div>

            {/* Step 4 - Right */}
            <div className="step-item step-right">
              <img src="/images/mobile/img_step_right.png" alt="Step 4" className="step-bg-image" />
              <div className="step-content">
                <div className="step-number">04</div>
                <div className="step-title">{"Review & ký\nhợp đồng"}</div>
                <div className="step-hexagon">
                  <img src="/icons/ic_step_4.svg" alt="Step 4 Icon" className="step-icon" />
                </div>
              </div>
            </div>

            {/* Step 5 - Left */}
            <div className="step-item step-left">
              <img src="/images/mobile/img_step_left.png" alt="Step 5" className="step-bg-image" />
              <div className="step-content">
                <div className="step-hexagon">
                  <img src="/icons/ic_step_5.svg" alt="Step 5 Icon" className="step-icon" />
                </div>
                <div className="step-title">Thanh toán phí</div>
                <div className="step-number">05</div>
              </div>
            </div>

            {/* Step 6 - Right */}
            <div className="step-item step-right">
              <img src="/images/mobile/img_step_right.png" alt="Step 6" className="step-bg-image" />
              <div className="step-content">
                <div className="step-number">06</div>
                <div className="step-title">Cung cấp thông tin triển khai</div>
                <div className="step-hexagon">
                  <img src="/icons/ic_step_6.svg" alt="Step 6 Icon" className="step-icon" />
                </div>
              </div>
            </div>

            {/* Step 7 - Left */}
            <div className="step-item step-left">
              <img src="/images/mobile/img_step_left.png" alt="Step 7" className="step-bg-image" />
              <div className="step-content">
                <div className="step-hexagon">
                  <img src="/icons/ic_step_7.svg" alt="Step 7 Icon" className="step-icon" />
                </div>
                <div className="step-title">{"Netlink bàn giao\ntài khoản"}</div>
                <div className="step-number">07</div>
              </div>
            </div>

          </div>
        </section>

        {/* Partner and Customer Section */}
        <section className="partner-customer-section">
          <h2 className="partner-customer-title">ĐỐI TÁC</h2>
          <div className="logo-scroll-container">
            <div className="logo-scroll-track">
              {[...partnerLogos, ...partnerLogos].map((logo, index) => (
                <img key={index} src={logo} alt={`Partner ${index + 1}`} className="logo-item" />
              ))}
            </div>
          </div>

          <h2 className="partner-customer-title">KHÁCH HÀNG</h2>
          <p className="customer-description">
            Netlink luôn tự hào khi được đồng hành<br />
            cùng khách hàng với vai trò là sự lựa chọn<br />
            hàng đầu, nhờ vào chất lượng dịch vụ<br />
            vượt trội, sự tận tâm trong từng giải pháp<br />
            và cam kết đồng hành lâu dài.
          </p>
          <div className="logo-scroll-container">
            <div className="logo-scroll-track">
              {[...customerLogos, ...customerLogos].map((logo, index) => (
                <img key={index} src={logo} alt={`Customer ${index + 1}`} className="logo-item" />
              ))}
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="customer-reviews-section">
          <h2 className="customer-reviews-title">
            KHÁCH HÀNG<br />
            ĐÁNH GIÁ
          </h2>

          <div className="reviews-carousel">
            <div
              className="reviews-carousel-container"
              onTouchStart={handleReviewTouchStart}
              onTouchMove={handleReviewTouchMove}
              onTouchEnd={handleReviewTouchEnd}
            >
              <div
                className="reviews-carousel-track"
                style={{ transform: `translateX(calc(-${currentReview * 70}vw - ${currentReview * 20}px))` }}
              >
                {customerReviews.map((review, index) => (
                  <div
                    key={index}
                    className={`review-card ${index === currentReview ? 'active' : ''}`}
                  >
                    <div className="review-card-inner">
                      <div className="review-avatar-container">
                        <img src={review.asset} alt={review.name} className="review-avatar" />
                      </div>

                      <div className="review-name">{review.name}</div>
                      <div className="review-company">{review.company}</div>
                      <div className="review-location">{review.location}</div>

                      <div
                        className="review-text"
                        ref={(el) => { reviewTextRefs.current[index] = el; }}
                      >
                        {review.testimonial}
                      </div>

                      <div className="review-stars">
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i} className="star">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Registration Section */}
        <section className="registration-section" ref={registrationFormRef}>
          <h2 className="registration-title">
            ĐĂNG KÝ<br />
            NHẬN THÔNG TIN
          </h2>

          <form id="contact-form" className="registration-form" onSubmit={handleSubmit}>
            <div className="form-input-wrapper" data-placeholder="Họ và tên">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input form-input-required"
                required
              />
              {!formData.name && <span className="placeholder-with-asterisk">Họ và tên <span className="asterisk-green">*</span></span>}
            </div>

            <div className="form-input-wrapper" data-placeholder="Số điện thoại">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, phone: value });
                }}
                className="form-input form-input-required"
                inputMode="numeric"
                pattern="[0-9]*"
                required
              />
              {!formData.phone && <span className="placeholder-with-asterisk">Số điện thoại <span className="asterisk-green">*</span></span>}
            </div>

            <div className="industry-selector">
              <label className="industry-label">Ngành hàng</label>
              <div className="industry-tags">
                {industries.map((industry) => (
                  <button
                    key={industry}
                    type="button"
                    className={`industry-tag ${formData.industries.includes(industry) ? 'active' : ''}`}
                    onClick={() => toggleIndustry(industry)}
                  >
                    {industry}
                    <span className="tag-icon">{formData.industries.includes(industry) ? '✓' : '+'}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className={`submit-button ${isFormValid ? 'enabled' : ''}`}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'ĐANG GỬI...' : 'ĐĂNG KÝ NGAY'}
            </button>

            {submitError && (
              <div className="form-message error-message">
                ✗ {submitError}
              </div>
            )}
          </form>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2 className="faq-title">CÂU HỎI THƯỜNG GẶP</h2>

          <div className="faq-list">
            {faqData.slice(0, showAllFaq ? faqData.length : 2).map((faq, index) => (
              <div key={index} className="faq-item">
                <div
                  className="faq-question-header"
                  onClick={() => toggleFaq(index)}
                >
                  <div className="faq-question">
                    <span className="faq-label">Q:</span> {faq.Q.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <br />}
                        {line}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className={`faq-icon ${expandedFaq.includes(index) ? 'expanded' : ''}`}>
                    {expandedFaq.includes(index) ? '−' : '+'}
                  </div>
                </div>
                {expandedFaq.includes(index) && (
                  <div className="faq-answer">
                    <span className="faq-label">A:</span> {faq.A.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <br />}
                        {line}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {faqData.length > 2 && (
            <button
              className="faq-show-more"
              onClick={() => setShowAllFaq(!showAllFaq)}
            >
              {showAllFaq ? 'Thu gọn' : `Xem thêm ${faqData.length - 2} câu hỏi`}
            </button>
          )}
        </section>

        {/* Contact Info Section */}
        <section className="contact-info-section">
          <h2 className="contact-info-title">THÔNG TIN LIÊN HỆ</h2>

          <div className="contact-info-content">
            <div className="contact-region">
              <h3 className="contact-region-title">Việt Nam</h3>

              <div className="contact-office">
                <div className="contact-office-name">Hà Nội</div>
                <div className="contact-office-address">Tầng 2, tòa Dolphin Plaza, 6 Nguyễn Hoàng, Từ Liêm</div>
              </div>

              <div className="contact-office">
                <div className="contact-office-name">Hồ Chí Minh</div>
                <div className="contact-office-address">8-10 Tạ Hiện, Cát Lái</div>
              </div>
            </div>

            <div className="contact-region">
              <h3 className="contact-region-title">HongKong</h3>
              <div className="contact-office-address">Unit 308, 3/F., Chevalier House,</div>
              <div className="contact-office-address">45-51 Chatham Rd South, Tsim Sha Tsui</div>
            </div>

            <div className="contact-region">
              <h3 className="contact-region-title">Singapore</h3>
              <div className="contact-office-address">470 North Bridge Road, #05-12 Bugis Cube</div>
            </div>

            <div className="contact-region">
              <h3 className="contact-region-title">BVI Office</h3>
              <div className="contact-office-address">OMC Chambers, Wickham Cay 1, Road Town,</div>
              <div className="contact-office-address">Tortola, British Virgin Islands</div>
            </div>

            <div className="contact-divider"></div>

            <div className="contact-email-section">
              <h3 className="contact-email-title">Email</h3>
              <a href="mailto:contact@netlinkad.com" className="contact-email-link">contact@netlinkad.com</a>
            </div>

            <div className="contact-copyright">
              © 2025. All rights reserved.
            </div>
          </div>
        </section>
      </main>

      {/* Floating CTA Buttons */}
      <div className="floating-cta">
        <a href="tel:0393529682">
          <img src="/icons/ic_cta_call.svg" alt="Call" className="cta-icon" />
        </a>
        <a href="http://m.me/477906138739476" target="_blank" rel="noopener noreferrer">
          <img src="/icons/ic_cta_message.svg" alt="Message" className="cta-icon" />
        </a>
      </div>
    </div>
  );
};
