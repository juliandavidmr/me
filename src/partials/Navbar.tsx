import { cn } from '@/utils/cn';

type NavbarProps = {
  active?: 'writing' | 'projects' | 'games' | 'about';
};

const frame =
  'ml-[max(8.4375rem,calc((100%-72.5rem)/2+4.25rem))] w-[min(72.5rem,calc(100%-11.875rem))] max-tablet:ml-15 max-tablet:w-[calc(100%-5rem)] max-sm:mx-4.5 max-sm:w-[calc(100%-2.25rem)]';
const navLink =
  'relative py-2 text-3xs font-semibold uppercase tracking-nav after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-center after:scale-x-0 after:bg-accent after:transition-transform hover:after:scale-x-45 max-sm:text-4xs max-sm:tracking-wide-label';

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
      <span>jd</span>
    </a>
    <nav
      className="flex items-center gap-14 max-tablet:gap-6 max-sm:gap-3"
      aria-label="Primary navigation"
    >
      <a
        className={cn(navLink, active === 'writing' && 'after:scale-x-45')}
        href="/posts/"
      >
        Writing
      </a>
      <a
        className={cn(navLink, active === 'projects' && 'after:scale-x-45')}
        href="/projects/"
      >
        Projects
      </a>
      <a
        className={cn(navLink, active === 'games' && 'after:scale-x-45')}
        href="/games/"
      >
        Games
      </a>
      <a
        className={cn(navLink, active === 'about' && 'after:scale-x-45')}
        href="/about/"
      >
        About
      </a>
    </nav>
  </header>
);

export { frame, Navbar };
