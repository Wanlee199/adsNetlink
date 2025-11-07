'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        
        return <div className="w-5 h-5 md:h-8 md:w-8 p-2 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse"></div>;
    }

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button 
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:ring-2 hover:ring-indigo-500 transition duration-300"
            aria-label="Chuyển đổi chế độ sáng tối"
        >
            {theme === 'dark' ? (
                <SunIcon className="w-5 h-5 md:h-8 md:w-8 text-yellow-400" /> 
            ) : (
                <MoonIcon className="w-5 h-5 md:h-8 md:w-8 text-gray-500" />
            )}
        </button>
    );
};

export default ThemeSwitcher;