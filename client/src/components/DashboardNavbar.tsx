import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code, Menu, X, Home, FolderOpen, BarChart3 } from 'lucide-react';
import LogoutButton from './LogoutButton';
import { useAuth } from '../context/AuthContext';

const DashboardNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  const isActiveLink = (href: string) => {
    return location.pathname === href;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Client Desk
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActiveLink(link.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <LogoutButton />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg mt-2 shadow-lg border border-gray-200">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      isActiveLink(link.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {link.name}
                  </Link>
                );
              })}
              
              {/* User info and logout in mobile */}
              <div className="pt-2 mt-2 border-t border-gray-200">
                <div className="px-3 py-2 text-sm text-gray-700">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-gray-500">{user?.email}</div>
                </div>
                <div className="px-2">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DashboardNavbar; 