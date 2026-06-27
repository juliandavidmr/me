import { cn } from '@/utils/cn';

type NavbarProps = {
  active?: 'writing' | 'projects' | 'games' | 'about';
};

const frame = 'mx-auto w-full max-w-page px-4.5 sm:px-10 tablet:px-15';

const NavbarItems = [
  { label: 'Writing', href: '/posts/', active: 'writing' },
  { label: 'Projects', href: '/projects/', active: 'projects' },
  { label: 'Games', href: '/games/', active: 'games' },
  { label: 'About', href: '/about/', active: 'about' },
];

const label = `{ Julian }`;

const Navbar = ({ active }: NavbarProps) => (
  <header
    className={cn(frame, 'flex h-24 items-center justify-between max-sm:h-20')}
  >
    <a
      className="flex items-center gap-2 text-base font-medium tracking-brand no-underline"
      href="/"
      aria-label="Julian David home"
    >
      <picture>
        <source media="(prefers-color-scheme: dark)" srcSet="/icon-dark.svg" />
        <img
          className="size-8"
          src="/icon-light.svg"
          alt=""
          width="32"
          height="32"
        />
      </picture>
      <span className="font-bold">{label}</span>
    </a>
    <nav
      className="flex items-center gap-8 max-tablet:gap-6 max-sm:gap-3"
      aria-label="Primary navigation"
    >
      {NavbarItems.map((item) => (
        <a
          key={item.active}
          className={cn(
            'relative py-2 text-2xs font-semibold uppercase tracking-nav after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-center after:scale-x-0 after:bg-accent after:transition-transform hover:after:scale-x-45 max-sm:text-4xs max-sm:tracking-wide-label',
            active === item.active && 'after:scale-x-45',
          )}
          href={item.href}
        >
          {item.label}
        </a>
      ))}
    </nav>
  </header>
);

export { frame, Navbar };
