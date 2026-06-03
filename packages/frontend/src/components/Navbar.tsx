import { useEffect, useState } from 'react';
import { scrollToSection } from '../utils/scroll';

const links = [
  { href: 'home', label: 'Home' },
  { href: 'about', label: 'About' },
  { href: 'gallery', label: 'Gallery' },
  { href: 'reviews', label: 'Reviews' },
  { href: 'pricing', label: 'Pricing' },
  { href: 'contact', label: 'Contact' },
];

const MOBILE_NAV_MQ = '(max-width: 768px)';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_NAV_MQ);
    const onChange = () => {
      if (!mq.matches) setMenuOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const navigate = (sectionId: string) => {
    scrollToSection(sectionId);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">
          <span className="logo-text">AZANI</span>
          <span className="logo-sub">KCSE Project</span>
        </div>

        <button
          type="button"
          className={`nav-menu-toggle${menuOpen ? ' nav-menu-toggle--open' : ''}`}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="nav-menu-toggle-bar" aria-hidden />
          <span className="nav-menu-toggle-bar" aria-hidden />
          <span className="nav-menu-toggle-bar" aria-hidden />
        </button>

        <ul
          id="primary-navigation"
          className={`nav-links${menuOpen ? ' nav-links--open' : ''}`}
        >
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={`#${link.href}`}
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.href);
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
}
