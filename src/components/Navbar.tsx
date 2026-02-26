<<<<<<< HEAD
import { useState } from 'react';
=======
>>>>>>> save-code
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
<<<<<<< HEAD
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';
=======
>>>>>>> save-code

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
<<<<<<< HEAD
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
=======
>>>>>>> save-code

  return (
    <>
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex-shrink-0">
              <img 
                src="https://raw.githubusercontent.com/kafaahbd/kafaah/refs/heads/main/pics/kafaah.png" 
                alt="Kafa'ah" 
                className="h-10 w-auto" 
              />
            </Link>
            
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <ThemeToggle />
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/profile"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-blue-400"
                  >
                    {user.name}
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
<<<<<<< HEAD
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-4 py-2 bg-green-600 dark:bg-blue-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-blue-700 transition"
                >
                  {t('nav.login')}
                </button>
=======
                <Link
                  to="/login"
                  className="px-4 py-2 bg-green-600 dark:bg-blue-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-blue-700 transition"
                >
                  {t('nav.login')}
                </Link>
>>>>>>> save-code
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="h-16"></div>
<<<<<<< HEAD

      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowSignUp(true);
        }}
      />

      <SignUpModal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSwitchToLogin={() => {
          setShowSignUp(false);
          setShowLogin(true);
        }}
      />
=======
>>>>>>> save-code
    </>
  );
};

export default Navbar;