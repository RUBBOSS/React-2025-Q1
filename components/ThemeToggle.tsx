import React from 'react';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';
const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="mt-4 rounded-full p-2 transition-all duration-500 hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative h-10 w-10">
        <div
          className={`absolute transition-all duration-500 ${
            theme === 'dark' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
          }`}
        >
          <Image
            src="/sun.png"
            alt="Light mode"
            width={40}
            height={40}
            className="transform transition-all"
          />
        </div>
        <div
          className={`absolute transition-all duration-500 ${
            theme === 'dark' ? '-rotate-90 opacity-0' : 'rotate-0 opacity-100'
          }`}
        >
          <Image
            src="/moon.png"
            alt="Dark mode"
            width={40}
            height={40}
            className="transform transition-all"
          />
        </div>
      </div>
    </button>
  );
};
export default ThemeToggle;
