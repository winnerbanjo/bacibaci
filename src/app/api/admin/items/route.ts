import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { BRAND } from "@/lib/brand";
import { getItems } from "@/lib/catalog";
import { createItemSlug, parseSizes } from "@/lib/catalog-utils";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await getItems();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("ADMIN ITEMS GET ERROR:", error);
    return NextResponse.json({ error: "Unable to load items" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const image = String(body.image ?? "").trim();
    const category = String(body.category ?? "").trim().toLowerCase();
    const type = String(body.type ?? "product").trim().toLowerCase();
    const slug = String(body.slug ?? "").trim() || createItemSlug(name);
    const description = String(body.description ?? "").trim();
    const priceValue = String(body.price ?? "").trim();
    const sizes = parseSizes(String(body.sizes ?? ""));

    if (!name || !image || !category || !slug) {
      return NextResponse.json({ error: "Missing required product fields" }, { status: 400 });
    }

    const item = await prisma.item.create({
      data: {
        id: randomUUID(),
        brand: BRAND,
        name,
        slug,
        image,
        category,
        type,
        description: description || null,
        sizes,
        price: priceValue ? Number(priceValue) : null,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("ADMIN ITEM CREATE ERROR:", error);
    return NextResponse.json({ error: "Unable to create item" }, { status: 503 });
  }
}
