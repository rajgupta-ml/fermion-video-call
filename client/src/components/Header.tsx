"use client"

import React, { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-900/95 backdrop-blur-sm py-3 shadow-md' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-white font-medium text-xl">Meet</span>
          </div>



          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 shadow-lg mt-3 animate-fadeIn">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-gray-300 hover:text-white py-2 transition-colors">Features</a>
              <a href="#" className="text-gray-300 hover:text-white py-2 transition-colors">Plans</a>
              <a href="#" className="text-gray-300 hover:text-white py-2 transition-colors">Support</a>
              <a href="#" className="text-gray-300 hover:text-white py-2 transition-colors">About</a>
              <button className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors mt-2 flex items-center justify-center space-x-2">
                <User size={18} />
                <span>Sign In</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;