// components/Experience.tsx
import React from 'react';

// Dữ liệu mẫu cho kinh nghiệm
const experiences = [
  {
    role: 'Full-stack Developer',
    company: 'Công ty Công nghệ ABC',
    duration: '01/2023 - Hiện tại',
    description: [
      'Phát triển các tính năng mới cho nền tảng thương mại điện tử sử dụng Next.js và NestJS.',
      'Tối ưu hóa hiệu suất ứng dụng, giảm thời gian tải trang trung bình 30%.',
      'Tham gia vào quy trình code review và triển khai CI/CD.',
    ],
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
  },
  {
    role: 'Front-end Intern',
    company: 'Startup XYZ',
    duration: '06/2022 - 12/2022',
    description: [
      'Hỗ trợ xây dựng giao diện người dùng cho ứng dụng quản lý nội bộ bằng React.',
      'Viết unit tests cho các components chính, đảm bảo chất lượng code.',
    ],
    tags: ['React', 'JavaScript', 'HTML/CSS'],
  },
  // Bạn có thể thêm nhiều mục khác
];

const Experience = () => {
  return (
    <section id="experience" className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-16">
          Kinh Nghiệm & <span className="text-indigo-600">Học Vấn</span>
        </h2>

        {/* Bố cục Dòng Thời Gian */}
        <div className="relative">
          {/* Đường dọc chính của Timeline */}
          <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-indigo-200 hidden md:block"></div>

          {experiences.map((exp, index) => (
            <div 
              key={index} 
              className={`mb-8 flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
            >
              {/* Thẻ Nội Dung (Bên trái hoặc phải) */}
              <div className="md:w-1/2 px-4">
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-500 border border-gray-100 transform hover:-translate-y-1 w-full">
                  <h3 className="text-xl font-bold text-indigo-600">{exp.role}</h3>
                  <p className="text-gray-800 font-semibold mt-1">{exp.company}</p>
                  <p className="text-sm text-gray-500 mb-4 italic">{exp.duration}</p>
                  
                  {/* Mô tả dưới dạng Bullet Points */}
                  <ul className="list-disc space-y-2 text-gray-700 ml-5">
                    {exp.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>

                  {/* Tags Công Nghệ */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="text-xs font-medium bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dấu chấm tròn trên Timeline */}
              <div className="w-8 h-8 bg-indigo-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center z-10 -mt-10 md:mt-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.618a1.5 1.5 0 011.66 2.06L16.29 17.51a.5.5 0 01-.707.001L8.7 10.7a.5.5 0 010-.707l2.842-2.842a1.5 1.5 0 012.06 1.66z"></path></svg>
              </div>

              {/* Khoảng trống trên mobile */}
              <div className="md:w-1/2 hidden md:block"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;