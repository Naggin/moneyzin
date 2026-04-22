export default function DashboardLoading() {
  return (
    // O segredo está no animate-pulse do Tailwind! Ele faz tudo piscar suavemente.
    <div className="p-8 pb-24 md:pb-8 max-w-7xl mx-auto space-y-8 animate-pulse transition-colors duration-300">
      
      {/* 1. Esqueleto do Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-3"></div>
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        </div>
        <div className="h-10 w-40 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-xl"></div>
      </div>

      {/* 2. Esqueleto dos Cards de Resumo (Criamos 3 blocos iguais) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex flex-col justify-between">
             <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
             <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        ))}
      </div>

      {/* 3. Esqueleto dos Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Gráfico de Pizza */}
        <div className="h-[380px] bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-8"></div>
          <div className="h-48 w-48 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Gráficos de Barra */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-[380px] bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex flex-col">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
              <div className="h-3 w-40 bg-gray-200 dark:bg-gray-800 rounded mb-10"></div>
              <div className="space-y-4 mt-auto">
                 <div className="h-8 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
                 <div className="h-8 w-5/6 bg-gray-200 dark:bg-gray-800 rounded"></div>
                 <div className="h-8 w-4/6 bg-gray-200 dark:bg-gray-800 rounded"></div>
                 <div className="h-8 w-3/6 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}