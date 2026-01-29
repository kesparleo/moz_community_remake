import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { FaBars } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTop, setIsTop] = useState(true);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY < 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isTop ? 'navbar--top' : 'navbar--scrolled'}`}>
      <div className="navbar__logo">MozComun</div>

      <div className={`navbar__links ${menuOpen ? 'active' : ''}`}>
        <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
        <a href="#communities" onClick={() => setMenuOpen(false)}>List</a>
        <a href="#foot" onClick={() => setMenuOpen(false)}>Contact</a>
      </div>

      <div className="navbar__hamburger" onClick={toggleMenu}><FaBars /></div>
    </nav>
  );
};

export default Navbar;
