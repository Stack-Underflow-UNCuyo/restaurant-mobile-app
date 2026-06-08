export default function MenuPreviewLoading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col" aria-hidden>
      <div className="h-48 w-full animate-pulse bg-gradient-to-br from-brand-700 to-brand-950 sm:h-60 md:h-72" />

      <div className="flex flex-col gap-6 py-6">
        {Array.from({ length: 3 }).map((_, rowIndex) => (
          <section key={rowIndex} className="flex flex-col gap-3">
            <div className="flex items-end justify-between gap-3 border-b border-brand-100 px-4 pb-3 sm:px-6 md:px-8">
              <div className="flex items-baseline gap-3">
                <div className="h-8 w-10 animate-pulse rounded bg-brand-50" />
                <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 sm:px-6 md:px-8">
              {Array.from({ length: 4 }).map((_, cardIndex) => (
                <div key={cardIndex} className="flex w-32 shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white sm:w-36">
                  <div className="h-20 w-full animate-pulse bg-gray-200 sm:h-24" />
                  <div className="flex flex-col gap-1.5 p-2.5">
                    <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-brand-50" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
