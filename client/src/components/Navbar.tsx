import React, { useState, useEffect } from 'react';
import { Code, Menu, X, ArrowRight, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onOpenForm: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenForm }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-colors ${
              isScrolled ? 'bg-blue-600' : 'bg-white'
            }`}>
              <Code className={`w-6 h-6 transition-colors ${
                isScrolled ? 'text-white' : 'text-blue-600'
              }`} />
            </div>
            <span className={`text-xl font-bold transition-colors ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              Client Desk
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className={`px-3 py-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                    isScrolled ? 'text-gray-700' : 'text-white hover:text-blue-200'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:block flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isScrolled
                  ? 'text-gray-700 hover:text-blue-600'
                  : 'text-white hover:text-blue-200'
              }`}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className={`group inline-flex items-center px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 ${
                isScrolled
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  : 'bg-white text-blue-600 hover:bg-gray-100'
              }`}
            >
              Dashboard
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-lg mt-2 shadow-lg border border-gray-200">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-200 space-y-2">
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate('/dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;