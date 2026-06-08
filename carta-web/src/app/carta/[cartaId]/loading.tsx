export default function CartaLoading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col" aria-hidden>
      <div className="flex h-16 items-center border-b border-brand-100 bg-paper-50/90 px-4 sm:px-6 md:px-8">
        <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="flex flex-col gap-4 px-4 py-6 sm:px-6 md:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3">
          <div className="col-span-2 h-48 animate-pulse rounded-2xl bg-gray-200 sm:h-60" />
          <div className="h-full min-h-32 animate-pulse rounded-2xl bg-gradient-to-br from-brand-600 to-brand-900" />
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="h-28 w-full animate-pulse bg-gray-200" />
              <div className="flex flex-col gap-2 p-4">
                <div className="h-3 w-16 animate-pulse rounded-full bg-brand-50" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
