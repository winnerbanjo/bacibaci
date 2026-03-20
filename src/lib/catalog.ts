import { randomUUID } from "crypto";

import type { Item, Prisma } from "@prisma/client";

import { BRAND } from "@/lib/brand";
import { getLocalCategoryItems } from "@/lib/local-images";
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

export async function getItems(category?: CatalogCategory) {
  try {
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
  } catch (error) {
    console.error("GET ITEMS ERROR:", error);
    return [];
  }
}

async function syncEssentialsFromImages() {
  const localItems = await getLocalCategoryItems("essentials");

  if (!localItems.length) {
    return;
  }

  const existing = await prisma.item.findMany({
    where: {
      brand: BRAND,
      category: "essentials",
    },
    select: {
      slug: true,
    },
  });

  const existingSlugs = new Set(existing.map((item) => item.slug));
  const missing = localItems.filter((item) => !existingSlugs.has(item.slug));

  if (!missing.length) {
    return;
  }

  await prisma.item.createMany({
    data: missing.map((item) => ({
      id: randomUUID(),
      brand: BRAND,
      name: item.name,
      slug: item.slug,
      image: item.src,
      category: "essentials",
      type: "ready",
      sizes: [],
      description: null,
      price: null,
    })),
  });
}

function resolveImage(category: CatalogCategory, image: string, localImages: string[], index: number) {
  if (image?.startsWith("/images/")) {
    return image;
  }

  const localMatch = localImages[index];

  if (localMatch) {
    return localMatch;
  }

  return image;
}

export async function getDisplayItems(category: CatalogCategory) {
  if (category === "essentials") {
    await syncEssentialsFromImages();
  }

  const [databaseItems, localItems] = await Promise.all([
    getItems(category),
    getLocalCategoryItems(category),
  ]);

  if (!databaseItems.length) {
    return localItems.map((item) => ({
      id: item.slug,
      name: item.name,
      slug: item.slug,
      image: item.src,
      category,
      type: category === "essentials" ? "ready" : "custom",
      brand: BRAND,
      description: null,
      sizes: [],
      price: null,
      createdAt: new Date(0).toISOString(),
    }));
  }

  if (category === "essentials") {
    const databaseBySlug = new Map(databaseItems.map((item) => [item.slug, item]));

    return localItems.map((item) => {
      const databaseItem = databaseBySlug.get(item.slug);

      if (!databaseItem) {
        return {
          id: item.slug,
          name: item.name,
          slug: item.slug,
          image: item.src,
          category,
          type: "ready",
          brand: BRAND,
          description: null,
          sizes: [],
          price: null,
          createdAt: new Date(0).toISOString(),
        };
      }

      return {
        ...databaseItem,
        name: item.name,
        image: item.src,
      };
    });
  }

  const localSources = localItems.map((item) => item.src);

  return databaseItems.map((item, index) => ({
    ...item,
    image: resolveImage(category, item.image, localSources, index),
  }));
}

export async function getItemBySlug(slug: string) {
  try {
    const item = await prisma.item.findFirst({
      where: {
        brand: BRAND,
        slug,
      },
    });

    return item ? normalizeItem(item) : null;
  } catch (error) {
    console.error("GET ITEM BY SLUG ERROR:", error);
    return null;
  }
}

export async function getDisplayItemBySlug(slug: string) {
  const item = await getItemBySlug(slug);

  if (item) {
    const localItems = await getLocalCategoryItems(item.category);
    return {
      ...item,
      image: resolveImage(item.category, item.image, localItems.map((entry) => entry.src), 0),
    };
  }

  const [localSuits, localEvening, localEssentials] = await Promise.all([
    getLocalCategoryItems("suits"),
    getLocalCategoryItems("evening"),
    getLocalCategoryItems("essentials"),
  ]);
  const fallback =
    localSuits.find((entry) => entry.slug === slug) ??
    localEvening.find((entry) => entry.slug === slug) ??
    localEssentials.find((entry) => entry.slug === slug);

  if (!fallback) {
    return null;
  }

  return {
    id: fallback.slug,
    name: fallback.name,
    slug: fallback.slug,
    image: fallback.src,
    category: fallback.category,
    type: fallback.category === "essentials" ? "ready" : "custom",
    brand: BRAND,
    description: null,
    sizes: [],
    price: null,
    createdAt: new Date(0).toISOString(),
  };
}
