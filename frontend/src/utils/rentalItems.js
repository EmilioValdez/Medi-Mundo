const RENTAL_KEYWORDS = ['lujo', 'eléctrica', 'electrica', 'cama manual', 'grúa', 'grua', 'reposet'];

export function isRentalItem(name) {
  if (!name) return false;
  const lower = name.toLowerCase();
  return RENTAL_KEYWORDS.some(k => lower.includes(k.toLowerCase()));
}
