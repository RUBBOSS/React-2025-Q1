import { useTheme } from '../context/ThemeContext';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-4 flex justify-end items-center">
      <button
        onClick={toggleTheme}
        className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none flex items-center justify-center overflow-hidden ${
          theme === 'light' ? 'bg-black' : 'bg-white'
        }`}
      >
        <div className="relative w-7 h-7">
          <img
            src="/sun.png"
            alt="Sun"
            className={`absolute w-7 h-7 transition-all duration-500 
              ${theme === 'light' ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 -translate-x-full rotate-[360deg]'}`}
          />
          <img
            src="/moon.png"
            alt="Moon"
            className={`absolute w-7 h-7 transition-all duration-500 
              ${theme === 'dark' ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-full rotate-[360deg]'}`}
          />
        </div>
      </button>
    </div>
  );
};

export default ThemeSwitcher;
