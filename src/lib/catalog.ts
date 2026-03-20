import type { Item, Prisma } from "@prisma/client";

import { BRAND } from "@/lib/brand";
import { prisma } from "@/lib/prisma";

export type CatalogCategory = "suits" | "evening" | "essentials";

export type CatalogItem = {
  id: string;
  name: string;
  slug: string;
  image: string;
  category: CatalogCategory;
  type: string;
  brand: string;
  description: string | null;
  sizes: string[];
  price: number | null;
  createdAt: string;
};

function normalizePrice(value: Prisma.Decimal | null) {
  if (!value) {
    return null;
  }

  return Number(value);
}

export function normalizeItem(item: Item): CatalogItem {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    image: item.image,
    category: item.category as CatalogCategory,
    type: item.type,
    brand: item.brand,
    description: item.description,
    sizes: item.sizes ?? [],
    price: normalizePrice(item.price),
    createdAt: item.createdAt.toISOString(),
  };
}

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

export async function getItems(category?: CatalogCategory) {
  const items = await prisma.item.findMany({
    where: {
      brand: BRAND,
      ...(category ? { category } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return items.map(normalizeItem);
}

export async function getItemBySlug(slug: string) {
  const item = await prisma.item.findFirst({
    where: {
      brand: BRAND,
      slug,
    },
  });

  return item ? normalizeItem(item) : null;
}
