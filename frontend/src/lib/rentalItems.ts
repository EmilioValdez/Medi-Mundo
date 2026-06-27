interface PriceFields {
  price_daily?: number;
  price_biweekly?: number;
  price_monthly?: number;
  price_sale?: number;
}

export function isRentalItem(item: PriceFields): boolean {
  return (item.price_daily ?? 0) > 0 || (item.price_biweekly ?? 0) > 0 || (item.price_monthly ?? 0) > 0;
}

export function isCatalogItem(item: PriceFields): boolean {
  return (item.price_sale ?? 0) > 0;
}
