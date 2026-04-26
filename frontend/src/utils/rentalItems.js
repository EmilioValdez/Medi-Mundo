const RENTAL_KEYWORDS = ['lujo', 'eléctrica', 'electrica', 'cama manual', 'silla de ruedas', 'grúa', 'grua', 'reposet'];
const EXCLUDE_KEYWORDS = ['cómodo', 'comodo'];

export function isRentalItem(name) {
  if (!name) return false;
  const lower = name.toLowerCase();
  if (EXCLUDE_KEYWORDS.some(k => lower.includes(k))) return false;
  return RENTAL_KEYWORDS.some(k => lower.includes(k.toLowerCase()));
}
