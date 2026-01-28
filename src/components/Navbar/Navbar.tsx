import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTop, setIsTop] = useState(true); // se está no topo

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Detecta scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY < 10); // topo = menos de 10px scroll
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

      <div className="navbar__hamburger" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};

export default Navbar;
