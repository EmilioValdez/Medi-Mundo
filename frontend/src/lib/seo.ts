import type { Metadata } from "next";

/**
 * Títulos de página para Google — FUENTE ÚNICA.
 *
 * Problema que resuelve (nov 2026): la marca se agregaba en 3 capas (el título
 * de la página/blog, la página del blog y la plantilla global) y en Google salía
 * "… | MediMundo Querétaro | MediMundo Querétaro | MediMundo Querétaro".
 *
 * Regla: cada página llama `pageTitle("Texto sin marca")`. Se quita cualquier
 * marca al final (incluidas colas cortadas como "| Me" o "| MediM") y se agrega
 * " | MediMundo" UNA vez, solo si cabe en 60 caracteres (lo que muestra Google).
 * Si no cabe, se deja sin marca para no cortar las palabras clave.
 */
export const BRAND = "MediMundo";
const SUFFIX = ` | ${BRAND}`;
const MAX_LEN = 60;

// "| MediMundo", "— Medimundo Querétaro", "| MediM", "| Me", etc. al final del texto.
// Ojo: en JS `\w` no incluye acentos ("Querétaro"); por eso se usa \p{L} con la bandera u.
const BRAND_TAIL = /\s*[|—–-]\s*(?:M|Me|Med|Medi|MediM\p{L}*|Medim\p{L}*)(?:\s+Quer\p{L}*)?\s*$/iu;

export function stripBrand(title: string): string {
  let s = title.trim();
  let prev: string;
  do {
    prev = s;
    s = s.replace(BRAND_TAIL, "").trim();
  } while (s !== prev);
  return s.replace(/[\s.]+$/, "");
}

export function pageTitle(core: string): Metadata["title"] {
  const clean = stripBrand(core);
  if (/medi\s?mundo/i.test(clean) || (clean + SUFFIX).length > MAX_LEN) {
    return { absolute: clean };
  }
  return { absolute: clean + SUFFIX };
}
