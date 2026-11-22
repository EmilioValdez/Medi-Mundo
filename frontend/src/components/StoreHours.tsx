"use client";

import { useEffect, useState } from "react";
import { SCHEDULE, formatHours, isOpenNow } from "@/lib/business";

/**
 * Horario con badge "Abierto ahora / Cerrado". El estado se calcula en el
 * navegador (después de montar) para no servir un "Abierto" cacheado.
 */
export default function StoreHours({ dark = false }: { dark?: boolean }) {
  const [status, setStatus] = useState<{ open: boolean; todayIndex: number } | null>(null);

  useEffect(() => {
    const update = () => setStatus(isOpenNow());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  const border = dark ? "border-gray-700 divide-gray-700" : "border-gray-200 divide-gray-100";
  const rowBg = dark ? "bg-gray-800/60" : "bg-white";
  const label = dark ? "text-gray-200" : "text-gray-700";
  const hours = dark ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`divide-y overflow-hidden rounded-xl border ${border}`}>
      {SCHEDULE.map((slot, i) => {
        const isToday = status?.todayIndex === i;
        return (
          <div key={slot.label} className={`flex items-center justify-between gap-3 px-4 py-2.5 ${rowBg}`}>
            <span className={`text-sm ${label} ${isToday ? "font-semibold" : ""}`}>{slot.label}</span>
            <span className="flex items-center gap-2">
              <span className={`text-sm ${hours}`}>{formatHours(slot)}</span>
              {isToday && status && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    status.open ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {status.open ? "Abierto ahora" : "Cerrado"}
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
