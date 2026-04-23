const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format a number as Mexican Pesos.
 * Example: formatMXN(1500) => "$1,500.00 MXN"
 */
export default function formatMXN(value) {
  if (value == null || isNaN(Number(value))) return '-';
  return `${formatter.format(Number(value))} MXN`;
}
