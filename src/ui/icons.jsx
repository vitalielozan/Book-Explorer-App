/**
 * Hairline icons, drawn to the same 1.5px stroke as the rules elsewhere on the
 * page. A filled icon set would outweigh everything around it.
 */
const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export function SearchIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx='11' cy='11' r='6.5' />
      <path d='M16 16l4.5 4.5' />
    </svg>
  );
}

export function HeartIcon({ filled = false, ...props }) {
  return (
    <svg {...base} fill={filled ? 'currentColor' : 'none'} {...props}>
      <path d='M12 20.2S3.8 15.4 3.8 9.6a4.3 4.3 0 018.2-1.8 4.3 4.3 0 018.2 1.8c0 5.8-8.2 10.6-8.2 10.6z' />
    </svg>
  );
}

export function TrashIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d='M4 6.5h16M9.5 6.5V4.8a1 1 0 011-1h3a1 1 0 011 1v1.7' />
      <path d='M6.5 6.5l.8 12a1.6 1.6 0 001.6 1.5h6.2a1.6 1.6 0 001.6-1.5l.8-12' />
      <path d='M10.3 10.5v6M13.7 10.5v6' />
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d='M4.5 12.5l5 5 10-11' />
    </svg>
  );
}

export function ArrowLeftIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d='M19 12H5M10.5 6.5L5 12l5.5 5.5' />
    </svg>
  );
}

export function MenuIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d='M4 7h16M4 12h16M4 17h16' />
    </svg>
  );
}

export function CloseIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d='M6 6l12 12M18 6L6 18' />
    </svg>
  );
}

export function GithubIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d='M15.2 21v-3.3c0-1-.3-1.7-.9-2.2 2.8-.3 5.4-1.4 5.4-6a4.7 4.7 0 00-1.2-3.2 4.4 4.4 0 00-.1-3.2s-1-.3-3.3 1.2a11.3 11.3 0 00-6 0C6.8 2.8 5.8 3.1 5.8 3.1a4.4 4.4 0 00-.1 3.2 4.7 4.7 0 00-1.2 3.2c0 4.6 2.6 5.7 5.4 6-.4.4-.7.9-.8 1.6-1.9.6-3.4 0-4.3-1.7' />
    </svg>
  );
}
