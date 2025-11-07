// components/Footer.tsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Liên kết Mạng Xã hội (Tùy chọn) */}
        <div className="flex justify-center space-x-6 mb-4">
          {/* Thay thế # bằng liên kết thực tế của bạn */}
          <a href="#" className="text-gray-400 hover:text-indigo-400 transition duration-300">
            {/* Icon GitHub */}
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.082-.741.083-.725.083-.725 1.192.083 1.815 1.226 1.815 1.226 1.058 1.815 2.768 1.294 3.435.989.108-.77.418-1.294.762-1.597-2.628-.297-5.397-1.317-5.397-5.839 0-1.292.443-2.348 1.168-3.183-.112-.296-.506-1.503.111-3.149 0 0 .952-.318 3.116 1.226.906-.251 1.872-.377 2.837-.382 1.025.005 1.99.131 2.897.382 2.162-1.544 3.116-1.226 3.116-1.226.617 1.646.223 2.853.111 3.149.725.835 1.168 1.891 1.168 3.183 0 4.532-2.77 5.541-5.397 5.839.429.371.821 1.102.821 2.222v3.293c0 .319.192.694.801.576C20.56 21.822 24 17.324 24 12c0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-indigo-400 transition duration-300">
            {/* Icon LinkedIn */}
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.54c.98 0 1.77-.77 1.77-1.73V1.73c0-.96-.79-1.73-1.77-1.73zM7.05 20.45H3.64V8.04h3.41v12.41zM5.35 6.55a2.15 2.15 0 110-4.3 2.15 2.15 0 010 4.3zm15.1 13.9H16.9v-6.2c0-1.48-.52-2.5-1.87-2.5-1.02 0-1.63.68-1.9.33s-.9.76-.9 1.87v6.5h-3.41V8.04h3.41v1.5c.45-.73 1.2-1.77 3.06-1.77 2.24 0 3.92 1.46 3.92 4.62v7.06h-.01z"/></svg>
          </a>
        </div>

        {/* Bản quyền */}
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Tên Của Bạn. Được xây dựng với Next.js & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;