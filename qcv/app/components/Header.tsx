'use client'; 

import Link from 'next/link';

import { HomeIcon} from '@heroicons/react/24/solid'; 
import ThemeSwitcher from '@/app/components/ThemeSwitcher';


const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Work', href: '#experience' }, 
  { name: 'Projects', href: '#projects' }, 
  { name: 'Contact', href: '#contact' },
];

const Header = () => {
  return (
    <header className="fixed bottom-5 w-full md:top-5 md:left-1/2 md:-translate-x-1/2 md:w-auto z-50 transition duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center py-3">
        <div className="px-4 flex justify-center items-center py-3 bg-[#ffffff] rounded-full shadow-1 z-index-1">
          <Link 
            href="/" 
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition duration-300"
            aria-label="Trang chủ"
          >
            <HomeIcon className="w-6 h-6 md:h-8 md:w-8 mr-1" />
          </Link>

          <nav className="md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 
                          text-xs md:text-base transition duration-300 relative group"
              >
                {item.name}
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 
                              transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}
          </nav>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;