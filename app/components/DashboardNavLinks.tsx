"use client";

import { LayoutDashboard, ArrowRightLeft, Target, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Visão Geral", shortLabel: "Início", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/transactions", label: "Transações", shortLabel: "Trans.", icon: ArrowRightLeft, exact: false },
  { href: "/dashboard/metas", label: "Metas", shortLabel: "Metas", icon: Target, exact: false },
  { href: "/dashboard/settings", label: "Configurações", shortLabel: "Config.", icon: Settings, exact: false },
];

export function DesktopNavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              active
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        );
      })}
    </>
  );
}

export function MobileNavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map(({ href, shortLabel, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
              active
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{shortLabel}</span>
          </Link>
        );
      })}
    </>
  );
}
