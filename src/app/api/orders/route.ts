import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { BRAND } from "@/lib/brand";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = {
      name: String(body.name ?? "").trim(),
      email: String(body.email ?? "").trim(),
      phone: String(body.phone ?? "").trim(),
      address: String(body.address ?? "").trim(),
      product: String(body.product ?? "").trim(),
      productSlug: String(body.productSlug ?? "").trim(),
      size: String(body.size ?? "").trim().toUpperCase(),
      quantity: Number(body.quantity ?? 1),
      receiptImage: String(body.receiptImage ?? "").trim(),
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.phone ||
      !payload.address ||
      !payload.product ||
      !payload.productSlug ||
      !payload.size ||
      !Number.isFinite(payload.quantity) ||
      payload.quantity < 1
    ) {
      return NextResponse.json({ error: "Missing order details" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        id: randomUUID(),
        brand: BRAND,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
        product: payload.product,
        productSlug: payload.productSlug,
        size: payload.size,
        quantity: payload.quantity,
        receiptImage: payload.receiptImage || null,
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("ORDER CREATE ERROR:", error);
    return NextResponse.json({ error: "Unable to place order" }, { status: 503 });
  }
}
