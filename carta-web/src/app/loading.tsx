export default function HomeLoading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col md:max-w-3xl" aria-hidden>
      <div className="h-48 w-full animate-pulse bg-gradient-to-br from-brand-700 to-brand-950 sm:h-56 md:h-64" />

      <div className="flex flex-col gap-8 px-4 py-8 sm:px-6 md:px-8">
        <div className="-mt-24 flex justify-center sm:-mt-28">
          <div className="h-28 w-28 animate-pulse rounded-full border-4 border-paper-50 bg-gray-200 shadow-theme-lg sm:h-32 sm:w-32" />
        </div>

        <div className="flex flex-col">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 border-b border-brand-100 py-5 first:pt-0 last:border-b-0">
              <div className="h-8 w-10 animate-pulse rounded bg-brand-50" />
              <div className="h-5 flex-1 animate-pulse rounded bg-gray-200" style={{ maxWidth: `${70 - index * 8}%` }} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
