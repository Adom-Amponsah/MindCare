import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, signout } = useAuth();

  const handleSignOut = async () => {
    try {
      await signout();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-[#fbbf24] bg-clip-text text-transparent">
                MindCare
              </span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-[#2563eb] hover:text-[#fbbf24] px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/chat" className="text-[#2563eb] hover:text-[#fbbf24] px-3 py-2 rounded-md text-sm font-medium">
              Chat
            </Link>
            <Link to="/resources" className="text-[#2563eb] hover:text-[#fbbf24] px-3 py-2 rounded-md text-sm font-medium">
              Resources
            </Link>
            <Link to="/resource-demo" className="text-[#2563eb] hover:text-[#fbbf24] px-3 py-2 rounded-md text-sm font-medium">
              Resource Demo
            </Link>
            
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center gap-2 text-[#2563eb]">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {currentUser.displayName || currentUser.email || 'User'}
                  </span>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-md text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                to="/signin" 
                className="bg-[#fbbf24] hover:bg-[#f59e0b] text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#2563eb] hover:text-[#fbbf24]"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block text-[#2563eb] hover:text-[#fbbf24] px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/chat" 
              className="block text-[#2563eb] hover:text-[#fbbf24] px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Chat
            </Link>
            <Link 
              to="/resources" 
              className="block text-[#2563eb] hover:text-[#fbbf24] px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            <Link 
              to="/resource-demo" 
              className="block text-[#2563eb] hover:text-[#fbbf24] px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Resource Demo
            </Link>
            
            {currentUser ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 text-[#2563eb]">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {currentUser.displayName || currentUser.email || 'User'}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/signin" 
                className="block bg-[#fbbf24] hover:bg-[#f59e0b] text-white px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 