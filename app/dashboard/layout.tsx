import { UserButton } from "@clerk/nextjs";
import { VisibilityProvider } from "../contexts/VisibilityContext";
import { DesktopNavLinks, MobileNavLinks } from "../components/DashboardNavLinks";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <VisibilityProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-hidden">

        {/* Menu Lateral (Desktop) */}
        <aside className="w-64 bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 flex-col hidden md:flex z-10 transition-colors duration-300">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <span className="text-2xl font-bold text-emerald-500 tracking-tight">Moneyzin</span>
          </div>

          <nav className="flex-1 p-4 space-y-2 mt-4">
            <DesktopNavLinks />
          </nav>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800 m-4 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
            <UserButton showName />
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0 relative">
          {children}
        </main>

        {/* Menu Inferior (Mobile) */}
        <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 flex items-center justify-around p-3 z-50 transition-colors duration-300">
          <MobileNavLinks />
          <div className="flex flex-col items-center gap-1 p-2 mt-1">
            <UserButton />
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">Perfil</span>
          </div>
        </nav>

      </div>
    </VisibilityProvider>
  );
}
