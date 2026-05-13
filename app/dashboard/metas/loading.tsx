export default function MetasLoading() {
  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-4xl mx-auto animate-pulse">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="h-8 w-44 bg-gray-200 dark:bg-gray-800 rounded-lg mb-2" />
          <div className="h-4 w-72 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        </div>
        <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurar Metas skeleton */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <div className="h-5 w-36 bg-gray-200 dark:bg-gray-800 rounded mb-6" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
              <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 rounded-xl" />
            </div>
          ))}
          <div className="h-10 w-full bg-emerald-500/20 rounded-xl mt-6" />
        </div>

        {/* Progresso skeleton */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <div className="h-5 w-36 bg-gray-200 dark:bg-gray-800 rounded mb-6" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl mb-3">
              <div className="flex justify-between mb-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2" />
              <div className="flex justify-between">
                <div className="h-3 w-16 bg-gray-100 dark:bg-gray-700 rounded" />
                <div className="h-3 w-16 bg-gray-100 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
