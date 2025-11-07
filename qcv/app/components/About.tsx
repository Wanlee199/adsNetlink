// components/About.tsx
import React from 'react';
import Image from 'next/image';

const About = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
          Về <span className="text-indigo-600">Tôi</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          
          {/* Cột 1: Thông tin cá nhân và Kỹ năng chính (2/3 chiều rộng trên desktop) */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-600 pl-3">
              Chào, tôi là [Tên Bạn]
            </h3>
            
            <p className="text-gray-700 leading-relaxed text-lg">
              Là một **[Chức danh chính, ví dụ: Full-stack Developer]** với kinh nghiệm **[Số năm]** năm, tôi chuyên 
              về việc xây dựng các ứng dụng web hiệu suất cao và dễ bảo trì. Tôi có niềm đam mê sâu sắc 
              với việc chuyển đổi các ý tưởng phức tạp thành các giải pháp kỹ thuật sạch sẽ và hiệu quả.
            </p>
            
            <p className="text-gray-700 leading-relaxed text-lg">
              Lĩnh vực chuyên môn chính của tôi bao gồm: **Next.js**, **React**, **TypeScript**, và các thư viện 
              front-end hiện đại khác. Tôi luôn tìm kiếm cơ hội để học hỏi các công nghệ mới và mang lại 
              giá trị thực tế cho khách hàng và cộng đồng.
            </p>

            {/* Mục tiêu / Slogan */}
            <blockquote className="border-l-4 border-indigo-300 pl-4 py-2 italic text-gray-500 mt-6">
                "Code sạch, trải nghiệm người dùng tuyệt vời."
            </blockquote>
          </div>

          {/* Cột 2: Ảnh và Kỹ năng (1/3 chiều rộng trên desktop) */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start space-y-8">
             
            {/* Ảnh (Tùy chọn) */}
            <div className="w-full max-w-xs rounded-lg shadow-xl overflow-hidden transform hover:scale-[1.02] transition duration-300">
                {/* Bạn có thể đặt một ảnh chân dung khác ở đây */}
                <Image 
                    src="/about-me-image.jpg" // Đổi đường dẫn ảnh nếu cần
                    alt="Giới thiệu về tôi"
                    width={500}
                    height={500}
                    objectFit="cover"
                />
            </div>
            
            {/* Danh sách kỹ năng nổi bật */}
            <div className="w-full">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Bộ Kỹ Năng Chính</h4>
                <ul className="space-y-3">
                    {['Next.js & React', 'Tailwind CSS', 'Node.js/Express', 'Database (SQL/NoSQL)'].map((skill) => (
                        <li key={skill} className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            {skill}
                        </li>
                    ))}
                </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;