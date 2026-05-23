import { useColorScheme } from '../context/ThemeProvider';

export const ThemeSwitcher = () => {
  const { colorScheme, setColorScheme } = useColorScheme();

  const options = ['System', 'Light', 'Dark'];

  return (
    <div className="theme-switcher-container flex gap-2 p-1 rounded-lg max-w-fit border transition-all">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => setColorScheme(opt)}
          className={`theme-switcher-btn px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            colorScheme === opt
              ? 'active shadow-sm'
              : 'inactive'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};
