import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"; // Prevent scroll
    } else {
      document.body.style.overflow = ""; // Restore scroll
    }
  }, [isMenuOpen]);

  useEffect(() => {
    // scroll to top on nav change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about.html' },
    { name: 'Skills', path: '/skills.html' },
    { name: 'Projects', path: '/projects.html' },
    { name: 'Contact', path: '/contact.html' },
  ];

  const getLinkClasses = ({ isActive }) => 
    `font-headline text-[12px] uppercase tracking-widest transition-colors duration-300 ` + 
    (isActive 
      ? `text-[#ff8a7a] border-b border-[#ff8a7a] pb-1` 
      : `text-[#acabaa] hover:text-[#ff8a7a]`);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-md border-b border-[#484848]/20 shadow-[0_0_40px_rgba(255,138,122,0.1)]">
        <div className="flex justify-between items-center px-8 py-6 max-w-[1440px] mx-auto">
          
          <div className="text-xl font-light tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#f3a77d] via-[#ff8a7a] to-[#c0ee91] font-headline">
            AC
          </div>
          
          <div className="hidden md:flex items-center gap-10 font-headline font-light tracking-wide uppercase text-[10px] md:text-xs">
            {navLinks.map((link) => (
              <NavLink 
                to={link.path} 
                key={link.name}
                className={getLinkClasses}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:block">
            <NavLink to="/contact.html">
              <button className="bg-transparent border border-outline-variant/30 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest text-[#ff8a7a] hover:shadow-[0_0_15px_-2px_#ff8a7a] hover:border-[#ff8a7a] transition-all duration-300 scale-95 active:scale-90 font-headline">
                Hire Me
              </button>
            </NavLink>
          </div>

          <button id="menu-btn" className="md:hidden text-[#ff8a7a]" onClick={toggleMenu}>
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div 
        id="mobile-menu"
        className={`fixed top-0 right-0 h-full w-[70%] max-w-[280px] overflow-hidden bg-[#131313]/20 backdrop-blur-2xl border-l border-[#484848]/30 z-[9999] flex flex-col items-start justify-start pt-28 gap-8 px-8 transform transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* TASK B FIX: Move Hire Me to top of mobile menu */}
        <div className="mb-4">
          <NavLink to="/contact.html" onClick={closeMenu}>
             <button className="bg-transparent border border-outline-variant/30 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest text-[#ff8a7a] hover:shadow-[0_0_15px_-2px_#ff8a7a] hover:border-[#ff8a7a] transition-all duration-300 scale-95 active:scale-90 font-headline">
                Hire Me
             </button>
          </NavLink>
        </div>

        {navLinks.map((link) => (
            <NavLink 
              to={link.path} 
              key={link.name}
              onClick={closeMenu}
              className={getLinkClasses}
            >
              {link.name}
            </NavLink>
        ))}
      </div>

      <div 
        id="menu-backdrop"
        onClick={closeMenu}
        className={`fixed inset-0 bg-black/30 backdrop-blur-md z-[9998] transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
      </div>
    </>
  );
};

export default Navbar;
