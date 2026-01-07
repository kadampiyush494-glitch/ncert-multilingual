import { BookOpen, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">

        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white">
            ZAPLEARN
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className={isActive('/') ? 'text-blue-600 font-medium' : 'text-gray-600'}
          >
            Home
          </button>

          {user?.role === 'student' && (
            <button
              onClick={() => navigate('/chat')}
              className={isActive('/chat') ? 'text-blue-600 font-medium' : 'text-gray-600'}
            >
              Chat
            </button>
          )}

          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className={isActive('/admin') ? 'text-blue-600 font-medium' : 'text-gray-600'}
            >
              Dashboard
            </button>
          )}

          {user && (
            <button
              onClick={() => navigate('/ocr')}
              className={isActive('/ocr') ? 'text-blue-600 font-medium' : 'text-gray-600'}
            >
              OCR
            </button>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme}>
            {theme === 'light' ? <Moon /> : <Sun />}
          </button>

          {user ? (
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

