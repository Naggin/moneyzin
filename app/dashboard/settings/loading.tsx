export default function SettingsLoading() {
  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-2xl mx-auto animate-pulse">

      <div className="mb-6 md:mb-8">
        <div className="h-8 w-44 bg-gray-200 dark:bg-gray-800 rounded-lg mb-2" />
        <div className="h-4 w-56 bg-gray-200 dark:bg-gray-800 rounded-lg" />
      </div>

      {/* Conta skeleton */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-6">
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-5" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0" />
          <div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
            <div className="h-3 w-48 bg-gray-100 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>

      {/* Aparência skeleton */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-5" />
        <div className="flex items-center justify-between">
          <div>
            <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
            <div className="h-3 w-40 bg-gray-100 dark:bg-gray-700 rounded" />
          </div>
          <div className="h-10 w-44 bg-gray-100 dark:bg-gray-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
