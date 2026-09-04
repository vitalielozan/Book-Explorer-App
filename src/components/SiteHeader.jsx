import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';

import styles from './SiteHeader.module.css';
import { CloseIcon, MenuIcon } from '../ui/icons';

const SECTIONS = [
  { to: '/books', label: 'Catalog' },
  { to: '/favorites', label: 'Your shelf' },
  { to: '/discover', label: 'Discover' },
  { to: '/about', label: 'About' },
];

function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Following a link should put the mobile panel away.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={styles.header}>
      <div className={`page ${styles.bar}`}>
        <Link to='/' className={styles.brand}>
          <span className={styles.mark} aria-hidden='true'>
            <span />
            <span />
            <span />
          </span>
          Book Explorer
        </Link>

        <button
          type='button'
          className={styles.toggle}
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls='site-nav'
          aria-label={open ? 'Close the menu' : 'Open the menu'}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>

        <nav
          id='site-nav'
          className={`${styles.nav} ${open ? styles.navOpen : ''}`}
          aria-label='Sections'
        >
          {SECTIONS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default SiteHeader;
