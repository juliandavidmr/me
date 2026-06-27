import { cn } from '@/utils/cn';

import { frame } from './Navbar';

const Footer = () => (
  <footer
    className="mt-14 border-t border-line dark:border-line-dark"
    id="about"
  >
    <div
      className={cn(
        frame,
        'grid min-h-72 grid-cols-[.85fr_1.65fr_1fr] max-tablet:grid-cols-[1fr_1.3fr] max-sm:block',
      )}
    >
      <div className="min-w-0 border-r border-line px-7 py-8 dark:border-line-dark max-sm:border-b max-sm:border-r-0 max-sm:px-0 max-sm:py-8">
        <b className="font-medium text-accent">/</b>
        <p className="text-xs leading-copy text-muted dark:text-muted-dark">
          This is my journal.
          <br />I write to think clearly.
          <br />I build to understand.
          <br />I share to connect.
        </p>
        <div className="mt-7 flex gap-4">
          {[
            ['GH', 'https://github.com/anlijudavid'],
            ['IN', 'https://www.linkedin.com/in/juliandavidmr/'],
            ['RSS', '/rss.xml'],
            ['@', 'mailto:iamjuliand.retype181@aleeas.com'],
          ].map(([label, url]) => (
            <a
              className="text-3xs font-semibold text-muted no-underline dark:text-muted-dark"
              href={url}
              key={label}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
      <img
        className="size-full min-w-0 border-r border-line object-cover grayscale dark:border-line-dark dark:opacity-80 dark:invert max-tablet:hidden"
        src="/assets/journal/footer-topography.png"
        alt="Abstract ink topographic landscape"
      />
      <div className="flex min-w-0 flex-col justify-center px-7 py-8 max-sm:min-h-60 max-sm:border-b-0 max-sm:px-0 max-sm:py-8">
        <h2 className="mb-3 max-w-xs text-base font-medium leading-snug-copy tracking-tight-copy">
          Subscribe to my Newsletters
        </h2>
        <p className="text-xs leading-copy text-muted dark:text-muted-dark">
          Occasional updates on new posts and projects.
        </p>
        <form
          className="mt-5 flex border-b border-ink dark:border-ink-dark"
          action="mailto:iamjuliand.retype181@aleeas.com"
          method="post"
        >
          <label className="sr-only" htmlFor="footer-email">
            Email address
          </label>
          <input
            className="w-full border-0 bg-transparent py-2.5 text-3xs -tracking-card-title outline-0"
            id="footer-email"
            type="email"
            name="email"
            placeholder="YOUR@EMAIL.COM"
            required
          />
          <button
            className="cursor-pointer border-0 bg-transparent transition hover:translate-x-1 hover:text-accent"
            type="submit"
            aria-label="Subscribe"
          >
            →
          </button>
        </form>
      </div>
    </div>
    <div
      className={cn(
        frame,
        'flex h-16 items-center justify-between border-t border-line text-4xs uppercase tracking-wide-label text-muted dark:border-line-dark dark:text-muted-dark',
      )}
    >
      <span>© 2026 Julian David</span>
      <a className="no-underline" href="#">
        Top ↑
      </a>
    </div>
  </footer>
);

export { Footer };
