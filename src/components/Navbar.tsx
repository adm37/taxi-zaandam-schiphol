import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Phone, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Tarieven', href: '/tarieven/' },
  { name: 'Over Ons', href: '/over-ons/' },
  { name: 'Contact', href: '/contact/' },
];

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return `/${pathname.replace(/^\/+|\/+$/g, '')}/`;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = normalizePath(location.pathname);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Plane className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-emerald-900">ZaanTaxi <span className="text-emerald-600">Schiphol</span></span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name} 
                to={link.href} 
                className={`text-sm font-medium transition-colors ${
                  currentPath === normalizePath(link.href) ? 'text-emerald-600' : 'text-stone-600 hover:text-emerald-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a 
              href="tel:0752340037" 
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200"
            >
              <Phone size={16} />
              075 - 234 00 37
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-stone-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-stone-200 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {NAV_LINKS.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className={`block text-lg font-medium ${
                    currentPath === normalizePath(link.href) ? 'text-emerald-600' : 'text-stone-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <a 
                href="tel:0752340037" 
                className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl text-lg font-semibold"
              >
                <Phone size={20} />
                Bel Nu: 075 - 234 00 37
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
