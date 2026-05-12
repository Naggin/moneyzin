"use client";

import { FileSpreadsheet, FileText } from "lucide-react";

interface Props {
  month: number;
  year: number;
}

export default function ExportButtons({ month, year }: Props) {
  return (
    <div className="flex items-center gap-2">
      <a
        href={`/api/reports/excel?month=${month}&year=${year}`}
        download
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-xl transition-colors border border-emerald-200 dark:border-emerald-500/20"
      >
        <FileSpreadsheet size={16} />
        Excel
      </a>
      <a
        href={`/api/reports/pdf?month=${month}&year=${year}`}
        download
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors border border-gray-200 dark:border-gray-700"
      >
        <FileText size={16} />
        PDF
      </a>
    </div>
  );
}
