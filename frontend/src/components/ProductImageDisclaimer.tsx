/**
 * Leyenda obligatoria en TODOS los productos del catálogo (renta y venta,
 * incluidos los que se agreguen: oxímetros, baumanómetros, etc.).
 * Se muestra en la ficha /equipo/[id] y debajo de los listados de /catalogo y /rentas.
 * scripts/check-critical.mjs hace fallar el build si se quita de alguno.
 *
 * Para cambiar el texto, cámbialo SOLO aquí.
 */
export const PRODUCT_IMAGE_DISCLAIMER =
  "Imagen ilustrativa. La fotografía muestra un ejemplo del producto; la marca, el modelo, el color y algunos detalles pueden variar según la disponibilidad en tienda. Todos los productos y precios están sujetos a disponibilidad.";

export const PRODUCT_IMAGE_DISCLAIMER_SHORT =
  "Imágenes ilustrativas: la marca, el modelo y el color pueden variar según la disponibilidad en tienda. Productos sujetos a disponibilidad.";

export default function ProductImageDisclaimer({
  variant = "full",
  className = "",
}: {
  variant?: "full" | "short";
  className?: string;
}) {
  return (
    <p className={`flex items-start gap-1.5 text-xs leading-relaxed text-gray-500 ${className}`}>
      <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </svg>
      <span>{variant === "full" ? PRODUCT_IMAGE_DISCLAIMER : PRODUCT_IMAGE_DISCLAIMER_SHORT}</span>
    </p>
  );
}
