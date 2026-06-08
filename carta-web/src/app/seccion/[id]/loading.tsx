export default function SeccionLoading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col" aria-hidden>
      <div className="h-56 w-full animate-pulse bg-gradient-to-br from-brand-700 to-brand-950 sm:h-72 md:h-80" />

      <div className="px-4 py-6 sm:px-6 md:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={`featured-${index}`} className="col-span-2 flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white sm:flex-row">
              <div className="h-44 w-full animate-pulse bg-gray-200 sm:h-auto sm:w-2/5" />
              <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
                <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200" />
                <div className="mt-auto h-4 w-20 animate-pulse rounded bg-brand-50" />
              </div>
            </div>
          ))}
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`grid-${index}`} className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="h-28 w-full animate-pulse bg-gray-200 sm:h-32" />
              <div className="flex flex-col gap-2 p-3">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-brand-50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
