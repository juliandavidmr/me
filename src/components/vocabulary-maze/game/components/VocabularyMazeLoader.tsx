type VocabularyMazeLoaderProps = {
  status: 'error' | 'loading';
};

export const VocabularyMazeLoader = ({ status }: VocabularyMazeLoaderProps) => (
  <section className="mx-auto grid w-full max-w-120 gap-7 py-8">
    <header className="grid gap-5">
      <div>
        <p className="text-3xs font-semibold uppercase tracking-label text-muted dark:text-muted-dark">
          Daily maze
        </p>
        <h1 className="mt-2 text-prose-h3-mobile font-medium tracking-title">
          Vocabulary Maze
        </h1>
      </div>

      <div className="grid min-h-72 place-items-center overflow-hidden border-y border-line py-8 dark:border-line-dark">
        {status === 'error' ? (
          <div className="grid max-w-80 gap-3 text-center">
            <p className="text-card-title font-medium tracking-card-title">
              The daily maze is not available right now.
            </p>
            <p className="text-sm leading-copy text-muted dark:text-muted-dark">
              The puzzle is generated on the server. Try refreshing in a moment.
            </p>
          </div>
        ) : (
          <div
            className="grid w-full max-w-72 gap-6"
            role="status"
            aria-live="polite"
            aria-label="Loading today's maze"
          >
            <div className="relative mx-auto grid size-40 grid-cols-5 gap-2">
              {Array.from({ length: 25 }, (_, index) => (
                <span
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className={
                    index === 2 ||
                    index === 7 ||
                    index === 8 ||
                    index === 13 ||
                    index === 18 ||
                    index === 22
                      ? 'animate-pulse border border-accent bg-accent/20'
                      : 'border border-line bg-transparent dark:border-line-dark'
                  }
                  style={{ animationDelay: `${index * 45}ms` }}
                />
              ))}
              <span className="absolute left-[42%] top-[2%] size-4 animate-ping rounded-full bg-accent" />
              <span className="absolute bottom-[10%] right-[10%] size-5 rounded-full border border-accent bg-canvas dark:bg-canvas-dark" />
            </div>

            <div className="grid gap-2 text-center">
              <p className="text-sm font-medium text-ink dark:text-ink-dark">
                Loading today&apos;s word
              </p>
              <p className="text-xs leading-copy text-muted dark:text-muted-dark">
                Building the maze on the server...
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  </section>
);
