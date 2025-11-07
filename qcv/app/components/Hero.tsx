import React from 'react';
import Image from 'next/image';

const Hero = () => {
  return (
    <section id="hero" className="py-20 md:py-32 text-center">
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-6 border-4 border-indigo-600/50 shadow-lg">
          
          <Image
            src="/avatar.jpg" 
            alt="Ảnh đại diện"
            layout="fill"
            objectFit="cover"
            priority 
          />
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Xin chào, tôi là <span className="text-indigo-600">[Tên bạn]</span>
        </h1>

        <p className="text-xl sm:text-2xl text-gray-600 mb-8 font-light">
          Một **[Chức danh của bạn]** tập trung vào [Lĩnh vực chuyên môn]
        </p>

        <div className="flex space-x-4">
          <a
            href="#projects"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
          >
            Xem Dự án
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-indigo-600 text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-indigo-50 transition duration-300"
          >
            Liên hệ
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;