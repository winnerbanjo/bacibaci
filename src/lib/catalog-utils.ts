export function createItemSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function parseSizes(value: string) {
  return value
    .split(",")
    .map((size) => size.trim().toUpperCase())
    .filter(Boolean);
}

export function formatPrice(value: number | null) {
  if (value === null) {
    return "Price on request";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}
