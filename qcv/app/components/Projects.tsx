// components/Project.tsx
import React from 'react';
import Image from 'next/image';

// Dữ liệu mẫu cho các dự án
const projects = [
  {
    title: 'Nền tảng Thương mại Điện tử',
    description: 'Xây dựng một nền tảng E-commerce với các tính năng đăng nhập, giỏ hàng, và thanh toán tích hợp.',
    imageUrl: '/project-ecommerce.jpg', // Thay bằng ảnh dự án của bạn
    technologies: ['Next.js', 'Stripe', 'Tailwind CSS', 'Prisma'],
    link: 'https://github.com/your-username/ecommerce-project',
  },
  {
    title: 'Ứng dụng Quản lý Nhiệm vụ',
    description: 'Một ứng dụng web đơn giản để theo dõi và quản lý công việc hàng ngày, có tích hợp kéo thả.',
    imageUrl: '/project-todo.jpg', // Thay bằng ảnh dự án của bạn
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    link: 'https://github.com/your-username/todo-app',
  },
  {
    title: 'Website Portfolio Cá nhân',
    description: 'Chính là website này! Được xây dựng để trình bày kỹ năng và kinh nghiệm một cách chuyên nghiệp.',
    imageUrl: '/project-portfolio.jpg', // Thay bằng ảnh dự án của bạn
    technologies: ['Next.js', 'Tailwind CSS', 'Framer Motion (Tùy chọn)'],
    link: 'https://github.com/your-username/your-portfolio-repo',
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-20 md:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-16">
          Các <span className="text-indigo-600">Dự Án</span> Nổi Bật
        </h2>

        {/* Lưới Dự Án (3 cột trên desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-xl shadow-lg overflow-hidden border border-gray-100 
                         transform transition duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Ảnh Dự Án */}
              <div className="relative w-full h-48 bg-gray-200">
                {/* Bạn cần thêm ảnh vào thư mục public */}
                <Image 
                  src={project.imageUrl} 
                  alt={project.title} 
                  layout="fill" 
                  objectFit="cover"
                />
              </div>

              {/* Nội dung Thẻ */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{project.description}</p>

                {/* Tags Công Nghệ */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span 
                      key={tech} 
                      className="text-xs font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Nút Xem Chi Tiết */}
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition duration-300"
                >
                  Xem Mã nguồn / Demo
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;