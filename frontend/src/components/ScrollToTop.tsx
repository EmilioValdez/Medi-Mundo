"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Cada vez que se abre una página nueva (cambia la ruta), la muestra desde arriba.
 *
 * - Usa behavior "instant" para no pelear con el `scroll-behavior: smooth` global
 *   (esa animación era la que dejaba la página nueva a la mitad).
 * - Respeta el botón "atrás/adelante" del navegador: ahí se conserva la posición
 *   anterior, que es lo que la gente espera.
 * - No interfiere con los filtros del catálogo (solo cambian ?parámetros, no la ruta)
 *   ni con enlaces a anclas (#seccion).
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const isHistoryNav = useRef(false);
  const first = useRef(true);

  useEffect(() => {
    const onPop = () => {
      isHistoryNav.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (isHistoryNav.current) {
      isHistoryNav.current = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
