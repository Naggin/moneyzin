export default function TransactionsLoading() {
  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 animate-pulse">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <div className="h-8 w-36 bg-gray-200 dark:bg-gray-800 rounded-lg mb-2" />
          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-20 bg-emerald-500/20 rounded-xl" />
          <div className="h-10 w-16 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div className="h-10 w-40 bg-emerald-500/20 rounded-xl" />
        </div>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">

        {/* Card header */}
        <div className="p-6 border-b border-gray-50 dark:border-gray-800">
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>

        {/* Filters bar */}
        <div className="flex gap-3 p-4 border-b border-gray-50 dark:border-gray-800">
          <div className="h-9 flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl" />
          <div className="h-9 w-44 bg-gray-100 dark:bg-gray-800 rounded-xl" />
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-3 sm:p-4">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/5 mb-2" />
                  <div className="flex gap-2">
                    <div className="h-3 w-16 bg-gray-100 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-20 bg-gray-100 dark:bg-gray-700 rounded-full" />
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-7 w-7 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                  <div className="h-7 w-7 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
