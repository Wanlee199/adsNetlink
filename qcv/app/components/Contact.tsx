// components/Contact.tsx
import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-16">
          <span className="text-indigo-600">Liên Hệ</span> Với Tôi
        </h2>

        <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Cột 1: Thông tin liên hệ */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Thông tin của tôi</h3>
              <p className="text-gray-600 mb-6">Tôi luôn sẵn lòng nhận các dự án mới hoặc cơ hội hợp tác.</p>
              
              <div className="space-y-4 text-gray-700">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.8 5.2a1 1 0 001.4 0L21 8"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 8l-8 8-8-8"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 8V6a2 2 0 00-2-2H5a2 2 0 00-2 2v2l9 6 9-6z"></path></svg>
                  <span>email@example.com</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14v6m0 0l-4-4m4 4l4-4m-9-6a9 9 0 1118 0 9 9 0 01-18 0z"></path></svg>
                  <span>github.com/your-username</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-2h4m-4 0l4-4m-4 4l-4-4m4 4l-4 4"></path></svg>
                  <span>linkedin.com/in/your-profile</span>
                </div>
              </div>
            </div>

            {/* Cột 2: Form Liên hệ */}
            <div>
              <form action="#" method="POST" className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên của bạn</label>
                  <input type="text" id="name" name="name" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id="email" name="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Lời nhắn</label>
                  <textarea id="message" name="message" rows={4} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 transform hover:scale-[1.01]"
                  >
                    Gửi Lời Nhắn
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;