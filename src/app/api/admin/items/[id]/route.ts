import { NextResponse } from "next/server";

import { BRAND } from "@/lib/brand";
import { createItemSlug, parseSizes } from "@/lib/catalog-utils";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const image = String(body.image ?? "").trim();
    const category = String(body.category ?? "").trim().toLowerCase();
    const type = String(body.type ?? "product").trim().toLowerCase();
    const slug = String(body.slug ?? "").trim() || createItemSlug(name);
    const description = String(body.description ?? "").trim();
    const priceValue = String(body.price ?? "").trim();
    const sizes = parseSizes(String(body.sizes ?? ""));

    if (!id || !name || !image || !category || !slug) {
      return NextResponse.json({ error: "Missing required product fields" }, { status: 400 });
    }

    await prisma.item.updateMany({
      where: { id, brand: BRAND },
      data: {
        name,
        image,
        category,
        type,
        slug,
        description: description || null,
        sizes,
        price: priceValue ? Number(priceValue) : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN ITEM UPDATE ERROR:", error);
    return NextResponse.json({ error: "Unable to update item" }, { status: 503 });
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    await prisma.item.deleteMany({
      where: { id, brand: BRAND },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN ITEM DELETE ERROR:", error);
    return NextResponse.json({ error: "Unable to delete item" }, { status: 503 });
  }
}
